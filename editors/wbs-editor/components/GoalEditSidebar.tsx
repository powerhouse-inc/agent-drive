import { useState } from "react";
import { useSelectedWorkBreakdownStructureDocument } from "powerhouse-agent/document-models/work-breakdown-structure";
import {
  updateDescription,
  markAsDraft,
  markAsReady,
} from "powerhouse-agent/document-models/work-breakdown-structure";
import { findGoalInTree } from "../utils/treeTransform.js";
import { Tooltip } from "./Tooltip.js";

interface GoalEditSidebarProps {
  goalId: string;
  onClose: () => void;
}

export function GoalEditSidebar({ goalId, onClose }: GoalEditSidebarProps) {
  const [document, dispatch] = useSelectedWorkBreakdownStructureDocument();
  const [editingDescription, setEditingDescription] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  // Find the goal in the document
  const goals = document.state.global.goals || [];
  const goal = goals.find((g) => g.id === goalId);

  if (!goal) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Goal Not Found
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-500">
          The selected goal could not be found.
        </p>
      </div>
    );
  }

  const handleUpdateDescription = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const descriptionInput = form.elements.namedItem(
      "description",
    ) as HTMLInputElement;
    const newDescription = descriptionInput.value.trim();

    if (newDescription && newDescription !== goal.description) {
      dispatch(
        updateDescription({ goalId: goal.id, description: newDescription }),
      );
      setEditingDescription(false);
    }
  };

  const handleToggleDraft = () => {
    if (goal.isDraft) {
      dispatch(markAsReady({ goalId: goal.id }));
    } else {
      dispatch(markAsDraft({ goalId: goal.id }));
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(goal.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy ID:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with close button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">Goal Details</h3>
          <Tooltip content={copied ? "Copied!" : `Goal ID: ${goal.id} • Click to copy`}>
            <span
              className="text-sm text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-200"
              onClick={handleCopyId}
            >
              {copied ? "✓" : "⧉"}
            </span>
          </Tooltip>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          title="Close goal editor"
        >
          ×
        </button>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-base font-semibold text-gray-700 mb-2">
          Description
        </h4>
        {editingDescription ? (
          <form onSubmit={handleUpdateDescription} className="space-y-2">
            <input
              name="description"
              type="text"
              defaultValue={goal.description}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Enter goal description"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingDescription(false)}
                className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <div className="text-base text-gray-800 p-2 bg-white border border-gray-200 rounded">
              {goal.description}
            </div>
            <button
              onClick={() => setEditingDescription(true)}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Edit Description
            </button>
          </div>
        )}
      </div>

      {/* Draft Status */}
      <div>
        <h4 className="text-base font-semibold text-gray-700 mb-2">Status</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-base text-gray-600">
              {goal.isDraft ? "📝 Draft" : "✅ Ready"}
            </span>
          </div>
          <button
            onClick={handleToggleDraft}
            className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 border border-gray-300"
          >
            Mark as {goal.isDraft ? "Ready" : "Draft"}
          </button>
        </div>
      </div>

      {/* Read-only information */}
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-semibold text-gray-700 mb-2">
            Current Status
          </h4>
          <div className="text-base text-gray-600 p-2 bg-gray-50 rounded">
            {goal.status}
          </div>
        </div>

        {goal.assignee && (
          <div>
            <h4 className="text-base font-semibold text-gray-700 mb-2">
              Assignee
            </h4>
            <div className="text-base text-gray-600 p-2 bg-gray-50 rounded">
              {goal.assignee}
            </div>
          </div>
        )}

        {goal.parentId && (
          <div>
            <h4 className="text-base font-semibold text-gray-700 mb-2">
              Parent Goal
            </h4>
            <div className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
              {goal.parentId}
            </div>
          </div>
        )}

        {goal.dependencies.length > 0 && (
          <div>
            <h4 className="text-base font-semibold text-gray-700 mb-2">
              Dependencies
            </h4>
            <div className="space-y-1">
              {goal.dependencies.map((depId) => (
                <div
                  key={depId}
                  className="text-xs text-gray-500 font-mono bg-gray-100 p-1 rounded"
                >
                  {depId}
                </div>
              ))}
            </div>
          </div>
        )}

        {goal.notes.length > 0 && (
          <div>
            <h4 className="text-base font-semibold text-gray-700 mb-2">Notes</h4>
            <div className="space-y-2">
              {goal.notes.map((note) => (
                <div
                  key={note.id}
                  className="text-base text-gray-600 p-2 bg-white border border-gray-200 rounded"
                >
                  <div className="font-medium">{note.note}</div>
                  {note.author && (
                    <div className="text-xs text-gray-400 mt-1">
                      — {note.author}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
