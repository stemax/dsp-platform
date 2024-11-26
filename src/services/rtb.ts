import {prisma} from "../app.ts";

interface BidRequest {
    id: string;
    imp: Array<{
        id: string;
        banner?: { w: number; h: number };
        video?: { w: number; h: number; duration: number };
    }>;
    site?: { id: string; domain: string };
    app?: { id: string; name: string };
    device?: { ua: string; ip: string; geo?: { country: string; city?: string } };
    user?: { id: string; yob?: number; gender?: string };
    bcat?: string[]; // blocked categories
    badv?: string[]; // blocked advertisers
}

interface BidResponse {
    id: string;
    seatbid: Array<{
        bid: Array<{
            id: string;
            impid: string;
            price: number;
            adm: string;
            crid: string;
            adomain: string[];
        }>;
    }>;
}

export async function validateBidRequest(bidRequest: BidRequest): Promise<boolean> {
    return !!(bidRequest.id && bidRequest.imp && bidRequest.imp.length > 0);
}

export async function processBidRequest(bidRequest: BidRequest): Promise<BidResponse | null> {
    // filter eligible impressions
    const eligibleImpressions = bidRequest.imp.filter((impression) =>
        isImpressionEligible(impression, bidRequest) &&
        isGeoEligible(bidRequest.device || {}) &&
        isDemographicEligible(bidRequest.user || {})
    );

    if (eligibleImpressions.length === 0) {
        console.info(`No eligible impressions for request ID: ${bidRequest.id}`);
        return null;
    }

    // generation of bids
    const bids = await Promise.all(eligibleImpressions.map(async (impression) => {
        const price = await calculateBidPrice(impression, bidRequest);

        return {
            id: `bid-${impression.id}`,
            impid: impression.id,
            price: price,
            adm: '<html>Ad content here</html>',
            crid: 'creative-12345',
            adomain: ['example.com'],
        };
    }));

    return {
        id: bidRequest.id,
        seatbid: [{bid: bids}],
    };
}

async function calculateBidPrice(impression: { banner?: { w: number; h: number }; video?: { w: number; h: number; duration: number } }, bidRequest: BidRequest): Promise<number> {
    const geo = bidRequest.device?.geo?.country || 'default';

    const settings = await prisma.bidSettings.findFirst({
        where: { geo },
    });

    if (!settings) {
        console.info(`No bid settings found for geo: ${geo}`);
        return 0;
    }

    // ROI calculation
    const campaignId = bidRequest.app?.id || 'default-campaign';
    const stats = await prisma.adStats.findFirst({ where: { campaignId } });
    const roi = stats ? (stats.revenue / stats.spend || 0) : 0;
    const roiMultiplier = roi > 1 ? 1.2 : 0.8;

    const baseCpm = settings.baseCpm;
    const multiplier = settings.multiplier * roiMultiplier;

    return baseCpm * multiplier;
}

function isImpressionEligible(
    impression: { id: string; banner?: { w: number; h: number }; video?: { w: number; h: number; duration: number } },
    bidRequest: BidRequest
): boolean {
    // filter by size
    if (bidRequest.bcat && bidRequest.bcat.includes('IAB12')) {
        console.info(`Impression ${impression.id} filtered due to blocked category`);
        return false;
    }

    // filter by advertiser
    if (bidRequest.badv && bidRequest.badv.includes('blocked-advertiser.com')) {
        console.info(`Impression ${impression.id} filtered due to blocked advertiser`);
        return false;
    }

    return true;
}

function isGeoEligible(device: { geo?: { country: string; city?: string } }): boolean {
    const allowedCountries = ['US', 'CA', 'UK']; // list of allowed countries
    if (!device.geo || !allowedCountries.includes(device.geo.country)) {
        console.info(`Device filtered due to geo targeting: ${device.geo?.country}`);
        return false;
    }
    return true;
}
function isDemographicEligible(user: { yob?: number; gender?: string }): boolean {
    const currentYear = new Date().getFullYear();
    const age = user.yob ? currentYear - user.yob : null;

    // filter by age
    if (age && (age < 18 || age > 65)) {
        console.info(`User filtered due to age: ${age}`);
        return false;
    }

    // filter by gender
    if (user.gender && user.gender !== 'male') {
        console.info(`User filtered due to gender: ${user.gender}`);
        return false;
    }

    return true;
}