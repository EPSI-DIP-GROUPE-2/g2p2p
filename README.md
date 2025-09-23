# Echo

## Table of Contents

1. [Project Overview](#project-overview)
2. [Installation](#installation)
3. [Running the Project](#running-the-project)
4. [File Structure](#file-structure)
5. [Documentation](#documentation)
6. [Contributing](#contributing)

---

## Project Overview

This project provides a backend framework that includes:

- JWT authentication (`login`, `me` endpoints)
- User management via a `UserService`
- Request validation using Zod schemas
- Modular middleware and interceptor architecture
- Centralized error and response handling

It is designed with **Effect-based programming**, TypeScript type safety, and clean separation of concerns.

---

## Installation

```bash
# Install dependencies
yarn install

# Build the project
docker build -t echo:dev

# Run the project
yarn start:dev
```

## Running the Project

1. Set up configuration in `.env` via `config/custom-environment-variables.yaml` override.
2. Start the instance

```shell
yarn start:dev
```

---

## File Structure

```
config/                 # Application configuration files (default & custom env overrides)
docs/                   # Project documentation
src/
├── controllers/        # Express route handlers
├── handlers/           # Centralized error handling, response, database, and utilities
├── interceptors/       # Request interceptors (logging, security headers...)
├── middlewares/        # Express middlewares (auth, validation...)
├── models/             # Database models (Users...)
├── routes.ts           # Express route definitions
├── schemas/            # Zod validation schemas (e.g., AuthSchema)
├── services/           # Business logic/services (UserService)
├── types/              # Shared TypeScript types
└── utils/              # Utility functions (database, JWT, crypto, logger, config...)
static/                 # Frontend static files (HTML, CSS, JS, assets...)
package.json            # Project dependencies and scripts
tsconfig.json           # TypeScript configuration
webpack.config.cjs      # Webpack build configuration
yarn.lock               # Yarn dependency lock file
```

**Key Files to Know:**

- `src/controllers/auth.controller.ts` → Handles login and current user endpoints.
- `src/middlewares/auth.middleware.ts` → Validates JWT from cookies.
- `src/services/user.service.ts` → User creation, fetching, and initialization logic.
- `config/default.yaml` → JWT and database configuration.
- `docs/api.md` → Full API reference for authentication endpoints.

---

## Documentation

- API Reference: [`docs/api.md`](./docs/api.md)
  - `/api/login` → Login user
  - `/api/me` → Get currently authenticated user

- Contribution Guide: [`CONTRIBUTING.md`](./CONTRIBUTING.md)

---

## Contributing

- Code style

```shell
yarn format
```

- Pull requests from dedicated branches

```shell
git checkout feat/awesome-feature
git add .
git commit -m "docs: valid conventional commit"
git push origin feat/awesome-feature
```

- Testing and linting

```shell
yarn lint
yarn typecheck
yarn test
```
