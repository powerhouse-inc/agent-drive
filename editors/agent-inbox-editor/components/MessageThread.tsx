import { useState, useRef } from "react";
import { generateId } from "document-model/core";
import type { DocumentDispatch } from "@powerhousedao/reactor-browser";
import type { AgentInboxAction } from "powerhouse-agent/document-models/agent-inbox";
import { sendStakeholderMessage } from "../../../document-models/agent-inbox/gen/creators.js";

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
}

export function MessageThread({
  thread,
  stakeholder,
  agent,
  dispatch,
}: MessageThreadProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusActions = () => {
    switch (thread.status) {
      case "Open":
        return (
          <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Propose Resolved
          </button>
        );
      case "ProposedResolvedByStakeholder":
        return (
          <button className="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            Confirm Resolved
          </button>
        );
      case "ProposedResolvedByAgent":
        return (
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            Awaiting Confirmation
          </button>
        );
      case "ConfirmedResolved":
        return (
          <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
            Archive Thread
          </button>
        );
      case "Archived":
        return (
          <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={
                stakeholder.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${stakeholder.name}`
              }
              alt={stakeholder.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {stakeholder.name}
              </h2>
              <p className="text-sm text-gray-600">
                {thread.topic || "No topic"}
              </p>
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
              {thread.messages.map((message: Message) => {
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
                  <div
                    key={message.id}
                    className={`flex ${isFromAgent ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`flex ${
                        isFromAgent ? "flex-row" : "flex-row-reverse"
                      } items-start space-x-3 max-w-[75%]`}
                    >
                      <img
                        src={avatarUrl}
                        alt={sender}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                      <div
                        className={`${isFromAgent ? "ml-3 mr-0" : "ml-0 mr-3"}`}
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
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3 max-w-[75%]">
                    <img
                      src={
                        stakeholder.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${stakeholder.name}`
                      }
                      alt={stakeholder.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="ml-3">
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
        <div className="flex items-end space-x-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => {
              setIsTyping(false);
              scrollToBottom();
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              newMessage.trim()
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500 text-right">
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
}
