import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const RecordButton = ({ isRecording, onStartRecording, onStopRecording }: RecordButtonProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onMouseDown={onStartRecording}
        onMouseUp={onStopRecording}
        onMouseLeave={onStopRecording}
        onTouchStart={onStartRecording}
        onTouchEnd={onStopRecording}
        className={cn(
          "w-20 h-20 rounded-full border-4 transition-all duration-200 select-none",
          "flex items-center justify-center text-white font-medium",
          "active:scale-95 touch-manipulation",
          isRecording 
            ? "bg-record-active border-record-active animate-pulse shadow-lg shadow-record/30" 
            : "bg-record hover:bg-record-hover border-record hover:border-record-hover hover:shadow-md"
        )}
        type="button"
      >
        {isRecording ? (
          <Square className="w-8 h-8" fill="currentColor" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </button>
      <p className="text-sm text-muted-foreground">
        {isRecording ? "Release to stop recording" : "Hold to record"}
      </p>
    </div>
  );
};