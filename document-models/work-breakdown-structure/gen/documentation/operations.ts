import { type SignalDispatch } from "document-model";
import {
  type UpdateDescriptionAction,
  type UpdateInstructionsAction,
  type AddNoteAction,
  type ClearInstructionsAction,
  type ClearNotesAction,
  type RemoveNoteAction,
  type MarkAsDraftAction,
  type MarkAsReadyAction,
  type SetOwnerAction,
} from "./actions.js";
import { type WorkBreakdownStructureState } from "../types.js";

export interface WorkBreakdownStructureDocumentationOperations {
  updateDescriptionOperation: (
    state: WorkBreakdownStructureState,
    action: UpdateDescriptionAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateInstructionsOperation: (
    state: WorkBreakdownStructureState,
    action: UpdateInstructionsAction,
    dispatch?: SignalDispatch,
  ) => void;
  addNoteOperation: (
    state: WorkBreakdownStructureState,
    action: AddNoteAction,
    dispatch?: SignalDispatch,
  ) => void;
  clearInstructionsOperation: (
    state: WorkBreakdownStructureState,
    action: ClearInstructionsAction,
    dispatch?: SignalDispatch,
  ) => void;
  clearNotesOperation: (
    state: WorkBreakdownStructureState,
    action: ClearNotesAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeNoteOperation: (
    state: WorkBreakdownStructureState,
    action: RemoveNoteAction,
    dispatch?: SignalDispatch,
  ) => void;
  markAsDraftOperation: (
    state: WorkBreakdownStructureState,
    action: MarkAsDraftAction,
    dispatch?: SignalDispatch,
  ) => void;
  markAsReadyOperation: (
    state: WorkBreakdownStructureState,
    action: MarkAsReadyAction,
    dispatch?: SignalDispatch,
  ) => void;
  setOwnerOperation: (
    state: WorkBreakdownStructureState,
    action: SetOwnerAction,
    dispatch?: SignalDispatch,
  ) => void;
}
