import type { DocumentModelModule } from "document-model";
import { ClaudeChat } from "./claude-chat/module.js";
import { AgentProjects } from "./agent-projects/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  AgentProjects,
  ClaudeChat,
];
