import { create } from 'zustand';
import { Meeting, MeetingResult, ChatMessage } from '../types';

interface MeetingState {
  meetings: Meeting[];
  currentMeeting: MeetingResult | null;
  chatHistory: ChatMessage[];
  isProcessing: boolean;
  
  // Actions
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  setCurrentMeeting: (meeting: MeetingResult | null) => void;
  addChatMessage: (message: ChatMessage) => void;
  setProcessing: (processing: boolean) => void;
  clearChatHistory: () => void;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  meetings: [],
  currentMeeting: null,
  chatHistory: [],
  isProcessing: false,
  
  addMeeting: (meeting) =>
    set((state) => ({
      meetings: [meeting, ...state.meetings],
    })),
    
  updateMeeting: (id, updates) =>
    set((state) => ({
      meetings: state.meetings.map((meeting) =>
        meeting.id === id ? { ...meeting, ...updates } : meeting
      ),
    })),
    
  setCurrentMeeting: (meeting) =>
    set({ currentMeeting: meeting }),
    
  addChatMessage: (message) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, message],
    })),
    
  setProcessing: (processing) =>
    set({ isProcessing: processing }),
    
  clearChatHistory: () =>
    set({ chatHistory: [] }),
}));
