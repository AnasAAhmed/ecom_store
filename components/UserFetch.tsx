'use client'
import { useWhishListUserStore } from '@/lib/hooks/useCart';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

const UserFetcher = () => {

    const { isSignedIn } = useUser()
    if (!isSignedIn) return;
    const user = useWhishListUserStore((state) => state.user);
    const setUser = useWhishListUserStore((state) => state.setUser);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/users');
                const data = await res.json();
                setUser(data);
                console.log('kkk');
                
            } catch (err) {
                console.log('[users_GET]', err);
                // Optionally reset the user in case of an error
                useWhishListUserStore.getState().resetUser();
            }
        };

        if (!user) {
            fetchUserData();
        }
    }, [user, setUser]);

    return null; // This component doesn't need to render anything
};

export default UserFetcher;
