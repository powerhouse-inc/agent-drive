import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { WorkBreakdownStructurePHState } from "powerhouse-agent/document-models/work-breakdown-structure";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "./index.js";

/** Document model module for the Todo List document type */
export const WorkBreakdownStructure: DocumentModelModule<WorkBreakdownStructurePHState> =
  {
    reducer,
    actions,
    utils,
    documentModel: createState(defaultBaseState(), documentModel),
  };
