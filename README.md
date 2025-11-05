
---

# 🌿 ShambaSecure — Magic Link Authentication System

## 🔍 Overview
ShambaSecure is a secure authentication module built using **Flask** (Python) and **Firebase Authentication**.  
It implements a **passwordless login system** using **Magic Links**, allowing users to log in securely through their email without traditional passwords.  

This project is part of the **ShambaSecure Farmer Dashboard**, designed to enhance account security and accessibility for rural farmers.

---

## 🧠 Key Features
- 🔐 Passwordless login via Firebase Magic Links  
- 📨 Email-based authentication using Firebase Admin SDK  
- 🌍 RESTful Flask API for backend integration  
- ⚙️ Environment variable-based configuration for secure deployment  
- 🧾 JSON responses for easy frontend consumption  

---

## 🏗️ Tech Stack
| Layer | Technology |
|-------|-------------|
| Backend | Flask (Python) |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| Environment Management | Python `dotenv` |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Mitch-4/ShambaSecure.git
cd ShambaSecure/backend

---

### 2️⃣ Create a virtual environment
python -m venv venv
venv\Scripts\activate  # On Windows
source venv/bin/activate  # On Mac/Linux

---

### 3️⃣ Install depemdencies
pip install -r requirements.txt

---

### 4️⃣ Set up Firebase Admin SDK
Go to Firebase Console
Create a project → Enable Email Link (passwordless sign-in) under Authentication
Generate a service account key (JSON) and place it in the backend directory
Rename it to firebase_key.json

---

### 5️⃣Create a .env file
FIREBASE_CREDENTIALS=firebase_key.json
FLASK_ENV=development
SECRET_KEY=your_secret_key

---

### 6️⃣ Run the Flask app
flask run or python app.py

---

### 7️⃣Once the backend is running locally, the frontend can now connect to it.
Open a new terminal tab/window
Go to the frontend (cd prototype-frontend)
Start it with (npm run dev)


---

##🚀 How It Works
-User enters their email on the login page.
-Flask sends a request to Firebase to generate a magic link.
-The user receives the link via email and clicks it.
-The link verifies the user’s identity and logs them in automatically.
