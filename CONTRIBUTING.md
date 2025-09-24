# ECHO

## 1. Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd <repo-folder>
```

2. Install dependencies:

```bash
yarn install
# or
npm install
```

---

## 2. Development

During development, use the following scripts:

- **Start in development mode** (auto-restarts on changes):

```bash
yarn start:dev
```

This uses `ts-node-dev` to run the project with TypeScript support and hot-reloading.

- **Type checking** (without building):

```bash
yarn typecheck
```

- **Linting** (auto-fixes linting issues):

```bash
yarn lint
```

- **Formatting code** with Prettier:

```bash
yarn format
```

---

## 3. Testing

- **Run tests**:

```bash
yarn test
```

- **Run tests with coverage report**:

```bash
yarn test:cov
```

---

## 4. Building

Before deploying or running in production, build the project:

1. **Clean previous builds**:

```bash
yarn clean
```

2. **Build TypeScript**:

```bash
yarn build
```

This will compile the project into the `dist` folder and adjust path aliases using `tsc-alias`.

3. **Build static assets** (CSS, JS, etc.):

```bash
yarn build:static
```

---

## 5. Production

Run the compiled project:

```bash
yarn start:prod
```

This runs the built JS files from `dist/`.

---

## 6. Git Hooks

Husky is configured to manage Git hooks automatically. It runs during the `prepare` step:

```bash
yarn prepare
```

This ensures your commits follow the configured rules and checks.

---

## 7. Notes

- Always lint and format before committing.
- Ensure all tests pass before opening a pull request.
- Keep dependencies up to date.
- Follow the folder structure conventions for new files:
  - `src/` for application code
  - `static/` for frontend assets
  - `tests/` for unit and integration tests
