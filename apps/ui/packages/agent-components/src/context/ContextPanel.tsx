import React, { useCallback } from 'react';
import { usePromptStore } from '../hooks/usePromptStore';
import { ContextItem } from '../types/index';
import { X, Pin, PinOff } from 'lucide-react';

export function ContextPanel() {
  const { context, removeContext, pinContext } = usePromptStore();

  const getIconForType = (type: string) => {
    switch (type) {
      case 'file':
        return '📄';
      case 'image':
        return '🖼️';
      case 'git':
        return '🔀';
      case 'voice':
        return '🎙️';
      default:
        return '📌';
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'file':
        return 'bg-blue-50 border-blue-200';
      case 'image':
        return 'bg-purple-50 border-purple-200';
      case 'git':
        return 'bg-green-50 border-green-200';
      case 'voice':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleRemove = useCallback(
    (id: string) => {
      removeContext(id);
    },
    [removeContext]
  );

  const handlePin = useCallback(
    (id: string, isPinned: boolean) => {
      pinContext(id, !isPinned);
    },
    [pinContext]
  );

  if (context.items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-sm text-gray-600">No context added yet</p>
        <p className="text-xs text-gray-500 mt-1">Add files, images, git context, or voice to enrich your prompts</p>
      </div>
    );
  }

  const pinnedItems = context.items.filter((item) => item.pinned);
  const unpinnedItems = context.items.filter((item) => !item.pinned);

  return (
    <div className="space-y-4">
      {pinnedItems.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-700 mb-2">Pinned Context</h3>
          <div className="space-y-2">
            {pinnedItems.map((item) => (
              <ContextItemCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onPin={handlePin}
                getIconForType={getIconForType}
                getColorForType={getColorForType}
              />
            ))}
          </div>
        </div>
      )}

      {unpinnedItems.length > 0 && (
        <div>
          {pinnedItems.length > 0 && (
            <h3 className="text-xs font-semibold text-gray-700 mb-2">Current Context</h3>
          )}
          <div className="space-y-2">
            {unpinnedItems.map((item) => (
              <ContextItemCard
                key={item.id}
                item={item}
                onRemove={handleRemove}
                onPin={handlePin}
                getIconForType={getIconForType}
                getColorForType={getColorForType}
              />
            ))}
          </div>
        </div>
      )}

      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-600">
          Total tokens: {context.totalTokens} / {context.maxTokens}
        </p>
      </div>
    </div>
  );
}

interface ContextItemCardProps {
  item: ContextItem;
  onRemove: (id: string) => void;
  onPin: (id: string, isPinned: boolean) => void;
  getIconForType: (type: string) => string;
  getColorForType: (type: string) => string;
}

function ContextItemCard({
  item,
  onRemove,
  onPin,
  getIconForType,
  getColorForType,
}: ContextItemCardProps) {
  return (
    <div className={`rounded-lg border p-3 ${getColorForType(item.type)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getIconForType(item.type)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.label}</p>
              <p className="text-xs text-gray-500">
                {item.tokens} tokens • {item.type}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 ml-2">
          <button
            onClick={() => onPin(item.id, item.pinned || false)}
            className="p-1 hover:bg-white rounded transition-colors"
            title={item.pinned ? 'Unpin' : 'Pin'}
          >
            {item.pinned ? (
              <Pin className="w-4 h-4 text-blue-600" />
            ) : (
              <PinOff className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <button
            onClick={() => onRemove(item.id)}
            className="p-1 hover:bg-white rounded transition-colors"
            title="Remove"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
