import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { AgentInboxPHState } from "@powerhousedao/agent-manager/document-models/agent-inbox";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "./index.js";

/** Document model module for the Todo List document type */
export const AgentInbox: DocumentModelModule<AgentInboxPHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
