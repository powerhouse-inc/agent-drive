import type { EditorModule } from "document-model";
import { ClaudeChatEditor } from "./claude-chat-editor/module.js";
import { AgentProjectsEditor } from "./agent-projects-editor/module.js";
import { WbsEditor } from "./wbs-editor/module.js";

export const editors: EditorModule[] = [
  AgentProjectsEditor,
  ClaudeChatEditor,
  WbsEditor,
];
