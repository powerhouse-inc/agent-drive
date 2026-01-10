import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: WorkBreakdownStructure Document
  """
  type WorkBreakdownStructureQueries {
    getDocument(docId: PHID!, driveId: PHID): WorkBreakdownStructure
    getDocuments(driveId: String!): [WorkBreakdownStructure!]
  }

  type Query {
    WorkBreakdownStructure: WorkBreakdownStructureQueries
  }

  """
  Mutations: WorkBreakdownStructure
  """
  type Mutation {
    WorkBreakdownStructure_createDocument(
      name: String!
      driveId: String
    ): String

    WorkBreakdownStructure_updateDescription(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_UpdateDescriptionInput
    ): Int
    WorkBreakdownStructure_updateInstructions(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_UpdateInstructionsInput
    ): Int
    WorkBreakdownStructure_addNote(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_AddNoteInput
    ): Int
    WorkBreakdownStructure_clearInstructions(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_ClearInstructionsInput
    ): Int
    WorkBreakdownStructure_clearNotes(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_ClearNotesInput
    ): Int
    WorkBreakdownStructure_removeNote(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_RemoveNoteInput
    ): Int
    WorkBreakdownStructure_markAsDraft(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_MarkAsDraftInput
    ): Int
    WorkBreakdownStructure_markAsReady(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_MarkAsReadyInput
    ): Int
    WorkBreakdownStructure_reorder(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_ReorderInput
    ): Int
    WorkBreakdownStructure_addDependencies(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_AddDependenciesInput
    ): Int
    WorkBreakdownStructure_removeDependencies(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_RemoveDependenciesInput
    ): Int
    WorkBreakdownStructure_createGoal(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_CreateGoalInput
    ): Int
    WorkBreakdownStructure_delegateGoal(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_DelegateGoalInput
    ): Int
    WorkBreakdownStructure_reportOnGoal(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_ReportOnGoalInput
    ): Int
    WorkBreakdownStructure_markInProgress(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_MarkInProgressInput
    ): Int
    WorkBreakdownStructure_markCompleted(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_MarkCompletedInput
    ): Int
    WorkBreakdownStructure_markTodo(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_MarkTodoInput
    ): Int
    WorkBreakdownStructure_reportBlocked(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_ReportBlockedInput
    ): Int
    WorkBreakdownStructure_unblockGoal(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_UnblockGoalInput
    ): Int
    WorkBreakdownStructure_markWontDo(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_MarkWontDoInput
    ): Int
    WorkBreakdownStructure_setReferences(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_SetReferencesInput
    ): Int
    WorkBreakdownStructure_setMetaData(
      driveId: String
      docId: PHID
      input: WorkBreakdownStructure_SetMetaDataInput
    ): Int
  }

  """
  Module: Documentation
  """
  input WorkBreakdownStructure_UpdateDescriptionInput {
    goalId: OID!
    description: String!
  }
  input WorkBreakdownStructure_UpdateInstructionsInput {
    goalId: OID!
    instructions: String!
  }
  input WorkBreakdownStructure_AddNoteInput {
    goalId: OID!
    noteId: OID!
    note: String!
    author: String
  }
  input WorkBreakdownStructure_ClearInstructionsInput {
    goalId: OID!
  }
  input WorkBreakdownStructure_ClearNotesInput {
    goalId: OID!
  }
  input WorkBreakdownStructure_RemoveNoteInput {
    goalId: OID!
    noteId: OID!
  }
  input WorkBreakdownStructure_MarkAsDraftInput {
    goalId: OID!
  }
  input WorkBreakdownStructure_MarkAsReadyInput {
    goalId: OID!
  }

  """
  Module: Hierarchy
  """
  input WorkBreakdownStructure_ReorderInput {
    goalId: OID!
    "Omit for root goals"
    parentId: OID
    "Omit for appending at the end"
    insertBefore: OID
  }
  input WorkBreakdownStructure_AddDependenciesInput {
    goalId: OID!
    dependsOn: [OID!]!
  }
  input WorkBreakdownStructure_RemoveDependenciesInput {
    goalId: OID!
    dependencies: [OID!]!
  }

  """
  Module: Workflow
  """
  input WorkBreakdownStructure_CreateGoalInput {
    id: OID!
    description: String!
    instructions: String
    draft: Boolean
    parentId: OID
    insertBefore: OID
    assignee: String
    dependsOn: [OID!]
    initialNote: WorkBreakdownStructure_InitialNoteInput
    metaData: WorkBreakdownStructure_MetaDataInput
  }

  input WorkBreakdownStructure_InitialNoteInput {
    id: OID!
    note: String!
    author: String
  }

  input WorkBreakdownStructure_MetaDataInput {
    format: WorkBreakdownStructure_MetaDataFormat
    data: String
  }
  input WorkBreakdownStructure_DelegateGoalInput {
    id: OID!
    assignee: String!
  }
  input WorkBreakdownStructure_ReportOnGoalInput {
    id: OID!
    note: String!
    moveInReview: Boolean!
  }
  input WorkBreakdownStructure_MarkInProgressInput {
    id: OID!
    note: String
  }
  input WorkBreakdownStructure_MarkCompletedInput {
    id: OID!
    note: String
  }
  input WorkBreakdownStructure_MarkTodoInput {
    id: OID!
    note: String
  }
  input WorkBreakdownStructure_ReportBlockedInput {
    id: OID!
    question: String!
  }
  input WorkBreakdownStructure_UnblockGoalInput {
    id: OID!
    response: String!
  }
  input WorkBreakdownStructure_MarkWontDoInput {
    id: OID!
  }

  """
  Module: Metadata
  """
  input WorkBreakdownStructure_SetReferencesInput {
    references: [URL!]!
  }
  input WorkBreakdownStructure_SetMetaDataInput {
    format: WorkBreakdownStructure_MetaDataFormat!
    data: String!
  }
`;
