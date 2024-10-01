This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Setting up

### Install project dependencies

```bash
npm install
```

The file .env and .env.local will need to be setup with the corresponding data

### .env

```txt
DATABASE_URL=
```

### .env.local

```txt
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
NODE_ENV=development
```

Auth secret can be obtained through

```bash
npx auth secret
```

The current version of the project uses a local psql database, so DATABASE_URL would look something like `"postgresql://user_name:password@localhost:5432/db_name"`, if you haven't made a local version of the database you use the following code to initialize everything. Make sure to be logged in into the user postgres

### Databse

```psql
CREATE DATABASE aimax;
CREATE USER aimax WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE aimax TO aimax;
\c aimax
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO aimax;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO aimax;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO aimax;
ALTER USER aimax WITH CREATEDB;
```

### Updating the schema

Once you have an available database and have the secrets set up you can migrate the schema onto the db with prisma, this will need to be done each time the schema changes

```bash
npx prisma migrate dev
```

## Running

```bash
npm run dev
```

## Helpful commands and remainders

- Always work on a branch, once you are in one you can work and commit all you want, the most important branch is named `main`:w

```bash
git checkout -b branch-name
```

- push to your branches origin, afterwards you can go to the project online and request a pull request (PR)

```bash
git push origin branch-name
```

- once a branch is merged and you will start another branch you can delete it locally with

```bash
git branch -d branch-name
```

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Dependencies Directory

- [Next.js Documentation](https://nextjs.org/docs) - Important for SSR and API
- [Tailwindcss Documentation](https://tailwindcss.com/docs/flex-basis) - CSS
- [Shadcn/ui Documentation](https://ui.shadcn.com/docs) - CSS component library, if you are making something functional like a button or a toast check if it exists in here
- [Prisma Documentation](https://www.prisma.io/docs/orm/overview/introduction) - Data retrieval for API, data saving
- [Auth.js Documentation](https://authjs.dev/getting-started) - Registers Session and manages authentication
