import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  agentProjectsDocumentType,
} from "powerhouse-agent/document-models/agent-projects";

import type {
  AgentProjectsDocument,
  CreateProjectInput,
  RunProjectInput,
  StopProjectInput,
  DeleteProjectInput,
  RegisterProjectInput,
  UpdateProjectConfigInput,
  UpdateProjectStatusInput,
  UpdateRuntimeInfoInput,
  AddLogEntryInput,
  ClearProjectLogsInput,
} from "powerhouse-agent/document-models/agent-projects";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      AgentProjects: async () => {
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

            const doc = await reactor.getDocument<AgentProjectsDocument>(docId);
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
                  await reactor.getDocument<AgentProjectsDocument>(docId);
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
              (doc) => doc.header.documentType === agentProjectsDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      AgentProjects_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(agentProjectsDocumentType);

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: agentProjectsDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      AgentProjects_createProject: async (
        _: unknown,
        args: { docId: string; input: CreateProjectInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentProjectsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.createProject(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to createProject");
        }

        return true;
      },

      AgentProjects_runProject: async (
        _: unknown,
        args: { docId: string; input: RunProjectInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentProjectsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.runProject(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to runProject");
        }

        return true;
      },

      AgentProjects_stopProject: async (
        _: unknown,
        args: { docId: string; input: StopProjectInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentProjectsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.stopProject(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to stopProject");
        }

        return true;
      },

      AgentProjects_deleteProject: async (
        _: unknown,
        args: { docId: string; input: DeleteProjectInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentProjectsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.deleteProject(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to deleteProject");
        }

        return true;
      },

      AgentProjects_registerProject: async (
        _: unknown,
        args: { docId: string; input: RegisterProjectInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentProjectsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.registerProject(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to registerProject");
        }

        return true;
      },

      AgentProjects_updateProjectConfig: async (
        _: unknown,
        args: { docId: string; input: UpdateProjectConfigInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentProjectsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateProjectConfig(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateProjectConfig",
          );
        }

        return true;
      },

      AgentProjects_updateProjectStatus: async (
        _: unknown,
        args: { docId: string; input: UpdateProjectStatusInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentProjectsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateProjectStatus(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateProjectStatus",
          );
        }

        return true;
      },

      AgentProjects_updateRuntimeInfo: async (
        _: unknown,
        args: { docId: string; input: UpdateRuntimeInfoInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentProjectsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateRuntimeInfo(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateRuntimeInfo",
          );
        }

        return true;
      },

      AgentProjects_addLogEntry: async (
        _: unknown,
        args: { docId: string; input: AddLogEntryInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentProjectsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addLogEntry(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addLogEntry");
        }

        return true;
      },

      AgentProjects_clearProjectLogs: async (
        _: unknown,
        args: { docId: string; input: ClearProjectLogsInput },
      ) => {
        const { docId, input } = args;
        const doc = await reactor.getDocument<AgentProjectsDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.clearProjectLogs(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to clearProjectLogs",
          );
        }

        return true;
      },
    },
  };
};
