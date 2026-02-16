import React, { useState, useCallback } from 'react';
import { MessageCircle, Send, Trash2, Check, X } from 'lucide-react';
import { LineComment } from '../types/index';

interface LineCommentsProps {
  fileId: string;
  lineNumber: number;
  comments: LineComment[];
  onAddComment?: (text: string, lineNumber: number) => void;
  onResolve?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onReply?: (parentId: string, text: string) => void;
  currentUser?: string;
}

export function LineComments({
  fileId,
  lineNumber,
  comments,
  onAddComment,
  onResolve,
  onDelete,
  onReply,
  currentUser = 'You',
}: LineCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isExpanded, setIsExpanded] = useState(comments.length > 0);

  const handleAddComment = useCallback(() => {
    if (newComment.trim()) {
      onAddComment?.(newComment, lineNumber);
      setNewComment('');
    }
  }, [newComment, lineNumber, onAddComment]);

  const handleReply = useCallback(
    (parentId: string) => {
      if (replyText.trim()) {
        onReply?.(parentId, replyText);
        setReplyText('');
        setReplyingTo(null);
      }
    },
    [replyText, onReply]
  );

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-blue-600" />
          <p className="text-sm font-semibold text-gray-900">
            Comments on line {lineNumber}
          </p>
          <span className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
            {comments.length}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Existing comments */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                onResolve={() => onResolve?.(comment.id)}
                onDelete={() => onDelete?.(comment.id)}
                onReply={() => {
                  setReplyingTo(comment.id);
                  setReplyText('');
                }}
                currentUser={currentUser}
              />
            ))}
          </div>

          {/* Reply to parent comment */}
          {replyingTo && (
            <div className="bg-white rounded p-2 space-y-2 border border-blue-200">
              <p className="text-xs text-gray-600">Replying...</p>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReply(replyingTo)}
                  disabled={!replyText.trim()}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-300"
                >
                  <Send className="w-3 h-3" />
                  Reply
                </button>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText('');
                  }}
                  className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* New comment form */}
          <div className="bg-white rounded p-3 border border-blue-200 space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-300"
              >
                <Send className="w-3 h-3" />
                Comment
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface CommentThreadProps {
  comment: LineComment;
  onResolve: () => void;
  onDelete: () => void;
  onReply: () => void;
  currentUser: string;
}

function CommentThread({
  comment,
  onResolve,
  onDelete,
  onReply,
  currentUser,
}: CommentThreadProps) {
  return (
    <div className={`p-2 rounded border ${comment.resolved ? 'bg-green-50 border-green-200' : 'bg-white border-gray-300'}`}>
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-xs font-semibold text-gray-900">{comment.author}</p>
          <p className="text-xs text-gray-600">{comment.createdAt.toLocaleString()}</p>
        </div>

        <div className="flex items-center gap-1">
          {!comment.resolved && (
            <button
              onClick={onResolve}
              className="p-0.5 hover:bg-gray-200 rounded"
              title="Mark as resolved"
            >
              <Check className="w-3 h-3 text-green-600" />
            </button>
          )}

          {comment.author === currentUser && (
            <button
              onClick={onDelete}
              className="p-0.5 hover:bg-gray-200 rounded"
              title="Delete comment"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-900 mb-2">{comment.text}</p>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="ml-3 border-l-2 border-blue-300 pl-2 space-y-2 mb-2">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="text-xs">
              <p className="font-semibold text-gray-900">{reply.author}</p>
              <p className="text-gray-600">{reply.text}</p>
            </div>
          ))}
        </div>
      )}

      {!comment.resolved && (
        <button onClick={onReply} className="text-xs text-blue-600 hover:text-blue-700">
          Reply
        </button>
      )}

      {comment.resolved && <p className="text-xs text-green-600 font-semibold">Resolved</p>}
    </div>
  );
}
