# SudokuGame

A high-performance, stateless Web Sudoku game with a native C++ puzzle generator!

Inspired by the [Str8ts](https://github.com/daandtu/Str8ts) architecture, this project offloads complex puzzle generation to a highly optimized C++ backend while delivering a buttery-smooth, modern user interface in React. 

## Features

- **Blazing Fast Generation**: Uses recursive backtracking in C++ to instantly generate uniquely solvable Sudoku boards with variable difficulty.
- **Stateless Sharing**: Share puzzles instantly without a database! The board state is compactly encoded directly into the URL hash.
- **Modern UI**: A clean, responsive grid featuring "Pen" and "Notes" modes for pencil marks.
- **Smart Highlighting**: Automatically highlights rows, columns, 3x3 boxes, and matching numbers when a cell is selected.

## Architecture

1. **Frontend**: React + Vite (HTML/CSS/JS)
2. **API Server**: A lightweight Node.js Express server (`backend/server.js`) that handles requests from the frontend.
3. **Generator**: A compiled C++ binary (`backend/generator.cpp`) that the Node server executes via `child_process`.

## Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- A C++ compiler (like `g++` via WSL, MinGW, or MSVC).

### 1. Compile the C++ Generator
You must compile the backend generator before starting the server. If you are using Windows Subsystem for Linux (WSL) with `g++`:

```bash
cd backend
wsl g++ generator.cpp -o generator
```
*(If you compile it as `generator.exe` on native Windows, you will need to update the execution command in `server.js` accordingly).*

### 2. Start the Backend API Server
Open a terminal in the root of the project and run:

```bash
node backend/server.js
```
The API server will start on `http://localhost:3000`.

### 3. Start the React Frontend
Open a new terminal in the root of the project and run:

```bash
npm install
npm run dev
```
The frontend will start on your local Vite port (usually `http://localhost:5173`). Open that URL in your browser to play!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
