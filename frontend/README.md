# Medical Chatbot - Next.js & shadcn/ui Frontend

A medical chatbot interface built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui-styled components**, matching the clinical UI layout with dark/light theme support.

## Features

- **Pixel-Accurate UI Matching the Design**:
  - Medical header with plus emblem and status badge (`● Connected` / `Checking...`)
  - Prominent gold/amber disclaimer banner: *"Educational guidance only. Not a diagnosis. For severe symptoms, contact emergency services."*
  - Structured chat bubble history with formatted answers and cited source pills (`[PDF p.N]` / web references)
  - Bottom action toolbar:
    - 📎 **Image**: Upload JPEG/PNG/WebP with visual thumbnail preview & removal
    - 📷 **Camera**: Real-time webcam capture dialog
    - 🎤 **Voice**: Speech recognition and dictation
    - 🔊 **Read answer**: Speech synthesis to listen to clinical guidance
    - **Send ➜**: Vibrant indigo/purple gradient action button
  - Collapsible `▶ API access (optional)` drawer for API Token and FastAPI backend endpoint
- **Dark & Light Mode**:
  - Full theme toggle powered by `next-themes` (defaults to the sleek dark clinical aesthetic from the mockup, with instant light mode toggle)
- **Modular, Reusable Components**:
  - `src/components/ui/button.tsx`: Variant-driven button component with gradient and pill styles
  - `src/components/ui/badge.tsx`: Status indicator badges
  - `src/components/ui/textarea.tsx` & `input.tsx`: Inputs with focus rings and accessible labels
  - `src/components/ui/theme-toggle.tsx`: Smooth sun/moon theme switcher
  - `src/components/chat/chat-header.tsx`: Header with title, subtitle, and live status
  - `src/components/chat/disclaimer-banner.tsx`: Clinical advisory banner
  - `src/components/chat/message-bubble.tsx`: Reusable message bubbles with copy & read triggers
  - `src/components/chat/message-list.tsx`: Auto-scrolling conversation timeline with quick suggestions
  - `src/components/chat/chat-input-toolbar.tsx`: Text input and multimodal controls
  - `src/components/chat/camera-modal.tsx`: Webcam snapshot modal
  - `src/components/chat/api-settings.tsx`: Optional token and backend connection drawer
- **Seamless Dual-Mode Backend Integration**:
  - Out of the box, includes high-fidelity clinical responses with simulated Gale Encyclopedia citations for immediate standalone testing.
  - Automatically proxies to your running FastAPI backend at `http://127.0.0.1:8000` for live retrieval, Pinecone vector search, Tavily web search, and Whisper voice transcription.

## Getting Started

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Connecting to the Python Backend

Start the FastAPI backend in another terminal:
```bash
cd backend
source .venv/bin/activate  # or conda activate project
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
The Next.js frontend will automatically connect to `http://127.0.0.1:8000`. You can also configure a custom URL or token directly from the collapsible "API access (optional)" toggle in the chat interface.
