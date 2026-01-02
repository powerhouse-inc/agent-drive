import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: ClaudeChat Document
  """
  type ClaudeChatQueries {
    getDocument(docId: PHID!, driveId: PHID): ClaudeChat
    getDocuments(driveId: String!): [ClaudeChat!]
  }

  type Query {
    ClaudeChat: ClaudeChatQueries
  }

  """
  Mutations: ClaudeChat
  """
  type Mutation {
    ClaudeChat_createDocument(name: String!, driveId: String): String

    ClaudeChat_addAgent(
      driveId: String
      docId: PHID
      input: ClaudeChat_AddAgentInput
    ): Int
    ClaudeChat_addUserMessage(
      driveId: String
      docId: PHID
      input: ClaudeChat_AddUserMessageInput
    ): Int
    ClaudeChat_addAgentMessage(
      driveId: String
      docId: PHID
      input: ClaudeChat_AddAgentMessageInput
    ): Int
    ClaudeChat_setUsername(
      driveId: String
      docId: PHID
      input: ClaudeChat_SetUsernameInput
    ): Int
    ClaudeChat_setSelectedAgent(
      driveId: String
      docId: PHID
      input: ClaudeChat_SetSelectedAgentInput
    ): Int
  }

  """
  Module: Agents
  """
  input ClaudeChat_AddAgentInput {
    id: OID!
    name: String!
    apiKey: String!
    model: String!
    initialPrompt: String
  }

  """
  Module: Messages
  """
  input ClaudeChat_AddUserMessageInput {
    id: OID!
    content: String!
  }
  input ClaudeChat_AddAgentMessageInput {
    id: OID!
    agent: OID!
    content: String!
  }

  """
  Module: User
  """
  input ClaudeChat_SetUsernameInput {
    username: String!
  }
  input ClaudeChat_SetSelectedAgentInput {
    agentId: OID
  }
`;
