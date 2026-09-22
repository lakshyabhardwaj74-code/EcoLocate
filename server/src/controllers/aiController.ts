import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { AIService } from '../services/aiService.js';
import prisma from '../utils/prisma.js';

export const analyzeImage = async (req: AuthRequest, res: Response) => {
  try {
    let imageUrl = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop';
    let originalFilename = undefined;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      originalFilename = req.file.originalname;
    } else {
      if (req.body.imageUrl) {
        imageUrl = req.body.imageUrl;
      }
      if (req.body.filename) {
        originalFilename = req.body.filename;
      } else if (req.body.sample) {
        originalFilename = req.body.sample;
      }
    }

    const aiResult = await AIService.analyzeEWasteImage(imageUrl, originalFilename);

    let savedScan = null;
    if (req.user) {
      savedScan = await prisma.aIScan.create({
        data: {
          userId: req.user.id,
          imageUrl: imageUrl,
          detectedItem: aiResult.detectedItem,
          category: aiResult.category,
          confidence: aiResult.confidence,
          estimatedWeightKg: aiResult.estimatedWeightKg,
          estimatedPoints: aiResult.estimatedPoints,
          recyclableMaterials: JSON.stringify(aiResult.recyclableMaterials),
          safetyNotes: aiResult.safetyNotes,
          disposalMethod: aiResult.disposalMethod,
          isDemoMode: aiResult.isDemoMode,
        },
      });
    }

    return res.json({
      success: true,
      data: {
        ...aiResult,
        scanId: savedScan?.id || null,
        imageUrl,
      },
    });
  } catch (error) {
    console.error('Error analyzing AI e-waste image:', error);
    return res.status(500).json({ success: false, message: 'AI Analysis failed.' });
  }
};

export const getScanHistory = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const scans = await prisma.aIScan.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const parsedScans = scans.map((s) => ({
      ...s,
      recyclableMaterials: JSON.parse(s.recyclableMaterials || '{}'),
    }));

    return res.json({ success: true, count: parsedScans.length, data: parsedScans });
  } catch (error) {
    console.error('Error fetching scan history:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve scan history.' });
  }
};
