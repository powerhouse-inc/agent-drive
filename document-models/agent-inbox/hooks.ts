import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import {
  useDocumentsInSelectedDrive,
  useDocumentsInSelectedFolder,
  useDocumentById,
  useSelectedDocument,
} from "@powerhousedao/reactor-browser";
import type {
  AgentInboxDocument,
  AgentInboxAction,
} from "@powerhousedao/agent-manager/document-models/agent-inbox";
import { isAgentInboxDocument } from "./gen/document-schema.js";

/** Hook to get a AgentInbox document by its id */
export function useAgentInboxDocumentById(
  documentId: string | null | undefined,
):
  | [AgentInboxDocument, DocumentDispatch<AgentInboxAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useDocumentById(documentId);
  if (!isAgentInboxDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get the selected AgentInbox document */
export function useSelectedAgentInboxDocument():
  | [AgentInboxDocument, DocumentDispatch<AgentInboxAction>]
  | [undefined, undefined] {
  const [document, dispatch] = useSelectedDocument();
  if (!isAgentInboxDocument(document)) return [undefined, undefined];
  return [document, dispatch];
}

/** Hook to get all AgentInbox documents in the selected drive */
export function useAgentInboxDocumentsInSelectedDrive() {
  const documentsInSelectedDrive = useDocumentsInSelectedDrive();
  return documentsInSelectedDrive?.filter(isAgentInboxDocument);
}

/** Hook to get all AgentInbox documents in the selected folder */
export function useAgentInboxDocumentsInSelectedFolder() {
  const documentsInSelectedFolder = useDocumentsInSelectedFolder();
  return documentsInSelectedFolder?.filter(isAgentInboxDocument);
}
