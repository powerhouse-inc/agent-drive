import type { ClaudeChatUserOperations } from "powerhouse-agent/document-models/claude-chat";

export const claudeChatUserOperations: ClaudeChatUserOperations = {
  setUsernameOperation(state, action) {
    state.username = action.input.username;
  },
  setSelectedAgentOperation(state, action) {
    state.selectedAgent = action.input.agentId || null;
  },
};
