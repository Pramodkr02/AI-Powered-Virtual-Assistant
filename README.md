# AI-Powered Virtual Assistant

A full-stack, voice-responsive virtual assistant application that allows users to create their own personalized AI assistant. Users can customize their assistant's name and avatar, and interact with it using natural language to perform various tasks such as searching the web, checking the date/time, or opening applications.

---

[**Live Website Link**](https://ai-powered-virtual-assistant.vercel.app/)

## 🚀 Features

### **Personalized Assistant**

- **Custom Identity**: Set a unique name and image for your AI assistant.
- **Dynamic Interactions**: Engaging voice and text-based responses powered by Google's Gemini AI.

### **Functional Commands**

- **Web Search**: Integrated Google and YouTube searching.
- **Media Playback**: Directly play videos or songs on YouTube.
- **Utility Tools**: Get the current time, date, day, and month.
- **App Launcher**: Open popular platforms like Facebook, Instagram, and local tools like a Calculator.
- **Weather Updates**: Real-time weather information (logic integrated).

### **User System**

- **Secure Authentication**: Robust Sign-Up and Sign-In system using JWT and Bcrypt.
- **Session Management**: Persistent sessions via secure HTTP-only cookies.
- **Profile Management**: Current user state managed through React Context API.

---

## 🛠️ Tech Stack

### **Frontend**

- **React (Vite)**: For a fast, modern UI development experience.
- **Tailwind CSS**: Premium, responsive styling with a focus on modern aesthetics.
- **React Router Dom**: Seamless navigation and protected routing.
- **Axios**: Efficient API communication with the backend.
- **React Icons**: High-quality UI icons.

### **Backend**

- **Node.js & Express**: Scalable and flexible server architecture.
- **MongoDB & Mongoose**: Fast and efficient NoSQL data storage.
- **Gemini AI SDK**: Powering the core intelligence of the virtual assistant.
- **Cloudinary**: Secure image hosting for custom assistant avatars.
- **Multer**: Handling file uploads for assistant images.
- **JWT (Json Web Token)**: Secure, stateless user authentication.
- **Moment.js**: Streamlined date and time formatting.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Cloudinary Account](https://cloudinary.com/) (For image uploads)
- [Gemini API Key](https://aistudio.google.com/) (For AI responses)

---

## ⚙️ Installation & Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/Pramodkr02/AI-Powered-Virtual-Assistant.git
cd AI-Powered-Virtual-Assistant
```

### **2. Backend Configuration**

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your credentials:
   ```env
   PORT=5000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### **3. Frontend Configuration**

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend application:
   ```bash
   npm run dev
   ```

---

## 🔌 API Endpoints

### **Authentication**

| Method | Endpoint           | Description            |
| :----- | :----------------- | :--------------------- |
| POST   | `/api/auth/signup` | Register a new user    |
| POST   | `/api/auth/signin` | Login existing user    |
| GET    | `/api/auth/logout` | Terminate user session |

### **User & Assistant**

| Method | Endpoint                   | Description                     |
| :----- | :------------------------- | :------------------------------ |
| GET    | `/api/user/current`        | Get logged-in user details      |
| POST   | `/api/user/update`         | Update assistant name and image |
| POST   | `/api/user/asktoassistant` | Interact with the AI assistant  |

---

## 🛡️ Project Structure

```text
VirtualAssistance/
├── backend/
│   ├── config/         # DB and Cloudinary configs
│   ├── controllers/    # Request handling logic
│   ├── middlewares/    # Auth and Multer middlewares
│   ├── models/         # MongoDB schemas
│   ├── routes/         # Express API routes
│   └── index.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI pieces
│   │   ├── context/    # Global state management
│   │   ├── pages/      # Main application screens
│   │   └── App.jsx     # Routing and core logic
│   └── index.html      # Entry point
└── README.md           # Documentation
```

---

## 🤝 Contribution

Contributions are welcome! If you'd like to improve the Virtual Assistant:

1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 👤 Author

**Pramod Kumar**

- GitHub: [@Pramodkr02](https://github.com/Pramodkr02)

---

Developed with ❤️ for a smarter assistant experience.
