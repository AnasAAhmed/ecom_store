"use client"

import { useWhishListUserStore } from "@/lib/hooks/useCart";
import { useUser } from "@clerk/nextjs";
import { Heart, Loader } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface HeartFavoriteProps {
  productId: string;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const HeartFavorite = ({ productId, updateSignedInUser }: HeartFavoriteProps) => {
  const router = useRouter();
  const { user } = useWhishListUserStore();

  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  useEffect(() => {
    if (user) {
      console.log(user);
      
      setIsLiked(user.wishlist.includes(productId));
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
        toast.success(`${updatedUser.isLiked ? "Removed from" : "Added in"} your wishlists`);
        updateSignedInUser && updateSignedInUser(updatedUser);
        // revalidatePath('/wishlist')
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
