import { createAction } from "document-model/core";
import { SetUsernameInputSchema } from "../schema/zod.js";
import type { SetUsernameInput } from "../types.js";
import type { SetUsernameAction } from "./actions.js";

export const setUsername = (input: SetUsernameInput) =>
  createAction<SetUsernameAction>(
    "SET_USERNAME",
    { ...input },
    undefined,
    SetUsernameInputSchema,
    "global",
  );
