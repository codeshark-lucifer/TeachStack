# TreamExam - Exam Preparation Platform

TreamExam is a modern web application designed to help students prepare for exams through categorized questions and a personalized dashboard. Built with **Next.js 15+**, **TypeScript**, and **Firebase**.

## 🚀 Features

- **Secure Authentication**: User registration and login powered by Firebase Auth.
- **Interactive Dashboard**: Personalized student portal for tracking progress.
- **Question Management**: Categorized exam questions with a streamlined API.
- **Modern UI/UX**: Clean, responsive interface using Tailwind CSS 4 and Geist typography.
- **Real-time Data**: Instant updates using Firebase Realtime Database.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend as a Service**: [Firebase](https://firebase.google.com/) (Auth, Realtime Database, Admin SDK)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Fonts**: Geist Sans & Geist Mono

## 🏁 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm / yarn / pnpm / bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-TreamExam/dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Ensure your Firebase credentials are correctly configured in `app/lib/firebase-client.js`. For production, it is recommended to use environment variables in a `.env.local` file.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `app/api/`: RESTful API endpoints for categories and questions.
- `app/user/`: User-authenticated routes including the dashboard.
- `app/lib/`: Shared logic, Firebase initialization, and utility functions.
- `public/`: Static assets and icons.

## 🔌 API Documentation

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/categories` | `GET` | Retrieve all available exam categories. |
| `/api/category/[id]` | `GET` | Fetch details for a specific category. |
| `/api/questions/[id]` | `GET` | Get questions associated with a category ID. |

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---
Developed for **NUBB** - Project TreamExam.
