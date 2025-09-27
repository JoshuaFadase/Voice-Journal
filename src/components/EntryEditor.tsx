import { useState } from 'react';
import { JournalEntry } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface EntryEditorProps {
  entry: JournalEntry;
  onSave: (updatedEntry: JournalEntry) => void;
  onDelete: (entryId: string) => void;
  onBack: () => void;
}

export const EntryEditor = ({ entry, onSave, onDelete, onBack }: EntryEditorProps) => {
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);

  const handleSave = () => {
    const updatedEntry: JournalEntry = {
      ...entry,
      title: title.trim() || format(new Date(entry.createdAt), 'PPP'),
      content: content.trim(),
      updatedAt: new Date(),
    };
    onSave(updatedEntry);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      onDelete(entry.id);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to entries
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDelete} className="text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={format(new Date(entry.createdAt), 'PPP')}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Content</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Your journal entry..."
            className="min-h-[300px] resize-none"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Created: {format(new Date(entry.createdAt), 'PPP p')}
          {entry.updatedAt.getTime() !== entry.createdAt.getTime() && (
            <span className="ml-4">
              Updated: {format(new Date(entry.updatedAt), 'PPP p')}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};