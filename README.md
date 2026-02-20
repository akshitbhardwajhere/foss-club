# FOSS Club NIT Srinagar - Official Website

This repository contains the official website for the Free and Open Source Society (FOSS) Club at the National Institute of Technology Srinagar. The website serves as a platform to showcase club activities, events, blogs, and team members.

## 🚀 Features

- **Modern UI**: Built with Next.js and Tailwind CSS for a premium user experience.
- **Admin Dashboard**: Secure admin panel to manage website content.
- **Content Management**:
  - **Events**: Create and manage event listings (upcoming and past).
  - **News**: Publish club news and announcements.
  - **Blogs**: Share articles and insights on open-source.
  - **Team**: Showcase club members and their roles.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
- **Dark Mode**: Built-in dark theme for a comfortable viewing experience.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: React Hook Form + Zod

### Backend
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://prisma.io/)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod

## 📂 Project Structure

```
foss-club/
├── client/          # Next.js Frontend Application
│   ├── app/         # Next.js App Router pages
│   ├── components/  # Reusable React components
│   └── lib/         # Utility functions and API clients
├── server/          # Express.js Backend Application
│   ├── config/      # Database and middleware configuration
│   ├── controllers/ # Request handlers
│   ├── routes/      # API route definitions
│   └── prisma/      # Prisma schema and migrations
└── README.md        # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure database URL in .env
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate dev --name init

# Start the server
npm run dev
```

The backend API will be available at `http://localhost:5000`.

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

## 🔐 Admin Access

After starting the backend, you can create an admin user:

```bash
# Run the script to create an admin
cd server
npx ts-node src/scripts/createAdmin.ts
```

**Default Admin Credentials:**
- **Email**: [EMAIL_ADDRESS]`
- **Password**: `admin123` (change this immediately after login)

## 📝 Usage

### Creating Content

**Events:**
```bash
# Create a new event
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "title": "Tech Workshop",
    "description": "Learn about new technologies",
    "date": "2024-12-01T10:00:00Z",
    "location": "Auditorium"
  }'
```

**News:**
```bash
# Create a news post
curl -X POST http://localhost:5000/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "title": "New Event Announced",
    "content": "We are excited to announce...",
    "author": "FOSS Team"
  }'
```

**Blogs:**
```bash
# Create a blog post
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "title": "Getting Started with Open Source",
    "content": "A beginner's guide...",
    "author": "Jane Doe",
    "tags": ["opensource", "beginner"]
  }'
```

**Team Members:**
```bash
# Add a team member
curl -X POST http://localhost:5000/api/team \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "name": "John Smith",
    "role": "President",
    "email": "[EMAIL_ADDRESS]",
    "githubUrl": "https://github.com/john",
    "linkedinUrl": "https://linkedin.com/in/john"
  }'
```

## 📂 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/refresh` - Refresh token

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)

### News
- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get news by ID
- `POST /api/news` - Create news (admin)
- `PUT /api/news/:id` - Update news (admin)
- `DELETE /api/news/:id` - Delete news (admin)

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get blog by ID
- `POST /api/blogs` - Create blog (admin)
- `PUT /api/blogs/:id` - Update blog (admin)
- `DELETE /api/blogs/:id` - Delete blog (admin)

### Team
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get team member by ID
- `POST /api/team` - Create team member (admin)
- `PUT /api/team/:id` - Update team member (admin)
- `DELETE /api/team/:id` - Delete team member (admin)

### Dashboard
- `GET /api/dashboard/stats` - Get statistics

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support or questions, please open an issue or contact the development team.
