import { useState, useRef, useEffect } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type { AgentInboxAction } from "powerhouse-agent/document-models/agent-inbox";
import {
  sendStakeholderMessage,
  setThreadTopic,
  proposeThreadResolved,
  confirmThreadResolved,
  archiveThread,
  reopenThread,
  markMessageRead,
} from "../../../document-models/agent-inbox/gen/creators.js";

interface Message {
  id: string;
  flow: "Incoming" | "Outgoing";
  when: string;
  content: string;
  read: boolean;
}

interface Stakeholder {
  id: string;
  name: string;
  avatar: string | null;
}

interface Agent {
  name: string | null;
  role: string | null;
  ethAddress: string | null;
  description: string | null;
  avatar: string | null;
}

interface Thread {
  id: string;
  topic: string | null;
  stakeholder: string;
  status: string;
  messages: Message[];
}

interface MessageThreadProps {
  thread: Thread;
  stakeholder: Stakeholder;
  agent: Agent;
  dispatch: DocumentDispatch<AgentInboxAction>;
  isCollapsed?: boolean;
  onExpand?: () => void;
}

export function MessageThread({
  thread,
  stakeholder,
  agent,
  dispatch,
  isCollapsed,
  onExpand,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [tempTopic, setTempTopic] = useState("");
  const [hasMarkedAsRead, setHasMarkedAsRead] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const newMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const topicInputRef = useRef<HTMLInputElement>(null);
  const markReadTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  // Find first unread agent message
  const firstUnreadAgentMessageIndex = thread.messages.findIndex(
    (msg) => msg.flow === "Outgoing" && !msg.read
  );

  // Scroll to appropriate position when thread changes
  useEffect(() => {
    setHasMarkedAsRead(false);
    
    // Clear any existing timer
    if (markReadTimerRef.current) {
      clearTimeout(markReadTimerRef.current);
    }

    // Small delay to ensure DOM is updated
    setTimeout(() => {
      if (firstUnreadAgentMessageIndex !== -1 && newMessagesRef.current) {
        // Scroll to new messages divider
        newMessagesRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        // All messages are read, scroll to bottom
        scrollToBottom();
      }

      // Start timer to mark messages as read
      markReadTimerRef.current = setTimeout(() => {
        markAgentMessagesAsRead();
      }, 2000);
    }, 100);

    return () => {
      if (markReadTimerRef.current) {
        clearTimeout(markReadTimerRef.current);
      }
    };
  }, [thread.id]); // Trigger when thread ID changes

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (markReadTimerRef.current) {
        clearTimeout(markReadTimerRef.current);
      }
    };
  }, []);

  const markAgentMessagesAsRead = () => {
    if (hasMarkedAsRead) return;

    const unreadAgentMessages = thread.messages.filter(
      (msg) => msg.flow === "Outgoing" && !msg.read
    );

    unreadAgentMessages.forEach((msg) => {
      dispatch(
        markMessageRead({
          threadId: thread.id,
          messageId: msg.id,
        })
      );
    });

    setHasMarkedAsRead(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && thread) {
      // Dispatch stakeholder message (simulating stakeholder sending a message)
      dispatch(
        sendStakeholderMessage({
          threadId: thread.id,
          messageId: generateId(),
          content: newMessage,
          when: new Date().toISOString(),
        }),
      );
      setNewMessage("");
      // Scroll to bottom after sending
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Check if user is at bottom of scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;

    // If at bottom (100% scroll), start timer to mark messages as read
    if (isAtBottom && !hasMarkedAsRead) {
      // Clear any existing timer
      if (markReadTimerRef.current) {
        clearTimeout(markReadTimerRef.current);
      }
      
      // Set new timer
      markReadTimerRef.current = setTimeout(() => {
        markAgentMessagesAsRead();
      }, 2000);
    }
  };

  const handleStartEditTopic = () => {
    setTempTopic(thread.topic || "");
    setIsEditingTopic(true);
    setTimeout(() => {
      if (topicInputRef.current) {
        topicInputRef.current.focus();
        topicInputRef.current.select();
      }
    }, 0);
  };

  const handleSaveTopic = () => {
    dispatch(
      setThreadTopic({
        id: thread.id,
        topic: tempTopic.trim() || undefined,
      }),
    );
    setIsEditingTopic(false);
  };

  const handleCancelEditTopic = () => {
    setIsEditingTopic(false);
    setTempTopic("");
  };

  const handleTopicKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveTopic();
    } else if (e.key === "Escape") {
      handleCancelEditTopic();
    }
  };

  const handleProposeResolved = () => {
    dispatch(
      proposeThreadResolved({
        threadId: thread.id,
        proposedBy: "Agent",
      }),
    );
  };

  const handleConfirmResolved = () => {
    dispatch(
      confirmThreadResolved({
        threadId: thread.id,
        confirmedBy: "Agent",
      }),
    );
  };

  const handleArchiveThread = () => {
    dispatch(
      archiveThread({
        threadId: thread.id,
        archivedBy: "Agent",
      }),
    );
  };

  const handleReopenThread = () => {
    dispatch(
      reopenThread({
        threadId: thread.id,
        reopenedBy: "Agent",
      }),
    );
  };

  const getStatusActions = () => {
    switch (thread.status) {
      case "Open":
        return (
          <button
            onClick={handleProposeResolved}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Propose Resolved
          </button>
        );
      case "ProposedResolvedByStakeholder":
        return (
          <button
            onClick={handleConfirmResolved}
            className="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            Confirm Resolved
          </button>
        );
      case "ProposedResolvedByAgent":
        return (
          <button
            disabled
            className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
          >
            Awaiting Confirmation
          </button>
        );
      case "ConfirmedResolved":
        return (
          <button
            onClick={handleArchiveThread}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Archive Thread
          </button>
        );
      case "Archived":
        return (
          <button
            onClick={handleReopenThread}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Reopen Thread
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Thread Header - Fixed */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 space-x-2">
            {/* Expand button when sidebar is collapsed */}
            {isCollapsed && onExpand && (
              <button
                onClick={onExpand}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            {/* Topic */}
            <div className="flex-1">
              {isEditingTopic ? (
                <input
                  ref={topicInputRef}
                  type="text"
                  value={tempTopic}
                  onChange={(e) => setTempTopic(e.target.value)}
                  onBlur={handleSaveTopic}
                  onKeyDown={handleTopicKeyDown}
                  placeholder="Enter topic..."
                  className="text-lg font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-lg"
                />
              ) : (
                <h2
                  className="text-lg font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 px-3 py-1 -ml-3 rounded inline-block"
                  onClick={handleStartEditTopic}
                >
                  {thread.topic || "Click to add topic"}
                </h2>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusActions()}
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <div
        className="flex-1 overflow-y-auto bg-gray-50"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <div className="px-6 py-4 space-y-6">
          {!thread.messages || thread.messages.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm mt-1">Start the conversation</p>
            </div>
          ) : (
            <>
              {thread.messages.map((message: Message, index: number) => {
                const isFromAgent = message.flow === "Outgoing";
                const sender = isFromAgent
                  ? agent.name || "Agent"
                  : stakeholder.name;
                const avatarUrl = isFromAgent
                  ? agent.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${agent.name || "Agent"}`
                  : stakeholder.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${stakeholder.name}`;
                const messageTime = new Date(message.when).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                );

                return (
                  <>
                    {/* New Messages Divider */}
                    {index === firstUnreadAgentMessageIndex && (
                      <div ref={newMessagesRef} className="flex items-center my-4">
                        <div className="flex-1 border-t border-red-400"></div>
                        <span className="px-3 text-xs font-medium text-red-500">
                          NEW MESSAGES
                        </span>
                        <div className="flex-1 border-t border-red-400"></div>
                      </div>
                    )}
                  <div
                    key={message.id}
                    className={`flex ${isFromAgent ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`flex ${
                        isFromAgent ? "flex-row" : "flex-row-reverse"
                      } items-start space-x-1.5 max-w-[75%]`}
                    >
                      <img
                        src={avatarUrl}
                        alt={sender}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div
                        className={`${isFromAgent ? "ml-1.5 mr-0" : "ml-0 mr-1.5"}`}
                      >
                        <div className="flex items-baseline space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {sender}
                          </span>
                          <span className="text-xs text-gray-500">
                            {messageTime}
                          </span>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-3 ${
                            isFromAgent
                              ? "bg-blue-600 text-white"
                              : "bg-white border border-gray-200"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-1.5 max-w-[75%]">
                    <img
                      src={
                        stakeholder.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${stakeholder.name}`
                      }
                      alt={stakeholder.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="ml-1.5">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center space-x-3">
          {/* Stakeholder Avatar */}
          <img
            src={
              stakeholder.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${stakeholder.name}`
            }
            alt={stakeholder.name}
            className="w-12 h-12 rounded-full flex-shrink-0"
          />

          {/* Message Input */}
          <div className="flex-1 flex items-stretch space-x-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => {
                setIsTyping(false);
                scrollToBottom();
              }}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              style={{ minHeight: "60px" }}
            />

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`px-5 py-3 text-sm font-medium rounded-lg transition-colors self-stretch ${
                newMessage.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Send
            </button>
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500 text-right">
          <span>Press Ctrl+Enter to send</span>
        </div>
      </div>
    </div>
  );
}
