# FOSS Club NIT Srinagar - Official Website

This repository contains the official website for the Free and Open Source Society (FOSS) Club at the National Institute of Technology Srinagar. The website serves as a platform to showcase club activities, events, blogs, team members, and manage event registrations.

## 🚀 Features

- **Modern UI**: Built with Next.js 14, Tailwind CSS v4, and Framer Motion for a premium, responsive user experience.
- **Admin Dashboard**: Secure admin panel to manage website content and analytics.
- **Content Management**:
  - **Events**: Create and manage event listings (upcoming, tentative, and past). Includes countdown timers and live event tags.
  - **Event Registration**: Built-in registration system for students (individuals & teams) with automated email notifications (via Mailjet) and real-time syncing to Google Sheets.
  - **Gallery**: Manage and display event images in an organized gallery with editable descriptions.
  - **News & Blogs**: Publish club news and articles using a seamless Rich Text Editor (Tiptap).
  - **Team**: Showcase club members with drag-and-drop ordering capabilities.
- **Performance Optimized**: Implemented API response compression, static asset caching, and dynamic imports for improved load times and efficiency.
- **Well-Documented**: Extensive JSDoc comments integrated across both client and server codebases.
- **File Management**: Comprehensive image and PDF upload capabilities directly integrating with Cloudinary.
- **Responsive & Accessible Design**: Optimized for desktop, tablet, and mobile viewing across different devices, incorporating Radix UI primitives.
- **Dark Mode**: Built-in dark theme powered by `next-themes` for a comfortable viewing experience.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), Shadcn UI
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Editor**: [Tiptap](https://tiptap.dev/)
- **Forms & Validation**: React Hook Form + Zod
- **Drag & Drop**: dnd-kit

### Backend (Server)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://prisma.io/)
- **Storage**: [Cloudinary](https://cloudinary.com/)
- **Communication**: Node Mailjet (Email Automation)
- **Integration**: Google APIs (Google Sheets Sync)
- **Authentication**: JWT & bcryptjs
- **File Uploads**: Multer

## 📂 Project Structure

```text
foss-club/
├── client/          # Next.js Frontend Application
│   ├── app/         # Next.js App Router pages (admin, events, blogs, team, gallery)
│   ├── components/  # Reusable React components (AdminSidebar, ImageUpload, PdfUpload, etc.)
│   └── lib/         # Utility functions, Redux store, and API clients
├── server/          # Express.js Backend Application
│   ├── src/
│   │   ├── config/      # DB, Cloudinary, Mailjet configuration
│   │   ├── controllers/ # Logic for Auth, Events, Blogs, Registration, Sheets, Contact, Stats, Uploads
│   │   ├── routes/      # API endpoints mapping to controllers
│   │   └── middleware/  # Auth guards, Error handling
│   └── prisma/      # Schema (Admin, Event, Blog, TeamMember, RegistrationConfig, etc.)
└── README.md        # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Cloudinary Account
- Mailjet Account
- Google Service Account (for Sheets API)

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables in .env
# - DATABASE_URL
# - JWT_SECRET
# - CLOUDINARY credentials
# - MAILJET credentials
# - GOOGLE_SHEETS settings

# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate dev --name init

# Start the development server
npm run dev
```

The backend API will be running at `http://localhost:5000`.

### 2. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:3000`.

## 📂 Key API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Events & Registrations
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `POST /api/registrations/:eventId` - Register for an event
- `GET /api/registrations/config/:eventId` - Get event registration config

### Content (Blogs & Gallery)
- `GET /api/blogs` - Get all blogs
- `GET /api/gallery/:eventId` - Get gallery images for a specific event
- `POST /api/gallery/:eventId` - Add an image to an event's gallery
- `PUT /api/gallery/:id` - Update a gallery image description
- `DELETE /api/gallery/:id` - Delete a gallery image

### External Integrations
- `POST /api/contact` - Submit contact form
- `GET/POST /api/sheet/*` - Google Sheets synchronizations
- `POST /api/upload/*` - Handle file uploads (Cloudinary)

### Dashboard
- `GET /api/stats` - Get summary statistics for the admin dashboard

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support or questions, please open an issue or contact the development team.
