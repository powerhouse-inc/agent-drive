import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { AgentProjectsPHState } from "powerhouse-agent/document-models/agent-projects";
import { actions, documentModel, reducer, utils } from "./index.js";

/** Document model module for the Todo List document type */
export const AgentProjects: DocumentModelModule<AgentProjectsPHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
