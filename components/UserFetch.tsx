'use client';
import { useWhishListUserStore } from '@/lib/hooks/useCart';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

const UserFetcher = () => {
    const { isSignedIn } = useUser();  // Always call useUser, no condition here
    const { user, setUser, resetUser } = useWhishListUserStore();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/users');
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.log('[users_GET]', err);
                resetUser();
            }
        };

        if (isSignedIn && !user) {  // Use isSignedIn conditionally within useEffect
            fetchUserData();
        }
    }, [isSignedIn, user, setUser, resetUser]);  // Add isSignedIn as a dependency

    return null; // This component doesn't need to render anything
};

export default UserFetcher;
