# 💰 FinTrack – Expense Tracker Application

A modern, full-stack personal finance management application built with **Next.js**, **TypeScript**, and **MongoDB**, designed to help users track expenses, analyze spending patterns, and manage daily finances efficiently.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178c6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4ea94b?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-3c873a?style=for-the-badge&logo=nodedotjs&logoColor=white" />
</p>

---

## 📌 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Team Git Workflow](#team-git-workflow)
- [Contribution Guidelines](#contribution-guidelines)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

# 🌟 Overview
FinTrack is a collaborative expense-tracking application that helps users:

- Add, update, and delete expenses  
- Categorize transactions  
- Track monthly spending  
- Visualize analytics & insights  
- Securely store data using MongoDB  

This repository includes a **team-friendly Git workflow** for effective collaboration among multiple developers.

---

# 🚀 Features
- Expense CRUD operations  
- Category & date-based filtering  
- Monthly and yearly analytics  
- Dashboard UI using Next.js App Router  
- MongoDB database connectivity  
- Responsive design  
- Modular & scalable folder structure  

---

# 🛠 Tech Stack

| Layer | Technologies |
|------|--------------|
| **Frontend** | Next.js, React, TypeScript |
| **Backend** | Next.js API Routes |
| **Database** | MongoDB + Mongoose |
| **Tools** | Git, GitHub, pnpm / npm, VS Code |

---

# 📂 Folder Structure

```bash
project-root/
│
├── app/                     # Next.js App Router pages
│   ├── admin/
│   ├── auth/
│   ├── dashboard/
│   ├── api/
│   └── ...
│
├── components/              # UI components
├── hooks/                   # Custom hooks
├── lib/
│   └── mongodb/             # MongoDB connection utilities
│
├── public/                  # Static assets
├── styles/                  # Global styles
│
├── .env.local               # Environment variables (ignored in Git)
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── README.md
---
```


---

# 🚀 Getting Started

Follow the steps below to run the project locally.

---

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Expense-Tracker.git
cd Expense-Tracker
```
---

## 2️⃣ Install Dependencies

Using **npm** (recommended):
```bash
npm install
```

---

## 3️⃣ Set up Environment Variables

Create a `.env.local` file in the root of the project and add your MongoDB URI:
```bash
cp .env.local
```
Edit `.env.local` and add your MongoDB URI:
```bash
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_APP_NAME=FinTrack
JWT_SECRET=your_secret_key
```
---

## 4️⃣ Run the Development Server

```bash
pnpm dev
```
Open your browser and navigate to `http://localhost:3000` to see the application in action.

---

# 📜 Available Scripts
```bash
npm dev
npm build
npm start
npm run dev
```

---

# 👨‍💻 Team Git Workflow
## 1️⃣ Fork the Repository

Fork the repository to your GitHub account.

## 2️⃣ Clone the Forked Repository

Clone the forked repository to your local machine:
```bash
git clone https://github.com/Ramiz1323/Expense-Tracker.git
cd Expense-Tracker
```

## 3️⃣ Create a New Branch

Create a new branch for your feature or bug fix:
```bash
git checkout -b feature/your-feature
```

## 4️⃣ Make Changes

Make the necessary changes to the codebase. Commit your changes regularly:
```bash
git add .
git commit -m "Add your commit message"
```

## 5️⃣ Push Changes to Your Fork

Push your changes to your forked repository:
```bash
git push origin feature/your-feature
```

## 6️⃣ Create a Pull Request

Create a pull request from your feature branch to the main branch of the original repository:
```bash
git checkout main
git pull upstream main
git checkout feature/your-feature
git push origin feature/your-feature
```

## 7️⃣ Collaborate with Other Team Members

Collaborate with other team members by reviewing and commenting on pull requests.

## 8️⃣ Merge the Pull Request

Once your pull request is approved, merge it into the main branch of the original repository:
```bash
git checkout main
git pull upstream main
git merge feature/your-feature
git push upstream main
```

## 9️⃣ Delete the Branch

After merging the pull request, delete the feature branch from your forked repository:
```bash
git branch -d feature/your-feature
git push origin --delete feature/your-feature
```
---
# 🤝 Contribution Guidelines
Please follow these guidelines when submitting a pull request:

**Do NOT commit:**
- `node_modules/`
- `.next/`
- `.env` or `.env.local`

**Branching Rules**
- Never push directly to `main`
- Always create and work in feature branches

**Commit Standards**
- Write meaningful, descriptive commit messages

**Pull Requests**
- Always request a PR review before merging

**Code Quality**
- Keep the code modular, clean, and documented

---

## 🐞 Troubleshooting

### 🔸 MongoDB Not Connecting?
1. Verify your `MONGODB_URI` value  
2. Check MongoDB Atlas **IP Whitelist**  
3. Ensure `.env.local` exists and is correctly filled  
 ---