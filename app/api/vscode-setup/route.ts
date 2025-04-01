import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    setupGuide: `
# VS Code Setup Guide

This guide will help you set up Visual Studio Code for developing the Mischievous Cat Shopper Content Generation Platform.

## Prerequisites

- Visual Studio Code installed
- Node.js 18 or higher
- Python 3.9 or higher
- Git

## Step 1: Install VS Code Extensions

Install the following VS Code extensions:

1. **ESLint**: JavaScript linting
2. **Prettier**: Code formatting
3. **Tailwind CSS IntelliSense**: Autocomplete for Tailwind CSS
4. **Python**: Python language support
5. **Pylance**: Python language server
6. **Python Indent**: Smart Python indentation
7. **Python Docstring Generator**: Generate Python docstrings
8. **Thunder Client**: API testing (alternative to Postman)

You can install these extensions by opening VS Code, pressing \`Ctrl+Shift+X\` (or \`Cmd+Shift+X\` on macOS), and searching for each extension.

## Step 2: Configure VS Code Settings

Create a \`.vscode/settings.json\` file in your project root with the following settings:

\`\`\`json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[python]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "ms-python.python"
  },
  "python.formatting.provider": "autopep8",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true
}
\`\`\`

## Step 3: Set Up Project Workspace

1. Create a VS Code workspace file (\`.code-workspace\`) to manage both frontend and backend:

\`\`\`json
{
  "folders": [
    {
      "name": "Frontend",
      "path": "."
    },
    {
      "name": "Backend",
      "path": "./backend"
    }
  ],
  "settings": {
    "files.exclude": {
      "backend/": true
    }
  }
}
\`\`\`

2. Save this file as \`mischievous-cat-shopper.code-workspace\` in your project root.

3. Open the workspace by selecting File > Open Workspace from File... and selecting the workspace file.

## Step 4: Configure Terminal

Set up integrated terminals for both frontend and backend:

1. Open the Command Palette (\`Ctrl+Shift+P\` or \`Cmd+Shift+P\` on macOS)
2. Type "Terminal: Create New Terminal" and press Enter
3. This will open a terminal in the frontend directory
4. Create a second terminal and navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

## Step 5: Install Development Tools

Install development tools for both frontend and backend:

### Frontend

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer eslint eslint-config-next prettier
\`\`\`

### Backend

\`\`\`bash
pip install autopep8 pylint
\`\`\`

## Step 6: Set Up Launch Configurations

Create a \`.vscode/launch.json\` file for debugging:

\`\`\`json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "main:app",
        "--reload",
        "--host",
        "0.0.0.0",
        "--port",
        "8000"
      ],
      "cwd": "\${workspaceFolder}/backend",
      "jinja": true
    }
  ],
  "compounds": [
    {
      "name": "Full Stack: Next.js + FastAPI",
      "configurations": ["Next.js: debug server-side", "Python: FastAPI"]
    }
  ]
}
\`\`\`

## Step 7: Start Development

You're now ready to start development:

1. Start the frontend development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Start the backend development server:
   \`\`\`bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   \`\`\`

3. Open your browser and navigate to http://localhost:3000 to see the frontend
4. The backend API will be available at http://localhost:8000

Happy coding!
    `
  })
}
