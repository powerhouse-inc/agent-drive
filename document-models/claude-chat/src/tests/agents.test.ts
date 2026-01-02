/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import { generateId } from "document-model/core";
import {
  reducer,
  utils,
  isClaudeChatDocument,
  addAgent,
  AddAgentInputSchema,
} from "claude-demo/document-models/claude-chat";

describe("Agents Operations", () => {
  it("should handle addAgent operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddAgentInputSchema());

    const updatedDocument = reducer(document, addAgent(input));

    expect(isClaudeChatDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("ADD_AGENT");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it("should add a new agent to the agents array", () => {
    const document = utils.createDocument();
    const input = {
      id: generateId(),
      name: "Claude Assistant",
      model: "claude-3-opus-20240229",
      apiKey: "test-api-key-123",
    };

    const updatedDocument = reducer(document, addAgent(input));

    expect(updatedDocument.state.global.agents).toHaveLength(1);
    const addedAgent = updatedDocument.state.global.agents[0];
    expect(addedAgent.name).toBe(input.name);
    expect(addedAgent.model).toBe(input.model);
    expect(addedAgent.apiKey).toBe(input.apiKey);
    expect(addedAgent.id).toBeDefined();
    expect(typeof addedAgent.id).toBe("string");
  });

  it("should use the provided IDs for each agent", () => {
    const document = utils.createDocument();
    const firstId = generateId();
    const secondId = generateId();
    const firstAgent = {
      id: firstId,
      name: "Claude",
      model: "claude-3-opus",
      apiKey: "key1",
    };
    const secondAgent = {
      id: secondId,
      name: "GPT",
      model: "gpt-4",
      apiKey: "key2",
    };

    let updatedDocument = reducer(document, addAgent(firstAgent));
    updatedDocument = reducer(updatedDocument, addAgent(secondAgent));

    const agents = updatedDocument.state.global.agents;
    expect(agents).toHaveLength(2);
    expect(agents[0].id).toBe(firstId);
    expect(agents[1].id).toBe(secondId);
    expect(agents[0].id).not.toBe(agents[1].id);
  });

  it("should preserve existing agents when adding new ones", () => {
    const document = utils.createDocument();
    const firstAgent = {
      id: generateId(),
      name: "Agent1",
      model: "model1",
      apiKey: "key1",
    };
    const secondAgent = {
      id: generateId(),
      name: "Agent2",
      model: "model2",
      apiKey: "key2",
    };

    let updatedDocument = reducer(document, addAgent(firstAgent));
    const firstAgentData = updatedDocument.state.global.agents[0];

    updatedDocument = reducer(updatedDocument, addAgent(secondAgent));

    expect(updatedDocument.state.global.agents).toHaveLength(2);
    expect(updatedDocument.state.global.agents[0]).toStrictEqual(
      firstAgentData,
    );
    expect(updatedDocument.state.global.agents[1].name).toBe(secondAgent.name);
  });

  it("should handle multiple agents with the same name", () => {
    const document = utils.createDocument();
    const agent1 = {
      id: generateId(),
      name: "Claude",
      model: "claude-3-opus",
      apiKey: "key1",
    };
    const agent2 = {
      id: generateId(),
      name: "Claude",
      model: "claude-3-sonnet",
      apiKey: "key2",
    };

    let updatedDocument = reducer(document, addAgent(agent1));
    updatedDocument = reducer(updatedDocument, addAgent(agent2));

    const agents = updatedDocument.state.global.agents;
    expect(agents).toHaveLength(2);
    expect(agents[0].name).toBe("Claude");
    expect(agents[1].name).toBe("Claude");
    expect(agents[0].model).not.toBe(agents[1].model);
    expect(agents[0].id).not.toBe(agents[1].id);
  });

  it("should preserve other state properties when adding agents", () => {
    const document = utils.createDocument();
    const initialUsername = document.state.global.username;
    const initialMessages = document.state.global.messages;

    const input = {
      id: generateId(),
      name: "Test Agent",
      model: "test-model",
      apiKey: "test-key",
    };

    const updatedDocument = reducer(document, addAgent(input));

    expect(updatedDocument.state.global.username).toBe(initialUsername);
    expect(updatedDocument.state.global.messages).toStrictEqual(
      initialMessages,
    );
  });
});
