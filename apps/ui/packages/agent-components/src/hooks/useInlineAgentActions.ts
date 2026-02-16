import { useCallback, useState } from 'react';

export interface InlineAgentAction {
  id: string;
  label: string;
  description: string;
  icon?: string;
  prompt?: string;
}

const DEFAULT_ACTIONS: InlineAgentAction[] = [
  {
    id: 'fix-bug',
    label: 'Fix this bug',
    description: 'Analyze and fix the selected code',
    icon: 'bug',
  },
  {
    id: 'optimize',
    label: 'Optimize performance',
    description: 'Improve code performance',
    icon: 'zap',
  },
  {
    id: 'add-tests',
    label: 'Add tests',
    description: 'Generate unit tests for this code',
    icon: 'test-tube',
  },
  {
    id: 'document',
    label: 'Document this',
    description: 'Add JSDoc/docstring comments',
    icon: 'file-text',
  },
  {
    id: 'refactor',
    label: 'Refactor',
    description: 'Improve code structure and readability',
    icon: 'layers',
  },
  {
    id: 'explain',
    label: 'Explain',
    description: 'Explain what this code does',
    icon: 'help-circle',
  },
];

interface UseInlineAgentActionsOptions {
  customActions?: InlineAgentAction[];
  onAction?: (action: InlineAgentAction, selectedCode: string) => void;
}

export function useInlineAgentActions(options: UseInlineAgentActionsOptions = {}) {
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const actions = options.customActions || DEFAULT_ACTIONS;

  const getContextMenuPosition = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    },
    []
  );

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();

      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        setSelectedCode(selection.toString());
        setMenuPosition(getContextMenuPosition(event));
        setIsActionMenuOpen(true);
      }
    },
    [getContextMenuPosition]
  );

  const handleAction = useCallback(
    (action: InlineAgentAction) => {
      if (options.onAction) {
        options.onAction(action, selectedCode);
      }
      setIsActionMenuOpen(false);
      setSelectedCode('');
    },
    [selectedCode, options]
  );

  const closeActionMenu = useCallback(() => {
    setIsActionMenuOpen(false);
    setSelectedCode('');
  }, []);

  return {
    selectedCode,
    isActionMenuOpen,
    menuPosition,
    actions,
    handleContextMenu,
    handleAction,
    closeActionMenu,
  };
}
