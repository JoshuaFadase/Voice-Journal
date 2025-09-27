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
      {/* Fixed container to prevent layout shifts */}
      <div className="relative w-20 h-20">
        <button
          onMouseDown={onStartRecording}
          onMouseUp={onStopRecording}
          onMouseLeave={onStopRecording}
          onTouchStart={onStartRecording}
          onTouchEnd={onStopRecording}
          className={cn(
            "absolute inset-0 w-20 h-20 rounded-full border-4 select-none",
            "flex items-center justify-center text-white font-medium",
            "touch-manipulation transition-colors duration-200",
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
      </div>
      {/* Fixed height container for text to prevent shifts */}
      <div className="h-5 flex items-center">
        <p className="text-sm text-muted-foreground">
          {isRecording ? "Release to stop recording" : "Hold to record"}
        </p>
      </div>
    </div>
  );
};