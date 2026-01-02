import { z } from "zod";
import type {
  AddAgentInput,
  AddAgentMessageInput,
  AddUserMessageInput,
  Agent,
  ClaudeChatState,
  Message,
  SetUsernameInput,
} from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export function AddAgentInputSchema(): z.ZodObject<Properties<AddAgentInput>> {
  return z.object({
    apiKey: z.string(),
    id: z.string(),
    model: z.string(),
    name: z.string(),
  });
}

export function AddAgentMessageInputSchema(): z.ZodObject<
  Properties<AddAgentMessageInput>
> {
  return z.object({
    agent: z.string(),
    content: z.string(),
    id: z.string(),
  });
}

export function AddUserMessageInputSchema(): z.ZodObject<
  Properties<AddUserMessageInput>
> {
  return z.object({
    content: z.string(),
    id: z.string(),
  });
}

export function AgentSchema(): z.ZodObject<Properties<Agent>> {
  return z.object({
    __typename: z.literal("Agent").optional(),
    apiKey: z.string(),
    id: z.string(),
    model: z.string(),
    name: z.string(),
  });
}

export function ClaudeChatStateSchema(): z.ZodObject<
  Properties<ClaudeChatState>
> {
  return z.object({
    __typename: z.literal("ClaudeChatState").optional(),
    agents: z.array(AgentSchema()),
    messages: z.array(MessageSchema()),
    username: z.string(),
  });
}

export function MessageSchema(): z.ZodObject<Properties<Message>> {
  return z.object({
    __typename: z.literal("Message").optional(),
    agent: z.string().nullable(),
    content: z.string(),
    id: z.string(),
  });
}

export function SetUsernameInputSchema(): z.ZodObject<
  Properties<SetUsernameInput>
> {
  return z.object({
    username: z.string(),
  });
}
