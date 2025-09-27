import { useState, useEffect } from 'react';
import { JournalEntry } from '@/types/journal';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { RecordButton } from './RecordButton';
import { TranscriptDisplay } from './TranscriptDisplay';
import { EntryList } from './EntryList';
import { EntryEditor } from './EntryEditor';
import { ThemeToggle } from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Edit3, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState('');
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

  const handleEditTranscript = () => {
    setEditableContent(transcript);
    setIsEditing(true);
  };

  const handleSaveEditedContent = () => {
    const contentToSave = editableContent.trim();
    if (!contentToSave) {
      toast({
        title: "Nothing to save",
        description: "Please add some content before saving.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title: format(new Date(), 'PPP'),
      content: contentToSave,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setEntries(prev => [newEntry, ...prev]);
    resetTranscript();
    setIsEditing(false);
    setEditableContent('');
    
    toast({
      title: "Entry saved!",
      description: "Your journal entry has been saved successfully.",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableContent('');
  };

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
      <div className="flex justify-between items-start">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold mb-2">Voice Journal</h1>
          <p className="text-muted-foreground">
            Hold the red button and speak your thoughts
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Edit your entry</label>
              <Textarea
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                placeholder="Edit your journal entry..."
                className="min-h-[200px] resize-none"
              />
            </div>
            <div className="flex justify-center gap-2">
              <Button onClick={handleSaveEditedContent} className="bg-primary hover:bg-primary/90">
                <Check className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <TranscriptDisplay
              transcript={transcript}
              interimTranscript={interimTranscript}
              isRecording={isListening}
            />

            {transcript && !isListening && (
              <div className="flex justify-center gap-2">
                <Button onClick={handleEditTranscript} variant="outline">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Before Saving
                </Button>
                <Button onClick={handleSaveEntry} className="bg-primary hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Entry
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex justify-center py-8">
          <RecordButton
            isRecording={isListening}
            onStartRecording={startListening}
            onStopRecording={stopListening}
          />
        </div>
      )}

      <EntryList entries={entries} onSelectEntry={setSelectedEntry} />
    </div>
  );
};