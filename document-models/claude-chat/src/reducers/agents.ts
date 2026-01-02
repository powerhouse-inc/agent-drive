import type { ClaudeChatAgentsOperations } from "claude-demo/document-models/claude-chat";

export const claudeChatAgentsOperations: ClaudeChatAgentsOperations = {
  addAgentOperation(state, action) {
    const newAgent = {
      id: action.input.id,
      name: action.input.name,
      model: action.input.model,
      apiKey: action.input.apiKey,
    };
    state.agents.push(newAgent);
  },
};
