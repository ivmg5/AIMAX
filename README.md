AIMAX: Personalized Learning Platform

Introduction

AIMAX is an innovative personalized learning platform designed to adapt to each user’s needs and preferences. By leveraging artificial intelligence, AIMAX generates highly personalized learning recommendations, ensuring that users receive content relevant and tailored to their individual goals.

Whether you’re a student or a professional, AIMAX bridges the gap between the vast availability of information and effective personalization, facilitating efficient and effective learning for everyone.

Features

	•	Personalized Recommendations: AI-driven suggestions based on your academic background, interests, and learning history.
	•	Dynamic Learning Roadmaps: Customized learning paths that evolve with your changing interests and goals.
	•	Progress Tracking: Visualize your learning progress with dynamic progress bars and milestone tracking.
	•	Profile Management: Update your profile information, interests, and skills as you grow.
	•	Access to Learning Resources: Detailed descriptions and links to relevant resources for each topic in your roadmap.
	•	Multi-device Support: Accessible and functional across desktops, tablets, and smartphones.

Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

Prerequisites

	•	Node.js (v14.x or later)
	•	npm (v6.x or later)
	•	PostgreSQL (v12.x or later)
	•	Git

Installation

	1.	Clone the Repository

git clone https://github.com/ivmg5/AIMAX.git
cd AIMAX


	2.	Install Project Dependencies

npm install


	3.	Set Up Environment Variables
Create a .env file in the root directory and add the following:

DATABASE_URL=postgresql://username:password@localhost:5432/aimax

Create a .env.local file and add the following:

AUTH_SECRET=your_auth_secret
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=development

	•	AUTH_SECRET: Generate using:

npx authjs generate-secret


	•	DATABASE_URL: Replace username, password, and aimax with your PostgreSQL credentials and desired database name.
	•	OPENAI_API_KEY: Obtain an API key from OpenAI.

	4.	Set Up the Database
Log in to PostgreSQL and create the database and user:

CREATE DATABASE aimax;
CREATE USER aimax WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE aimax TO aimax;
\c aimax
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO aimax;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO aimax;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO aimax;
ALTER USER aimax WITH CREATEDB;


	5.	Migrate the Database Schema

npx prisma migrate dev

This command will create the necessary tables in your database based on the Prisma schema.

Running the Application

To start the development server:

npm run dev

The application will be available at http://localhost:3000.

Technologies Used

Front-End

	•	Next.js: React framework with server-side rendering.
	•	React.js: JavaScript library for building user interfaces.
	•	Tailwind CSS: Utility-first CSS framework for styling.
	•	Shadcn/ui: Component library for React.js.

Back-End

	•	Next.js: For server-side rendering and API routes.
	•	OpenAI API: Utilizing ChatGPT-3.5-turbo for AI recommendations.
	•	Auth.js: Authentication framework for handling OAuth and sessions.
	•	Zod: JavaScript data validation library.

Database

	•	Prisma: Next-generation ORM for TypeScript and JavaScript.
	•	PostgreSQL: Relational database for data storage.

Helpful Commands and Reminders

	•	Generate Auth Secret

npx authjs generate-secret


	•	Database Migration
After any changes to the Prisma schema:

npx prisma migrate dev

License

This project is licensed under the MIT License.
