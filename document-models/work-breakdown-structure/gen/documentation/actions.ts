import { type Action } from "document-model";
import type {
  UpdateDescriptionInput,
  UpdateInstructionsInput,
  AddNoteInput,
  ClearInstructionsInput,
  ClearNotesInput,
  RemoveNoteInput,
  MarkAsDraftInput,
  MarkAsReadyInput,
} from "../types.js";

export type UpdateDescriptionAction = Action & {
  type: "UPDATE_DESCRIPTION";
  input: UpdateDescriptionInput;
};
export type UpdateInstructionsAction = Action & {
  type: "UPDATE_INSTRUCTIONS";
  input: UpdateInstructionsInput;
};
export type AddNoteAction = Action & { type: "ADD_NOTE"; input: AddNoteInput };
export type ClearInstructionsAction = Action & {
  type: "CLEAR_INSTRUCTIONS";
  input: ClearInstructionsInput;
};
export type ClearNotesAction = Action & {
  type: "CLEAR_NOTES";
  input: ClearNotesInput;
};
export type RemoveNoteAction = Action & {
  type: "REMOVE_NOTE";
  input: RemoveNoteInput;
};
export type MarkAsDraftAction = Action & {
  type: "MARK_AS_DRAFT";
  input: MarkAsDraftInput;
};
export type MarkAsReadyAction = Action & {
  type: "MARK_AS_READY";
  input: MarkAsReadyInput;
};

export type WorkBreakdownStructureDocumentationAction =
  | UpdateDescriptionAction
  | UpdateInstructionsAction
  | AddNoteAction
  | ClearInstructionsAction
  | ClearNotesAction
  | RemoveNoteAction
  | MarkAsDraftAction
  | MarkAsReadyAction;
