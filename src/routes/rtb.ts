import { Router, type Request, type Response } from 'express';
import {processBidRequest, validateBidRequest} from "../services/rtb.ts";
import * as e from "cors";

const router = Router();

// OpenRTB BidRequest
router.post('/bid', async (req: Request, res: Response, next) : Promise<e.Response<any, Record<string, any>>> => {
    const bidRequest = req.body;

    if (!await validateBidRequest(bidRequest)) {
        return res.status(400).json({ error: 'Invalid BidRequest format' });
    }

    const bidResponse = await processBidRequest(bidRequest);

    if (!bidResponse) {
        return res.status(204).send(); // No Content
    }


    res.json(bidResponse);
});

export default router;
