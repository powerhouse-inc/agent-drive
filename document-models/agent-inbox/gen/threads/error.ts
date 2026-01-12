export type ErrorCode =
  | "StakeholderNotFoundError"
  | "ThreadNotFoundError"
  | "MessageNotFoundError";

export interface ReducerError {
  errorCode: ErrorCode;
}

export class StakeholderNotFoundError extends Error implements ReducerError {
  errorCode = "StakeholderNotFoundError" as ErrorCode;
  constructor(message = "StakeholderNotFoundError") {
    super(message);
  }
}

export class ThreadNotFoundError extends Error implements ReducerError {
  errorCode = "ThreadNotFoundError" as ErrorCode;
  constructor(message = "ThreadNotFoundError") {
    super(message);
  }
}

export class MessageNotFoundError extends Error implements ReducerError {
  errorCode = "MessageNotFoundError" as ErrorCode;
  constructor(message = "MessageNotFoundError") {
    super(message);
  }
}

export const errors = {
  CreateThread: {
    StakeholderNotFoundError,
  },
  SendAgentMessage: {
    ThreadNotFoundError,
  },
  SetThreadTopic: {
    ThreadNotFoundError,
  },
  EditMessageContent: {
    MessageNotFoundError,
  },
  MarkMessageRead: {
    MessageNotFoundError,
  },
  MarkMessageUnread: {
    MessageNotFoundError,
  },
  SendStakeholderMessage: {
    ThreadNotFoundError,
  },
};
