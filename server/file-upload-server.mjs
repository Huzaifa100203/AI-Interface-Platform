import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.FILE_SERVER_PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(
    cors({

        origin: CLIENT_ORIGIN,
    })
);

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        cb(null, `${timestamp}-${safeName}`);
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5,
    },
});

app.post("/upload", upload.array("files", 5), (req, res) => {
    const files = (req.files || []).map((file) => ({
        id: file.filename,
        name: file.originalname,
        storedName: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        path: file.path,
    }));

    res.json({ files });
});

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`File upload server listening on http://localhost:${PORT}`);
});


