# Contributing to Transkarte

First off, thank you for considering contributing to Transkarte! 🌍 It's people like you that make Transkarte such a great tool for learning languages and geography.

We welcome contributions of all kinds: code, documentation, bug reports, feature suggestions, and more. Whether you're a beginner or an experienced developer, there's a place for you in our community.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Style Guide](#style-guide)
- [Questions?](#questions)

---

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Git** - for version control
- **Node.js** (v16 or higher) - for running the development environment
- **Docker** & **Docker Compose** - for running services locally
- **npm** or **yarn** - package managers (comes with Node.js)

### Fork and Clone

1. **Fork the repository** on GitHub by clicking the "Fork" button
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/YOUR-USERNAME/ProyectoIntermodular-MapaInteractivo.git
   cd ProyectoIntermodular-MapaInteractivo
   ```

3. **Add upstream remote** to stay synced with the main repository:
   ```bash
   git remote add upstream https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo.git
   git fetch upstream
   ```

---

## Development Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Add your environment variables:
# - MONGO_URI: MongoDB connection string
# - DEEPL_API_KEY: DeepL translation API key (optional, uses Google Translate fallback)
# - NODE_ENV: development or production
# - SENTRY_DSN: Sentry error tracking (optional)

cp .env.example .env
nano .env  # Edit with your values
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file for frontend variables
# - VITE_API_URL: Backend API URL (default: http://localhost:5000)
# - VITE_SENTRY_DSN: Sentry DSN for error tracking (optional)

cp .env.example .env
nano .env  # Edit with your values
```

### 3. Database Setup

```bash
# Start MongoDB using Docker Compose
docker-compose up -d mongo

# The database will be accessible at mongodb://localhost:27017
# Seed initial data (optional)
cd backend && npm run seed
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev  # Starts on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev  # Starts on http://localhost:5173
```

The application will be available at `http://localhost:5173`

---

## Making Changes

### Create a Branch

Always create a new branch for your work:

```bash
# Update local repository
git fetch upstream
git checkout main
git merge upstream/main

# Create a feature branch
git checkout -b feature/your-feature-name
# or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/short-description` - for new features
- `fix/short-description` - for bug fixes
- `docs/short-description` - for documentation
- `refactor/short-description` - for code refactoring
- `test/short-description` - for tests

### Work on Your Feature

- Keep your changes focused and atomic
- Write clear, descriptive commit messages (see [Commit Guidelines](#commit-guidelines))
- Update documentation if your changes affect user-facing features
- Test your changes thoroughly

---

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring without feature changes
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Changes to build tools, dependencies, or CI/CD

### Examples

```bash
git commit -m "feat(frontend): add dark mode toggle to landing page"

git commit -m "fix(backend): resolve translation cache invalidation bug"

git commit -m "docs(readme): update installation instructions"

git commit -m "refactor(api): simplify error handling middleware"
```

---

## Testing

### Frontend Tests

```bash
cd frontend

# Run tests in watch mode
npm run test

# Run tests with coverage
npm run test:coverage
```

### Backend Tests

```bash
cd backend

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### Manual Testing

1. **Test locally** in both light and dark modes
2. **Test responsiveness** on mobile and desktop
3. **Test API endpoints** using Postman or curl
4. **Test translations** with different languages
5. **Test game modes** to ensure they work correctly

### Linting

```bash
# Frontend - ESLint
cd frontend && npm run lint

# Backend - ESLint
cd backend && npm run lint
```

---

## Pull Request Process

### Before Submitting

1. **Sync with upstream:**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes:**
   - Run linting: `npm run lint`
   - Run tests: `npm run test`
   - Manual testing in browser
   - Check for console errors and warnings

3. **Update documentation:**
   - Update README.md if needed
   - Add JSDoc comments to new functions
   - Update CHANGELOG.md

### Creating a Pull Request

1. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Fill in the PR template completely
   - Reference related issues: `Fixes #123`
   - Provide context about your changes

### PR Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix (fixes an issue)
- [ ] New feature (adds functionality)
- [ ] Documentation update
- [ ] Other (specify):

## Related Issues
Fixes #(issue number)

## Testing Done
- [ ] Manual testing (describe)
- [ ] Unit tests added
- [ ] No new test needed because...

## Screenshots (if applicable)
<!-- Attach any relevant screenshots -->

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have updated the documentation
- [ ] I have added tests (if applicable)
- [ ] All tests pass locally
- [ ] Linting passes (`npm run lint`)
- [ ] No console errors or warnings
```

### Code Review

- Respond to reviewer feedback promptly
- Make requested changes in new commits
- Ask questions if feedback is unclear
- Be respectful and constructive in discussions

---

## Reporting Bugs

### Before Reporting

- Search existing issues to avoid duplicates
- Check if the bug exists in the latest version
- Try to reproduce the issue consistently

### Filing a Bug Report

Create an issue with the following information:

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots/Logs
Attach relevant errors or screenshots

## Environment
- OS: (Windows, macOS, Linux)
- Browser: (Chrome, Firefox, Safari, etc.)
- Node version: (if backend-related)
- Docker version: (if using Docker)

## Additional Context
Any other relevant information
```

---

## Suggesting Features

### Before Suggesting

- Check existing issues and discussions
- Consider if the feature aligns with Transkarte's mission
- Think about the implementation complexity

### Feature Request Format

```markdown
## Description
What feature do you want to add?

## Problem it Solves
Why is this feature needed?

## Proposed Solution
How should it work?

## Example Use Case
Show how users would use this feature

## Alternative Approaches
Any other ways to achieve this?

## Additional Context
Mockups, research, or references
```

---

## Style Guide

### Code Style

We use ESLint for styling consistency. Run `npm run lint` before committing.

#### TypeScript/JavaScript

- Use `const` by default, `let` for reassignment, avoid `var`
- Use arrow functions: `() => {}`
- Use template literals: `` `Hello ${name}` ``
- Use destructuring: `const { name, age } = user`
- Add JSDoc comments to all functions:

```typescript
/**
 * Translates text to a target language
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<string>} Translated text
 */
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  // Implementation
};
```

#### CSS

- Use consistent naming: `component-name`, `component-name__element`
- Use CSS variables for colors: `var(--color-primary)`
- Add comments for complex styles
- Ensure responsive design with media queries

#### Git Commits

- Write in present tense: "add feature" not "added feature"
- Be specific: "fix login bug" not "fix bug"
- Keep first line under 50 characters
- Reference issues: "fixes #123"

### File Organization

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── styles/          # CSS files
│   │   ├── types.ts         # TypeScript definitions
│   │   └── i18n/            # Internationalization
│   └── package.json
├── backend/
│   ├── routes/              # API routes
│   ├── models/              # Database models
│   ├── services/            # Business logic
│   ├── config/              # Configuration files
│   └── package.json
└── docs/                    # Documentation
```

---

## Stack Overview

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Zustand** - State management
- **Axios** - HTTP client
- **react-simple-maps** - Interactive maps
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **DeepL API** - Translation
- **Sentry** - Error tracking

### DevOps
- **Docker** - Containerization
- **Railway** - Deployment platform
- **GitHub Actions** - CI/CD

---

## Questions?

- **Questions about contributing?** Open a discussion on GitHub
- **Need help setting up?** Create an issue tagged `help wanted`
- **Want to discuss features?** Start a discussion in the Discussions tab
- **Found a security issue?** Please report it privately to the maintainers

---

## Recognition

Contributors who make significant improvements to Transkarte will be:
- Added to the CONTRIBUTORS.md file
- Mentioned in release notes
- Featured in the project's README

---

## License

By contributing to Transkarte, you agree that your contributions will be licensed under the same license as the project.

---

## Additional Resources

- [Project README](./README.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [API Documentation](https://sdurutr436.github.io/ProyectoIntermodular-MapaInteractivo/)
- [GitHub Issues](https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo/issues)

---

Thank you for contributing to Transkarte! Together, we're making language learning fun and accessible to everyone. 🚀📚
