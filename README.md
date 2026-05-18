# Layout Agent

A chat-based AI layout agent that lets you modify design JSON using natural language. Built with React + Vite (frontend), Express (backend), and Claude Sonnet (LLM).

## Demo

Ask things like:
- *"Convert this design to 9:16"*
- *"Move the headline to the top"*
- *"Make the headline smaller"*
- *"Move the offer badge higher"*
- *"Keep the product large"*
- *"Change the headline color to orange"*
- *"Make the discount badge bigger"*
- *"Center the product"*

Follow-ups work too — *"make it even smaller"*, *"now move it to the left"*.

---

## Prerequisites

- Node.js v18 or newer
- An [Anthropic API key](https://console.anthropic.com/) it is not free 
so i used GROQ_API_KEY(https://console.groq.com/keys)

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/varshitha8523/layout-agent.git
cd layout-agent
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your groq_API_KEY
```

### 3. Set up the frontend

```bash
cd ../client
npm install
```

### 4. Run both servers

In one terminal (backend):
```bash
cd server
npm run dev
```

In another terminal (frontend):
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Tech Stack

| Layer    | Tool                                         |
|----------|----------------------------------------------|
| Frontend | React 18 + Vite                              |
| Backend  | Node.js + Express                            |
| LLM      | groq                                         |
| State    | React useState hook                          |
| Preview  | Absolute-positioned divs (normalized coords) |

---

## Project Structure

```
layout-agent/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── ChatWindow.jsx       # Message list
│       │   ├── ChatInput.jsx        # Input + suggestion chips
│       │   ├── WireframePreview.jsx # Visual layout preview
│       │   └── JsonViewer.jsx       # Collapsible JSON display
│       ├── data/
│       │   └── initialLayout.json   # Provided design JSON
│       ├── hooks/
│       │   └── useLayoutAgent.js    # Chat + layout state logic
│       └── utils/
│           └── api.js               # Axios wrapper
│
└── server/                    # Express backend
    ├── routes/
    │   └── chat.js                  # POST /api/chat
    ├── services/
    │   ├── llmService.js            # Anthropic SDK wrapper
    │   └── layoutTransforms.js      # resizeArtboard, moveNode, scaleNode
    ├── prompts/
    │   └── systemPrompt.js          # Engineered system prompt
    └── utils/
        └── jsonValidator.js         # Layout validation
```

---

## Example Prompts to Try

```
Convert this design to 9:16
Keep the product large
Move the headline to the top
Move the offer badge higher
Make the headline smaller
Change the headline color to orange
Make the discount badge bigger
Center the product
Now move it to the left
Make it even smaller
```
