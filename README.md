# :dart: TODO APP - Game of fronts Challenge - Edition 02 (BACKEND)

## :computer: Overview
This is the backend for the ToDo App, designed to manage tasks and provide APIs for the frontend. It uses Node.js with Express for the server and TypeORM with SQLite for database management.

---

## :computer: Tools
- **Node.js**: Runtime environment for executing JavaScript code.
- **Express**: Framework for building RESTful APIs.
- **TypeORM**: ORM for database management.
- **SQLite**: Lightweight database engine.
- **TypeScript**: Typed superset of JavaScript for better maintainability.

---

## :computer: Features
- Create, read, update, and delete tasks.
- Persistent storage using SQLite.
- Well-structured code with TypeScript.
- Extensible API endpoints for integration.

---

## :computer: Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add necessary configuration:
   - JWT_SECRET: The secret key used to encrypt and decrypt JSON Web Tokens (JWT) for secure user authentication and session management.
   - PORT: The port number on which the server will run.
   - DEFAULT_MODEL_PROVIDER: Defines the default AI model provider (e.g., OpenAI or WatsonX) for processing requests.
   - OPENAI_API_KEY: The API key to authenticate and use OpenAI's services.
   - OPENAI_MODEL: Specifies the OpenAI model to be used (e.g., gpt-4, gpt-3.5-turbo).
   - WATSONX_MODEL: Specifies the WatsonX AI model to be used for processing.
   - WATSONX_AI_AUTH_TYPE: Authentication type required for WatsonX AI services (e.g., apikey or iam).
   - WATSONX_AI_APIKEY: The API key to authenticate and access WatsonX AI services.
   - WATSONX_AI_PROJECT_ID: The unique identifier for the project in WatsonX AI, used to organize and manage resources.

4. Run Migrations:
   ```bash
   npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts
   ```

---

## :computer: Running
- To start the server in development mode:
  ```bash
  npx ts-node src/app.ts
  ```
- Swagger Documentation available in `localhost:<PORT>/docs`

---

## :computer: Database
- This project uses SQLite for simplicity.
- The database file will be created in the project root as `database.sqlite`.
- The schema is automatically synchronized based on the entities defined.

---

### :computer: Migrations

Manage changes to the database schema with the following instructions:

#### **1. Generate a New Migration**
Use the command below to generate a migration based on the changes in your entities:

```bash
npx typeorm-ts-node-commonjs migration:generate ./src/migrations/<NAME> -d ./src/data-source.ts
```

Replace `<NAME>` with a descriptive name for the migration (e.g., `CreateUserTable`).

#### **2. Apply Migrations**
To execute pending migrations and synchronize the database:

```bash
npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts
```

#### **3. Revert the Last Migration (Optional)**
If you need to undo the last applied migration:

```bash
npx typeorm-ts-node-commonjs migration:revert -d ./src/data-source.ts
```

## :bust_in_silhouette: Contributing

You can get in touch with `anasantos.rds@outlook.com` or `anacs@ibm.com` in mail.
