import { Router } from "express";
import type { Request, Response } from "express";
import { ChatModel } from "../models/Chat.js";
import runGraph from "../ai/graph.ai.js";
import processImageWithAI from "../ai/vision.ai.js";
import multer from "multer";
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
//   Get all chats (sidebar) 
router.get('/', async (req: Request, res: Response) => {
    try {
        const chats = await ChatModel.find().select('_id title updatedAt').sort({ updatedAt: -1 });
        res.json({ success: true, chats });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

// Get single chat 
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const chat = await ChatModel.findById(req.params.id);
        if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });
        res.json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

// Delete chat

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await ChatModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Chat deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error });
    }
});

// Post a text message 

router.post('/', async (req: Request, res: Response) => {
    try {
        let { input, chatId } = req.body; let chat;
        if (chatId) {
            if (!chatId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({
                    success: false, message: 'Invalid Chat ID format'
                });
            }
            chat = await ChatModel.findById(chatId);
            if (!chat) return res.status(404).json({
                success: false, message: 'Chat not found'
            });
        } else {
            // Auto-generate a short title from the input 

            const title = input.length > 30 ? input.substring(0, 30) + '...' : input;
            chat = new ChatModel({ title, messages: [] });
        }

        // Add user message 

        const userMsg = { id: Date.now(), role: 'user', content: input };
        chat.messages.push(userMsg as any);
        const aiResult = await runGraph(input);

        // Add AI message 

        const aiMsg = {
            id: Date.now() + 1, role: 'ai', problem: input,

            // graph Result fields 

            solution_1: aiResult.solution_1,
            solution_2: aiResult.solution_2,
            judge: aiResult.judge,
            isVision: false
        };

        chat.messages.push(aiMsg as any);
        await chat.save();
        res.json({
            success: true,
            chatId: chat._id,
            userMessage: userMsg,
            aiMessage: aiMsg,
            data: aiResult // keeping original data structure for frontend API compatibility 

        });
    } catch (error) {
        console.error(error); res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});

// Post an image (vision) 

router.post('/vision', upload.single('image'), async (req: Request, res: Response) => {
    try {
        const { input, chatId } = req.body;
        const file = req.file;
        if (!file) return res.status(400).json({
            success: false,
            message: 'No image uploaded'
        });

        let chat;

        if (chatId) {
            chat = await ChatModel.findById(chatId);
        } else {
            const title = "Image Upload Chat";
            chat = new ChatModel({ title, messages: [] });
        }

        const userMsg = { id: Date.now(), role: 'user', content: input || 'Uploaded an image' };
        chat!.messages.push(userMsg as any);
        const base64Data = file.buffer.toString('base64');
        const aiResponse = await processImageWithAI(input, file.mimetype, base64Data);
        const aiMsg = {
            id: Date.now() + 1,
            role: 'ai',
            content: String(aiResponse),
            isVision: true
        };

        chat!.messages.push(aiMsg as any);
        await chat!.save();
        res.json({
            success: true,
            chatId: chat!._id,
            userMessage: userMsg,
            aiMessage: aiMsg
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}
);

export default router;
