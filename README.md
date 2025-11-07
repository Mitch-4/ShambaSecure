# 🌿 ShambaSecure — Magic Link Authentication System

## 🔍 Overview
ShambaSecure is a secure authentication module built using **Flask** (Python) and **Firebase Authentication**.  
It implements a **passwordless login system** using **Magic Links**, allowing users to log in securely through their email without traditional passwords.  

This project is part of the **ShambaSecure Farmer Dashboard**, designed to enhance account security and accessibility for rural farmers.

## 🧠 Key Features
- 🔐 Passwordless login via Firebase Magic Links  
- 📨 Email-based authentication using Firebase Admin SDK  
- 🌍 RESTful Flask API for backend integration  
- ⚙️ Environment variable-based configuration for secure deployment  
- 🧾 JSON responses for easy frontend consumption  

## 🏗️ Tech Stack
| Layer | Technology |
|-------|-------------|
| Backend | Flask (Python) |
| Authentication | Firebase Authentication |
| Database | Firebase Firestore |
| Environment Management | Python `dotenv` |

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

git clone https://github.com/Mitch-4/ShambaSecure.git
cd ShambaSecure/backend

### 2️⃣ Create a virtual environment
python -m venv venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass # On Windows
venv\Scripts\Activate.ps1  # On Windows powershell
venv\Scripts\activate.bat # On Windows CMD
source venv/bin/activate # On Mac/Linux

### 3️⃣ Install dependencies
pip install -r requirements.txt

### 4️⃣ Run the Flask app
flask run or python app.py

### 5️⃣Once the backend is running locally, the frontend can now connect to it.
Open a new terminal tab/window
Go to the frontend (cd prototype-frontend)
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
Start it with (npm run dev)
Then click the link- local: (link)

## 🚀 How It Works
-User enters their email on the login page.
-Flask sends a request to Firebase to generate a magic link.
-The user receives the link via email and clicks it.
-The link verifies the user’s identity and logs them in automatically.

## Project demo

All images used for the project demo are stored in the `assets/` folder at the root of this repository.  
This includes:
- `login interface.png` — This module allows farmers to securely access the system using their registered email addresses through a passwordless magic link authentication method.
- `magic link email.png` — Shows the automatically generated email sent to farmers containing the unique authentication link that expires after five minutes for enhanced security.
- `dashboard homepage.png` — The central interface where farmers can view key greenhouse data and metrics after successful authentication.

