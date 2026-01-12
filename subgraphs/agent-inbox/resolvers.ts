import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  agentInboxDocumentType,
} from "powerhouse-agent/document-models/agent-inbox";

import type {
  AgentInboxDocument,
  SetAgentNameInput,
  SetAgentAddressInput,
  SetAgentRoleInput,
  SetAgentDescriptionInput,
  SetAgentAvatarInput,
  AddStakeholderInput,
  RemoveStakeholderInput,
  SetStakeholderNameInput,
  SetStakeholderAddressInput,
  SetStakeholderAvatarInput,
  MoveStakeholderInput,
  CreateThreadInput,
  SendAgentMessageInput,
  SetThreadTopicInput,
  EditMessageContentInput,
  MarkMessageReadInput,
  MarkMessageUnreadInput,
  SendStakeholderMessageInput,
  ProposeThreadResolvedInput,
  ConfirmThreadResolvedInput,
  ArchiveThreadInput,
  ReopenThreadInput,
} from "powerhouse-agent/document-models/agent-inbox";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      AgentInbox: async () => {
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

            const doc = await reactor.getDocument<AgentInboxDocument>(docId);
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
                  await reactor.getDocument<AgentInboxDocument>(docId);
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
              (doc) => doc.header.documentType === agentInboxDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      AgentInbox_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(agentInboxDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: agentInboxDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      AgentInbox_setAgentName: async (
        _: unknown,
        args: { docId: string; input: SetAgentNameInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setAgentName(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setAgentName");
        }

        return true;
      },

      AgentInbox_setAgentAddress: async (
        _: unknown,
        args: { docId: string; input: SetAgentAddressInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setAgentAddress(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setAgentAddress");
        }

        return true;
      },

      AgentInbox_setAgentRole: async (
        _: unknown,
        args: { docId: string; input: SetAgentRoleInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setAgentRole(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setAgentRole");
        }

        return true;
      },

      AgentInbox_setAgentDescription: async (
        _: unknown,
        args: { docId: string; input: SetAgentDescriptionInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setAgentDescription(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setAgentDescription",
          );
        }

        return true;
      },

      AgentInbox_setAgentAvatar: async (
        _: unknown,
        args: { docId: string; input: SetAgentAvatarInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setAgentAvatar(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setAgentAvatar");
        }

        return true;
      },

      AgentInbox_addStakeholder: async (
        _: unknown,
        args: { docId: string; input: AddStakeholderInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addStakeholder(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addStakeholder");
        }

        return true;
      },

      AgentInbox_removeStakeholder: async (
        _: unknown,
        args: { docId: string; input: RemoveStakeholderInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeStakeholder(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeStakeholder",
          );
        }

        return true;
      },

      AgentInbox_setStakeholderName: async (
        _: unknown,
        args: { docId: string; input: SetStakeholderNameInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setStakeholderName(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setStakeholderName",
          );
        }

        return true;
      },

      AgentInbox_setStakeholderAddress: async (
        _: unknown,
        args: { docId: string; input: SetStakeholderAddressInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setStakeholderAddress(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setStakeholderAddress",
          );
        }

        return true;
      },

      AgentInbox_setStakeholderAvatar: async (
        _: unknown,
        args: { docId: string; input: SetStakeholderAvatarInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setStakeholderAvatar(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to setStakeholderAvatar",
          );
        }

        return true;
      },

      AgentInbox_moveStakeholder: async (
        _: unknown,
        args: { docId: string; input: MoveStakeholderInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.moveStakeholder(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to moveStakeholder");
        }

        return true;
      },

      AgentInbox_createThread: async (
        _: unknown,
        args: { docId: string; input: CreateThreadInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.createThread(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to createThread");
        }

        return true;
      },

      AgentInbox_sendAgentMessage: async (
        _: unknown,
        args: { docId: string; input: SendAgentMessageInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.sendAgentMessage(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to sendAgentMessage",
          );
        }

        return true;
      },

      AgentInbox_setThreadTopic: async (
        _: unknown,
        args: { docId: string; input: SetThreadTopicInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setThreadTopic(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setThreadTopic");
        }

        return true;
      },

      AgentInbox_editMessageContent: async (
        _: unknown,
        args: { docId: string; input: EditMessageContentInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.editMessageContent(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to editMessageContent",
          );
        }

        return true;
      },

      AgentInbox_markMessageRead: async (
        _: unknown,
        args: { docId: string; input: MarkMessageReadInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.markMessageRead(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to markMessageRead");
        }

        return true;
      },

      AgentInbox_markMessageUnread: async (
        _: unknown,
        args: { docId: string; input: MarkMessageUnreadInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.markMessageUnread(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to markMessageUnread",
          );
        }

        return true;
      },

      AgentInbox_sendStakeholderMessage: async (
        _: unknown,
        args: { docId: string; input: SendStakeholderMessageInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.sendStakeholderMessage(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to sendStakeholderMessage",
          );
        }

        return true;
      },

      AgentInbox_proposeThreadResolved: async (
        _: unknown,
        args: { docId: string; input: ProposeThreadResolvedInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.proposeThreadResolved(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to proposeThreadResolved",
          );
        }

        return true;
      },

      AgentInbox_confirmThreadResolved: async (
        _: unknown,
        args: { docId: string; input: ConfirmThreadResolvedInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.confirmThreadResolved(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to confirmThreadResolved",
          );
        }

        return true;
      },

      AgentInbox_archiveThread: async (
        _: unknown,
        args: { docId: string; input: ArchiveThreadInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.archiveThread(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to archiveThread");
        }

        return true;
      },

      AgentInbox_reopenThread: async (
        _: unknown,
        args: { docId: string; input: ReopenThreadInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentInboxDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.reopenThread(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to reopenThread");
        }

        return true;
      },
    },
  };
};
