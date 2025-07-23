import { useState, useRef, useEffect } from 'react';
import { VoiceLinkAPI, type LLMResponse } from '../services/api';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  confidence?: number;
  tokens_used?: number;
}

interface ChatInterfaceProps {
  meetingId?: string;
}

export default function ChatInterface({ meetingId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAvailableModels();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadAvailableModels = async () => {
    try {
      const models = await VoiceLinkAPI.getAvailableModels();
      setAvailableModels(models);
      if (models.length > 0) {
        setSelectedModel(models[0]);
      }
    } catch (err) {
      console.error('Failed to load models:', err);
      setError('Failed to load available models');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response: LLMResponse = await VoiceLinkAPI.chatWithLLM(
        currentInput,
        selectedModel || undefined
      );

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.response,
        timestamp: new Date(),
        confidence: response.confidence,
        tokens_used: response.tokens_used
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get response from AI');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3 className="chat-title">
          💬 AI Assistant
          {meetingId && <span className="meeting-context">Meeting: {meetingId}</span>}
        </h3>
        
        <div className="flex items-center gap-3 mt-2">
          {availableModels.length > 0 && (
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          )}
          
          <button
            onClick={clearConversation}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            🗑️ Clear
          </button>
        </div>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 mx-4 mt-2">
          <div className="flex">
            <div className="text-red-400 text-sm">⚠️</div>
            <div className="ml-2">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-3">🤖</div>
            <p className="text-sm">Start a conversation with the AI assistant</p>
            {meetingId ? (
              <p className="text-xs mt-2">You can ask questions about the current meeting</p>
            ) : (
              <p className="text-xs mt-2">Ask general questions or upload a meeting first</p>
            )}
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
              {message.confidence && (
                <span className="ml-2 text-xs">
                  Confidence: {Math.round(message.confidence * 100)}%
                </span>
              )}
              {message.tokens_used && (
                <span className="ml-2 text-xs">
                  Tokens: {message.tokens_used}
                </span>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message ai">
            <div className="message-content">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="typing">AI is thinking</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={meetingId ? "Ask about the meeting transcript..." : "Ask the AI assistant..."}
          rows={2}
          disabled={isLoading}
          className="chat-textarea"
        />
        <button 
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          className="btn btn-primary"
        >
          {isLoading ? '⏳' : 'Send'}
        </button>
      </div>
    </div>
  );
}
