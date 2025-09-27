import { JournalEntry } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface EntryListProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
}

export const EntryList = ({ entries, onSelectEntry }: EntryListProps) => {
  if (entries.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">No journal entries yet</h3>
        <p className="text-muted-foreground">
          Start recording your first journal entry using the red button below
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold mb-4">Your Journal Entries</h2>
      {entries.map((entry) => (
        <Card key={entry.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{entry.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {format(new Date(entry.createdAt), 'PPP p')}
              </p>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {entry.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectEntry(entry)}
              className="ml-2 flex-shrink-0"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};