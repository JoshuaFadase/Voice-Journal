export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recording {
  isRecording: boolean;
  transcript: string;
  interimTranscript: string;
}