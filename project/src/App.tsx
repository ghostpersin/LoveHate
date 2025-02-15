import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bot, Sparkles, Heart, Mic2 } from 'lucide-react';

type Mode = 'rap' | 'argument' | 'flirt';
type Rapper = 'LuvBot' | 'Cupidrilla';

const BGM_URL = '/audio/8bit.mp3';

function App() {
  const [mode, setMode] = useState<Mode>('rap');
  const [rapLines, setRapLines] = useState<string[]>([]);
  const [currentRapper, setCurrentRapper] = useState<Rapper>('LuvBot');
  const [isMuted, setIsMuted] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // States for argument mode
  const [argumentTopic, setArgumentTopic] = useState('');
  const [showArgumentPopup, setShowArgumentPopup] = useState(false);

  // Audio initialization
  useEffect(() => {
    const newAudio = new Audio(BGM_URL);
    newAudio.loop = true;
    setAudio(newAudio);

    return () => {
      newAudio.pause();
      newAudio.remove();
    };
  }, []);

  // Audio error handling
  useEffect(() => {
    if (!audio) return;
    const handleError = () => console.error('Audio loading failed');
    audio.addEventListener('error', handleError);
    return () => audio.removeEventListener('error', handleError);
  }, [audio]);

  const toggleAudio = () => {
    if (!audio) return;
    if (isMuted) {
      audio.play().catch(e => console.log('Audio play failed:', e));
    } else {
      audio.pause();
    }
    setIsMuted(!isMuted);
  };

  // Axios integration for rap mode
  const handleRapLine = async () => {
    const lastResponse = rapLines[rapLines.length - 1] || '';
    const rapper = currentRapper === 'LuvBot' ? 'LuvBot' : 'Cupidrilla';
    const prompt = `${rapper}: ${lastResponse}`;
  
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/bot/', {
        params: { mode: 'rap', prompt: prompt }
      });
      const newLine = `${rapper}: ${res.data.response}`;
      setRapLines(prev => [...prev, newLine]);
      setCurrentRapper(prev => (prev === 'LuvBot' ? 'Cupidrilla' : 'LuvBot'));
    } catch (error) {
      console.error('Error in rap mode:', error);
    }
  };

  // Axios integration for starting an argument battle
  const handleStartArgument = async () => {
    if (!argumentTopic.trim()) return;
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/bot/', {
        params: { mode: 'argument', prompt: argumentTopic }
      });
      const newLine = res.data.response;
      setRapLines(prev => [...prev, newLine]);
      setShowArgumentPopup(false);
    } catch (error) {
      console.error('Error starting argument:', error);
    }
  };

  // Axios integration for subsequent argument lines
  const handleArgumentLine = async () => {
    if (!argumentTopic.trim()) return;
    const lastResponse = rapLines[rapLines.length - 1] || argumentTopic;
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/bot/', {
        params: { mode: 'argument', prompt: lastResponse }
      });
      const newLine = res.data.response;
      setRapLines(prev => [...prev, newLine]);
      setCurrentRapper(prev => (prev === 'LuvBot' ? 'Cupidrilla' : 'LuvBot'));
    } catch (error) {
      console.error('Error in argument mode:', error);
    }
  };

  // Axios integration for flirt mode
  const handleFlirtLine = async () => {
    const lastResponse = rapLines[rapLines.length - 1] || '';
    const rapper = currentRapper === 'LuvBot' ? 'LuvBot' : 'Cupidrilla';
    const prompt = `${rapper}: ${lastResponse}`;
  
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/bot/', {
        params: { mode: 'flirt', prompt: prompt }
      });
      const newLine = `${rapper}: ${res.data.response}`;
      setRapLines(prev => [...prev, newLine]);
      setCurrentRapper(prev => (prev === 'LuvBot' ? 'Cupidrilla' : 'LuvBot'));
    } catch (error) {
      console.error('Error in flirt mode:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#2A0E61] p-4 sm:p-6 md:p-8 relative overflow-hidden crt-flicker">
      <div className="scanline"></div>
      <div className="absolute inset-0 pixel-grid"></div>

      <div className="max-w-4xl mx-auto relative">
        {/* Sound Toggle */}
        <button
          onClick={toggleAudio}
          className="absolute top-4 right-4 z-10 px-4 py-2 bg-pink-600 text-white pixel-box text-xs sm:text-sm hover:bg-pink-700 transition-colors"
        >
          {isMuted ? '🔇 Music Off' : '🔊 Music On'}
        </button>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="pixel-heart-container mb-4">
            <div className="pixel-heart"></div>
            <div className="pixel-heart" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 md:mb-4 pixel-font pixel-shadow glitch-text">
            AI CRINGE BATTLE
          </h1>
          <p className="text-pink-300 text-sm sm:text-base md:text-lg pixel-font">
            Where bots battle with their hearts!
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          {(['rap', 'argument', 'flirt'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                if (m === 'argument') {
                  setShowArgumentPopup(true);
                }
              }}
              className={`pixel-box flex items-center justify-center gap-2 px-4 py-2 text-white transition-all ${
                mode === m
                  ? 'bg-pink-600 scale-105'
                  : 'bg-purple-700 hover:bg-purple-600'
              }`}
            >
              {m === 'rap' && <Mic2 className="w-4 h-4" />}
              {m === 'argument' && <Sparkles className="w-4 h-4" />}
              {m === 'flirt' && <Heart className="w-4 h-4" />}
              <span className="text-sm capitalize pixel-font">{m}</span>
            </button>
          ))}
        </div>

        {/* Battle Arena */}
        <div className="pixel-box bg-purple-900/90 p-4 sm:p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            {['LuvBot 5000', 'Cupidrilla'].map((name) => (
              <div key={name} className="text-center w-1/3">
                <div
                  className={`pixel-box w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ${
                    name === 'LuvBot 5000' ? 'bg-pink-600' : 'bg-purple-600'
                  } mx-auto mb-2 flex items-center justify-center`}
                >
                  <Bot
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white bot-hover ${
                      currentRapper === (name === 'LuvBot 5000' ? 'LuvBot' : 'Cupidrilla')
                        ? 'animate-bounce'
                        : ''
                    }`}
                  />
                </div>
                <h2 className="text-white text-xs sm:text-sm pixel-font">{name}</h2>
              </div>
            ))}
          </div>

          {/* Battle Content */}
          <div className="space-y-4 mb-6 min-h-[150px] sm:min-h-[200px] overflow-y-auto max-h-[300px] sm:max-h-[400px] scrollbar-hide">
            {rapLines.map((line, index) => (
              <div
                key={index}
                className={`pixel-box p-3 text-xs sm:text-sm ${
                  line.startsWith('LuvBot')
                    ? 'bg-pink-900/50 text-pink-100 ml-auto w-[85%] sm:w-3/4'
                    : 'bg-purple-900/50 text-purple-100 w-[85%] sm:w-3/4'
                }`}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="text-center">
            {mode === 'rap' && (
              <button
                onClick={handleRapLine}
                className="pixel-box bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 text-sm sm:text-base hover:scale-105 transition-transform pixel-font"
              >
                Drop that cringe! 🎤
              </button>
            )}
            {mode === 'argument' && argumentTopic && (
              <button
                onClick={handleArgumentLine}
                className="pixel-box bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 text-sm sm:text-base hover:scale-105 transition-transform pixel-font"
              >
                Slam that argument! 🎤
              </button>
            )}
            {mode === 'flirt' && (
              <button
                onClick={handleFlirtLine}
                className="pixel-box bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 px-6 text-sm sm:text-base hover:scale-105 transition-transform pixel-font"
              >
                Drop that charm! 😘
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Argument Topic Popup */}
      {showArgumentPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20">
          <div className="pixel-box bg-purple-900 p-6 max-w-sm w-full">
            <h2 className="text-white text-xl mb-4 pixel-font">
              Enter a topic for the argument
            </h2>
            <input
              type="text"
              value={argumentTopic}
              onChange={(e) => setArgumentTopic(e.target.value)}
              className="w-full p-2 mb-4 pixel-box bg-purple-800 text-white"
              placeholder="Type your topic..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowArgumentPopup(false);
                  setArgumentTopic('');
                }}
                className="pixel-box px-4 py-2 text-white bg-gray-600 hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartArgument}
                className="pixel-box px-4 py-2 text-white bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 transition-transform"
              >
                Start Argument
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
