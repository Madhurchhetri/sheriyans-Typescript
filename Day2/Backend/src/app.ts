import express from 'express';
import connectDB from './config/db.js';
import chatRoutes from './routes/chat.routes.js';
import runGraph from './ai/graph.ai.js';

const app = express();
app.use(express.json());
app.use(express.static('./public'))

// Initialize Database connection
connectDB();

app.get('/',async (req,res)=>{
    const result = await runGraph("What is the capital of France?")
    res.json(result)
})

// V2 routes with Mongo persistence
app.use('/api/chats', chatRoutes);

// Keep V1 alive for backward compatibility if needed, or remove it (I will remove/replace the v1 post /chat since we proxy to /api/chats in frontend now).
// Actually, let's update frontend vite to proxy /api
export default app;