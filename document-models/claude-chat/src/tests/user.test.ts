/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isClaudeChatDocument,
  setUsername,
  SetUsernameInputSchema,
} from "claude-demo/document-models/claude-chat";

describe("User Operations", () => {
  it("should handle setUsername operation", () => {
    const document = utils.createDocument();
    const input = generateMock(SetUsernameInputSchema());

    const updatedDocument = reducer(document, setUsername(input));

    expect(isClaudeChatDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "SET_USERNAME",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should update username in document state", () => {
    const document = utils.createDocument();
    const newUsername = "TestUser123";
    const input = { username: newUsername };

    const updatedDocument = reducer(document, setUsername(input));

    expect(updatedDocument.state.global.username).toBe(newUsername);
  });

  it("should handle empty username", () => {
    const document = utils.createDocument();
    const input = { username: "" };

    const updatedDocument = reducer(document, setUsername(input));

    expect(updatedDocument.state.global.username).toBe("");
  });

  it("should preserve other state properties when updating username", () => {
    const document = utils.createDocument();
    const initialAgents = document.state.global.agents;
    const initialMessages = document.state.global.messages;
    const input = { username: "NewUser" };

    const updatedDocument = reducer(document, setUsername(input));

    expect(updatedDocument.state.global.agents).toStrictEqual(initialAgents);
    expect(updatedDocument.state.global.messages).toStrictEqual(
      initialMessages,
    );
  });

  it("should handle multiple username changes", () => {
    let document = utils.createDocument();
    const firstUsername = "User1";
    const secondUsername = "User2";

    document = reducer(document, setUsername({ username: firstUsername }));
    expect(document.state.global.username).toBe(firstUsername);

    document = reducer(document, setUsername({ username: secondUsername }));
    expect(document.state.global.username).toBe(secondUsername);
    expect(document.operations.global).toHaveLength(2);
  });
});
