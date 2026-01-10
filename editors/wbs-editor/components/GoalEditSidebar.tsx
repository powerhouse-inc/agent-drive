import { useState, useEffect, useCallback } from "react";
import { useSelectedWorkBreakdownStructureDocument } from "powerhouse-agent/document-models/work-breakdown-structure";
import {
  updateDescription,
  updateInstructions,
  clearInstructions,
  addNote,
  removeNote,
  markAsDraft,
  markAsReady,
  markTodo,
  markInProgress,
  markCompleted,
  markWontDo,
  reportBlocked,
  delegateGoal,
  reportOnGoal,
} from "powerhouse-agent/document-models/work-breakdown-structure";
import { generateId } from "document-model/core";
import { findGoalInTree } from "../utils/treeTransform.js";
import { Tooltip } from "./Tooltip.js";
import { SingleClickStatusChip } from "./SingleClickStatusChip.js";
import { BlockedStatusPopup } from "./BlockedStatusPopup.js";
import { DelegationPopup } from "./DelegationPopup.js";
import { ReportProgressPopup } from "./ReportProgressPopup.js";

interface GoalEditSidebarProps {
  goalId: string;
  onClose: () => void;
}

export function GoalEditSidebar({ goalId, onClose }: GoalEditSidebarProps) {
  const [document, dispatch] = useSelectedWorkBreakdownStructureDocument();
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingInstructions, setEditingInstructions] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [copied, setCopied] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [instructionsValue, setInstructionsValue] = useState("");
  const [newNoteValue, setNewNoteValue] = useState("");
  const [blockedPopup, setBlockedPopup] = useState<{ isOpen: boolean; goalId: string }>({
    isOpen: false,
    goalId: "",
  });
  const [delegationPopup, setDelegationPopup] = useState<{ isOpen: boolean; goalId: string }>({
    isOpen: false,
    goalId: "",
  });
  const [reportProgressPopup, setReportProgressPopup] = useState<{ isOpen: boolean; goalId: string }>({
    isOpen: false,
    goalId: "",
  });

  if (!document) return null;

  // Find the goal in the document
  const goals = document.state.global.goals || [];
  const goal = goals.find((g) => g.id === goalId);

  // Sync values when goal changes
  useEffect(() => {
    if (goal) {
      setDescriptionValue(goal.description);
      setInstructionsValue(goal.instructions || "");
    }
  }, [goal?.description, goal?.instructions]);

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

  const handleDescriptionBlur = () => {
    const newDescription = descriptionValue.trim();
    if (newDescription && newDescription !== goal.description) {
      dispatch(
        updateDescription({ goalId: goal.id, description: newDescription }),
      );
    }
    setEditingDescription(false);
  };

  const handleDescriptionKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.currentTarget.blur(); // Trigger onBlur to save
    } else if (e.key === "Escape") {
      setDescriptionValue(goal.description); // Reset to original
      setEditingDescription(false);
    }
  };

  const handleInstructionsBlur = () => {
    const newInstructions = instructionsValue.trim();
    if (newInstructions !== goal.instructions) {
      if (newInstructions) {
        dispatch(
          updateInstructions({
            goalId: goal.id,
            instructions: newInstructions,
          }),
        );
      } else {
        dispatch(clearInstructions({ goalId: goal.id }));
      }
    }
    setEditingInstructions(false);
  };

  const handleInstructionsKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.currentTarget.blur(); // Trigger onBlur to save
    } else if (e.key === "Escape") {
      setInstructionsValue(goal.instructions || ""); // Reset to original
      setEditingInstructions(false);
    }
  };

  const handleToggleDraft = () => {
    if (goal.isDraft) {
      dispatch(markAsReady({ goalId: goal.id }));
    } else {
      dispatch(markAsDraft({ goalId: goal.id }));
    }
  };

  // Handle status changes from the dropdown
  const handleStatusChange = useCallback((actionData: any) => {
    if (!dispatch) return;
    
    const { value } = actionData.data || actionData;
    
    if (value === "BLOCKED") {
      // Show popup for blocked status
      setBlockedPopup({ isOpen: true, goalId: goal.id });
    } else {
      // Handle other status changes directly
      switch (value) {
        case "TODO":
          dispatch(markTodo({ id: goal.id }));
          break;
        case "IN_PROGRESS":
          dispatch(markInProgress({ id: goal.id }));
          break;
        case "COMPLETED":
          dispatch(markCompleted({ id: goal.id }));
          break;
        case "WONT_DO":
          dispatch(markWontDo({ id: goal.id }));
          break;
        case "DELEGATED":
          // Show delegation popup (pre-fill assignee if currently IN_REVIEW)
          setDelegationPopup({ isOpen: true, goalId: goal.id });
          break;
        case "IN_REVIEW":
          console.log("In Review status not yet implemented");
          break;
        default:
          console.warn("Unknown status:", value);
      }
    }
  }, [dispatch, goal?.id]);

  // Handle blocked status popup
  const handleBlockedSubmit = useCallback((note: string, author?: string) => {
    if (!dispatch) return;
    dispatch(reportBlocked({ 
      id: blockedPopup.goalId, 
      question: {
        id: generateId(),
        note,
        author: author || undefined
      }
    }));
  }, [dispatch, blockedPopup.goalId]);

  const handleBlockedClose = useCallback(() => {
    setBlockedPopup({ isOpen: false, goalId: "" });
  }, []);

  // Handle delegation popup
  const handleDelegationSubmit = useCallback((assignee: string) => {
    if (!dispatch) return;
    dispatch(delegateGoal({ 
      id: delegationPopup.goalId, 
      assignee
    }));
  }, [dispatch, delegationPopup.goalId]);

  const handleDelegationClose = useCallback(() => {
    setDelegationPopup({ isOpen: false, goalId: "" });
  }, []);

  // Handle report progress popup
  const handleReportProgressSubmit = useCallback((note: string, moveToReview: boolean, author?: string) => {
    if (!dispatch) return;
    dispatch(reportOnGoal({ 
      id: reportProgressPopup.goalId,
      note: {
        id: generateId(),
        note,
        author: author || undefined
      },
      moveInReview: moveToReview
    }));
  }, [dispatch, reportProgressPopup.goalId]);

  const handleReportProgressClose = useCallback(() => {
    setReportProgressPopup({ isOpen: false, goalId: "" });
  }, []);

  const handleReportProgress = useCallback(() => {
    setReportProgressPopup({ isOpen: true, goalId: goal.id });
  }, [goal?.id]);

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(goal.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy ID:", error);
    }
  };

  const handleAddNote = (noteText: string) => {
    if (noteText.trim()) {
      dispatch(
        addNote({
          goalId: goal.id,
          noteId: generateId(),
          note: noteText.trim(),
          author: undefined, // Let the system handle author if needed
        }),
      );
      setNewNoteValue("");
      setAddingNote(false);
    }
  };

  const handleRemoveNote = (noteId: string) => {
    dispatch(removeNote({ goalId: goal.id, noteId }));
  };

  const handleNewNoteSubmit = () => {
    const noteText = newNoteValue.trim();
    if (noteText) {
      handleAddNote(noteText);
    }
  };

  const handleNewNoteKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleNewNoteSubmit();
    } else if (e.key === "Escape") {
      setNewNoteValue("");
      setAddingNote(false);
      e.currentTarget.blur(); // Unfocus the textarea
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with close button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-800">Goal Details</h3>
          <Tooltip
            content={copied ? "Copied!" : `Goal ID: ${goal.id} • Click to copy`}
          >
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

      {/* Inline Editable Description Title */}
      <div>
        {editingDescription ? (
          <input
            type="text"
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)}
            onBlur={handleDescriptionBlur}
            onKeyDown={handleDescriptionKeyDown}
            onFocus={(e) => e.target.select()}
            className="w-full text-xl font-semibold text-gray-800 bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600 pb-1"
            placeholder="Enter goal description"
            autoFocus
          />
        ) : (
          <h2
            className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-gray-600 transition-colors duration-200 pb-1 border-b-2 border-transparent hover:border-gray-300"
            onClick={() => setEditingDescription(true)}
            title="Click to edit description"
          >
            {goal.description || "Untitled Goal"}
          </h2>
        )}
      </div>

      {/* Status and Assignee Row */}
      <div className="flex items-center gap-2">
        <SingleClickStatusChip 
          goal={goal}
          onStatusChange={handleStatusChange}
        />
        {(goal.status === "DELEGATED" || goal.status === "IN_REVIEW") && goal.assignee && (
          <>
            <span className="text-gray-400">→</span>
            <span className="text-sm font-medium text-gray-700">{goal.assignee}</span>
          </>
        )}
      </div>

      {/* Report Progress Button for Delegated Goals */}
      {goal.status === "DELEGATED" && (
        <div className="flex justify-start">
          <button
            onClick={handleReportProgress}
            className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 border border-blue-200 transition-colors duration-200"
          >
            Report Progress
          </button>
        </div>
      )}

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

      {/* Other information */}
      <div className="space-y-4">

        {/* Instructions Section */}
        <div>
          <h4 className="text-base font-semibold text-gray-700 mb-2">
            Instructions
          </h4>
          {editingInstructions ? (
            <textarea
              value={instructionsValue}
              onChange={(e) => setInstructionsValue(e.target.value)}
              onBlur={handleInstructionsBlur}
              onKeyDown={handleInstructionsKeyDown}
              onFocus={(e) => e.target.select()}
              className="w-full text-sm text-gray-600 bg-white border-2 border-blue-500 focus:outline-none focus:border-blue-600 p-2 rounded resize-vertical min-h-[80px]"
              placeholder="Enter instructions for this goal"
              autoFocus
            />
          ) : (
            <div
              className="text-sm text-gray-600 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors duration-200 min-h-[80px] border-2 border-transparent hover:border-gray-300"
              onClick={() => setEditingInstructions(true)}
              title="Click to edit instructions"
            >
              {goal.instructions ||
                "No instructions set. Click to add instructions."}
            </div>
          )}
        </div>

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

        {/* Notes Section */}
        <div>
          <h4 className="text-base font-semibold text-gray-700 mb-2">Notes</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
            {goal.notes.length === 0 ? (
              <div className="text-sm text-gray-400 p-3 bg-gray-50 rounded text-center">
                No notes yet. Add your first note below.
              </div>
            ) : (
              goal.notes.map((note) => (
                <div
                  key={note.id}
                  className="text-sm text-gray-600 p-3 bg-white border border-gray-200 rounded group hover:border-gray-300 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap">{note.note}</div>
                      {note.author && (
                        <div className="text-xs text-gray-400 mt-2">
                          — {note.author}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveNote(note.id)}
                      className="ml-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      title="Remove note"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="relative">
            <textarea
              value={newNoteValue}
              onChange={(e) => setNewNoteValue(e.target.value)}
              onFocus={() => setAddingNote(true)}
              onKeyDown={handleNewNoteKeyDown}
              className="w-full text-sm text-gray-600 bg-white border border-gray-300 focus:border-blue-500 focus:outline-none p-2 rounded resize-vertical min-h-[60px]"
              placeholder="Add a note..."
            />
            {addingNote && (
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-gray-400">
                  Ctrl+Enter to save, Escape to cancel
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAddingNote(false);
                      setNewNoteValue("");
                    }}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNewNoteSubmit}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                    disabled={!newNoteValue.trim()}
                  >
                    Add Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <BlockedStatusPopup
        isOpen={blockedPopup.isOpen}
        onClose={handleBlockedClose}
        onSubmit={handleBlockedSubmit}
        goalId={blockedPopup.goalId}
      />

      <DelegationPopup
        isOpen={delegationPopup.isOpen}
        onClose={handleDelegationClose}
        onSubmit={handleDelegationSubmit}
        goalId={delegationPopup.goalId}
        defaultAssignee={goal.status === "IN_REVIEW" && goal.assignee ? goal.assignee : undefined}
      />

      <ReportProgressPopup
        isOpen={reportProgressPopup.isOpen}
        onClose={handleReportProgressClose}
        onSubmit={handleReportProgressSubmit}
        goalId={reportProgressPopup.goalId}
        goalDescription={goal.description}
      />
    </div>
  );
}
