import type { Goal } from "../../gen/index.js";
import {
  findGoal,
  findGoalIndex,
  isDescendant,
} from "../utils.js";
import type { WorkBreakdownStructureHierarchyOperations } from "powerhouse-agent/document-models/work-breakdown-structure";

export const workBreakdownStructureHierarchyOperations: WorkBreakdownStructureHierarchyOperations =
  {
    reorderOperation(state, action) {
      // Find target goal by ID
      const goal = findGoal(state.goals, action.input.goalId);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.goalId} not found`);
      }

      // If new parent is specified, validate it's not a descendant (prevent cycles)
      if (action.input.parentId !== undefined) {
        // Check if the new parent exists (unless it's null for root)
        if (action.input.parentId !== null) {
          const newParent = findGoal(state.goals, action.input.parentId);
          if (!newParent) {
            throw new Error(`Parent goal with ID ${action.input.parentId} not found`);
          }
          
          // Prevent circular reference - can't move a goal under its own descendant
          if (isDescendant(state.goals, action.input.goalId, action.input.parentId)) {
            throw new Error(`Cannot move goal ${action.input.goalId} under its own descendant ${action.input.parentId}`);
          }
        }

        // Update the goal's parentId
        goal.parentId = action.input.parentId;
      }

      // Handle position reordering if insertBefore is specified
      if (action.input.insertBefore !== undefined) {
        // Remove goal from current position
        const currentIndex = findGoalIndex(state.goals, action.input.goalId);
        if (currentIndex !== -1) {
          const [removedGoal] = state.goals.splice(currentIndex, 1);
          
          // Find the position to insert
          if (action.input.insertBefore === null) {
            // Insert at the end
            state.goals.push(removedGoal);
          } else {
            const insertIndex = findGoalIndex(state.goals, action.input.insertBefore);
            if (insertIndex === -1) {
              // If insertBefore goal not found, append at end
              state.goals.push(removedGoal);
            } else {
              // Insert at the specific position
              state.goals.splice(insertIndex, 0, removedGoal);
            }
          }
        }
      }
    },
    addDependenciesOperation(state, action) {
      // TODO: Implement "addDependenciesOperation" reducer
      throw new Error('Reducer "addDependenciesOperation" not yet implemented');
    },
    removeDependenciesOperation(state, action) {
      // TODO: Implement "removeDependenciesOperation" reducer
      throw new Error(
        'Reducer "removeDependenciesOperation" not yet implemented',
      );
    },
  };
