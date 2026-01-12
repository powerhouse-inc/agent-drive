import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { AgentInboxPHState } from "powerhouse-agent/document-models/agent-inbox";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "powerhouse-agent/document-models/agent-inbox";

/** Document model module for the Todo List document type */
export const AgentInbox: DocumentModelModule<AgentInboxPHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
