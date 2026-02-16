import { PromptContext, AgentMessage, AgentPlan, PlanStep, ExecutionResult } from '../types/index';

export interface AgentConfig {
  maxTokens?: number;
  temperature?: number;
  model?: string;
  tools?: string[];
  systemPrompt?: string;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ExecutionOptions {
  streaming?: boolean;
  validateOutput?: boolean;
  sandbox?: {
    enabled: boolean;
    timeout?: number;
    environment?: Record<string, string>;
  };
}

export class AgentOrchestrator {
  private config: Required<AgentConfig>;
  private messageHistory: AgentMessage[] = [];
  private contextHistory: PromptContext[] = [];
  private currentPlan: AgentPlan | null = null;

  constructor(config: AgentConfig = {}) {
    this.config = {
      maxTokens: config.maxTokens || 8000,
      temperature: config.temperature || 0.7,
      model: config.model || 'gpt-4',
      tools: config.tools || [],
      systemPrompt:
        config.systemPrompt ||
        'You are a helpful AI assistant for code generation and software development.',
      retryAttempts: config.retryAttempts || 3,
      retryDelay: config.retryDelay || 1000,
    };
  }

  /**
   * Generate an editable plan before execution
   */
  async generatePlan(prompt: string, context: PromptContext): Promise<AgentPlan> {
    const planPrompt = this.buildPlanPrompt(prompt, context);

    const plan = await this.executeWithRetry(async () => {
      return await this.callAgent(planPrompt, 'plan');
    });

    this.currentPlan = this.parsePlanResponse(plan);
    this.contextHistory.push(context);

    return this.currentPlan;
  }

  /**
   * Execute approved plan steps
   */
  async executePlan(
    plan: AgentPlan,
    options: ExecutionOptions = {}
  ): Promise<{ results: ExecutionResult[]; artifacts: string[] }> {
    const results: ExecutionResult[] = [];
    const artifacts: string[] = [];

    for (const step of plan.steps) {
      if (step.status === 'skipped') {
        results.push({
          stepId: step.id,
          status: 'success',
          output: 'Step skipped by user',
          duration: 0,
        });
        continue;
      }

      if (step.status !== 'approved' && step.status !== 'pending') {
        continue;
      }

      const startTime = Date.now();

      try {
        // Build execution context
        const executionContext = this.buildExecutionContext(step, options);

        // Call agent with step-specific prompt
        const stepPrompt = this.buildStepPrompt(step, executionContext);
        const response = await this.executeWithRetry(async () => {
          return await this.callAgent(stepPrompt, 'execute');
        });

        // Parse response for code artifacts
        const parsedResponse = this.parseResponse(response);

        // Validate if enabled
        if (options.validateOutput && options.sandbox?.enabled) {
          const validationResult = await this.validateInSandbox(
            parsedResponse.code,
            options.sandbox
          );

          if (!validationResult.success) {
            throw new Error(`Validation failed: ${validationResult.error}`);
          }
        }

        results.push({
          stepId: step.id,
          status: 'success',
          output: parsedResponse.output,
          artifacts: parsedResponse.artifacts,
          duration: Date.now() - startTime,
        });

        artifacts.push(...(parsedResponse.artifacts || []));
      } catch (error) {
        results.push({
          stepId: step.id,
          status: 'failure',
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime,
        });
      }
    }

    return { results, artifacts };
  }

  /**
   * Stream agent responses token by token
   */
  async *streamExecute(
    prompt: string,
    context: PromptContext
  ): AsyncGenerator<string, void, unknown> {
    const fullPrompt = this.buildPrompt(prompt, context);
    this.contextHistory.push(context);

    // Simulate streaming (replace with actual API streaming)
    const response = await this.callAgent(fullPrompt, 'stream');

    for (const chunk of response.split('')) {
      yield chunk;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  /**
   * Add message to history for context
   */
  addMessage(role: 'user' | 'agent', content: string, context?: PromptContext): void {
    this.messageHistory.push({
      id: `msg-${Date.now()}`,
      role,
      content,
      context,
      timestamp: new Date(),
    });
  }

  /**
   * Get message history
   */
  getHistory(): AgentMessage[] {
    return [...this.messageHistory];
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.messageHistory = [];
    this.contextHistory = [];
    this.currentPlan = null;
  }

  // Private methods

  private buildPrompt(prompt: string, context: PromptContext): string {
    const contextStr = context.items
      .map((item) => `[${item.type.toUpperCase()}] ${item.label}:\n${item.content}`)
      .join('\n\n');

    return `${this.config.systemPrompt}

CONTEXT:
${contextStr}

USER REQUEST:
${prompt}

Please provide a clear, detailed response.`;
  }

  private buildPlanPrompt(prompt: string, context: PromptContext): string {
    return `${this.buildPrompt(prompt, context)}

Please analyze this request and provide a step-by-step plan. For each step, include:
1. Title: Brief name for the step
2. Description: What this step accomplishes
3. Expected Output: What should result from this step

Format your response as a JSON array of steps.`;
  }

  private buildStepPrompt(step: PlanStep, context: string): string {
    return `Execute this step:

Title: ${step.title}
Description: ${step.description}

Context:
${context}

Please provide the implementation for this step, including any code or artifacts needed.`;
  }

  private buildExecutionContext(step: PlanStep, options: ExecutionOptions): string {
    let context = step.description;

    if (step.inputs) {
      context += '\n\nInputs:\n' + JSON.stringify(step.inputs, null, 2);
    }

    if (step.expectedOutput) {
      context += `\n\nExpected output: ${step.expectedOutput}`;
    }

    if (options.sandbox?.environment) {
      context += `\n\nEnvironment: ${JSON.stringify(options.sandbox.environment)}`;
    }

    return context;
  }

  private parsePlanResponse(response: string): AgentPlan {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No plan found in response');
      }

      const steps = JSON.parse(jsonMatch[0]);
      const planSteps: PlanStep[] = steps.map((step: any, index: number) => ({
        id: `step-${index}`,
        index,
        title: step.title || `Step ${index + 1}`,
        description: step.description || '',
        expectedOutput: step.expectedOutput,
        status: 'pending',
      }));

      return {
        id: `plan-${Date.now()}`,
        title: 'Agent Plan',
        steps: planSteps,
        estimatedTokens: planSteps.length * 500, // rough estimate
        status: 'draft',
        createdAt: new Date(),
      };
    } catch {
      // Fallback
      return {
        id: `plan-${Date.now()}`,
        title: 'Agent Plan',
        steps: [
          {
            id: 'step-0',
            index: 0,
            title: 'Execute Request',
            description: response,
            status: 'pending',
          },
        ],
        estimatedTokens: 500,
        status: 'draft',
        createdAt: new Date(),
      };
    }
  }

  private parseResponse(response: string): {
    output: string;
    code?: string;
    artifacts?: string[];
  } {
    const codeMatch = response.match(/```[\w]*\n([\s\S]*?)\n```/);
    const artifacts: string[] = [];

    if (codeMatch) {
      artifacts.push(codeMatch[1]);
    }

    return {
      output: response,
      code: codeMatch?.[1],
      artifacts,
    };
  }

  private async validateInSandbox(
    code: string,
    sandbox: ExecutionOptions['sandbox']
  ): Promise<{ success: boolean; error?: string }> {
    // Placeholder for sandbox validation
    // In production, this would execute code in an isolated environment
    try {
      // Basic validation - just check syntax
      new Function(code);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Syntax error',
      };
    }
  }

  private async callAgent(
    prompt: string,
    mode: 'plan' | 'execute' | 'stream' = 'execute'
  ): Promise<string> {
    // Placeholder for actual API call
    // In production, this would call your agent backend
    return `[Agent response - ${mode} mode]\n${prompt}`;
  }

  private async executeWithRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.retryAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < this.config.retryAttempts - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.config.retryDelay * Math.pow(2, attempt))
          );
        }
      }
    }

    throw lastError || new Error('Failed after retries');
  }
}
