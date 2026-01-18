import type { Note } from "../../gen/index.js";
import { findGoal } from "../utils.js";
import type { WorkBreakdownStructureDocumentationOperations } from "powerhouse-agent/document-models/work-breakdown-structure";

export const workBreakdownStructureDocumentationOperations: WorkBreakdownStructureDocumentationOperations =
  {
    updateDescriptionOperation(state, action) {
      // Find target goal by ID
      const goal = findGoal(state.goals, action.input.goalId);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.goalId} not found`);
      }

      // Update description field
      goal.description = action.input.description;
    },
    updateInstructionsOperation(state, action) {
      // Find target goal by ID
      const goal = findGoal(state.goals, action.input.goalId);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.goalId} not found`);
      }

      // Update instructions field with the new GoalInstructions structure
      goal.instructions = {
        comments: action.input.instructions.comments,
        skillId: action.input.instructions.skillId || null,
        scenarioId: action.input.instructions.scenarioId || null,
        taskId: action.input.instructions.taskId || null,
        context: action.input.instructions.contextJSON
          ? { format: "JSON", data: action.input.instructions.contextJSON }
          : null,
      };
    },
    addNoteOperation(state, action) {
      // Find target goal by ID
      const goal = findGoal(state.goals, action.input.goalId);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.goalId} not found`);
      }

      // Create note object and add to notes array
      const note: Note = {
        id: action.input.noteId,
        note: action.input.note,
        author: action.input.author || null,
      };
      goal.notes.push(note);
    },
    clearInstructionsOperation(state, action) {
      // Find target goal by ID
      const goal = findGoal(state.goals, action.input.goalId);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.goalId} not found`);
      }

      // Set instructions to null
      goal.instructions = null;
    },
    clearNotesOperation(state, action) {
      // Find target goal by ID
      const goal = findGoal(state.goals, action.input.goalId);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.goalId} not found`);
      }

      // Empty the notes array
      goal.notes = [];
    },
    removeNoteOperation(state, action) {
      // Find target goal by ID
      const goal = findGoal(state.goals, action.input.goalId);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.goalId} not found`);
      }

      // Find and remove note by ID
      const noteIndex = goal.notes.findIndex(
        (n) => n.id === action.input.noteId,
      );
      if (noteIndex === -1) {
        throw new Error(`Note with ID ${action.input.noteId} not found`);
      }
      goal.notes.splice(noteIndex, 1);
    },
    markAsDraftOperation(state, action) {
      // Find target goal by ID
      const goal = findGoal(state.goals, action.input.goalId);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.goalId} not found`);
      }

      // Set isDraft to true
      goal.isDraft = true;
    },
    markAsReadyOperation(state, action) {
      // Find target goal by ID
      const goal = findGoal(state.goals, action.input.goalId);
      if (!goal) {
        throw new Error(`Goal with ID ${action.input.goalId} not found`);
      }

      // Set isDraft to false
      goal.isDraft = false;
    },
    setOwnerOperation(state, action) {
      // Set the owner field in the global state
      state.owner = action.input.owner;
    },
  };
