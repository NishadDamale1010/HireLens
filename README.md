<div align="center">
  <img src="https://img.icons8.com/nolan/128/resume.png" alt="HireLens Logo">
  
  # ✦ HireLens ✦
  
  **AI-Powered Applicant Tracking System (ATS) Analyzer & Resume Enhancer**
  
  [![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://hire-lens-alpha.vercel.app/)
  [![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)]()
  [![AI Powered](https://img.shields.io/badge/AI-Llama_3.3_|_Gemini_2.0-violet?style=for-the-badge)]()

  <p align="center">
    <i>An intelligent, fully responsive MERN-stack application that helps job seekers beat the ATS, discover hidden strengths, and dynamically rewrite their resumes using cutting-edge Generative AI.</i>
  </p>
</div>

---

## 🚀 Why HireLens?

In today's competitive job market, over 70% of resumes are rejected by an Applicant Tracking System (ATS) before a human ever sees them. **HireLens** bridges the gap between candidates and recruiters by providing instant, deep-learning-driven feedback on resumes. 

By integrating state-of-the-art Large Language Models (LLMs) with a sleek, glassmorphic UI, HireLens offers an unparalleled user experience for career advancement.

---

## ✨ Features That Stand Out

### 🧠 Intelligent ATS Analysis
- **Smart Parsing**: Seamlessly extracts text from both `.pdf` and `.docx` file formats.
- **Holistic Scoring**: Generates an accurate 0-100 ATS compatibility score using advanced LLM reasoning.
- **Deep Insights**: Identifies actionable strengths, critical weaknesses, and missing industry-standard skills.
- **Career Matching**: Suggests optimal job roles based on the parsed skill matrix.

### ✍️ AI-Powered Resume Rewriter
- **Context-Aware Enhancements**: Users can paste a weak bullet point and provide custom instructions (e.g., "Make it sound more technical"). 
- **Dynamic Output**: The AI immediately rewrites the section to emphasize action verbs, quantify achievements, and maximize professional impact.

### 📊 Persistent User Dashboard
- **Secure Authentication**: Robust JWT-based authentication with bcrypt password hashing.
- **Analysis History**: Logged-in users can view their past resume analyses over time, track improvements, and easily compare ATS scores.

### 📥 One-Click PDF Export
- Instantly export your detailed analysis report and rewritten resume sections into a high-quality PDF to share with mentors or keep for reference.

### ⚡ Resilient AI Architecture
- **Multi-Provider Fallback Mechanism**: Built with a highly reliable backend that dynamically routes AI requests between **Llama 3.3 70B** (via OpenRouter & Groq) and **Google Gemini 2.0 Flash**. If one provider goes down or rate-limits, the system automatically falls back to the next, guaranteeing 100% uptime for analysis requests.

---

## 💻 Tech Stack

### Frontend
- **React.js (Vite)**: For blistering fast rendering and optimized builds.
- **Tailwind CSS**: For a modern, responsive, and breathtaking glassmorphic UI design.
- **React Router**: For seamless, protected client-side navigation.
- **Axios**: For highly configured, interceptor-enabled API communication.
- **html2pdf.js**: For seamless client-side document generation.

### Backend
- **Node.js & Express.js**: For a scalable, non-blocking, asynchronous RESTful API.
- **MongoDB & Mongoose**: For schema-driven, flexible, NoSQL data storage.
- **Multer**: For robust handling of `multipart/form-data` and file uploads.
- **pdf-parse & mammoth**: For high-fidelity text extraction from PDFs and Word documents.
- **JSON Web Tokens (JWT) & bcryptjs**: For secure, stateless user authentication.

### AI Integration
- **LLM Engine**: Meta Llama 3.3 70B Instruct & Google Gemini 2.0 Flash.
- **Prompt Engineering**: Highly constrained, JSON-enforcing prompts to ensure programmatic reliability from LLM responses.

---

## 🛠️ Local Development Setup

To run HireLens locally, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/NishadDamale1010/HireLens.git
cd HireLens
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
OPENROUTER_API_KEY=your_openrouter_api_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:5173
```
Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000
```
Run the frontend server:
```bash
npm run dev
```

---

## 💡 System Design Highlights for Technical Recruiters

- **Separation of Concerns**: The application strictly adheres to the MVC (Model-View-Controller) architecture on the backend, ensuring maintainability and clean code.
- **Error Boundary & Graceful Degradation**: The UI gracefully handles API timeouts and AI service failures with informative fallback UI elements rather than hard crashing.
- **Security Best Practices**: Passwords are never stored in plain text. CORS is strictly configured. File uploads are temporarily stored in the OS temp directory and securely deleted via `fs.unlinkSync` inside a `finally` block to prevent memory leaks and storage bloating.
- **Performant UI**: Uses CSS hardware-accelerated animations, backdrop-filters, and conditional rendering to maintain a 60fps experience without blocking the main thread.

---

<div align="center">
  <p>Built with ❤️ by Nishad Damale.</p>
</div>