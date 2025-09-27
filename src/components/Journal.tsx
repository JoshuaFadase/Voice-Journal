import { useState, useEffect } from 'react';
import { JournalEntry } from '@/types/journal';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { RecordButton } from './RecordButton';
import { TranscriptDisplay } from './TranscriptDisplay';
import { EntryList } from './EntryList';
import { EntryEditor } from './EntryEditor';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const { transcript, interimTranscript, isListening, startListening, stopListening, resetTranscript } = useSpeechRecognition();
  const { toast } = useToast();

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('journal-entries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setEntries(parsed.map((entry: any) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
      })));
    }
  }, []);

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem('journal-entries', JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = () => {
    if (!transcript.trim()) {
      toast({
        title: "Nothing to save",
        description: "Please record some content before saving.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title: format(new Date(), 'PPP'),
      content: transcript.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setEntries(prev => [newEntry, ...prev]);
    resetTranscript();
    
    toast({
      title: "Entry saved!",
      description: "Your journal entry has been saved successfully.",
    });
  };

  const handleUpdateEntry = (updatedEntry: JournalEntry) => {
    setEntries(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
    setSelectedEntry(null);
    
    toast({
      title: "Entry updated!",
      description: "Your changes have been saved.",
    });
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
    setSelectedEntry(null);
    
    toast({
      title: "Entry deleted",
      description: "The journal entry has been removed.",
    });
  };

  if (selectedEntry) {
    return (
      <EntryEditor
        entry={selectedEntry}
        onSave={handleUpdateEntry}
        onDelete={handleDeleteEntry}
        onBack={() => setSelectedEntry(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Voice Journal</h1>
        <p className="text-muted-foreground">
          Hold the red button and speak your thoughts
        </p>
      </div>

      <div className="space-y-4">
        <TranscriptDisplay
          transcript={transcript}
          interimTranscript={interimTranscript}
          isRecording={isListening}
        />

        {transcript && !isListening && (
          <div className="flex justify-center">
            <Button onClick={handleSaveEntry} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Save Entry
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-center py-8">
        <RecordButton
          isRecording={isListening}
          onStartRecording={startListening}
          onStopRecording={stopListening}
        />
      </div>

      <EntryList entries={entries} onSelectEntry={setSelectedEntry} />
    </div>
  );
};