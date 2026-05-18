import express from 'express';
import { buildSystemPrompt } from '../prompts/systemPrompt.js';
import { callLLM } from '../services/llmService.js';
import { validateLayout } from '../utils/jsonValidator.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, layout, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }
    if (!layout || !layout.rootNodes || !layout.nodes) {
      return res.status(400).json({ error: 'valid layout JSON is required' });
    }

    const systemPrompt = buildSystemPrompt(layout);
    const result = await callLLM(systemPrompt, history, message);

    // Merge changed nodes into full layout
    const updatedLayout = {
      ...layout,
      nodes: {
        ...layout.nodes,
        ...result.updatedNodes,
      }
    };

    // If artboard size changed, update it
    if (result.updatedArtboard) {
      const rootId = layout.rootNodes[0];
      updatedLayout.nodes[rootId] = {
        ...updatedLayout.nodes[rootId],
        ...result.updatedArtboard,
      };
    }

    validateLayout(updatedLayout);

    return res.json({
      updatedLayout,
      explanation: result.explanation,
    });

  } catch (err) {
    console.error('[chat route error]', err.message);
    return res.status(500).json({
      error: err.message || 'Internal server error',
    });
  }
});

export default router;