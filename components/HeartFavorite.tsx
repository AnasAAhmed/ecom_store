"use client"

import { useUser } from "@clerk/nextjs";
import { Heart, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface HeartFavoriteProps {
  productId: string;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const HeartFavorite = ({ productId, updateSignedInUser }: HeartFavoriteProps) => {
  const router = useRouter();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getUser = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setIsLiked(data.wishlist.includes(productId));
    } catch (err) {
      console.log("[users_GET]", err);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      if (!user) {
        router.push("/sign-in");
        return;
      } else {
        setLoading(true)
        const res = await fetch("/api/users/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId }),
        });
        const updatedUser = await res.json();
        setIsLiked(updatedUser.user.wishlist.includes(productId));
        toast.success(`${updatedUser.isLiked ? "Removed from" : "Added in"} your wishlists`)
        updateSignedInUser && updateSignedInUser(updatedUser);
      }
    } catch (err) {
      toast.error("Error in your wishlists")
      console.log("[wishlist_POST]", err);
    } finally {
      setLoading(false);

    }
  };

  return (
    <button onClick={handleLike}>
      {loading ? <Loader className="animate-spin" /> : <Heart fill={`${isLiked ? "red" : "white"}`} />}
    </button>
  );
};

export default HeartFavorite;
