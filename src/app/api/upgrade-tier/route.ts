import { NextRequest, NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
    // Grab userId from the Clerk JWT 
    const { userId } = getAuth(req);
    if (!userId) {
        return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
        );
    }

    // Parse & validate the new tier
    const { tier } = (await req.json()) as { tier: string };
    const allowed = ['silver', 'gold', 'platinum'] as const;
    if (!allowed.includes(tier as any)) {
        return NextResponse.json(
            { error: 'Invalid tier' },
            { status: 400 }
        );
    }

    const client = await clerkClient();

    // Use the server SDK to update publicMetadata
    await client.users.updateUser(userId, {
        publicMetadata: { tier }
    });

    return NextResponse.json({ success: true });
}
