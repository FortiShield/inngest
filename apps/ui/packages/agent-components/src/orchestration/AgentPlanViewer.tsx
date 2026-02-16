import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { AgentPlan, PlanStep } from '../types/index';

interface AgentPlanViewerProps {
  plan: AgentPlan;
  onStepStatusChange?: (stepId: string, status: PlanStep['status']) => void;
  onExecute?: (plan: AgentPlan) => void;
  isExecuting?: boolean;
}

export function AgentPlanViewer({
  plan,
  onStepStatusChange,
  onExecute,
  isExecuting = false,
}: AgentPlanViewerProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [stepEdits, setStepEdits] = useState<Record<string, Partial<PlanStep>>>({});

  const toggleStep = useCallback((stepId: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  }, []);

  const changeStepStatus = useCallback(
    (stepId: string, status: PlanStep['status']) => {
      onStepStatusChange?.(stepId, status);
    },
    [onStepStatusChange]
  );

  const editStep = useCallback(
    (stepId: string, changes: Partial<PlanStep>) => {
      setStepEdits((prev) => ({
        ...prev,
        [stepId]: { ...prev[stepId], ...changes },
      }));
    },
    []
  );

  const approveAllSteps = useCallback(() => {
    plan.steps.forEach((step) => {
      if (step.status === 'pending') {
        changeStepStatus(step.id, 'approved');
      }
    });
  }, [plan.steps, changeStepStatus]);

  const skipAllSteps = useCallback(() => {
    plan.steps.forEach((step) => {
      if (step.status !== 'completed' && step.status !== 'failed') {
        changeStepStatus(step.id, 'skipped');
      }
    });
  }, [plan.steps, changeStepStatus]);

  const getStepIcon = (status: PlanStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'approved':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'executing':
        return <Clock className="w-5 h-5 text-yellow-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStepBadgeColor = (status: PlanStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'executing':
        return 'bg-yellow-100 text-yellow-800';
      case 'skipped':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{plan.title}</h3>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {plan.steps.length} steps
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Estimated tokens: {plan.estimatedTokens}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={approveAllSteps}
              className="px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Approve All
            </button>
            <button
              onClick={skipAllSteps}
              className="px-3 py-1 text-sm rounded bg-gray-600 text-white hover:bg-gray-700"
            >
              Skip All
            </button>
            <button
              onClick={() => onExecute?.(plan)}
              disabled={isExecuting || !plan.steps.some((s) => s.status === 'approved')}
              className="px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300"
            >
              {isExecuting ? 'Executing...' : 'Execute'}
            </button>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-gray-200">
        {plan.steps.map((step) => (
          <PlanStepItem
            key={step.id}
            step={step}
            isExpanded={expandedSteps.has(step.id)}
            onToggle={() => toggleStep(step.id)}
            onStatusChange={(status) => changeStepStatus(step.id, status)}
            onEdit={(changes) => editStep(step.id, changes)}
            getStepIcon={getStepIcon}
            getStepBadgeColor={getStepBadgeColor}
            stepEdit={stepEdits[step.id]}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Pending</p>
            <p className="text-lg font-semibold text-gray-900">
              {plan.steps.filter((s) => s.status === 'pending').length}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Approved</p>
            <p className="text-lg font-semibold text-blue-600">
              {plan.steps.filter((s) => s.status === 'approved').length}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Completed</p>
            <p className="text-lg font-semibold text-green-600">
              {plan.steps.filter((s) => s.status === 'completed').length}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Failed</p>
            <p className="text-lg font-semibold text-red-600">
              {plan.steps.filter((s) => s.status === 'failed').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PlanStepItemProps {
  step: PlanStep;
  isExpanded: boolean;
  onToggle: () => void;
  onStatusChange: (status: PlanStep['status']) => void;
  onEdit: (changes: Partial<PlanStep>) => void;
  getStepIcon: (status: PlanStep['status']) => React.ReactNode;
  getStepBadgeColor: (status: PlanStep['status']) => string;
  stepEdit?: Partial<PlanStep>;
}

function PlanStepItem({
  step,
  isExpanded,
  onToggle,
  onStatusChange,
  onEdit,
  getStepIcon,
  getStepBadgeColor,
  stepEdit,
}: PlanStepItemProps) {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <button
          onClick={onToggle}
          className="flex items-start gap-3 flex-1 text-left hover:opacity-75"
        >
          <div className="mt-1">{getStepIcon(step.status)}</div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900">{step.title}</h4>
            <p className="text-xs text-gray-600 mt-1">{step.description}</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>

        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${getStepBadgeColor(step.status)}`}>
          {step.status}
        </span>
      </div>

      {isExpanded && (
        <div className="ml-8 space-y-3 mt-3 pt-3 border-t border-gray-200">
          {step.expectedOutput && (
            <div>
              <p className="text-xs font-semibold text-gray-700">Expected Output</p>
              <p className="text-sm text-gray-600 mt-1">{step.expectedOutput}</p>
            </div>
          )}

          {step.error && (
            <div className="bg-red-50 border border-red-200 p-2 rounded">
              <p className="text-xs font-semibold text-red-700">Error</p>
              <p className="text-sm text-red-600 mt-1">{step.error}</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onStatusChange('pending')}
              className={`px-2 py-1 text-xs rounded ${step.status === 'pending' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Pending
            </button>
            <button
              onClick={() => onStatusChange('approved')}
              className={`px-2 py-1 text-xs rounded ${step.status === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Approve
            </button>
            <button
              onClick={() => onStatusChange('skipped')}
              className={`px-2 py-1 text-xs rounded ${step.status === 'skipped' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
