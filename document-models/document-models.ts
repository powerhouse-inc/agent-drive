import type { DocumentModelModule } from "document-model";
import { ClaudeChat } from "./claude-chat/module.js";

export const documentModels: DocumentModelModule<any>[] = [
  ClaudeChat,
];
