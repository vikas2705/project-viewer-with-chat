# FileView - AI Chat with File Viewer 

A real-time AI chat application with an integrated file viewer, built with React, TypeScript, Express, and WebSockets. Features streaming AI responses powered by Google Gemini API.

## Features

- 🤖 Real-time AI chat with streaming responses
- 📁 Interactive file tree viewer
- 💬 WebSocket-based communication
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔄 Automatic reconnection handling
- ⚡ Fast development experience with Vite

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher) or **yarn**
- **Google Gemini API Key** (optional, for AI features)

## Project Structure

```
FileView-main/
├── agent-server/          # Backend WebSocket server
│   ├── src/
│   │   ├── handlers/      # Request handlers
│   │   ├── services/      # AI service integration
│   │   ├── utils/         # Utility functions
│   │   └── index.js       # Server entry point
│   └── package.json
│
└── agent-ui/              # Frontend React application
    ├── src/
    │   ├── components/    # React components
    │   ├── hooks/         # Custom hooks
    │   ├── types/         # TypeScript types
    │   └── constants/     # App constants
    └── package.json
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd FileView-main
```

### 2. Install Backend Dependencies

```bash
cd agent-server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../agent-ui
npm install
```

## Configuration

### Backend Environment Setup

1. Navigate to the `agent-server` directory:

```bash
cd agent-server
```

2. Create a `.env` file in the `agent-server` directory:

```bash
touch .env
```

3. Add the following environment variables to `.env`:

```env
# Google Gemini API Key (optional - app works without it using mock responses)
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port (optional - defaults to 8080)
PORT=8080
```

**Getting a Gemini API Key:**
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and paste it into your `.env` file

> **Note:** The application will work without an API key, but will use mock responses instead of real AI responses.

## Running the Application

### Option 1: Run Both Services Separately (Recommended for Development)

#### Terminal 1 - Start the Backend Server

```bash
cd agent-server

# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:8080` (or the port specified in `.env`).

#### Terminal 2 - Start the Frontend Development Server

```bash
cd agent-ui

# Start Vite dev server
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the next available port).

### Option 2: Run Both Services in Parallel

You can use a tool like `concurrently` to run both services in a single terminal:

1. Install `concurrently` globally (optional):

```bash
npm install -g concurrently
```

2. From the root directory, run:

```bash
concurrently "cd agent-server && npm run dev" "cd agent-ui && npm run dev"
```

## Usage

1. **Start the backend server** (Terminal 1)
2. **Start the frontend server** (Terminal 2)
3. **Open your browser** and navigate to `http://localhost:5173`
4. **Check connection status** - You should see "Connected" in the top-left of the chat panel
5. **Start chatting** - Type a message and press Enter

### Features Overview

- **Left Panel (Chat):**
  - Real-time AI conversation
  - Streaming response display
  - Connection status indicator
  - Auto-scroll to latest messages

- **Right Panel (File Viewer):**
  - Browse project files
  - View file contents with syntax highlighting
  - Expand/collapse folders
  - Random file selector

## Development Scripts

### Backend (`agent-server`)

```bash
npm start      # Start server in production mode
```

### Frontend (`agent-ui`)

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Troubleshooting

### Backend Issues

**WebSocket connection fails:**
- Ensure the backend server is running
- Check that the port matches in both frontend and backend
- Verify CORS is enabled (it should be by default)

### Frontend Issues

**Cannot connect to WebSocket:**
- Verify the backend server is running
- Check the `WEBSOCKET_URL` in `agent-ui/src/constants/index.ts`
- Default is `ws://localhost:8080` - ensure it matches your backend port

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Key Issues

**Mock responses instead of AI:**
- Check that `GEMINI_API_KEY` is set in `agent-server/.env`
- Verify the API key is valid
- Check server logs for error messages

## Production Build

### Build Frontend

```bash
cd agent-ui
npm run build
```

The production build will be in `agent-ui/dist/`.

### Run Production Server

```bash
cd agent-server
npm start
```

## Technology Stack

### Backend
- **Express.js** - Web framework
- **WebSocket (ws)** - Real-time communication
- **Google Generative AI** - AI responses
- **dotenv** - Environment configuration

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **WebSocket API** - Real-time communication

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

(README Generated via AI)