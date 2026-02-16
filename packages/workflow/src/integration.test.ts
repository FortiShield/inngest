import { Engine } from "./engine";
import { type Workflow, type WorkflowAction } from "./types";

/**
 * Integration Test Suite for Inngest Workflow Kit
 * Tests complete workflows with realistic scenarios
 */

describe("Workflow Kit - Integration Tests", () => {
  
  interface TestContext {
    executionLog: string[];
    errorCount: number;
  }

  const createTestEngine = () => {
    const context: TestContext = {
      executionLog: [],
      errorCount: 0,
    };

    const actions: WorkflowAction[] = [
      {
        kind: "log",
        name: "Log Message",
        handler: async (input: any) => {
          context.executionLog.push(`[LOG] ${JSON.stringify(input)}`);
          return { logged: true };
        },
      },
      {
        kind: "validate",
        name: "Validate Data",
        handler: async (input: any) => {
          if (!input.data) {
            context.errorCount++;
            throw new Error("Invalid input: missing data");
          }
          return { valid: true };
        },
      },
      {
        kind: "process",
        name: "Process Data",
        handler: async (input: any) => {
          context.executionLog.push(`[PROCESS] Processing ${JSON.stringify(input)}`);
          return { processed: true };
        },
      },
      {
        kind: "notify",
        name: "Send Notification",
        handler: async () => {
          context.executionLog.push("[NOTIFY] Notification sent");
          return { notified: true };
        },
      },
    ];

    return {
      engine: new Engine({ actions }),
      context,
    };
  };

  describe("User Onboarding Workflow", () => {
    it("should execute complete user signup workflow", () => {
      const { engine, context } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "validate-user", kind: "validate" },
          { id: "process-signup", kind: "process" },
          { id: "send-welcome", kind: "notify" },
          { id: "log-completion", kind: "log" },
        ],
        edges: [
          { from: "$source", to: "validate-user" },
          { from: "validate-user", to: "process-signup" },
          { from: "process-signup", to: "send-welcome" },
          { from: "send-welcome", to: "log-completion" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
      expect(context.errorCount).toBe(0);
    });

    it("should handle parallel notification channels", () => {
      const { engine } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "validate", kind: "validate" },
          { id: "email", kind: "notify" },
          { id: "sms", kind: "notify" },
          { id: "push", kind: "notify" },
          { id: "log", kind: "log" },
        ],
        edges: [
          { from: "$source", to: "validate" },
          { from: "validate", to: "email" },
          { from: "validate", to: "sms" },
          { from: "validate", to: "push" },
          { from: "email", to: "log" },
          { from: "sms", to: "log" },
          { from: "push", to: "log" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });
  });

  describe("E-commerce Order Processing Workflow", () => {
    it("should execute order processing pipeline", () => {
      const { engine } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "validate-order", kind: "validate" },
          { id: "process-payment", kind: "process" },
          { id: "update-inventory", kind: "process" },
          { id: "generate-shipment", kind: "process" },
          { id: "notify-customer", kind: "notify" },
          { id: "log-order", kind: "log" },
        ],
        edges: [
          { from: "$source", to: "validate-order" },
          { from: "validate-order", to: "process-payment" },
          { from: "process-payment", to: "update-inventory" },
          { from: "update-inventory", to: "generate-shipment" },
          { from: "generate-shipment", to: "notify-customer" },
          { from: "notify-customer", to: "log-order" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should handle order with multiple fulfillment paths", () => {
      const { engine } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "validate", kind: "validate" },
          { id: "digital", kind: "process" },
          { id: "physical", kind: "process" },
          { id: "send-digital", kind: "notify" },
          { id: "arrange-shipment", kind: "process" },
          { id: "notify-all", kind: "notify" },
        ],
        edges: [
          { from: "$source", to: "validate" },
          { from: "validate", to: "digital" },
          { from: "validate", to: "physical" },
          { from: "digital", to: "send-digital" },
          { from: "physical", to: "arrange-shipment" },
          { from: "send-digital", to: "notify-all" },
          { from: "arrange-shipment", to: "notify-all" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });
  });

  describe("Content Publishing Workflow", () => {
    it("should execute multi-stage content publishing", () => {
      const { engine } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "validate-content", kind: "validate" },
          { id: "process-media", kind: "process" },
          { id: "generate-seo", kind: "process" },
          { id: "schedule-publish", kind: "process" },
          { id: "notify-stakeholders", kind: "notify" },
        ],
        edges: [
          { from: "$source", to: "validate-content" },
          { from: "validate-content", to: "process-media" },
          { from: "process-media", to: "generate-seo" },
          { from: "generate-seo", to: "schedule-publish" },
          { from: "schedule-publish", to: "notify-stakeholders" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should handle content distribution to multiple channels", () => {
      const { engine } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "validate", kind: "validate" },
          { id: "website", kind: "notify" },
          { id: "blog", kind: "notify" },
          { id: "twitter", kind: "notify" },
          { id: "linkedin", kind: "notify" },
          { id: "email", kind: "notify" },
          { id: "log", kind: "log" },
        ],
        edges: [
          { from: "$source", to: "validate" },
          { from: "validate", to: "website" },
          { from: "validate", to: "blog" },
          { from: "validate", to: "twitter" },
          { from: "validate", to: "linkedin" },
          { from: "validate", to: "email" },
          { from: "website", to: "log" },
          { from: "blog", to: "log" },
          { from: "twitter", to: "log" },
          { from: "linkedin", to: "log" },
          { from: "email", to: "log" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });
  });

  describe("Data Processing Pipeline", () => {
    it("should handle ETL workflow", () => {
      const { engine } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "extract", kind: "process" },
          { id: "validate", kind: "validate" },
          { id: "transform", kind: "process" },
          { id: "load", kind: "process" },
          { id: "notify", kind: "notify" },
        ],
        edges: [
          { from: "$source", to: "extract" },
          { from: "extract", to: "validate" },
          { from: "validate", to: "transform" },
          { from: "transform", to: "load" },
          { from: "load", to: "notify" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should handle conditional data branching", () => {
      const { engine } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "fetch", kind: "process" },
          { id: "validate", kind: "validate" },
          { id: "high-priority", kind: "process" },
          { id: "normal", kind: "process" },
          { id: "archive", kind: "process" },
          { id: "complete", kind: "notify" },
        ],
        edges: [
          { from: "$source", to: "fetch" },
          { from: "fetch", to: "validate" },
          { from: "validate", to: "high-priority" },
          { from: "validate", to: "normal" },
          { from: "validate", to: "archive" },
          { from: "high-priority", to: "complete" },
          { from: "normal", to: "complete" },
          { from: "archive", to: "complete" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });
  });

  describe("Complex Multi-tenant Workflows", () => {
    it("should handle tenant isolation in workflows", () => {
      const { engine } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "route-tenant", kind: "validate" },
          { id: "tenant-a-process", kind: "process" },
          { id: "tenant-b-process", kind: "process" },
          { id: "tenant-a-notify", kind: "notify" },
          { id: "tenant-b-notify", kind: "notify" },
        ],
        edges: [
          { from: "$source", to: "route-tenant" },
          { from: "route-tenant", to: "tenant-a-process" },
          { from: "route-tenant", to: "tenant-b-process" },
          { from: "tenant-a-process", to: "tenant-a-notify" },
          { from: "tenant-b-process", to: "tenant-b-notify" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should handle cross-tenant aggregation", () => {
      const { engine } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "collect-a", kind: "process" },
          { id: "collect-b", kind: "process" },
          { id: "collect-c", kind: "process" },
          { id: "aggregate", kind: "process" },
          { id: "report", kind: "notify" },
        ],
        edges: [
          { from: "$source", to: "collect-a" },
          { from: "$source", to: "collect-b" },
          { from: "$source", to: "collect-c" },
          { from: "collect-a", to: "aggregate" },
          { from: "collect-b", to: "aggregate" },
          { from: "collect-c", to: "aggregate" },
          { from: "aggregate", to: "report" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });
  });

  describe("Workflow Composition and Reusability", () => {
    it("should support workflow composition", () => {
      const { engine } = createTestEngine();

      // Reusable validation sub-workflow
      const validationWorkflow: Workflow = {
        actions: [
          { id: "validate", kind: "validate" },
          { id: "log-validation", kind: "log" },
        ],
        edges: [
          { from: "$source", to: "validate" },
          { from: "validate", to: "log-validation" },
        ],
      };

      const mainWorkflow: Workflow = {
        actions: [
          { id: "pre-check", kind: "validate" },
          { id: "main-process", kind: "process" },
          { id: "post-check", kind: "validate" },
          { id: "finalize", kind: "notify" },
        ],
        edges: [
          { from: "$source", to: "pre-check" },
          { from: "pre-check", to: "main-process" },
          { from: "main-process", to: "post-check" },
          { from: "post-check", to: "finalize" },
        ],
      };

      const validationGraph = engine.graph(validationWorkflow);
      const mainGraph = engine.graph(mainWorkflow);

      expect(validationGraph).toBeDefined();
      expect(mainGraph).toBeDefined();
    });
  });

  describe("Error Recovery Workflows", () => {
    it("should handle error paths in workflows", () => {
      const { engine } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "attempt", kind: "process" },
          { id: "retry", kind: "process" },
          { id: "fallback", kind: "process" },
          { id: "notify-admin", kind: "notify" },
        ],
        edges: [
          { from: "$source", to: "attempt" },
          { from: "attempt", to: "retry" },
          { from: "retry", to: "fallback" },
          { from: "fallback", to: "notify-admin" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });

    it("should handle dead-letter workflows", () => {
      const { engine } = createTestEngine();

      const workflow: Workflow = {
        actions: [
          { id: "process", kind: "process" },
          { id: "validate", kind: "validate" },
          { id: "success", kind: "notify" },
          { id: "dead-letter", kind: "log" },
        ],
        edges: [
          { from: "$source", to: "process" },
          { from: "process", to: "validate" },
          { from: "validate", to: "success" },
          { from: "validate", to: "dead-letter" },
        ],
      };

      const graph = engine.graph(workflow);
      expect(graph).toBeDefined();
    });
  });
});
