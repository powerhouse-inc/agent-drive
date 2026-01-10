import { type SignalDispatch } from "document-model";
import { type SetReferencesAction, type SetMetaDataAction } from "./actions.js";
import { type WorkBreakdownStructureState } from "../types.js";

export interface WorkBreakdownStructureExternalOperations {
  setReferencesOperation: (
    state: WorkBreakdownStructureState,
    action: SetReferencesAction,
    dispatch?: SignalDispatch,
  ) => void;
  setMetaDataOperation: (
    state: WorkBreakdownStructureState,
    action: SetMetaDataAction,
    dispatch?: SignalDispatch,
  ) => void;
}
