import express from 'express';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3022;

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