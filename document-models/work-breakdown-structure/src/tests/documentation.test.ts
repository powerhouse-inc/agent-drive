/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import {
  reducer,
  utils,
  isWorkBreakdownStructureDocument,
  updateDescription,
  UpdateDescriptionInputSchema,
  updateInstructions,
  UpdateInstructionsInputSchema,
  addNote,
  AddNoteInputSchema,
  clearInstructions,
  ClearInstructionsInputSchema,
  clearNotes,
  ClearNotesInputSchema,
  removeNote,
  RemoveNoteInputSchema,
  markAsDraft,
  MarkAsDraftInputSchema,
  markAsReady,
  MarkAsReadyInputSchema,
} from "powerhouse-agent/document-models/work-breakdown-structure";

describe("Documentation Operations", () => {
  it.skip("should handle updateDescription operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateDescriptionInputSchema());

    const updatedDocument = reducer(document, updateDescription(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_DESCRIPTION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle updateInstructions operation", () => {
    const document = utils.createDocument();
    const input = generateMock(UpdateInstructionsInputSchema());

    const updatedDocument = reducer(document, updateInstructions(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_INSTRUCTIONS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle addNote operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddNoteInputSchema());

    const updatedDocument = reducer(document, addNote(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("ADD_NOTE");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle clearInstructions operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ClearInstructionsInputSchema());

    const updatedDocument = reducer(document, clearInstructions(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "CLEAR_INSTRUCTIONS",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle clearNotes operation", () => {
    const document = utils.createDocument();
    const input = generateMock(ClearNotesInputSchema());

    const updatedDocument = reducer(document, clearNotes(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "CLEAR_NOTES",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle removeNote operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RemoveNoteInputSchema());

    const updatedDocument = reducer(document, removeNote(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_NOTE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle markAsDraft operation", () => {
    const document = utils.createDocument();
    const input = generateMock(MarkAsDraftInputSchema());

    const updatedDocument = reducer(document, markAsDraft(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "MARK_AS_DRAFT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it.skip("should handle markAsReady operation", () => {
    const document = utils.createDocument();
    const input = generateMock(MarkAsReadyInputSchema());

    const updatedDocument = reducer(document, markAsReady(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "MARK_AS_READY",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
