import { useSelectedWorkBreakdownStructureDocument } from "powerhouse-agent/document-models/work-breakdown-structure";

export function GoalHierarchy() {
  const [document] = useSelectedWorkBreakdownStructureDocument();
  
  if (!document) return null;

  const goals = document.state.global.goals || [];

  return (
    <div className="h-full">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Goal Hierarchy</h2>
        <p className="text-sm text-gray-500 mt-1">
          {goals.length} {goals.length === 1 ? 'goal' : 'goals'} in this work breakdown structure
        </p>
      </div>
      
      {/* Placeholder for goal hierarchy tree */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Goal Hierarchy Visualization
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          The hierarchical tree view of goals will be displayed here
        </p>
        <div className="text-xs text-gray-400">
          Features to implement:
          <ul className="mt-2 space-y-1">
            <li>• Create and manage goals</li>
            <li>• Drag and drop to reorder</li>
            <li>• Status transitions (TODO, IN_PROGRESS, COMPLETED, etc.)</li>
            <li>• Delegation and assignment</li>
            <li>• Dependencies management</li>
            <li>• Notes and documentation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}