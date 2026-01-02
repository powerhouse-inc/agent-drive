import { type Action } from "document-model";
import type { SetUsernameInput } from "../types.js";

export type SetUsernameAction = Action & {
  type: "SET_USERNAME";
  input: SetUsernameInput;
};

export type ClaudeChatUserAction = SetUsernameAction;
