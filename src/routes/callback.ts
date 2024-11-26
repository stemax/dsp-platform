import {Router, type Request, type Response} from 'express';
import {prisma} from "../app.ts";

const router = Router();

// WinNotice
router.post('/win', async (req: Request, res: Response) => {
    const {bidId, price, adId, campaignId} = req.body;

    try {
        console.log(`WinNotice received: Bid ID ${bidId}, Price ${price}, Ad ID ${adId}`);
        const winNotice = await prisma.winNotice.create({
            data: {
                bidId: bidId,
                price: price,
                adId: adId,
            },
        });

        const stats = await prisma.adStats.findFirst({
            where: {campaignId},
        });
        if (stats) {
            const updatedStats = await prisma.adStats.update({
                where: {id: stats.id},
                data: {
                    spend: stats.spend + price,
                    impressions: stats.impressions + 1,
                },
            });
            console.log('AdStats updated:', updatedStats);
        } else {
            const newStats = await prisma.adStats.create({
                data: {
                    campaignId:campaignId,
                    spend: price,
                    impressions: 1,
                },
            });
            console.log('AdStats created:', newStats);
        }

        console.log(`WinNotice saved: Bid ID ${bidId}, Price ${price}, Ad ID ${adId}`, winNotice);
        res.status(200).send('WinNotice processed');
    } catch (error) {
        console.error(`Error processing WinNotice: ${error?.message}`);
        res.status(500).send('Error processing WinNotice');
    }
});

// Conversion Tracking
router.post('/conversion', async (req: Request, res: Response) => {
    const {bidId, userId, actionType, campaignId, price} = req.body;

    try {
        console.log(`Conversion received: Bid ID ${bidId}, User ID ${userId}, Action ${actionType}`);

        const Conversion = await prisma.conversions.create({
            data: {
                bidId: bidId,
                userId: userId,
                actionType: actionType,
                price: price ? parseFloat(price): 0,
                adId: campaignId
            },
        });

        const stats = await prisma.adStats.findFirst({
            where: { campaignId },
        });

        if (stats) {
            const updatedStats = await prisma.adStats.update({
                where: { id: stats.id },
                data: {
                    installs: stats.installs + 1,
                    revenue: stats.revenue + price,
                },
            });
            console.log('AdStats updated:', updatedStats);
        } else {
            const newStats = await prisma.adStats.create({
                data: {
                    campaignId,
                    installs: 1,
                    revenue: price,
                },
            });
            console.log('AdStats created:', newStats);
        }
        console.log(`Conversion saved: Bid ID ${bidId}, User ID ${userId}, Action ${actionType}`, Conversion);
        res.status(200).send('Conversion processed');
    } catch (error) {
        console.error(`Error processing Conversion: ${error?.message}`);
        res.status(500).send('Error processing Conversion');
    }
});

export default router;