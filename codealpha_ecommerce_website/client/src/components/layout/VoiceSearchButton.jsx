import React, { useState, useEffect } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { useToast } from '../../contexts/ToastContext';

const VoiceSearchButton = ({ onSpeechRecognized }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        addToast('Listening... Speak product name now', 'info');
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (transcript) {
          addToast(`Recognized: "${transcript}"`, 'success');
          onSpeechRecognized(transcript);
        }
      };

      rec.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          addToast('Microphone access denied. Please enable microphone permissions in your browser.', 'error');
        } else {
          addToast('Voice search error. Please try again.', 'error');
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  const handleVoiceSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!recognition) {
      addToast('Voice Search is not supported in this browser. Try Google Chrome or Microsoft Edge.', 'warning');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
      } catch (err) {
        recognition.stop();
        setTimeout(() => recognition.start(), 200);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleVoiceSearch}
      title={isListening ? 'Listening...' : 'Voice Search'}
      className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer ${
        isListening
          ? 'bg-rose-500 text-white animate-pulse shadow-lg ring-4 ring-rose-500/30'
          : 'text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60'
      }`}
    >
      {isListening ? (
        <FiMicOff className="w-4 h-4 animate-bounce" />
      ) : (
        <FiMic className="w-4 h-4" />
      )}
    </button>
  );
};

export default VoiceSearchButton;
