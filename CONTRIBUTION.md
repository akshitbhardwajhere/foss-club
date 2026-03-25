# Contributing to FOSS Club NIT Srinagar

First off, thank you for considering contributing to the FOSS Club NIT Srinagar website! It's people like you that make FOSS such a great community.

This document outlines the process for contributing to our repository.

## 🚀 Getting Started

### 1. Prerequisites
Before you begin, ensure you have the following installed on your machine:
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Git

You will also need:
- Cloudinary Account (for image/document uploads)
- Mailjet Account (for automated emails)
- Google Service Account (for Sheets API integration)

### 2. Fork and Clone
1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/foss-club.git
   cd foss-club
   ```
3. **Add the original repository** as an upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/foss-club.git
   ```

### 3. Setup the Project
The project is divided into a Next.js `client` and an Express `server`.

#### Backend (`server`)
```bash
cd server
npm install
cp .env.example .env
# Fill in your .env variables (Database URL, JWT Secret, Cloudinary, Mailjet, Google credentials)
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

#### Frontend (`client`)
```bash
cd ../client
npm install
npm run dev
```

## 🌿 Branching Strategy

We follow a standard Git workflow. Always create a new branch for your work:

- **Features**: `feature/your-feature-name` (e.g., `feature/dark-mode`)
- **Bug Fixes**: `bugfix/issue-description` (e.g., `bugfix/header-alignment`)
- **Documentation**: `docs/update-readme`

```bash
git checkout -b feature/your-feature-name
```

## 💻 Coding Guidelines

- **Frontend (Next.js/React)**:
  - We use **Tailwind CSS v4** for styling and **Framer Motion** for animations.
  - Utilize **Radix UI** primitives and Shadcn UI components where applicable for accessibility.
  - State management handles complex states using **Redux Toolkit**.
- **Backend (Express/Prisma)**:
  - Keep controllers cleanly separated from routes.
  - Use **Zod** for schema validations.
  - Never commit your `.env` secrets or Google Services JSON files.
- **General**:
  - Run `npm run lint` before committing if applicable.
  - Write clear and descriptive commit messages.

## 📥 Submitting a Pull Request (PR)

1. **Sync your fork** with the upstream repository before opening a PR:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```
2. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. **Open a Pull Request**:
   - Go to the original repository and click "New Pull Request".
   - Select your feature branch.
   - Provide a detailed description of your changes, including any relevant issue numbers (e.g., `Fixes #12`).
   - Add screenshots or screen recordings if your PR involves UI changes.

## 🐛 Reporting Bugs & Requesting Features

If you encounter a bug or have an idea for a feature, please feel free to open an issue!
- **Bug Reports**: Include clear steps to reproduce, expected behavior, and your environment details.
- **Feature Requests**: Outline the problem the feature solves and how it might work.

Thank you for contributing!
