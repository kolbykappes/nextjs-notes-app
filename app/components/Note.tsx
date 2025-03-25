import type { Note as NoteType } from '../lib/mockdb/client';

interface NoteProps {
  note: NoteType;
  onEdit: (note: NoteType) => void;
  onDelete: (id: string) => void;
}

export default function Note({ note, onEdit, onDelete }: NoteProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{note.title}</h2>
        <div className="space-x-2">
          <button
            onClick={() => onEdit(note)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
      <div className="mt-4 text-sm text-gray-500">
        <p>Created: {new Date(note.created_at).toLocaleString()}</p>
        <p>Updated: {new Date(note.updated_at).toLocaleString()}</p>
      </div>
    </div>
  );
} 