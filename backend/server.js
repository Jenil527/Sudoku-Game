import express from 'express';
import { exec } from 'child_process';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// The path to the compiled C++ executable (user must compile generator.cpp to generator.exe)
// In Windows, it's generator.exe
const generatorExe = './generator';

app.get('/api/generate', (req, res) => {
    const difficulty = req.query.difficulty || 40;
    
    // Execute the C++ binary via WSL and pass the difficulty as an argument
    exec(`wsl ${generatorExe} ${difficulty}`, { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing generator: ${error.message}`);
            return res.status(500).json({ 
                error: 'Failed to generate puzzle. Make sure you have compiled generator.cpp in WSL!' 
            });
        }
        
        try {
            // The C++ program outputs a JSON string directly to stdout
            const data = JSON.parse(stdout);
            res.json(data);
        } catch (e) {
            console.error(`Error parsing JSON from generator: ${e}`);
            res.status(500).json({ error: 'Invalid output from C++ generator' });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sudoku backend API server running on http://localhost:${PORT}`);
    console.log(`Important: You MUST compile backend/generator.cpp to backend/generator.exe for this to work.`);
});
