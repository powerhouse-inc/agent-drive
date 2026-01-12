/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isAgentInboxDocument,
  createThread,
  CreateThreadInputSchema,
  sendAgentMessage,
  SendAgentMessageInputSchema,
  setThreadTopic,
  SetThreadTopicInputSchema,
  editMessageContent,
  EditMessageContentInputSchema,
  markMessageRead,
  MarkMessageReadInputSchema,
  markMessageUnread,
  MarkMessageUnreadInputSchema,
  sendStakeholderMessage,
  SendStakeholderMessageInputSchema,
} from "powerhouse-agent/document-models/agent-inbox";

describe("Threads Operations", () => {
  it("should handle createThread operation", () => {
    const document = utils.createDocument();
    const input = generateMock(CreateThreadInputSchema());

    const updatedDocument = reducer(document, createThread(input));

    expect(isAgentInboxDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "CREATE_THREAD",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle sendAgentMessage operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SendAgentMessageInputSchema());

    const updatedDocument = reducer(document, sendAgentMessage(input));

    expect(isAgentInboxDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SEND_AGENT_MESSAGE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle setThreadTopic operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetThreadTopicInputSchema());

    const updatedDocument = reducer(document, setThreadTopic(input));

    expect(isAgentInboxDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_THREAD_TOPIC",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle editMessageContent operation", () => {
    const document = utils.createDocument();
    const input = generateMock(EditMessageContentInputSchema());

    const updatedDocument = reducer(document, editMessageContent(input));

    expect(isAgentInboxDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "EDIT_MESSAGE_CONTENT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle markMessageRead operation", () => {
    const document = utils.createDocument();
    const input = generateMock(MarkMessageReadInputSchema());

    const updatedDocument = reducer(document, markMessageRead(input));

    expect(isAgentInboxDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "MARK_MESSAGE_READ",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle markMessageUnread operation", () => {
    const document = utils.createDocument();
    const input = generateMock(MarkMessageUnreadInputSchema());

    const updatedDocument = reducer(document, markMessageUnread(input));

    expect(isAgentInboxDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "MARK_MESSAGE_UNREAD",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle sendStakeholderMessage operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SendStakeholderMessageInputSchema());

    const updatedDocument = reducer(document, sendStakeholderMessage(input));

    expect(isAgentInboxDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SEND_STAKEHOLDER_MESSAGE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
