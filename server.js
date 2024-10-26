import express from 'express';
import fs from 'fs';
import { GroqClient } from 'groq-sdk';
import multer from 'multer';

const app = express();
const groq = new GroqClient({ apiKey: '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' });

const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.post('/transcribe', upload.single('audio'), async (req, res) => {
    try {
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: 'whisper-large-v3',
            language: 'he',
            response_format: 'json',
        });
        fs.unlinkSync(req.file.path);
        res.json(transcription);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
