# WikiTusks

A markdown wiki application built with React, TypeScript, and Vite. Create, edit, and manage markdown articles with a modern editor interface.

## Features

- ✏️ **Markdown Editor**: Rich text editing with MDXEditor
- 📝 **Article Management**: Create, edit, and organize articles
- 🎨 **Modern UI**: Clean, responsive interface
- 📱 **Mobile Friendly**: Works on all devices

## Quick Start

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create your own `.env` file and add:

   ```bash
   VITE_JSONBIN_API_KEY=your_jsonbin_api_key
   VITE_JSONBIN_BIN_ID=your_bin_id
   VITE_TUSKY_API_KEY=your_tusky_api_key
   ```

   or use the one in the repo because I forgot to remove it anyway.

3. **Run the app**:

   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- React 18 + TypeScript
- Vite for build tooling
- MDXEditor for markdown editing
- JSONBin for data storage
- CSS Modules for styling

## License

MIT
