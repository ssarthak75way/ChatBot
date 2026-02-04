# AI Chat Bot - Advanced Conversational Platform

A premium AI-powered chat application built with a modern tech stack, featuring secure authentication, real-time session tracking, and multimodal voice capabilities.

## 🚀 Key Features

- **Advanced Authentication**: Secure login/signup system using **JWT Access & Refresh Tokens**.
- **Real-time Session Tracking**: A live countdown timer in the navbar keeps you informed of your remaining session time.
- **Silent Token Refresh**: Automatic session renewal in the background via Axios interceptors.
- **Voice Chat**: Transcribe and process audio messages using **Gemini 1.5 Flash**'s multimodal capabilities.
- **Streaming Responses**: Real-time AI response generation using **Server-Sent Events (SSE)**.
- **Markdown Support**: Rich text rendering for AI responses including code blocks, tables, and lists.
- **Multi-Chat Management**: Create, list, rename, and delete conversation threads easily.
- **Modern UI/UX**: Built with **Material UI (MUI)** following premium design principles.

## 🛠️ Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for lightning-fast builds
- **Material UI (MUI) v7** for styling
- **React Router Dom v7** for navigation
- **React Hook Form** + **Zod** for form validation
- **Axios** with custom interceptors

### Backend
- **Node.js** & **Express** with **TypeScript**
- **MongoDB** with **Mongoose**
- **Google Generative AI SDK** (Gemini 1.5 Flash)
- **JSON Web Tokens (JWT)** for secure sessions
- **Multer** for audio processing

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Gemini API Key](https://aistudio.google.com/)

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/ssarthak75way/ChatBot.git
cd CHATBOT
```

### 2. Backend Configuration
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_base_secret
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Frontend Configuration
Navigate to the `frontend` directory and install dependencies:
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Running the Application
**Start Backend:**
```bash
cd backend
npm run dev
```
**Start Frontend:**
```bash
cd frontend
npm run dev
```

## 🔐 Security Information

- **Access Tokens**: Short-lived (default 30 min) for security.
- **Refresh Tokens**: Long-lived (default 7 days) stored in the database for session persistence.
- **Auto-Logout**: The application automatically clears local storage and redirects to login when the session definitively expires.

## 🎤 Voice Chat Usage
Click the **Microphone icon** in the chat input to start recording. Stop the recording to automatically send the audio. The system will transcribe your speech and generate a relevant AI response.

## 📄 License
This project is licensed under the MIT License.
