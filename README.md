# SudokuGame

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![C++](https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)

A high-performance, stateless Web Sudoku game with a native C++ puzzle generator!

> **[Play it Live Here!]** *(Replace this with your future Vercel/GitHub Pages link!)*

<!-- PLACEHOLDER FOR SCREENSHOT: Un-comment the line below and add your image link once you take a screenshot -->
<!-- ![Sudoku Gameplay](./screenshot.png) -->

This project offloads complex puzzle generation to a highly optimized C++ backend while delivering a smooth, modern user interface in React.

## Features

- **Fast Generation**: Uses recursive backtracking in C++ to instantly generate uniquely solvable Sudoku boards with variable difficulty.
- **Stateless Sharing**: Share puzzles instantly without a database! The board state is compactly encoded directly into the URL hash.
- **Clean UI**: A clean, responsive grid featuring "Pen" and "Notes" modes for pencil marks.
- **Highlighting**: Automatically highlights rows, columns, 3x3 boxes, and matching numbers when a cell is selected.

## How the Magic Works 🪄

To achieve **database-free sharing**, the game state is translated into an 81-character string representing the 9x9 grid (where `0` is an empty cell and `1-9` are given numbers). When you click "Share", this string is appended to your URL (e.g., `#/game?code=530070000...`). 
When a friend opens your link, the React frontend simply reads this code, decodes it back into a 2D array, and instantly reconstructs the exact same puzzle for them to play!

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
