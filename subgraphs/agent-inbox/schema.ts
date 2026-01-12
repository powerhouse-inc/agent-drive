import { gql } from "graphql-tag";
import type { DocumentNode } from "graphql";

export const schema: DocumentNode = gql`
  """
  Queries: AgentInbox Document
  """
  type AgentInboxQueries {
    getDocument(docId: PHID!, driveId: PHID): AgentInbox
    getDocuments(driveId: String!): [AgentInbox!]
  }

  type Query {
    AgentInbox: AgentInboxQueries
  }

  """
  Mutations: AgentInbox
  """
  type Mutation {
    AgentInbox_createDocument(name: String!, driveId: String): String

    AgentInbox_setAgentName(
      driveId: String
      docId: PHID
      input: AgentInbox_SetAgentNameInput
    ): Int
    AgentInbox_setAgentAddress(
      driveId: String
      docId: PHID
      input: AgentInbox_SetAgentAddressInput
    ): Int
    AgentInbox_setAgentRole(
      driveId: String
      docId: PHID
      input: AgentInbox_SetAgentRoleInput
    ): Int
    AgentInbox_setAgentDescription(
      driveId: String
      docId: PHID
      input: AgentInbox_SetAgentDescriptionInput
    ): Int
    AgentInbox_setAgentAvatar(
      driveId: String
      docId: PHID
      input: AgentInbox_SetAgentAvatarInput
    ): Int
    AgentInbox_addStakeholder(
      driveId: String
      docId: PHID
      input: AgentInbox_AddStakeholderInput
    ): Int
    AgentInbox_removeStakeholder(
      driveId: String
      docId: PHID
      input: AgentInbox_RemoveStakeholderInput
    ): Int
    AgentInbox_setStakeholderName(
      driveId: String
      docId: PHID
      input: AgentInbox_SetStakeholderNameInput
    ): Int
    AgentInbox_setStakeholderAddress(
      driveId: String
      docId: PHID
      input: AgentInbox_SetStakeholderAddressInput
    ): Int
    AgentInbox_setStakeholderAvatar(
      driveId: String
      docId: PHID
      input: AgentInbox_SetStakeholderAvatarInput
    ): Int
    AgentInbox_moveStakeholder(
      driveId: String
      docId: PHID
      input: AgentInbox_MoveStakeholderInput
    ): Int
    AgentInbox_createThread(
      driveId: String
      docId: PHID
      input: AgentInbox_CreateThreadInput
    ): Int
    AgentInbox_sendAgentMessage(
      driveId: String
      docId: PHID
      input: AgentInbox_SendAgentMessageInput
    ): Int
    AgentInbox_setThreadTopic(
      driveId: String
      docId: PHID
      input: AgentInbox_SetThreadTopicInput
    ): Int
    AgentInbox_editMessageContent(
      driveId: String
      docId: PHID
      input: AgentInbox_EditMessageContentInput
    ): Int
    AgentInbox_markMessageRead(
      driveId: String
      docId: PHID
      input: AgentInbox_MarkMessageReadInput
    ): Int
    AgentInbox_markMessageUnread(
      driveId: String
      docId: PHID
      input: AgentInbox_MarkMessageUnreadInput
    ): Int
    AgentInbox_sendStakeholderMessage(
      driveId: String
      docId: PHID
      input: AgentInbox_SendStakeholderMessageInput
    ): Int
    AgentInbox_proposeThreadResolved(
      driveId: String
      docId: PHID
      input: AgentInbox_ProposeThreadResolvedInput
    ): Int
    AgentInbox_confirmThreadResolved(
      driveId: String
      docId: PHID
      input: AgentInbox_ConfirmThreadResolvedInput
    ): Int
    AgentInbox_archiveThread(
      driveId: String
      docId: PHID
      input: AgentInbox_ArchiveThreadInput
    ): Int
    AgentInbox_reopenThread(
      driveId: String
      docId: PHID
      input: AgentInbox_ReopenThreadInput
    ): Int
  }

  """
  Module: Agent
  """
  input AgentInbox_SetAgentNameInput {
    """
    The display name to identify the agent in conversations
    """
    name: String!
  }
  input AgentInbox_SetAgentAddressInput {
    """
    Ethereum wallet address for on-chain identity. Null value clears the address
    """
    ethAddress: String
  }
  input AgentInbox_SetAgentRoleInput {
    """
    Professional role or title. Null value clears the role
    """
    role: String
  }
  input AgentInbox_SetAgentDescriptionInput {
    """
    Detailed description of services and expertise. Null value clears the description
    """
    description: String
  }
  input AgentInbox_SetAgentAvatarInput {
    """
    URL to profile picture or avatar. Null value clears the avatar
    """
    avatar: URL
  }

  """
  Module: Stakeholders
  """
  input AgentInbox_AddStakeholderInput {
    """
    Unique identifier for the stakeholder
    """
    id: OID!
    """
    Display name for the stakeholder
    """
    name: String!
    """
    Optional Ethereum wallet address for identity verification
    """
    ethAddress: String
    """
    Optional URL to profile picture or avatar
    """
    avatar: URL
  }
  input AgentInbox_RemoveStakeholderInput {
    """
    ID of the stakeholder to remove
    """
    id: OID!
  }
  input AgentInbox_SetStakeholderNameInput {
    """
    ID of the stakeholder to update
    """
    id: OID!
    """
    New display name for the stakeholder
    """
    name: String!
  }
  input AgentInbox_SetStakeholderAddressInput {
    """
    ID of the stakeholder to update
    """
    id: OID!
    """
    New Ethereum address. Null value clears the address
    """
    ethAddress: String
  }
  input AgentInbox_SetStakeholderAvatarInput {
    id: OID!
    "Null value clears the avatar"
    avatar: URL
  }
  input AgentInbox_MoveStakeholderInput {
    """
    ID of the stakeholder to move
    """
    id: OID!
    """
    ID of stakeholder to insert before. Omit to move to end of list
    """
    insertBefore: OID
  }

  """
  Module: Threads
  """
  input AgentInbox_CreateThreadInput {
    """
    Unique identifier for the new thread
    """
    id: OID!
    """
    ID of the stakeholder initiating the conversation
    """
    stakeholder: OID!
    """
    Optional subject line or topic for the thread
    """
    topic: String
    """
    The first message to start the conversation
    """
    initialMessage: AgentInbox_InitialMessageInput!
  }

  input AgentInbox_InitialMessageInput {
    """
    Unique identifier for the message
    """
    id: OID!
    """
    Direction of message (Incoming from stakeholder, Outgoing from agent)
    """
    flow: AgentInbox_Flow!
    """
    Timestamp when the message was sent
    """
    when: DateTime!
    """
    The message text content
    """
    content: String!
  }
  input AgentInbox_SendAgentMessageInput {
    """
    ID of the thread to send the message to
    """
    threadId: OID!
    """
    Unique identifier for the new message
    """
    messageId: OID!
    """
    Timestamp when the message is being sent
    """
    when: DateTime!
    """
    The message text content
    """
    content: String!
  }
  input AgentInbox_SetThreadTopicInput {
    """
    ID of the thread to update
    """
    id: OID!
    """
    New topic or subject line. Null value clears the topic
    """
    topic: String
  }
  input AgentInbox_EditMessageContentInput {
    """
    ID of the message to edit
    """
    id: OID!
    """
    Updated message text content
    """
    newContent: String!
  }
  input AgentInbox_MarkMessageReadInput {
    """
    ID of the message to mark as read
    """
    id: OID!
  }
  input AgentInbox_MarkMessageUnreadInput {
    """
    ID of the message to mark as unread
    """
    id: OID!
  }
  input AgentInbox_SendStakeholderMessageInput {
    """
    ID of the thread to send the message to
    """
    threadId: OID!
    """
    Unique identifier for the new message
    """
    messageId: OID!
    """
    Timestamp when the message is being sent
    """
    when: DateTime!
    """
    The message text content
    """
    content: String!
  }

  """
  Module: Workflow
  """
  input AgentInbox_ProposeThreadResolvedInput {
    """
    ID of the thread to propose for resolution
    """
    threadId: OID!
    """
    Which party is proposing the resolution (Agent or AgentInbox_Stakeholder)
    """
    proposedBy: AgentInbox_ParticipantRole!
  }
  input AgentInbox_ConfirmThreadResolvedInput {
    """
    ID of the thread to confirm as resolved
    """
    threadId: OID!
    """
    Which party is confirming the resolution (Agent or AgentInbox_Stakeholder)
    """
    confirmedBy: AgentInbox_ParticipantRole!
  }
  input AgentInbox_ArchiveThreadInput {
    """
    ID of the thread to archive
    """
    threadId: OID!
    """
    Which party is archiving the thread (Agent or AgentInbox_Stakeholder)
    """
    archivedBy: AgentInbox_ParticipantRole!
  }
  input AgentInbox_ReopenThreadInput {
    """
    ID of the thread to reopen
    """
    threadId: OID!
    """
    Which party is reopening the thread (Agent or AgentInbox_Stakeholder)
    """
    reopenedBy: AgentInbox_ParticipantRole!
  }
`;
