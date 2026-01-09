import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  AgentProjectsDocument,
  AgentProjectsAction,
} from "powerhouse-agent/document-models/agent-projects";
import { isAgentProjectsDocument } from "./gen/document-schema.js";

/** Hook to get a AgentProjects document by its id */
export function useAgentProjectsDocumentById(
  documentId: string | null | undefined,
):
  | [AgentProjectsDocument, DocumentDispatch<AgentProjectsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isAgentProjectsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected AgentProjects document */
export function useSelectedAgentProjectsDocument():
  | [AgentProjectsDocument, DocumentDispatch<AgentProjectsAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isAgentProjectsDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all AgentProjects documents in the selected drive */
export function useAgentProjectsDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isAgentProjectsDocument);
}

/** Hook to get all AgentProjects documents in the selected folder */
export function useAgentProjectsDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isAgentProjectsDocument);
}
