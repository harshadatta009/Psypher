'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

type Tier = 'free' | 'silver' | 'gold' | 'platinum';
const tierOrder: Tier[] = ['free', 'silver', 'gold', 'platinum'];

export default function UpgradePage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();

    // Redirect anonymous users away
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.replace('/');
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    if (!isSignedIn) return null;

    const currentTier = (user.publicMetadata.tier as Tier) || 'free';

    const handleUpgrade = async (newTier: Tier) => {
        try {
            const res = await fetch('/api/upgrade-tier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tier: newTier }),
            });
            if (!res.ok) throw new Error((await res.json()).error || res.statusText);

            await user.reload();
            router.push('/events');
        } catch (err: any) {
            console.error(err);
            alert('Upgrade failed: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Upgrade Your Tier</h1>
                <p className="text-gray-700">
                    Current tier:{' '}
                    <span className="font-semibold capitalize">{currentTier}</span>
                </p>

                <div className="space-y-4">
                    {(['silver', 'gold', 'platinum'] as Tier[]).map((t) => {
                        const isDisabled =
                            tierOrder.indexOf(t) <= tierOrder.indexOf(currentTier);
                        const base =
                            'w-full py-3 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition';
                        const enabled =
                            'bg-green-500 hover:bg-green-600 focus:ring-green-300 text-white';
                        const disabledStyles =
                            'bg-gray-200 text-gray-500 cursor-not-allowed ring-offset-gray-100';

                        return (
                            <button
                                key={t}
                                disabled={isDisabled}
                                onClick={() => handleUpgrade(t)}
                                className={`${base} ${isDisabled ? disabledStyles : enabled
                                    }`}
                            >
                                {isDisabled
                                    ? `${t.toUpperCase()} (unavailable)`
                                    : `Upgrade to ${t.toUpperCase()}`}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
