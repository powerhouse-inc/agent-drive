import { type SignalDispatch } from "document-model";
import {
  type AddUserMessageAction,
  type AddAgentMessageAction,
} from "./actions.js";
import { type ClaudeChatState } from "../types.js";

export interface ClaudeChatMessagesOperations {
  addUserMessageOperation: (
    state: ClaudeChatState,
    action: AddUserMessageAction,
    dispatch?: SignalDispatch,
  ) => void;
  addAgentMessageOperation: (
    state: ClaudeChatState,
    action: AddAgentMessageAction,
    dispatch?: SignalDispatch,
  ) => void;
}
