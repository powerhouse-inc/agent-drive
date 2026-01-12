import type { DocumentModelModule } from "document-model";
import { ClaudeChat } from "./claude-chat/module.js";
import { AgentProjects } from "./agent-projects/module.js";
import { WorkBreakdownStructure } from "./work-breakdown-structure/module.js";
import { AgentInbox } from "./agent-inbox/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  AgentInbox,
  AgentProjects,
  ClaudeChat,
  WorkBreakdownStructure,
];
