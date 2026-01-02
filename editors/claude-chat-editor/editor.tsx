import { DocumentToolbar } from "@powerhousedao/design-system/connect/index";
import { EditClaudeChatName } from "./components/EditName.js";
import { UserSettings } from "./components/UserSettings.js";
import { AgentsManager } from "./components/AgentsManager.js";
import { ChatInterface } from "./components/ChatInterface.js";
import { useState } from "react";

/** Claude Chat Editor with tabbed interface */
export default function Editor() {
  const [activeTab, setActiveTab] = useState<"chat" | "agents" | "settings">(
    "chat",
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-4 px-8">
        <DocumentToolbar />

        <div className="mt-6">
          <EditClaudeChatName />
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("chat")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "chat"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab("agents")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "agents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Agents
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "settings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "chat" && <ChatInterface />}
          {activeTab === "agents" && <AgentsManager />}
          {activeTab === "settings" && <UserSettings />}
        </div>
      </div>
    </div>
  );
}
