import { useMemo, useCallback } from "react";
import { Grid, Willow } from "@svar-ui/react-grid";
import { useSelectedWorkBreakdownStructureDocument } from "powerhouse-agent/document-models/work-breakdown-structure";
import { flatToTree, countGoalsInTree } from "../utils/treeTransform.js";
import StatusChip from "./StatusChip.js";
import { updateDescription, delegateGoal } from "powerhouse-agent/document-models/work-breakdown-structure";

interface GoalGridProps {
  onGoalSelect?: (goalId: string) => void;
}

export function GoalGrid({ onGoalSelect }: GoalGridProps) {
  const [document, dispatch] = useSelectedWorkBreakdownStructureDocument();

  // Transform flat goals to tree structure
  // useMemo will recompute when document.state.global.goals changes
  const treeData = useMemo(() => {
    if (!document) return [];
    const goals = document.state.global.goals || [];
    return flatToTree(goals);
  }, [document?.state.global.goals]);

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
        cell: StatusChip,
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
    [],
  );

  if (!document) return <div>No document loaded</div>;

  const totalGoals = useMemo(() => countGoalsInTree(treeData), [treeData]);

  const handleRowClick = (event: any) => {
    console.log("Row selected:", event); // Debug log
    if (onGoalSelect && event?.id) {
      onGoalSelect(event.id);
    }
  };

  // Handle inline editing events
  const handleCellEdit = useCallback((event: any) => {
    const { row, column, value } = event;
    console.log("Cell edited:", { row, column, value });
    
    if (column === "description") {
      dispatch(
        updateDescription({
          goalId: row,
          description: value,
        }),
      );
    } else if (column === "assignee") {
      // Use delegateGoal to set assignee
      if (value && value.trim()) {
        dispatch(
          delegateGoal({
            id: row,
            assignee: value.trim(),
          }),
        );
      }
    }
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
            onSelectRow={handleRowClick}
            onAfterEdit={handleCellEdit}
          />
        </Willow>
      </div>
    </div>
  );
}
