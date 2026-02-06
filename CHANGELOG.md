# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-01-29

### Added

#### Core Features
- Interactive SVG world map with navigation, zoom, and country selection.
- Intelligent translation system with DeepL API and automatic fallback to Google Translate.
- Translation cache in MongoDB for performance and cost optimization.
- "Guess the Language" game mode with lives logic, scoring, and visual feedback.
- "Guess the Flag" game mode integrated with the interactive map.

#### Interface and User Experience
- Landing page with CSS animations and direct access to game modes.
- Full internationalization (i18n) support for English and Spanish.
- Dark and light theme with user preferences persistence.
- Country search bar with auto-zoom and centering functionality.
- Responsive design adapted for mobile and desktop.

#### Infrastructure and DevOps
- Complete containerized environment with Docker and Docker Compose (Frontend, Backend, Mongo).
- Sentry integration for real-time error and performance monitoring.
- GitHub Actions pipeline for automatic documentation generation (TypeDoc).
- Railway deployment configuration with secure environment variables.
- Seeding scripts for automatic database initialization.
