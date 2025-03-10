# CLAUDE.md - Guidelines for the Mocker Project

## Build and Development Commands
- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## Code Style Guidelines
- **TypeScript**: Use strict typing with interfaces/types for all components and functions
- **Imports**: Group imports by external libraries, then internal modules, with a blank line between
- **Component Structure**: Use functional components with named exports
- **Naming**: Use PascalCase for components, camelCase for functions/variables
- **CSS**: Use Tailwind classes with consistent ordering (layout, spacing, styling)
- **Error Handling**: Use try/catch for async operations, provide meaningful error messages
- **Path Aliases**: Use `@/` prefix for imports from the project root

## Project Structure
- Use the Next.js App Router architecture
- Place reusable components in `components/` directory
- Place API routes in `app/api/` directory
- Use page.tsx for route components