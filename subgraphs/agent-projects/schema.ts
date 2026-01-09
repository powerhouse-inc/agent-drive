import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: AgentProjects Document
  """
  type AgentProjectsQueries {
    getDocument(docId: PHID!, driveId: PHID): AgentProjects
    getDocuments(driveId: String!): [AgentProjects!]
  }

  type Query {
    AgentProjects: AgentProjectsQueries
  }

  """
  Mutations: AgentProjects
  """
  type Mutation {
    AgentProjects_createDocument(name: String!, driveId: String): String

    AgentProjects_createProject(
      driveId: String
      docId: PHID
      input: AgentProjects_CreateProjectInput
    ): Int
    AgentProjects_runProject(
      driveId: String
      docId: PHID
      input: AgentProjects_RunProjectInput
    ): Int
    AgentProjects_stopProject(
      driveId: String
      docId: PHID
      input: AgentProjects_StopProjectInput
    ): Int
    AgentProjects_deleteProject(
      driveId: String
      docId: PHID
      input: AgentProjects_DeleteProjectInput
    ): Int
    AgentProjects_registerProject(
      driveId: String
      docId: PHID
      input: AgentProjects_RegisterProjectInput
    ): Int
    AgentProjects_updateProjectConfig(
      driveId: String
      docId: PHID
      input: AgentProjects_UpdateProjectConfigInput
    ): Int
    AgentProjects_updateProjectStatus(
      driveId: String
      docId: PHID
      input: AgentProjects_UpdateProjectStatusInput
    ): Int
    AgentProjects_updateRuntimeInfo(
      driveId: String
      docId: PHID
      input: AgentProjects_UpdateRuntimeInfoInput
    ): Int
    AgentProjects_addLogEntry(
      driveId: String
      docId: PHID
      input: AgentProjects_AddLogEntryInput
    ): Int
    AgentProjects_clearProjectLogs(
      driveId: String
      docId: PHID
      input: AgentProjects_ClearProjectLogsInput
    ): Int
  }

  """
  Module: ProjectTargeting
  """
  input AgentProjects_CreateProjectInput {
    id: OID!
    name: String!
    connectPort: Int
    switchboardPort: Int
  }
  input AgentProjects_RunProjectInput {
    projectId: OID!
  }
  input AgentProjects_StopProjectInput {
    projectId: OID!
  }
  input AgentProjects_DeleteProjectInput {
    projectId: OID!
  }

  """
  Module: ProjectManagement
  """
  input AgentProjects_RegisterProjectInput {
    id: OID!
    name: String!
    path: String!
    connectPort: Int!
    switchboardPort: Int!
    startupTimeout: Int!
    autoStart: Boolean!
    currentStatus: AgentProjects_CurrentStatus!
  }
  input AgentProjects_UpdateProjectConfigInput {
    projectId: OID!
    connectPort: Int
    switchboardPort: Int
    startupTimeout: Int
    autoStart: Boolean
  }
  input AgentProjects_UpdateProjectStatusInput {
    projectId: OID!
    currentStatus: AgentProjects_CurrentStatus!
    path: String
  }

  """
  Module: RuntimeInfo
  """
  input AgentProjects_UpdateRuntimeInfoInput {
    projectId: OID!
    pid: Int!
    startedAt: DateTime!
    driveUrl: String
    connectPort: Int!
    switchboardPort: Int!
  }

  """
  Module: Logs
  """
  input AgentProjects_AddLogEntryInput {
    projectId: OID!
    timestamp: DateTime!
    message: String!
  }
  input AgentProjects_ClearProjectLogsInput {
    projectId: OID!
  }
`;
