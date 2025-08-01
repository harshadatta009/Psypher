import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    const { userId } = getAuth(req);
    if (!userId) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { tier } = (await req.json()) as { tier: string };
    if (!['silver', 'gold', 'platinum'].includes(tier)) {
        return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    try {
        const client = await clerkClient();
        await client.users.updateUser(userId, { publicMetadata: { tier } });
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
