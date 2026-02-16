import React, { useState, useRef, useCallback } from 'react';
import { Mic, Square, Loader } from 'lucide-react';
import { usePromptStore } from '../hooks/usePromptStore';
import { useTokenCounter } from '../hooks/useTokenCounter';
import { VoiceTranscription } from '../types/index';

interface VoiceTranscriberProps {
  onTranscriptionComplete?: (transcription: VoiceTranscription) => void;
  apiKey?: string;
}

export function VoiceTranscriber({ onTranscriptionComplete, apiKey }: VoiceTranscriberProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { addContext } = usePromptStore();
  const { estimateTokens } = useTokenCounter();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return;

    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setIsTranscribing(true);

      try {
        // Transcribe using Wispr Flow API or fallback
        const transcription = await transcribeAudio(audioBlob, apiKey);
        
        const voiceTranscription: VoiceTranscription = {
          id: `voice-${Date.now()}`,
          text: transcription.text,
          language: transcription.language || 'en',
          confidence: transcription.confidence || 0.95,
          duration,
          timestamp: new Date(),
        };

        // Add to context
        const tokens = estimateTokens(transcription.text);
        addContext({
          id: voiceTranscription.id,
          type: 'voice',
          label: `Voice: ${new Date().toLocaleTimeString()}`,
          content: transcription.text,
          tokens,
          metadata: {
            language: voiceTranscription.language,
            confidence: voiceTranscription.confidence,
            duration,
          },
        });

        onTranscriptionComplete?.(voiceTranscription);
      } catch (error) {
        console.error('Transcription failed:', error);
      } finally {
        setIsTranscribing(false);
      }

      // Stop all tracks
      stream.getTracks().forEach((track) => track.stop());
    };
  }, [duration, addContext, estimateTokens, onTranscriptionComplete, apiKey]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100">
            <Mic className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Voice Transcription</p>
            {isRecording && (
              <p className="text-xs text-orange-600">Recording: {formatDuration(duration)}</p>
            )}
            {isTranscribing && (
              <p className="text-xs text-orange-600">Transcribing...</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isRecording || isTranscribing ? (
            <>
              <button
                onClick={stopRecording}
                disabled={isTranscribing}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:bg-gray-300"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            </>
          ) : (
            <button
              onClick={startRecording}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-600 text-white text-sm hover:bg-orange-700"
            >
              {isTranscribing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Start Recording
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-600 mt-2">
        Click to record your voice. It will be transcribed and added to your context.
      </p>
    </div>
  );
}

// Transcribe audio using Wispr Flow or fallback
async function transcribeAudio(
  audioBlob: Blob,
  apiKey?: string
): Promise<{ text: string; language?: string; confidence?: number }> {
  // Placeholder implementation - replace with actual Wispr Flow integration
  // In production, this would call the Wispr Flow API
  
  if (apiKey) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      // Wispr Flow API endpoint would go here
      const response = await fetch('https://api.wispr.ai/transcribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return {
          text: result.text,
          language: result.language,
          confidence: result.confidence,
        };
      }
    } catch (error) {
      console.error('Wispr Flow API error:', error);
    }
  }

  // Fallback: return placeholder text
  return {
    text: '[Voice transcription requires Wispr Flow API key. Please configure in settings.]',
    language: 'en',
    confidence: 0,
  };
}
