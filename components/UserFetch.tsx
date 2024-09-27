'use client';
import { useWhishListUserStore } from '@/lib/hooks/useCart';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

const UserFetcher = () => {
    const { isSignedIn } = useUser();
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
    }, [isSignedIn, user, setUser, resetUser]);

    return null;
};

export default UserFetcher;
