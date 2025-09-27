import { Card } from '@/components/ui/card';

interface TranscriptDisplayProps {
  transcript: string;
  interimTranscript: string;
  isRecording: boolean;
}

export const TranscriptDisplay = ({ transcript, interimTranscript, isRecording }: TranscriptDisplayProps) => {
  const hasContent = transcript || interimTranscript;

  if (!hasContent && !isRecording) {
    return null;
  }

  return (
    <Card className="p-6 min-h-[120px] max-h-[300px] overflow-y-auto">
      <div className="space-y-2">
        {transcript && (
          <p className="text-foreground leading-relaxed">
            {transcript}
          </p>
        )}
        {interimTranscript && (
          <p className="text-muted-foreground italic leading-relaxed">
            {interimTranscript}
          </p>
        )}
        {!transcript && !interimTranscript && isRecording && (
          <p className="text-muted-foreground italic">
            Start speaking...
          </p>
        )}
      </div>
    </Card>
  );
};