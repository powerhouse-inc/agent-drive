# Work Breakdown Structure Implementation Plan

## Overview
This document outlines a methodical implementation plan for the WBS document model reducers. The implementation will proceed module by module, with careful verification at each step to ensure business logic correctness and maintain data invariants.

## Key Invariants to Maintain
1. **Status Consistency**: Goal status must be consistent with hierarchy (e.g., parent can't be TODO if child is IN_PROGRESS)
2. **No Circular Dependencies**: Goals cannot depend on themselves or their descendants
3. **No Circular Hierarchy**: Goals cannot be their own ancestors
4. **Delegation Rules**: Only leaf goals (no children) can be DELEGATED
5. **Assignee Consistency**: DELEGATED goals must have an assignee
6. **Status Transitions**: Only valid status transitions are allowed

## Implementation Order & Phases

### Phase 1: Workflow Module (Most Critical)
The workflow module is implemented first as it establishes the core business logic and status management.

#### 1.1 CREATE_GOAL Operation ✅
- [x] Implement basic goal creation with required fields
- [x] Handle optional fields (instructions, draft, metaData)
- [x] Set initial status (TODO or DELEGATED based on assignee)
- [x] Handle parent-child relationship setup
- [x] Implement insertion ordering (insertBefore logic)
- [x] Add initial note if provided
- [x] Set dependencies array
- [x] **Verify**: Goal appears in state.goals array
- [x] **Verify**: Status is TODO without assignee, DELEGATED with assignee
- [x] **Test**: Create root goal, child goal, goal with dependencies

#### 1.2 Status Transition Operations (Simple)
##### MARK_IN_PROGRESS ✅
- [x] Find target goal by ID
- [x] Update goal status to IN_PROGRESS
- [x] Add optional note if provided (skipped - needs ID generation)
- [x] Propagate IN_PROGRESS up to all ancestors
- [x] **Verify**: All ancestors are marked IN_PROGRESS
- [x] **Test**: Deep hierarchy propagation (6 tests passing)

##### MARK_COMPLETED ✅
- [x] Find target goal by ID  
- [x] Update goal status to COMPLETED
- [x] Add optional note if provided
- [x] Find all child goals (recursive)
- [x] Mark unfinished children as COMPLETED (skip COMPLETED/WONT_DO)
- [x] **Verify**: Entire subtree is completed correctly
- [x] **Test**: Mixed subtree with some already completed (6 tests passing)

##### MARK_TODO ✅
- [x] Find target goal by ID
- [x] Update goal status to TODO
- [x] Add optional note if provided
- [x] Find parent goals up the chain
- [x] Reset finished parents (COMPLETED/WONT_DO) to TODO
- [x] **Verify**: Parent chain consistency maintained
- [x] **Test**: Deep hierarchy with mixed statuses (5 tests passing)

##### MARK_WONT_DO
- [ ] Find target goal by ID
- [ ] Update goal status to WONT_DO
- [ ] Find all child goals (recursive)
- [ ] Mark unfinished children as WONT_DO (skip COMPLETED/WONT_DO)
- [ ] **Verify**: Subtree marked correctly
- [ ] **Test**: Mixed subtree scenarios

#### 1.3 Delegation Operations
##### DELEGATE_GOAL
- [ ] Find target goal by ID
- [ ] Validate goal has no children (leaf node only)
- [ ] Update assignee field
- [ ] Change status to DELEGATED
- [ ] **Verify**: Only leaf goals can be delegated
- [ ] **Test**: Attempt to delegate parent goal (should fail)

##### REPORT_ON_GOAL  
- [ ] Find target goal by ID
- [ ] Validate goal status is DELEGATED
- [ ] Add note to goal
- [ ] If moveInReview is true, change status to IN_REVIEW
- [ ] **Verify**: Only DELEGATED goals can be reported on
- [ ] **Test**: Various status scenarios

#### 1.4 Blocking Operations
##### REPORT_BLOCKED
- [ ] Find target goal by ID
- [ ] Update goal status to BLOCKED
- [ ] Store blocking question (consider adding to notes or separate field)
- [ ] Update global isBlocked if this is first blocked goal
- [ ] **Verify**: Question is stored and retrievable
- [ ] **Test**: Multiple blocked goals

##### UNBLOCK_GOAL
- [ ] Find target goal by ID
- [ ] Validate goal status is BLOCKED
- [ ] Store response (add to notes)
- [ ] Change status back to previous (TODO or IN_PROGRESS)
- [ ] Check if any goals remain blocked, update global isBlocked
- [ ] **Verify**: Goal returns to correct status
- [ ] **Test**: Last blocked goal updates global flag

### Phase 2: Hierarchy Module - REORDER Operation
Critical for maintaining tree structure integrity.

#### 2.1 REORDER Implementation
- [ ] Find target goal by ID
- [ ] Validate new parent is not a descendant (prevent cycles)
- [ ] Remove goal from current position in parent's children
- [ ] Update parentId field
- [ ] Insert at new position (handle insertBefore)
- [ ] **Verify**: No circular references created
- [ ] **Verify**: Goal maintains all its children
- [ ] **Test**: Move to root, move to sibling, move to different branch
- [ ] **Test**: Attempt circular reference (should fail)

### Phase 3: Hierarchy Module - Dependencies
Manage goal dependencies without creating cycles.

#### 3.1 ADD_DEPENDENCIES
- [ ] Find target goal by ID
- [ ] Validate each dependency exists
- [ ] Check no circular dependencies (goal can't depend on descendants)
- [ ] Add new dependencies to existing array (avoid duplicates)
- [ ] **Verify**: No circular dependency chains
- [ ] **Test**: Valid and invalid dependency scenarios

#### 3.2 REMOVE_DEPENDENCIES  
- [ ] Find target goal by ID
- [ ] Filter out specified dependencies from array
- [ ] **Verify**: Dependencies removed correctly
- [ ] **Test**: Remove some, remove all

### Phase 4: Documentation Module
Simpler operations for managing goal content.

#### 4.1 Content Updates
- [ ] UPDATE_DESCRIPTION: Update description field
- [ ] UPDATE_INSTRUCTIONS: Update instructions field
- [ ] CLEAR_INSTRUCTIONS: Set instructions to null
- [ ] **Verify**: Fields update correctly

#### 4.2 Note Management
- [ ] ADD_NOTE: Create note object, add to notes array
- [ ] REMOVE_NOTE: Find and remove note by ID
- [ ] CLEAR_NOTES: Empty the notes array
- [ ] **Verify**: Note operations maintain data integrity

#### 4.3 Draft Status
- [ ] MARK_AS_DRAFT: Set isDraft to true
- [ ] MARK_AS_READY: Set isDraft to false
- [ ] **Verify**: Draft flag toggles correctly

### Phase 5: Metadata Module
Global WBS metadata operations.

#### 5.1 SET_REFERENCES
- [ ] Update state.references array
- [ ] **Verify**: References stored at WBS level

#### 5.2 SET_META_DATA
- [ ] Create/update state.metaData object
- [ ] Set format and data fields
- [ ] **Verify**: Metadata structure maintained

## Testing Strategy

### Unit Tests for Each Operation
1. Test happy path
2. Test edge cases
3. Test validation/error conditions
4. Test with empty state
5. Test with complex existing state

### Integration Tests
1. Create complex WBS hierarchy
2. Test status propagation across operations
3. Test dependency chains
4. Test delegation workflow
5. Test blocking/unblocking workflow

### Invariant Tests
After each operation, verify:
1. No circular hierarchies
2. No circular dependencies  
3. Status consistency maintained
4. Delegation rules followed
5. Global isBlocked flag accurate

## Helper Functions Needed

```typescript
// Utility functions to implement
function findGoal(goals: Goal[], id: string): Goal | undefined
function findGoalIndex(goals: Goal[], id: string): number
function getChildren(goals: Goal[], parentId: string): Goal[]
function getDescendants(goals: Goal[], id: string): Goal[]
function getAncestors(goals: Goal[], id: string): Goal[]
function isDescendant(goals: Goal[], ancestorId: string, descendantId: string): boolean
function hasBlockedGoals(goals: Goal[]): boolean
function isLeafGoal(goals: Goal[], id: string): boolean
```

## Implementation Progress Tracking

### Module Completion
- [ ] Workflow Module (0/9 operations)
- [ ] Hierarchy REORDER (0/1 operations)  
- [ ] Hierarchy Dependencies (0/2 operations)
- [ ] Documentation Module (0/8 operations)
- [ ] Metadata Module (0/2 operations)

### Test Coverage
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] All invariants verified

### Definition of Done
- Implementation is finished
- All unit tests are passing when running `pnpm test` and they cover the new functionality
- TypeScript compiles without typing errors
- Linting rules are applied and passing
- pnpm build shows no issues

### Comitting work
Work will be committed for every step when the definition of done is satisfied before proceeding to the next step implementation.

## Notes & Considerations

1. **Status History**: Consider tracking previous status for unblocking
2. **Note IDs**: Ensure unique IDs for notes
3. **Performance**: Consider indexing goals by ID for large hierarchies
4. **Validation**: Add comprehensive validation before state mutations
5. **Error Handling**: Graceful handling of missing goals, invalid states

## Success Criteria

1. All 22 operations implemented
2. All tests passing
3. No invariant violations possible
4. Clean, maintainable code
5. Comprehensive error handling
6. Performance acceptable for large hierarchies (1000+ goals)