// Type definition for a Note
export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export class MockDbClient {
  private notes: Note[] = [];
  
  constructor() {
    // Initialize with some sample data
    this.loadFromStorage();
  }
  
  private loadFromStorage() {
    // In browser environments, load from localStorage
    if (typeof window !== 'undefined') {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        this.notes = JSON.parse(savedNotes);
      } else {
        // Initialize with sample data
        this.notes = [
          {
            id: '1',
            title: 'Welcome to Notes App',
            content: 'This is a sample note. You can create, edit, and delete notes.',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        this.saveToStorage();
      }
    }
  }
  
  private saveToStorage() {
    // In browser environments, save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('notes', JSON.stringify(this.notes));
    }
  }
  
  async getAllNotes(): Promise<Note[]> {
    return [...this.notes];
  }
  
  async getNoteById(id: string): Promise<Note | null> {
    const note = this.notes.find(note => note.id === id);
    return note || null;
  }
  
  async createNote(title: string, content: string): Promise<Note> {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.notes.push(newNote);
    this.saveToStorage();
    return newNote;
  }
  
  async updateNote(id: string, title: string, content: string): Promise<Note | null> {
    const index = this.notes.findIndex(note => note.id === id);
    if (index === -1) return null;
    
    this.notes[index] = {
      ...this.notes[index],
      title,
      content,
      updated_at: new Date().toISOString()
    };
    
    this.saveToStorage();
    return this.notes[index];
  }
  
  async deleteNote(id: string): Promise<boolean> {
    const initialLength = this.notes.length;
    this.notes = this.notes.filter(note => note.id !== id);
    this.saveToStorage();
    return this.notes.length < initialLength;
  }
}

// Create and export a singleton instance
export const mockDbClient = new MockDbClient(); 