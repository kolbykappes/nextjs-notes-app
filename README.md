# Next.js Notes App

A simple note-taking application built with Next.js, deployed on Vercel, with a mocked database layer for initial development.

## Project Overview

This project demonstrates how to build a full-stack web application using Next.js that allows users to create, read, update, and delete notes. The app uses:

- **Next.js** as the React framework
- **Mock Database Layer** for initial development (with easy transition to Vercel Postgres later)
- **Tailwind CSS** for styling
- **Next.js API Routes** for backend functionality

## Prerequisites

Before starting this project, you should have:

- Node.js installed (version 18.x or later)
- npm or yarn installed
- A GitHub account
- A Vercel account (free tier is fine)
- Cursor AI installed (recommended for coding assistance)



## Getting Started

1. Configure your cursor rules - there are a total of three that need to be setup
   - core.md - rules for all requests
   - react-next-rules.md - frontend rules
   - typescript-api-rules.md - backend rules

2. Create a new Next.js project:
   ```powershell
   npx create-next-app@latest nextjs-notes-app
   cd nextjs-notes-app
   ```
   
   When prompted, select the following options:
   - Would you like to use TypeScript? › Yes
   - Would you like to use ESLint? › Yes
   - Would you like to use Tailwind CSS? › Yes
   - Would you like to use `src/` directory? › No
   - Would you like to use App Router? › Yes
   - Would you like to customize the default import alias? › No

3. Install dependencies:
   ```powershell
   npm install
   # or
   yarn install
   ```

4. Run the development server:
   ```powershell
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
nextjs-notes-app\
├── app\                  # Next.js 13+ App Router
│   ├── api\              # API routes
│   │   └── notes\        # Notes API endpoints
│   ├── components\       # React components
│   ├── lib\              # Utility functions and mock DB client
│   │   └── mockdb\       # Mock database implementation
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Root layout
├── public\               # Static assets
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Features

- Create new notes with a title and content
- View a list of all notes
- View a single note in detail
- Edit existing notes
- Delete notes
- Responsive design that works on mobile and desktop

## Mock Database Implementation

For initial development, we'll implement a simple mock database layer that mimics the behavior of a real database but stores data in memory (with persistence to localStorage in the browser). This approach allows for:

- Faster development without database setup
- Easy testing on local environment
- Simple transition to a real database later

### Mock Database Schema

```typescript
// Type definition for a Note
export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
```

### Mock Database Client

We'll create a mock database client with methods that mimic SQL operations:

```typescript
// Sample implementation (to be expanded)
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
```

## Transitioning to a Real Database

When you're ready to move to a real database like Vercel Postgres:

1. Create a new database schema (same as the mock implementation)
2. Implement a real database client using the same interface
3. Update the imports in your API routes to use the real client
4. Deploy with proper environment variables

## Publishing to GitHub and Deployment

1. Initialize a Git repository (if not already done by create-next-app):
   ```powershell
   git init
   ```

2. Create a new repository on GitHub (without initializing with README, license, or gitignore)

3. Add your files and make your first commit:
   ```powershell
   git add .
   git commit -m "Initial commit: Basic Next.js Notes App with mock DB layer"
   ```

4. Add the remote GitHub repository and push:
   ```powershell
   git remote add origin https://github.com/your-username/nextjs-notes-app.git
   git push -u origin main
   ```
   Note: If your default branch is named "master" instead of "main", use that instead.

5. Log in to your Vercel account
6. Create a new project and import your GitHub repository
7. Deploy the application
8. Your application will be live at `https://your-project-name.vercel.app`

## Development Steps

This project will be built in stages:

1. Setting up the Next.js project with create-next-app
2. Configuring Tailwind CSS
3. Creating the mock database layer
4. Building the API routes
5. Creating UI components
6. Implementing CRUD functionality
7. Styling the application
8. Testing and deployment
9. (Optional) Migrating to a real database

## Using Cursor AI for Development

After setting up your initial project structure and before pushing to GitHub, we'll use Cursor AI to help with code generation. Some tips:

- Use specific prompts that describe exactly what you need
- Review and understand the generated code before implementing it
- Use Cursor to help debug issues and suggest improvements
- Use `Ctrl+K` to activate Cursor AI in VS Code
- Use `/` commands to access specific Cursor features
- Try `/explain` to understand complex code sections
- Use `/edit` for specific code modifications

## VS Code Shortcuts for Windows

- `Ctrl+Shift+P`: Command palette
- `Ctrl+P`: Quick file navigation
- `Ctrl+Space`: Trigger intellisense
- `Alt+Shift+F`: Format document
- `F5`: Start debugging
- `Ctrl+\`: Split editor
- `Ctrl+K Z`: Zen mode

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [VS Code Shortcuts for Windows](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-windows.pdf)
- [Cursor AI Documentation](https://cursor.sh/docs)