'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { useUser } from '@clerk/nextjs';


export default function Home() {
  const { user } = useUser();
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [output, setOutput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onresult = (event) => {
          const speechText = event.results[0][0].transcript;
          setText((prev) => `${prev} ${speechText}`.trim());
          toast.success('🎤 Voice input added');
        };

        recognition.onerror = (e) => {
          console.error('Speech recognition error:', e);
          toast.error('Voice input error');
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        toast.error('Speech recognition not supported');
      }
    }
  }, []);

  const startListening = () => {
    if (!user) {
      toast.error('You need to sign in to save inputs.');
      return;
    }
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
      toast('Listening... 🎙️');
    }
  };

  const addNote = async () => {
    if (!user) {
      toast.error('You need to sign in to save notes.');
      return;
    }
    await fetch('/api/add-note', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: { 'Content-Type': 'application/json' },
    });
    setText('');
    toast('Note saved!',
      {
        icon: '📝',
        style: {
          borderRadius: '5px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  };

  const askAI = async () => {
    if (!user) {
      toast.error('You need to sign in to ask questions.');
      return;
    }
    const res = await fetch('/api/query-note', {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
    // If 401 or other errors:
    const errText = await res.text();
    setOutput(`Error: ${errText}`); 
    return;
  }
    const data = await res.json();
    setOutput(data.result || data.error);
  };

  return (
    <main className="p-6 font-sans">
      <h1 className="text-4xl mb-4 font-serif flex justify-center 
      bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent"> [SECOND BRAIN] </h1>

      <p className="mb-6 text-gray-400">Welcome, {user?.firstName || 'there'}! Save your thoughts by typing or speaking.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-3 border mb-3"
      />
      <button onClick={addNote} className="bg-white text-black px-4 py-2 rounded mb-6 hover:opacity-90">
        Save Note
      </button>
      <button
          onClick={startListening}
          className={`${
            isListening ? 'bg-black text-white border-white ' : 'bg-white text-black'
          } hover:opacity-90 px-4 py-2 rounded ml-1`}
        >
          {isListening ? 'Listening...' : 'Voice Input'}
      </button>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask anything (e.g. What did I do yesterday?)"
        className="w-full p-3 border mb-3"
      />
      <button onClick={askAI} className="bg-white text-black px-4 py-2 rounded hover:opacity-90">
        Ask Memory
      </button>

      {output && (
        <div className="mt-6 bg-white text-black p-4 rounded">
          <strong>🧠 AI Response:</strong>
          <p>{output}</p>
        </div>
      )}
    </main>
  );
}
