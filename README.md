# 🤖 AI-CHATBOT  

### 🌐 Unified Chat Platform for ChatGPT & Gemini  

AI-CHATBOT is an intelligent web application that allows users to interact with **both ChatGPT** and **Google Gemini** from a single platform.  
It delivers a sleek, user-friendly interface with modern features such as dark/light mode, response regeneration, chat deletion, and link sharing — all powered by real-time API integrations.

---

## 🧠 Problem Statement  

With multiple AI assistants available online, users often need to switch between platforms like ChatGPT and Gemini to access different AI models.  
This process is time-consuming and creates a fragmented experience.  

---

## 💡 Solution  

AI-CHATBOT provides a **unified AI experience**, letting users chat with both models in one place.  
It enhances usability through efficient API handling, interactive features, and a responsive interface, making AI-powered conversations simpler and more accessible.

---

## ✨ Key Features  

- 💬 Chat with **ChatGPT** and **Gemini** using their respective APIs  
- 🔁 **Regenerate responses** instantly  
- 🔗 **Copy and share** chat links  
- ⏹️ **Stop** message generation mid-way  
- 🌓 **Toggle between light & dark mode**  
- 🗑️ **Delete chats** anytime  
- ⚡ **Responsive design** built using Tailwind CSS  

---

## 🧱 Tech Stack  

**Frontend:**  
- React.js  
- Tailwind CSS  
- React Router DOM  

**Backend:**  
- Node.js  
- Express.js  
- Axios  

**Additional Tools & Libraries:**  
- JSON Web Token (JWT)  
- bcrypt.js  
- express-rate-limit  
- morgan  

---

## ⚙️ Setup Instructions  

### 🔹 Prerequisites  
- Node.js (v18 or later)  
- npm (Node Package Manager)  

---

### 🔹 Step 1: Clone the Repository  
```bash
git clone https://github.com/<your-username>/AI-CHATBOT.git
cd AI-CHATBOT
```
🔹 Step 2: Install Dependencies
Install all required dependencies using:


```bash
npm install
```
🔹 Step 3: Setup Environment Variables
Create a .env file in the root directory and add your API keys:

ini
Copy code
```
OPENAI_API_KEY=your_chatgpt_api_key
GEMINI_API_KEY=your_gemini_api_key
```
⚠️ Replace the keys with your actual API credentials.

🔹 Step 4: Run the Project
Since the project includes frontend and backend, open two terminals:

Terminal 1 – Run Backend

bash
Copy code
```
cd backend
npm start
```
Terminal 2 – Run Frontend

bash
Copy code
```
cd frontend
npm start
```
After both servers start successfully, open:
👉 http://localhost:3000

🧩 Project Structure
pgsql
Copy code
AI-CHATBOT/
├── backend/
│   ├── server.js
│   ├── routes/
│   └── controllers/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── .env
├── .gitignore
├── package.json
└── README.md
📦 Dependencies
🛠️ Production
axios

bcryptjs

express-rate-limit

jsonwebtoken

morgan

react-router-dom

🧰 Development
autoprefixer

postcss

rollup

tailwindcss

💻 Usage
Start both frontend and backend servers.

Enter your query in the input box.

Choose whether to send it to ChatGPT or Gemini.

Regenerate, stop, or delete chats as needed.

Toggle between dark and light modes for comfort.

📸 Screenshots::
1. Signup Page:
<img width="1918" height="856" alt="image" src="https://github.com/user-attachments/assets/c3cfd89b-1ab7-4677-8794-7d818c99be62" />
2. Main Page:
<img width="1919" height="867" alt="image" src="https://github.com/user-attachments/assets/e75888ba-d8a3-400e-b0aa-06c4a6a823b0" />



markdown
Copy code
```
![Chat Interface](screenshots/chat.png)
![Dark Mode](screenshots/darkmode.png)
```
👨‍💻 Developers Info
Name: Satyam Gupta and Aryan Sharma
UID: 23BCS13673 and 23BCS10279
Class: 633'A'

Project: AI-CHATBOT
Course: B.Tech CSE
Submitted To: Prof. Shriya Dogra

🏁 Conclusion
AI-CHATBOT integrates the capabilities of both ChatGPT and Google Gemini into a single, cohesive platform.
It simplifies communication with AI, offering flexibility, accessibility, and an elegant interface — reflecting the power of modern full-stack development.

⭐ If you found this project helpful, don’t forget to give it a star on GitHub!

