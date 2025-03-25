'use client';

import { useState, useEffect } from 'react';
import type { Note as NoteType } from './lib/mockdb/client';
import Note from './components/Note';
import NoteForm from './components/NoteForm';

export default function Home() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<NoteType | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const validateInput = (text: string): boolean => {
    // Check for common SQL injection patterns
    const sqlInjectionPattern = /('|"|;|--|\/\*|\*\/|xp_|EXEC|UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER)/i;
    return !sqlInjectionPattern.test(text);
  };

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  // Create note
  const handleCreateNote = async (title: string, content: string) => {
    try {
      if (!validateInput(title) || !validateInput(content)) {
        setError('Invalid input detected');
        return;
      }

      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (!response.ok) throw new Error('Failed to create note');
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setIsCreating(false);
    } catch (err) {
      setError('Failed to create note');
    }
  };

  // Update note
  const handleUpdateNote = async (title: string, content: string) => {
    if (!editingNote) return;

    try {
      if (!validateInput(title) || !validateInput(content)) {
        setError('Invalid input detected');
        return;
      }

      const response = await fetch(`/api/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) throw new Error('Failed to update note');
      const updatedNote = await response.json();
      setNotes(notes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      ));
      setEditingNote(null);
    } catch (err) {
      setError('Failed to update note');
    }
  };

  // Delete note
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');
      setNotes(notes.filter(note => note.id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
          <button
            onClick={() => {
              setError(null);
              fetchNotes();
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
          {!isCreating && !editingNote && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              New Note
            </button>
          )}
        </div>

        {isCreating && (
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsCreating(false)}
          />
        )}

        {editingNote && (
          <NoteForm
            note={editingNote}
            onSubmit={handleUpdateNote}
            onCancel={() => setEditingNote(null)}
          />
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No notes yet. Create your first note!
              </p>
            ) : (
              notes.map(note => (
                <Note
                  key={note.id}
                  note={note}
                  onEdit={setEditingNote}
                  onDelete={handleDeleteNote}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
