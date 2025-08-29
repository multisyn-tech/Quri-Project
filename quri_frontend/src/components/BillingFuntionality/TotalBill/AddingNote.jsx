import React, { useState, useEffect } from 'react';
import { RiAddLine } from "react-icons/ri";

export default function AddingNote() {
  const [inputVisible, setInputVisible] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [savedNote, setSavedNote] = useState('');

  useEffect(() => {
    const storedNote = localStorage.getItem('userNote') || '';
    if (storedNote) {
      setSavedNote(storedNote);
    }
  }, []);

  const handleAddClick = () => {
    localStorage.setItem('userNote', noteText);
    setSavedNote(noteText);
    setNoteText('');
    setInputVisible(false);
  };

  return (
    <div className="relative px-6">
      {!inputVisible && savedNote ? (
        <div className="mb-3">
          <h1 className="font-medium text-xl">Your Note</h1>
          <p className="mt-2 whitespace-pre-wrap border p-3 rounded">{savedNote}</p>
        </div>
      ) : !inputVisible ? (
        <div className='mb-3 d-flex justify-content-between align-items-center'>
          <h1 className='font-medium text-xl'>Add Note</h1>
          <button onClick={() => setInputVisible(true)}>
            <RiAddLine size={20} />
          </button>
        </div>
      ) : (
        <div className="mb-3 d-flex flex-column">
          <textarea
            maxLength={200}
            rows={4}
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            placeholder="Type your note here (max 200 chars)"
            className="border p-2 mb-2 resize-none"
          />
          <button
            onClick={handleAddClick}
            disabled={!noteText.trim()}
            className="btn btn-dark"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
