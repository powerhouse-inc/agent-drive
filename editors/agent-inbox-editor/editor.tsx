import { useState, useEffect } from "react";
import { generateId } from "document-model/core";
import { AgentPanel } from "./components/AgentPanel.js";
import { ThreadsList } from "./components/ThreadsList.js";
import { MessageThread } from "./components/MessageThread.js";
import { DocumentToolbar } from "@powerhousedao/design-system/connect/index";
import { useSelectedAgentInboxDocument } from "../../document-models/agent-inbox/hooks.js";
import {
  setAgentName,
  setAgentAddress,
  setAgentRole,
  setAgentDescription,
  setAgentAvatar,
  sendStakeholderMessage,
  sendAgentMessage,
} from "../../document-models/agent-inbox/gen/creators.js";

// Dummy data for the agent
const dummyAgent = {
  name: "Alex Thompson",
  role: "Senior Project Manager",
  ethAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3",
  description:
    "Experienced project manager specializing in DeFi protocols and governance systems. Available for consultation on tokenomics, DAO structure, and protocol design.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
};

// Dummy stakeholders
const dummyStakeholders = [
  {
    id: "s1",
    name: "Maria Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  {
    id: "s2",
    name: "John Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    id: "s3",
    name: "Sarah Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "s4",
    name: "Robert Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
  },
  {
    id: "s5",
    name: "Emma Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
  },
];

// Dummy threads with longer messages
const dummyThreads = [
  {
    id: "t1",
    stakeholderId: "s1",
    stakeholderName: "Maria Chen",
    topic: "Treasury Management Proposal Review",
    status: "Open",
    lastMessage:
      "I've completed the initial review of the treasury management proposal...",
    lastMessageTime: "2 hours ago",
    unreadCount: 2,
    messages: [
      {
        id: "m1",
        sender: "Maria Chen",
        content:
          "Hi Alex,\n\nI hope this message finds you well. I've been reviewing the treasury management proposal you sent last week, and I have some thoughts I'd like to share.\n\nFirst, I think the overall structure is solid. The multi-sig approach you've outlined makes sense, especially with the 3-of-5 threshold for major transactions. However, I'm wondering if we should consider implementing a timelock mechanism for particularly large withdrawals - say anything over $1M USD equivalent.\n\nThe yield farming strategies you've proposed are interesting, but I think we need to be more conservative with our risk allocation. Currently, you have 40% allocated to high-risk strategies. Given the current market volatility and recent protocol exploits we've seen in the space, I'd recommend reducing this to no more than 20%, with the remainder going into more stable, battle-tested protocols.\n\nI also noticed that the proposal doesn't address how we'll handle treasury diversification across different chains. With the multi-chain future becoming reality, shouldn't we have a strategy for managing assets across Ethereum, Arbitrum, and perhaps Polygon?\n\nLooking forward to your thoughts on these points.",
        time: "3 days ago",
        isIncoming: true,
      },
      {
        id: "m2",
        sender: "Alex Thompson",
        content:
          "Hi Maria,\n\nThank you for the thorough review - these are excellent points that definitely need to be addressed.\n\nRegarding the timelock mechanism, I completely agree. In fact, I think we should implement a tiered timelock system:\n- Transactions under $100k: No timelock\n- $100k-$500k: 24-hour timelock\n- $500k-$1M: 48-hour timelock\n- Over $1M: 72-hour timelock with mandatory community notification\n\nThis would give the community time to react if something suspicious is happening, while not overly hampering day-to-day operations.\n\nYou're absolutely right about the risk allocation. I was perhaps too aggressive in my initial proposal. Let me revise the allocation:\n- 20% high-risk, high-reward strategies (as you suggested)\n- 40% medium-risk strategies (established DeFi protocols with good track records)\n- 40% low-risk strategies (stablecoin lending on Aave/Compound, ETH staking)\n\nFor multi-chain treasury management, I suggest we start with a 70/20/10 split between Ethereum/Arbitrum/Polygon initially, with quarterly rebalancing based on where we're seeing the most activity and best opportunities. We should also establish clear bridging protocols and use only audited bridge solutions.\n\nI'll update the proposal with these changes and add a section on emergency procedures - what happens if a protocol we're using gets exploited, how we execute emergency withdrawals, etc.\n\nDoes this address your concerns? Any other areas you think need attention?",
        time: "2 days ago",
        isIncoming: false,
      },
      {
        id: "m3",
        sender: "Maria Chen",
        content:
          "Alex,\n\nThe tiered timelock system is brilliant - much more nuanced than what I had in mind. The community notification for large transactions is particularly important for maintaining transparency.\n\nYour revised risk allocation looks much more balanced. I'd also suggest we explicitly define what constitutes each risk category. For example:\n\nHigh-risk: New protocols (<6 months), protocols with TVL under $100M, leveraged positions\nMedium-risk: Established protocols (6-24 months), TVL $100M-$1B, standard yield farming\nLow-risk: Blue-chip protocols (>24 months), TVL >$1B, simple lending/staking\n\nThe multi-chain split seems reasonable for a start. However, I think we should also consider having a small allocation (maybe 5%) on emerging L2s like zkSync or StarkNet once they're more mature. Being early on these chains could provide good opportunities.\n\nTwo additional points:\n\n1. We should establish clear KPIs for treasury performance. I'm thinking:\n   - Target APY (maybe 8-12% in current conditions?)\n   - Maximum drawdown tolerance (15%?)\n   - Minimum stablecoin reserves (always keep 20% liquid?)\n\n2. Insurance - should we consider getting coverage through something like Nexus Mutual for our largest positions?\n\nAlso, regarding the emergency procedures, we should have a clear escalation path and perhaps a 'war room' Discord channel that only key stakeholders can access during emergencies.\n\nOne last thing - when can we schedule a call with the broader finance committee to discuss these changes?",
        time: "2 days ago",
        isIncoming: true,
      },
      {
        id: "m4",
        sender: "Alex Thompson",
        content:
          "Maria,\n\nExcellent additions! Your risk categorization framework is exactly what we needed - clear, measurable criteria that remove ambiguity. I'll incorporate this verbatim into the proposal.\n\nRegarding emerging L2s, you're absolutely right about the opportunity. Let's revise to:\n- Ethereum: 65%\n- Arbitrum: 20%\n- Polygon: 10%\n- Emerging L2s reserve: 5%\n\nThis reserve can be deployed opportunistically as new chains mature.\n\nYour KPIs are spot-on. I'd suggest we review these quarterly and adjust based on market conditions. In bear markets, we might need to lower APY targets to 5-8% to maintain safety. The 20% liquid reserve is crucial - it ensures we can always meet operational needs without having to exit positions at inopportune times.\n\nInsurance is a great call. I'll research coverage options and costs. We should probably insure at least our top 3 positions, which would likely represent 60-70% of our treasury value. The cost-benefit analysis will be important here.\n\nFor the emergency procedures, I love the 'war room' concept. We should have:\n1. A private Discord channel with the 5 multi-sig holders\n2. A clear incident commander role (rotating monthly?)\n3. Pre-written emergency withdrawal transactions ready to execute\n4. A post-mortem process for any emergency event\n\nRegarding the finance committee meeting - how does next Thursday at 2 PM EST work? I can have the updated proposal ready by Tuesday for everyone to review.\n\nI'll also create a simple dashboard mockup showing how we'd track all these metrics in real-time. Transparency is key for maintaining community trust.",
        time: "1 day ago",
        isIncoming: false,
      },
      {
        id: "m5",
        sender: "Maria Chen",
        content:
          "Perfect! Thursday at 2 PM EST works for me. I'll coordinate with the other committee members to ensure we have quorum.\n\nThe dashboard mockup would be incredibly helpful. If we can show real-time treasury value, current allocations, and performance against our KPIs, it will go a long way toward building confidence in our management approach.\n\nLooking forward to seeing the updated proposal on Tuesday. This has shaped up really well - I think we have something solid to present to the DAO.\n\nThanks for being so receptive to the feedback, Alex. This is exactly the kind of collaborative approach we need.",
        time: "2 hours ago",
        isIncoming: true,
      },
    ],
  },
  {
    id: "t2",
    stakeholderId: "s2",
    stakeholderName: "John Davis",
    topic: "Smart Contract Audit Timeline",
    status: "ProposedResolvedByStakeholder",
    lastMessage:
      "The audit schedule looks good. I think we can close this thread once you confirm.",
    lastMessageTime: "5 hours ago",
    unreadCount: 1,
    messages: [],
  },
  {
    id: "t3",
    stakeholderId: "s3",
    stakeholderName: "Sarah Wilson",
    topic: "Governance Token Distribution Model",
    status: "Open",
    lastMessage: "I have some concerns about the vesting schedule...",
    lastMessageTime: "1 day ago",
    unreadCount: 0,
    messages: [],
  },
  {
    id: "t4",
    stakeholderId: "s4",
    stakeholderName: "Robert Kim",
    topic: "Q4 Development Roadmap",
    status: "ConfirmedResolved",
    lastMessage: "Great! Let's move forward with this plan.",
    lastMessageTime: "3 days ago",
    unreadCount: 0,
    messages: [],
  },
  {
    id: "t5",
    stakeholderId: "s5",
    stakeholderName: "Emma Johnson",
    topic: "Bug Bounty Program Setup",
    status: "Archived",
    lastMessage: "Program successfully launched. Closing this thread.",
    lastMessageTime: "1 week ago",
    unreadCount: 0,
    messages: [],
  },
];

export default function Editor() {
  const [document, dispatch] = useSelectedAgentInboxDocument();
  const [activeTab, setActiveTab] = useState<"inbox" | "archive">("inbox");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLeftColumnCollapsed, setIsLeftColumnCollapsed] = useState(false);

  // Return early if no document
  if (!document || !dispatch) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No document selected
      </div>
    );
  }

  const agent = document.state.global.agent;
  const stakeholders = document.state.global.stakeholders;
  const threads = document.state.global.threads;

  // Set initial selected thread
  useEffect(() => {
    if (!selectedThreadId && threads.length > 0) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  // Transform threads for display with stakeholder info
  const threadsWithInfo = threads.map((thread) => {
    const stakeholder = stakeholders.find((s) => s.id === thread.stakeholder);
    const lastMessage =
      thread.messages.length > 0
        ? thread.messages[thread.messages.length - 1]
        : null;

    return {
      ...thread,
      stakeholderId: thread.stakeholder,
      stakeholderName: stakeholder?.name || "Unknown",
      lastMessage: lastMessage?.content || "",
      lastMessageTime: lastMessage
        ? new Date(lastMessage.when).toLocaleString()
        : "",
      unreadCount: thread.messages.filter((m) => !m.read).length,
    };
  });

  // Filter threads based on tab
  const displayedThreads = threadsWithInfo.filter((thread) => {
    if (activeTab === "inbox") {
      return thread.status !== "Archived";
    } else {
      return thread.status === "Archived";
    }
  });

  // Further filter by search query
  const filteredThreads = displayedThreads.filter(
    (thread) =>
      (thread.topic || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.stakeholderName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedThread = threads.find((t) => t.id === selectedThreadId);
  const selectedStakeholder = selectedThread
    ? stakeholders.find((s) => s.id === selectedThread.stakeholder)
    : null;

  return (
    <div
      className="flex flex-col"
      style={{
        maxWidth: "1600px",
        margin: "0 auto",
        width: "100%",
        height: "100vh",
      }}
    >
      {/* Top cell - toolbar with bottom padding only */}
      <div className="pb-6">
        <DocumentToolbar />
      </div>

      {/* Bottom cell - calc remaining height minus toolbar and its padding */}
      <div
        className="overflow-hidden"
        style={{
          height: "calc(100vh - 7.5rem)", // Adjust this value based on actual toolbar height
          paddingBottom: "1.5rem",
        }}
      >
        {/* Column layout - full height minus bottom padding */}
        <div
          className="flex overflow-hidden border border-gray-200 shadow-md"
          style={{ height: "calc(100% - 0.5rem)" }}
        >
          {/* Left Column - 1/3 width */}
          {!isLeftColumnCollapsed && (
            <div
              className="bg-white border-r border-gray-200 flex flex-col h-full"
              style={{ width: "33.333%", minWidth: "400px" }}
            >
              {/* Agent Panel - Fixed */}
              <div className="flex-shrink-0">
                <AgentPanel
                  agent={agent}
                  dispatch={dispatch}
                  onCollapse={() => setIsLeftColumnCollapsed(true)}
                />
              </div>

              {/* Tabs and Search - Fixed */}
              <div className="px-4 pt-4 pb-2 border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-1 mb-3">
                  <button
                    onClick={() => setActiveTab("inbox")}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "inbox"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Inbox (
                    {threadsWithInfo.filter((t) => t.status !== "Archived").length}
                    )
                  </button>
                  <button
                    onClick={() => setActiveTab("archive")}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === "archive"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Archive (
                    {threadsWithInfo.filter((t) => t.status === "Archived").length}
                    )
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search threads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Threads List - scrollable */}
              <div className="flex-1 overflow-y-auto">
                <ThreadsList
                  threads={filteredThreads}
                  selectedThreadId={selectedThreadId}
                  onThreadSelect={setSelectedThreadId}
                />
              </div>
            </div>
          )}

          {/* Right Column - 2/3 width or full width when collapsed */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
            {/* Expand button when collapsed */}
            {isLeftColumnCollapsed && (
              <button
                onClick={() => setIsLeftColumnCollapsed(false)}
                className="absolute top-4 left-4 z-10 p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                title="Expand sidebar"
              >
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
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
            {selectedThread && selectedStakeholder ? (
              <MessageThread
                thread={selectedThread}
                stakeholder={selectedStakeholder}
                agent={agent}
                dispatch={dispatch}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4-4-4z"
                    />
                  </svg>
                  <p className="text-lg">Select a thread to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
