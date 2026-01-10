import { useMemo, useCallback, useState, useRef } from "react";
import { Grid, Willow } from "@svar-ui/react-grid";
import { useSelectedWorkBreakdownStructureDocument } from "powerhouse-agent/document-models/work-breakdown-structure";
import { flatToTree, countGoalsInTree } from "../utils/treeTransform.js";
import EditableStatusChip from "./EditableStatusChip.js";
import { BlockedStatusPopup } from "./BlockedStatusPopup.js";
import {
  updateDescription,
  delegateGoal,
  markTodo,
  markInProgress,
  markCompleted,
  reportBlocked,
  markWontDo,
} from "powerhouse-agent/document-models/work-breakdown-structure";
import { generateId } from "document-model/core";

interface GoalGridProps {
  onGoalSelect?: (goalId: string) => void;
}

export function GoalGrid({ onGoalSelect }: GoalGridProps) {
  const [document, dispatch] = useSelectedWorkBreakdownStructureDocument();
  const apiRef = useRef<any>(null);
  const [blockedPopup, setBlockedPopup] = useState<{ isOpen: boolean; goalId: string }>({
    isOpen: false,
    goalId: "",
  });

  // Transform flat goals to tree structure
  // useMemo will recompute when document.state.global.goals changes
  const treeData = useMemo(() => {
    if (!document) return [];
    const goals = document.state.global.goals || [];
    return flatToTree(goals);
  }, [document?.state.global.goals]);

  // Handle custom status change actions
  const handleStatusChange = useCallback((actionData: any) => {
    if (!dispatch) return;
    
    console.log("Status change received:", actionData);
    const { value, row: goalId } = actionData.data || actionData;
    console.log("Status change:", { value, goalId });
    
    if (value === "BLOCKED") {
      // Show popup for blocked status
      console.log("Blocked status selected - showing popup");
      setBlockedPopup({ isOpen: true, goalId });
    } else {
      // Handle other status changes directly
      switch (value) {
        case "TODO":
          dispatch(markTodo({ id: goalId }));
          break;
        case "IN_PROGRESS":
          dispatch(markInProgress({ id: goalId }));
          break;
        case "COMPLETED":
          dispatch(markCompleted({ id: goalId }));
          break;
        case "WONT_DO":
          dispatch(markWontDo({ id: goalId }));
          break;
        case "DELEGATED":
        case "IN_REVIEW":
          // These might need special handling
          console.log(`${value} status not yet implemented`);
          break;
        default:
          console.warn("Unknown status:", value);
      }
    }
  }, [dispatch]);

  // Column configuration for the grid
  const columns = useMemo(
    () => [
      {
        id: "description",
        header: "Goal Description",
        flexgrow: 1,
        treetoggle: true, // This column will show the expand/collapse toggle
        editor: "text", // Enable text editing
      },
      {
        id: "status",
        header: "Status", 
        width: 140,
        cell: (props: any) => (
          <EditableStatusChip 
            {...props} 
            onStatusChange={handleStatusChange}
          />
        ),
      },
      {
        id: "assignee",
        header: "Assignee",
        width: 150,
        editor: "text", // Enable text editing
        template: (v: string | null) => v || "", // Show empty string instead of null
      },
      {
        id: "isDraft",
        header: "Draft",
        width: 60,
        template: (v: boolean) => (v ? "📝" : ""),
      },
    ],
    [handleStatusChange],
  );

  if (!document) return <div>No document loaded</div>;

  const totalGoals = useMemo(() => countGoalsInTree(treeData), [treeData]);

  const handleRowClick = (event: any) => {
    console.log("Row selected:", event); // Debug log
    if (onGoalSelect && event?.id) {
      onGoalSelect(event.id);
    }
  };

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

  // Initialize Grid API and set up event handlers
  const init = useCallback((api: any) => {
    apiRef.current = api;
    
    // Handle cell updates from inline editing
    api.on('update-cell', (event: any) => {
      if (!dispatch) return;
      
      const { id, column, value } = event;
      console.log("update-cell event:", { id, column, value });
      
      if (column === "description") {
        dispatch(
          updateDescription({
            goalId: id,
            description: value,
          }),
        );
      } else if (column === "assignee") {
        // Use delegateGoal to set assignee
        if (value && value.trim()) {
          dispatch(
            delegateGoal({
              id: id,
              assignee: value.trim(),
            }),
          );
        }
      }
    });
  }, [dispatch]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Goal Hierarchy</h2>
        <p className="text-sm text-gray-500 mt-1">
          {totalGoals} {totalGoals === 1 ? "goal" : "goals"} in this work
          breakdown structure
          {onGoalSelect && (
            <span className="text-xs text-gray-400 ml-2">
              (Click a goal to edit)
            </span>
          )}
        </p>
        <div className="mt-2 text-xs text-gray-400">
          {treeData.length === 0 ? (
            <span>No goals yet. Create your first goal to get started.</span>
          ) : (
            <span>
              {treeData.length} root {treeData.length === 1 ? "goal" : "goals"}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
        <Willow>
          <Grid
            data={treeData}
            columns={columns}
            tree={true}
            init={init}
            onSelectRow={handleRowClick}
          />
        </Willow>
      </div>

      <BlockedStatusPopup
        isOpen={blockedPopup.isOpen}
        onClose={handleBlockedClose}
        onSubmit={handleBlockedSubmit}
        goalId={blockedPopup.goalId}
      />
    </div>
  );
}
