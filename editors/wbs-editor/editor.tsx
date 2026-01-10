import { DocumentToolbar } from "@powerhousedao/design-system/connect/index";
import { EditWorkBreakdownStructureName } from "./components/EditName.js";
import { WBSSidebar } from "./components/Sidebar.js";
import { GoalHierarchy } from "./components/GoalHierarchy.js";

/** WBS Editor with sidebar for metadata and main area for goal hierarchy */
export default function Editor() {
  return (
    <div className="flex flex-col h-full">
      <DocumentToolbar />
      <div className="flex flex-1 overflow-hidden" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Main content area - takes remaining space */}
        <div className="flex-1 p-6 overflow-auto">
          <GoalHierarchy />
        </div>
        
        {/* Sidebar - fixed width */}
        <div className="border-l border-gray-200 bg-gray-50 overflow-auto" style={{ flexShrink: 0, width: '250px', minWidth: '250px' }}>
          <WBSSidebar />
        </div>
      </div>
    </div>
  );
}