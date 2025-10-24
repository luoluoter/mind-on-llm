import express from 'express';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3022;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.warn('⚠️ 未检测到 server/.env 文件。请复制 server/.env.example 并根据说明进行配置。');
}

// 启用 CORS
app.use(cors({
  origin: 'http://localhost:5173', // 允许前端开发服务器的请求
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// 路由
app.use('/analyze', analyzeRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
