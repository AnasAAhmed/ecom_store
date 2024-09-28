// "use client";

// import Loader from "@/components/Loader";
// import ProductCard from "@/components/ProductCard";
// import { useWhishListUserStore } from "@/lib/hooks/useCart";
// import { useEffect, useState } from "react";

// const Wishlist = () => {
//   const { user } = useWhishListUserStore();
//   const [loading, setLoading] = useState(true);
//   const [signedInUser, setSignedInUser] = useState<UserType | null>(null);
//   const [wishlist, setWishlist] = useState<ProductType[]>([]);

//   useEffect(() => {
//     if (user) {
//       setSignedInUser(user);
//     } else {
//       setLoading(false); // Ensure loading state is reset when user is not authenticated
//     }
//   }, [user]);

//   // const getWishlistProducts = async () => {
//   //   setLoading(true);

//   //   if (!signedInUser) {
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   try {
//   //     const wishlistProducts = await Promise.all(
//   //       signedInUser.wishlist.map(async (productId) => {
//   //         const res = await fetch(`/api/products/${productId}`);
//   //         return res.json();
//   //       })
//   //     );
//   //     setWishlist(wishlistProducts);
//   //   } catch (err) {
//   //     console.log("[wishlist_GET]", err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const getWishlistProducts = async () => {
//     setLoading(true);

//     if (!signedInUser) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`/api/products`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ productIds: signedInUser.wishlist.map((i)=>productId) }),
//       });

//       const wishlistProducts = await res.json();
//       setWishlist(wishlistProducts);
//     } catch (err) {
//       console.log("[wishlist_GET]", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     if (signedInUser) {
//       getWishlistProducts();
//     }
//   }, [signedInUser]);

//   const updateSignedInUser = (updatedUser: UserType) => {
//     setSignedInUser(updatedUser);
//     // Refresh the wishlist after updating the signed-in user
//     setLoading(true); // Set loading to true while fetching updated wishlist
//     getWishlistProducts();
//   };

//   return loading ? (
//     <Loader />
//   ) : (
//     <div className="px-10 py-5  min-h-[90vh]">
//       <p className="text-heading3-bold my-10">Your Wishlist</p>
//       {wishlist.length === 0 && <p>No items in your wishlist</p>}

//       <div className="flex flex-wrap justify-center gap-16">
//         {wishlist.map((product) => (
//           <ProductCard key={product._id} product={product} updateSignedInUser={updateSignedInUser} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export const dynamic = "force-dynamic";

// export default Wishlist;

import ProductCard from "@/components/ProductCard";
import { FC } from "react";
import { auth } from "@clerk/nextjs/server";
import { getWishList } from "@/lib/actions/actions";
import type { Metadata } from 'next';

export const metadata: Metadata= {
  title: "Borcelle | Wishlist",
  description: "This is wishlist products",
};

const WishlistPage: FC = async () => {
  const { userId } = auth()
  if (!userId) return;
  const wishlist = await getWishList(userId!);


  if (!wishlist || wishlist.wishlist.length === 0) {
    return (
      <div className="px-10 py-5 min-h-[90vh]">
        <p className="text-heading3-bold my-10">Your Wishlist</p>
        <p>No items in your wishlist</p>
      </div>
    );
  }

  return (
    <div className="px-10 py-5 min-h-[90vh]">
      <p className="text-heading3-bold my-10">Your Wishlist</p>
      <div className="flex flex-wrap justify-center gap-16">
        {wishlist.wishlist.map((product: ProductType) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
