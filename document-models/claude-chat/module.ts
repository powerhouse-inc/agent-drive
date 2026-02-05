import type { DocumentModelModule } from "document-model";
import { createState } from "document-model";
import { defaultBaseState } from "document-model/core";
import type { ClaudeChatPHState } from "@powerhousedao/agent-manager/document-models/claude-chat";
import {
  actions,
  documentModel,
  reducer,
  utils,
} from "./index.js";

/** Document model module for the Todo List document type */
export const ClaudeChat: DocumentModelModule<ClaudeChatPHState> = {
  reducer,
  actions,
  utils,
  documentModel: createState(defaultBaseState(), documentModel),
};
