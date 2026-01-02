import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  claudeChatDocumentType,
} from "claude-demo/document-models/claude-chat";

import type {
  ClaudeChatDocument,
  AddAgentInput,
  AddUserMessageInput,
  AddAgentMessageInput,
  SetUsernameInput,
  SetSelectedAgentInput,
} from "claude-demo/document-models/claude-chat";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      ClaudeChat: async () => {
        return {
          getDocument: async (args: { docId: string; driveId: string }) => {
            const { docId, driveId } = args;

            if (!docId) {
              throw new Error("Document id is required");
            }

            if (driveId) {
              const docIds = await reactor.getDocuments(driveId);
              if (!docIds.includes(docId)) {
                throw new Error(
                  `Document with id ${docId} is not part of ${driveId}`,
                );
              }
            }

            const doc = await reactor.getDocument<ClaudeChatDocument>(docId);
            return {
              driveId: driveId,
              ...doc,
              ...doc.header,
              created: doc.header.createdAtUtcIso,
              lastModified: doc.header.lastModifiedAtUtcIso,
              state: doc.state.global,
              stateJSON: doc.state.global,
              revision: doc.header?.revision?.global ?? 0,
            };
          },
          getDocuments: async (args: { driveId: string }) => {
            const { driveId } = args;
            const docsIds = await reactor.getDocuments(driveId);
            const docs = await Promise.all(
              docsIds.map(async (docId) => {
                const doc =
                  await reactor.getDocument<ClaudeChatDocument>(docId);
                return {
                  driveId: driveId,
                  ...doc,
                  ...doc.header,
                  created: doc.header.createdAtUtcIso,
                  lastModified: doc.header.lastModifiedAtUtcIso,
                  state: doc.state.global,
                  stateJSON: doc.state.global,
                  revision: doc.header?.revision?.global ?? 0,
                };
              }),
            );

            return docs.filter(
              (doc) => doc.header.documentType === claudeChatDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      ClaudeChat_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(claudeChatDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: claudeChatDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      ClaudeChat_addAgent: async (
        _: unknown,
        args: { docId: string; input: AddAgentInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ClaudeChatDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addAgent(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addAgent");
        }

        return true;
      },

      ClaudeChat_addUserMessage: async (
        _: unknown,
        args: { docId: string; input: AddUserMessageInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ClaudeChatDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addUserMessage(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addUserMessage");
        }

        return true;
      },

      ClaudeChat_addAgentMessage: async (
        _: unknown,
        args: { docId: string; input: AddAgentMessageInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ClaudeChatDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addAgentMessage(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addAgentMessage");
        }

        return true;
      },

      ClaudeChat_setUsername: async (
        _: unknown,
        args: { docId: string; input: SetUsernameInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ClaudeChatDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setUsername(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setUsername");
        }

        return true;
      },

      ClaudeChat_setSelectedAgent: async (
        _: unknown,
        args: { docId: string; input: SetSelectedAgentInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<ClaudeChatDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setSelectedAgent(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setSelectedAgent",
          );
        }

        return true;
      },
    },
  };
};
