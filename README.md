# NoteHub - Learning Notes Management Application

A full-stack web application for organizing and managing learning notes with directories, code snippets, and collaborative features.

## 🚀 Features

- 📁 **Directory Management** - Organize notes into directories
- 📝 **Rich Note Taking** - Create notes with descriptions, code, and images
- 🎨 **Difficulty Levels** - Mark notes as Easy, Medium, or Hard
- 🤝 **Collaboration** - Collaborative editing and sharing
- 🔐 **User Authentication** - Secure login and registration
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🎤 **Speech to Text** - Convert audio to text for notes
- 🗑️ **Easy Deletion** - Delete notes and directories with confirmation dialogs
- 💾 **Persistent Data** - All data saved to MongoDB

## 📋 Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account (free tier available)
- ImageKit account (for image uploads)

## 🛠️ Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/vivekrqwat/notehub2.git
cd notehub2
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory (copy from `.env.example`):
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=8000
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🚀 Deployment on Render

### Prerequisites
- GitHub account with the repository pushed
- Render account (free at https://render.com)
- MongoDB Atlas account for database
- ImageKit account for image uploads

### Step-by-Step Deployment

1. **Push to GitHub** (Already done ✅)
   - Your code is at: https://github.com/vivekrqwat/notehub2

2. **Create MongoDB Atlas Database**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get your connection string (MONGODB_URI)

3. **Create ImageKit Account** (Optional, for image uploads)
   - Go to https://imagekit.io
   - Get your API credentials

4. **Deploy on Render**
   - Go to https://render.com and sign up
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure as follows:

   **For Backend:**
   - Name: `notehub-backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
   - Add Environment Variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Generate a strong secret key
     - `PORT`: 8000
     - `NODE_ENV`: production

   **For Frontend:**
   - Name: `notehub-frontend`
   - Runtime: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run preview`
   - Root Directory: `frontend`
   - Add Environment Variables:
     - `VITE_API_URL`: Your deployed backend URL (e.g., https://notehub-backend.onrender.com)

5. **Update CORS Settings in Backend**
   - Update `backend/index.js` CORS origin with your frontend URL

6. **Deploy**
   - Click "Deploy"
   - Wait for both services to deploy (5-10 minutes)
   - Access your app using the provided URLs

## 📁 Project Structure

```
notehub/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── Routes/           # API endpoints
│   ├── utils/            # Utilities and middleware
│   ├── index.js          # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── Components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand state management
│   │   ├── utils/        # Utility functions
│   │   └── App.jsx       # Main app component
│   └── package.json
├── .gitignore
├── render.yaml           # Render deployment config
└── README.md
```

## 🔑 Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=8000
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## 🛡️ Security Notes

- **Never commit `.env` files** - Use `.env.example` as reference
- **Regenerate secrets** if they were exposed
- **Use strong JWT secrets** - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- **Enable HTTPS** - Render automatically provides SSL certificates
- **Validate inputs** - All user inputs are validated on backend

## 📚 API Endpoints

### Users
- `POST /apii/user/signup` - Register new user
- `POST /apii/user/login` - Login user
- `GET /apii/user/:id` - Get user profile

### Directories
- `POST /apii/dir` - Create directory
- `GET /apii/dir/:uid` - Get user's directories
- `DELETE /apii/dir/:id` - Delete directory

### Notes
- `POST /apii/notes` - Create note
- `GET /apii/notes/:id` - Get notes by directory
- `PUT /apii/notes/:id` - Update note
- `DELETE /apii/notes/:id` - Delete note

### Posts (Discussion)
- `POST /apii/post` - Create post
- `GET /apii/post` - Get all posts
- `DELETE /apii/post/:id` - Delete post

## 🧰 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- Zustand (State Management)
- Axios (HTTP Client)
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- ImageKit (Image Uploads)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 📞 Support

For support, email vivekrqwat@gmail.com or open an issue on GitHub.

## 🎉 Happy Learning!

Start organizing your notes today with NoteHub!
