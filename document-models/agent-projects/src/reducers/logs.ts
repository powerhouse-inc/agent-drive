import { ProjectNotFoundError } from "../../gen/logs/error.js";
import type { AgentProjectsLogsOperations } from "powerhouse-agent/document-models/agent-projects";

export const agentProjectsLogsOperations: AgentProjectsLogsOperations = {
  addLogEntryOperation(state, action) {
    const project = state.projects.find((p) => p.id === action.input.projectId);
    if (!project) {
      throw new ProjectNotFoundError(
        `Project with ID ${action.input.projectId} not found`,
      );
    }
    const logEntry = {
      id: action.input.id,
      timestamp: action.input.timestamp,
      message: action.input.message,
    };
    project.logs.push(logEntry);
  },
  clearProjectLogsOperation(state, action) {
    const project = state.projects.find((p) => p.id === action.input.projectId);
    if (!project) {
      throw new ProjectNotFoundError(
        `Project with ID ${action.input.projectId} not found`,
      );
    }
    project.logs = [];
  },
};
