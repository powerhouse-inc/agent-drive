import type { Goal, Note } from "../../gen/index.js";
import {
  insertGoalAtPosition,
  findGoal,
  getAncestors,
  getDescendants,
  isLeafGoal,
} from "../utils.js";
import type { WorkBreakdownStructureWorkflowOperations } from "powerhouse-agent/document-models/work-breakdown-structure";

export const workBreakdownStructureWorkflowOperations: WorkBreakdownStructureWorkflowOperations =
  {
    createGoalOperation(state, action) {
      // Create the new goal with required fields
      const newGoal: Goal = {
        id: action.input.id,
        description: action.input.description,
        status: action.input.assignee ? "DELEGATED" : "TODO", // Status based on assignee
        parentId: action.input.parentId || null,
        dependencies: action.input.dependsOn || [],
        isDraft: action.input.draft || false,
        instructions: action.input.instructions || null,
        notes: [] as Note[],
        assignee: action.input.assignee || null,
      };

      // Add initial note if provided
      if (action.input.initialNote) {
        const note: Note = {
          id: action.input.initialNote.id,
          note: action.input.initialNote.note,
          author: action.input.initialNote.author || null,
        };
        newGoal.notes.push(note);
      }

      // Insert goal at the specified position
      state.goals = insertGoalAtPosition(
        state.goals,
        newGoal,
        action.input.insertBefore || undefined,
      );
    },
    delegateGoalOperation(state, action) {
      // Find target goal by ID
      const goal = findGoal(state.goals, action.input.id);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.id} not found`);
      }

      // Validate goal has no children (leaf node only)
      if (!isLeafGoal(state.goals, action.input.id)) {
        throw new Error(`Goal with ID ${action.input.id} has children and cannot be delegated`);
      }

      // Update assignee field
      goal.assignee = action.input.assignee;

      // Change status to DELEGATED
      goal.status = "DELEGATED";
    },
    reportOnGoalOperation(state, action) {
      // Find target goal by ID
      const goal = findGoal(state.goals, action.input.id);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.id} not found`);
      }

      // Validate goal status is DELEGATED
      if (goal.status !== "DELEGATED") {
        throw new Error(`Goal with ID ${action.input.id} is not delegated and cannot be reported on`);
      }

      // Add note to goal
      const note: Note = {
        id: action.input.note.id,
        note: action.input.note.note,
        author: action.input.note.author || null,
      };
      goal.notes.push(note);

      // If moveInReview is true, change status to IN_REVIEW
      if (action.input.moveInReview) {
        goal.status = "IN_REVIEW";
      }
    },
    markInProgressOperation(state, action) {
      // Find the target goal
      const goal = findGoal(state.goals, action.input.id);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.id} not found`);
      }

      // Update goal status to IN_PROGRESS
      goal.status = "IN_PROGRESS";

      // Add optional note if provided
      if (action.input.note) {
        const note: Note = {
          id: action.input.note.id,
          note: action.input.note.note,
          author: action.input.note.author || null,
        };
        goal.notes.push(note);
      }

      // Propagate IN_PROGRESS up to all ancestors
      const ancestors = getAncestors(state.goals, action.input.id);
      for (const ancestor of ancestors) {
        // Only update ancestors that are TODO or DELEGATED
        if (ancestor.status === "TODO" || ancestor.status === "DELEGATED") {
          ancestor.status = "IN_PROGRESS";
        }
      }
    },
    markCompletedOperation(state, action) {
      // Find the target goal
      const goal = findGoal(state.goals, action.input.id);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.id} not found`);
      }

      // Update goal status to COMPLETED
      goal.status = "COMPLETED";

      // Add optional note if provided
      if (action.input.note) {
        const note: Note = {
          id: action.input.note.id,
          note: action.input.note.note,
          author: action.input.note.author || null,
        };
        goal.notes.push(note);
      }

      // Mark all unfinished child goals as COMPLETED
      const descendants = getDescendants(state.goals, action.input.id);
      for (const descendant of descendants) {
        // Only mark as completed if not already finished (COMPLETED or WONT_DO)
        if (descendant.status !== "COMPLETED" && descendant.status !== "WONT_DO") {
          descendant.status = "COMPLETED";
        }
      }
    },
    markTodoOperation(state, action) {
      // Find the target goal
      const goal = findGoal(state.goals, action.input.id);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.id} not found`);
      }

      // Update goal status to TODO
      goal.status = "TODO";

      // Add optional note if provided
      if (action.input.note) {
        const note: Note = {
          id: action.input.note.id,
          note: action.input.note.note,
          author: action.input.note.author || null,
        };
        goal.notes.push(note);
      }

      // Reset finished parents (COMPLETED or WONT_DO) to TODO
      const ancestors = getAncestors(state.goals, action.input.id);
      for (const ancestor of ancestors) {
        if (ancestor.status === "COMPLETED" || ancestor.status === "WONT_DO") {
          ancestor.status = "TODO";
        }
      }
    },
    reportBlockedOperation(state, action) {
      // TODO: Implement "reportBlockedOperation" reducer
      throw new Error('Reducer "reportBlockedOperation" not yet implemented');
    },
    unblockGoalOperation(state, action) {
      // TODO: Implement "unblockGoalOperation" reducer
      throw new Error('Reducer "unblockGoalOperation" not yet implemented');
    },
    markWontDoOperation(state, action) {
      // Find the target goal
      const goal = findGoal(state.goals, action.input.id);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.id} not found`);
      }

      // Update goal status to WONT_DO
      goal.status = "WONT_DO";

      // Mark all unfinished child goals as WONT_DO
      const descendants = getDescendants(state.goals, action.input.id);
      for (const descendant of descendants) {
        // Only mark as WONT_DO if not already finished (COMPLETED or WONT_DO)
        if (descendant.status !== "COMPLETED" && descendant.status !== "WONT_DO") {
          descendant.status = "WONT_DO";
        }
      }
    },
  };
