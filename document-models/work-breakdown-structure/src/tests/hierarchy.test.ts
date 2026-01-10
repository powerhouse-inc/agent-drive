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
  createGoal,
  reorder,
  ReorderInputSchema,
  addDependencies,
  AddDependenciesInputSchema,
  removeDependencies,
  RemoveDependenciesInputSchema,
} from "powerhouse-agent/document-models/work-breakdown-structure";

describe("Hierarchy Operations", () => {
  describe("REORDER", () => {
    it("should move a goal to a different parent", () => {
      const document = utils.createDocument();
      
      // Create parent goals
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "parent-1",
          description: "Parent 1",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "parent-2",
          description: "Parent 2",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Create a child under parent-1
      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-1",
          description: "Child 1",
          instructions: null,
          draft: false,
          parentId: "parent-1",
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Move child-1 to parent-2
      updatedDocument = reducer(
        updatedDocument,
        reorder({
          goalId: "child-1",
          parentId: "parent-2",
          insertBefore: null,
        }),
      );

      const child = updatedDocument.state.global.goals.find(g => g.id === "child-1");
      expect(child?.parentId).toBe("parent-2");
    });

    it("should move a goal to root level", () => {
      const document = utils.createDocument();
      
      // Create parent and child
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "parent-1",
          description: "Parent 1",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-1",
          description: "Child 1",
          instructions: null,
          draft: false,
          parentId: "parent-1",
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Move child-1 to root
      updatedDocument = reducer(
        updatedDocument,
        reorder({
          goalId: "child-1",
          parentId: null,
          insertBefore: null,
        }),
      );

      const child = updatedDocument.state.global.goals.find(g => g.id === "child-1");
      expect(child?.parentId).toBeNull();
    });

    it("should reorder goals within the same level", () => {
      const document = utils.createDocument();
      
      // Create three sibling goals
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Goal 1",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "goal-2",
          description: "Goal 2",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "goal-3",
          description: "Goal 3",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Move goal-3 before goal-1
      updatedDocument = reducer(
        updatedDocument,
        reorder({
          goalId: "goal-3",
          insertBefore: "goal-1",
        }),
      );

      const goalIds = updatedDocument.state.global.goals.map(g => g.id);
      const goal3Index = goalIds.indexOf("goal-3");
      const goal1Index = goalIds.indexOf("goal-1");
      expect(goal3Index).toBeLessThan(goal1Index);
    });

    it("should prevent circular references", () => {
      const document = utils.createDocument();
      
      // Create parent-child-grandchild hierarchy
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "parent-1",
          description: "Parent 1",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "child-1",
          description: "Child 1",
          instructions: null,
          draft: false,
          parentId: "parent-1",
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      updatedDocument = reducer(
        updatedDocument,
        createGoal({
          id: "grandchild-1",
          description: "Grandchild 1",
          instructions: null,
          draft: false,
          parentId: "child-1",
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Try to move parent-1 under grandchild-1 (should fail)
      const result = reducer(
        updatedDocument,
        reorder({
          goalId: "parent-1",
          parentId: "grandchild-1",
          insertBefore: null,
        }),
      );

      // Check that the operation has an error
      const lastOperation = result.operations.global[result.operations.global.length - 1];
      expect(lastOperation.error).toBeDefined();
      const errorMessage = typeof lastOperation.error === 'string' 
        ? lastOperation.error 
        : (lastOperation.error as any)?.message;
      expect(errorMessage).toContain("under its own descendant");
    });

    it("should fail when goal does not exist", () => {
      const document = utils.createDocument();
      
      const result = reducer(
        document,
        reorder({
          goalId: "nonexistent",
          parentId: null,
          insertBefore: null,
        }),
      );

      // Check that the operation has an error
      const lastOperation = result.operations.global[result.operations.global.length - 1];
      expect(lastOperation.error).toBeDefined();
      const errorMessage = typeof lastOperation.error === 'string' 
        ? lastOperation.error 
        : (lastOperation.error as any)?.message;
      expect(errorMessage).toContain("not found");
    });

    it("should fail when new parent does not exist", () => {
      const document = utils.createDocument();
      
      // Create a goal
      let updatedDocument = reducer(
        document,
        createGoal({
          id: "goal-1",
          description: "Goal 1",
          instructions: null,
          draft: false,
          parentId: null,
          insertBefore: null,
          assignee: null,
          dependsOn: [],
          initialNote: null,
          metaData: null,
        }),
      );

      // Try to move it under a non-existent parent
      const result = reducer(
        updatedDocument,
        reorder({
          goalId: "goal-1",
          parentId: "nonexistent-parent",
          insertBefore: null,
        }),
      );

      // Check that the operation has an error
      const lastOperation = result.operations.global[result.operations.global.length - 1];
      expect(lastOperation.error).toBeDefined();
      const errorMessage = typeof lastOperation.error === 'string' 
        ? lastOperation.error 
        : (lastOperation.error as any)?.message;
      expect(errorMessage).toContain("Parent goal with ID nonexistent-parent not found");
    });
  });

  it.skip("should handle addDependencies operation", () => {
    const document = utils.createDocument();
    const input = generateMock(AddDependenciesInputSchema());

    const updatedDocument = reducer(document, addDependencies(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_DEPENDENCIES",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });

  it.skip("should handle removeDependencies operation", () => {
    const document = utils.createDocument();
    const input = generateMock(RemoveDependenciesInputSchema());

    const updatedDocument = reducer(document, removeDependencies(input));

    expect(isWorkBreakdownStructureDocument(updatedDocument)).toBe(true);
    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_DEPENDENCIES",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
