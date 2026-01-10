import type { WorkBreakdownStructureWorkflowOperations } from "powerhouse-agent/document-models/work-breakdown-structure";
import type { Goal, Note } from "../../gen/index.js";
import { insertGoalAtPosition } from "../utils.js";

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
      // TODO: Implement "delegateGoalOperation" reducer
      throw new Error('Reducer "delegateGoalOperation" not yet implemented');
    },
    reportOnGoalOperation(state, action) {
      // TODO: Implement "reportOnGoalOperation" reducer
      throw new Error('Reducer "reportOnGoalOperation" not yet implemented');
    },
    markInProgressOperation(state, action) {
      // TODO: Implement "markInProgressOperation" reducer
      throw new Error('Reducer "markInProgressOperation" not yet implemented');
    },
    markCompletedOperation(state, action) {
      // TODO: Implement "markCompletedOperation" reducer
      throw new Error('Reducer "markCompletedOperation" not yet implemented');
    },
    markTodoOperation(state, action) {
      // TODO: Implement "markTodoOperation" reducer
      throw new Error('Reducer "markTodoOperation" not yet implemented');
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
      // TODO: Implement "markWontDoOperation" reducer
      throw new Error('Reducer "markWontDoOperation" not yet implemented');
    },
  };
