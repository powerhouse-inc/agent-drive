import type { BaseSubgraph } from "@powerhousedao/reactor-api";
import { addFile } from "document-drive";
import { setName } from "document-model";
import {
  actions,
  workBreakdownStructureDocumentType,
} from "powerhouse-agent/document-models/work-breakdown-structure";

import type {
  WorkBreakdownStructureDocument,
  UpdateDescriptionInput,
  UpdateInstructionsInput,
  AddNoteInput,
  ClearInstructionsInput,
  ClearNotesInput,
  RemoveNoteInput,
  MarkAsDraftInput,
  MarkAsReadyInput,
  ReorderInput,
  AddDependenciesInput,
  RemoveDependenciesInput,
  CreateGoalInput,
  DelegateGoalInput,
  ReportOnGoalInput,
  MarkInProgressInput,
  MarkCompletedInput,
  MarkTodoInput,
  ReportBlockedInput,
  UnblockGoalInput,
  MarkWontDoInput,
  SetReferencesInput,
  SetMetaDataInput,
} from "powerhouse-agent/document-models/work-breakdown-structure";

export const getResolvers = (
  subgraph: BaseSubgraph,
): Record<string, unknown> => {
  const reactor = subgraph.reactor;

  return {
    Query: {
      WorkBreakdownStructure: async () => {
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

            const doc =
              await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
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
                  await reactor.getDocument<WorkBreakdownStructureDocument>(
                    docId,
                  );
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
              (doc) =>
                doc.header.documentType === workBreakdownStructureDocumentType,
            );
          },
        };
      },
    },
    Mutation: {
      WorkBreakdownStructure_createDocument: async (
        _: unknown,
        args: { name: string; driveId?: string },
      ) => {
        const { driveId, name } = args;
        const document = await reactor.addDocument(
          workBreakdownStructureDocumentType,
        );

        if (driveId) {
          await reactor.addAction(
            driveId,
            addFile({
              name,
              id: document.header.id,
              documentType: workBreakdownStructureDocumentType,
            }),
          );
        }

        if (name) {
          await reactor.addAction(document.header.id, setName(name));
        }

        return document.header.id;
      },

      WorkBreakdownStructure_updateDescription: async (
        _: unknown,
        args: { docId: string; input: UpdateDescriptionInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateDescription(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateDescription",
          );
        }

        return true;
      },

      WorkBreakdownStructure_updateInstructions: async (
        _: unknown,
        args: { docId: string; input: UpdateInstructionsInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.updateInstructions(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to updateInstructions",
          );
        }

        return true;
      },

      WorkBreakdownStructure_addNote: async (
        _: unknown,
        args: { docId: string; input: AddNoteInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.addNote(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addNote");
        }

        return true;
      },

      WorkBreakdownStructure_clearInstructions: async (
        _: unknown,
        args: { docId: string; input: ClearInstructionsInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.clearInstructions(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to clearInstructions",
          );
        }

        return true;
      },

      WorkBreakdownStructure_clearNotes: async (
        _: unknown,
        args: { docId: string; input: ClearNotesInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.clearNotes(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to clearNotes");
        }

        return true;
      },

      WorkBreakdownStructure_removeNote: async (
        _: unknown,
        args: { docId: string; input: RemoveNoteInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeNote(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to removeNote");
        }

        return true;
      },

      WorkBreakdownStructure_markAsDraft: async (
        _: unknown,
        args: { docId: string; input: MarkAsDraftInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.markAsDraft(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to markAsDraft");
        }

        return true;
      },

      WorkBreakdownStructure_markAsReady: async (
        _: unknown,
        args: { docId: string; input: MarkAsReadyInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.markAsReady(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to markAsReady");
        }

        return true;
      },

      WorkBreakdownStructure_reorder: async (
        _: unknown,
        args: { docId: string; input: ReorderInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.reorder(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to reorder");
        }

        return true;
      },

      WorkBreakdownStructure_addDependencies: async (
        _: unknown,
        args: { docId: string; input: AddDependenciesInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.addDependencies(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to addDependencies");
        }

        return true;
      },

      WorkBreakdownStructure_removeDependencies: async (
        _: unknown,
        args: { docId: string; input: RemoveDependenciesInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.removeDependencies(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(
            result.error?.message ?? "Failed to removeDependencies",
          );
        }

        return true;
      },

      WorkBreakdownStructure_createGoal: async (
        _: unknown,
        args: { docId: string; input: CreateGoalInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.createGoal(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to createGoal");
        }

        return true;
      },

      WorkBreakdownStructure_delegateGoal: async (
        _: unknown,
        args: { docId: string; input: DelegateGoalInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.delegateGoal(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to delegateGoal");
        }

        return true;
      },

      WorkBreakdownStructure_reportOnGoal: async (
        _: unknown,
        args: { docId: string; input: ReportOnGoalInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.reportOnGoal(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to reportOnGoal");
        }

        return true;
      },

      WorkBreakdownStructure_markInProgress: async (
        _: unknown,
        args: { docId: string; input: MarkInProgressInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.markInProgress(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to markInProgress");
        }

        return true;
      },

      WorkBreakdownStructure_markCompleted: async (
        _: unknown,
        args: { docId: string; input: MarkCompletedInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.markCompleted(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to markCompleted");
        }

        return true;
      },

      WorkBreakdownStructure_markTodo: async (
        _: unknown,
        args: { docId: string; input: MarkTodoInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(docId, actions.markTodo(input));

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to markTodo");
        }

        return true;
      },

      WorkBreakdownStructure_reportBlocked: async (
        _: unknown,
        args: { docId: string; input: ReportBlockedInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.reportBlocked(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to reportBlocked");
        }

        return true;
      },

      WorkBreakdownStructure_unblockGoal: async (
        _: unknown,
        args: { docId: string; input: UnblockGoalInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.unblockGoal(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to unblockGoal");
        }

        return true;
      },

      WorkBreakdownStructure_markWontDo: async (
        _: unknown,
        args: { docId: string; input: MarkWontDoInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.markWontDo(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to markWontDo");
        }

        return true;
      },

      WorkBreakdownStructure_setReferences: async (
        _: unknown,
        args: { docId: string; input: SetReferencesInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setReferences(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setReferences");
        }

        return true;
      },

      WorkBreakdownStructure_setMetaData: async (
        _: unknown,
        args: { docId: string; input: SetMetaDataInput },
      ) => {
        const { docId, input } = args;
        const doc =
          await reactor.getDocument<WorkBreakdownStructureDocument>(docId);
        if (!doc) {
          throw new Error("Document not found");
        }

        const result = await reactor.addAction(
          docId,
          actions.setMetaData(input),
        );

        if (result.status !== "SUCCESS") {
          throw new Error(result.error?.message ?? "Failed to setMetaData");
        }

        return true;
      },
    },
  };
};
