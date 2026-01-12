import type { EditorModule } from "document-model";
import { ClaudeChatEditor } from "./claude-chat-editor/module.js";
import { AgentProjectsEditor } from "./agent-projects-editor/module.js";
import { WbsEditor } from "./wbs-editor/module.js";
import { AgentInboxEditor } from "./agent-inbox-editor/module.js";

export const editors: EditorModule[] = [
  AgentInboxEditor,
  AgentProjectsEditor,
  ClaudeChatEditor,
  WbsEditor,
];
