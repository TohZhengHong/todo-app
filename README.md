# Todo App

A comprehensive Todo application built with Next.js, React, and Radix UI.

## Features

This Todo app implements the features outlined in the Todo.md checklist:

### Core Features
- Task Management (add, edit, delete, complete)
- Organization (multiple lists, views)
- Basic UI Components (list view, detail view, navigation, search)

### Enhanced Features
- Date & Time Features (due dates)
- Task Enrichment (descriptions, priorities)
- Views & Sorting (sort by priority/due date)

## Tech Stack

- **Frontend**: Next.js with React
- **UI Components**: Radix UI for accessible components
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```
   cd todo-app
   ```
3. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
todo-app/
├── public/              # Static files
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   ├── lib/             # Utility functions
│   ├── models/          # Data models
│   └── utils/           # Helper functions
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md            # Project documentation
```

## Future Enhancements

The app is designed to be extended with more features from the Todo.md checklist, including:
- User authentication
- Cloud synchronization
- Collaboration features
- Mobile responsiveness
- Accessibility improvements
