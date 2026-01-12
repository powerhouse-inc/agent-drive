interface AgentPanelProps {
  agent: {
    name: string;
    role: string;
    ethAddress: string;
    description: string;
    avatar: string;
  };
}

export function AgentPanel({ agent }: AgentPanelProps) {
  return (
    <div className="p-4">
      <div className="flex items-start space-x-3">
        <img
          src={agent.avatar}
          alt={agent.name}
          className="w-12 h-12 rounded-full bg-gray-200"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {agent.name}
          </h2>
          <p className="text-sm text-gray-600">{agent.role}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors" title="New Chat">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            <span>New Chat</span>
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Settings">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center text-xs text-gray-500">
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="font-mono truncate">{agent.ethAddress}</span>
        </div>

        <p className="text-xs text-gray-600 line-clamp-2">
          {agent.description}
        </p>
      </div>
    </div>
  );
}
