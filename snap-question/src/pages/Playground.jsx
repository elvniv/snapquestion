import React, { useState, useRef, useEffect } from "react";
import apiClient from "../api";

export default function Playground() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId] = useState(`conv_${Date.now()}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      text: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await apiClient.getAnswer(
        "dev-tenant",
        input,
        null,
        conversationId
      );

      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: response.answer,
        citations: response.citations || [],
        confidence: response.confidence,
        escalated: response.escalated,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting answer:", error);
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        text: "Sorry, I encountered an error. Please try again.",
        error: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Playground</h1>
              <p className="text-gray-600 mt-1">Test your knowledge base with questions</p>
            </div>
            <button
              onClick={clearChat}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white shadow-lg" style={{ height: "500px" }}>
          <div className="h-full overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                <p className="text-gray-500 text-lg mb-2">No messages yet</p>
                <p className="text-gray-400">Ask a question to get started!</p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : message.error
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {/* Message Text */}
                      <p className="whitespace-pre-wrap">{message.text}</p>
                      
                      {/* Bot Message Metadata */}
                      {message.type === "bot" && !message.error && (
                        <>
                          {/* Confidence Score */}
                          {message.confidence !== undefined && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">Confidence</span>
                                <span
                                  className={`font-medium ${
                                    message.confidence > 0.8
                                      ? "text-green-600"
                                      : message.confidence > 0.6
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {Math.round(message.confidence * 100)}%
                                </span>
                              </div>
                              <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    message.confidence > 0.8
                                      ? "bg-green-500"
                                      : message.confidence > 0.6
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                                  style={{ width: `${message.confidence * 100}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Citations */}
                          {message.citations && message.citations.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-600 mb-2">Sources:</p>
                              <div className="space-y-1">
                                {message.citations.map((citation, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center text-xs bg-white rounded px-2 py-1"
                                  >
                                    <svg
                                      className="w-3 h-3 text-blue-500 mr-1.5 flex-shrink-0"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                                    </svg>
                                    <span className="text-gray-700 truncate">
                                      {citation.title}
                                      {citation.page && ` (p. ${citation.page})`}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Escalation Notice */}
                          {message.escalated && (
                            <div className="mt-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                              <p className="text-xs text-yellow-800 flex items-center">
                                <svg
                                  className="w-3 h-3 mr-1.5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Escalated to human agent
                              </p>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Timestamp */}
                      <p className={`text-xs mt-2 ${
                        message.type === "user" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Loading Indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-b-2xl shadow-lg p-4 border-t">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your documents..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                disabled={loading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                !input.trim() || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              )}
            </button>
          </div>
          
          {/* Helper Text */}
          <p className="text-xs text-gray-500 mt-2 px-1">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}