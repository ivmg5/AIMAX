# **AIMAX: Personalized Learning Platform**
> *An adaptive AI-driven platform designed for personalized learning journeys tailored to each user’s unique goals and interests.*

## **Introduction**
AIMAX is a platform that leverages artificial intelligence to generate personalized learning recommendations tailored to each user's goals, academic background, and areas of interest. Designed for both students and professionals, AIMAX addresses the challenge of finding relevant, engaging, and customized learning resources. By bridging the gap between vast educational resources and effective, personalized learning pathways, AIMAX enables users to efficiently track their progress and achieve their objectives in a highly adaptive environment.

## **Project Description**
- **Main functionality:** Generates customized learning recommendations, dynamically tracks progress, and offers flexible, evolving educational paths.
- **Technologies used:** Next.js, Tailwind CSS, Shadcn/ui, React.js for front-end; OpenAI API, Auth.js, and Prisma with PostgreSQL for back-end and database management.
- **Challenges faced:** Creating a scalable and dynamic recommendation system that evolves with the user’s interests; ensuring a seamless user experience across multiple devices.
- **Future improvements:** Additional recommendation algorithms for enhanced personalization; expanded resource library for a wider range of subjects.

## **Table of Contents**
1. [Introduction](#introduction)
2. [Project Description](#project-description)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Additional Documentation](#additional-documentation)
6. [License](#license)
7. [Status Badges](#status-badges)

## **Installation**
1. **Prerequisites**:
   - **Node.js** - [Install Node.js](https://nodejs.org/)
   - **npm** - Installed with Node.js
   - **PostgreSQL** - [Install PostgreSQL](https://www.postgresql.org/)
   - **Git** - [Install Git](https://git-scm.com/)

2. **Clone the repository:**
   ```bash
   git clone https://github.com/ivmg5/AIMAX.git
   cd AIMAX
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root directory with the following:
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/aimax
   AUTH_SECRET=your_auth_secret
   OPENAI_API_KEY=your_openai_api_key
   ```
   - **AUTH_SECRET**: Generate with `npx authjs generate-secret`
   - **DATABASE_URL**: Replace `username`, `password`, and `aimax` with your PostgreSQL credentials.
   - **OPENAI_API_KEY**: Obtain an API key from OpenAI.

5. **Database setup and migrations:**
   Set up and grant permissions in PostgreSQL:
   ```sql
   CREATE DATABASE aimax;
   CREATE USER aimax WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE aimax TO aimax;
   ALTER USER aimax WITH CREATEDB;
   ```
   Then, migrate with Prisma:
   ```bash
   npx prisma migrate dev
   ```

6. **Run the application:**
   ```bash
   npm run dev
   ```
   Access the application at [http://localhost:3000](http://localhost:3000).

### **Configuration Options**
- Adjust settings like `DEBUG=true` in your `.env.local` file for development purposes.

## **Usage**
1. **User registration** to create and personalize your profile.
2. **Complete onboarding** questions to receive tailored topic recommendations.
3. **Track learning progress** and adjust preferences to refine recommendations.

**Example usage:**
   ```javascript
   const recommendations = getRecommendations();
   console.log(recommendations);
   ```

## **Additional Documentation**
Refer to the comprehensive documentation in `Documentation.pdf` within the repository for a detailed overview of user journey mapping, use case diagrams, and technical specifications.

## **License**
This project is licensed under the MIT License.

## **Status Badges**
[![Build Status](https://img.shields.io/badge/status-active-brightgreen)](#) [![Code Coverage](https://img.shields.io/badge/coverage-80%25-yellowgreen)](#)
