import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string;
  size?: string;
  stock: number;
  variantId?:string;
}

interface CartStore {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (idToRemove: string) => void;
  increaseQuantity: (idToIncrease: string) => void;
  decreaseQuantity: (idToDecrease: string) => void;
  clearCart: () => void;
  // updateStock: (itemId: string, newStock: number) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cartItems: [],
      addItem: (data: CartItem) => {
        const { item, quantity, color, size, stock,variantId } = data;
        const currentItems = get().cartItems;
        const isExisting = currentItems.find(
          (cartItem) => cartItem.item._id === item._id
        );

        if (isExisting) {
          return toast("Item already in cart", { icon: "🛒" });
        }

        set({ cartItems: [...currentItems, { item, quantity, color, size, stock,variantId }] });
        toast.success("Item added to cart");
      },
      removeItem: (idToRemove: string) => {
        const newCartItems = get().cartItems.filter(
          (cartItem) => cartItem.item._id !== idToRemove
        );
        set({ cartItems: newCartItems });
        toast.success("Item removed from cart");
      },
      increaseQuantity: async (idToIncrease: string) => {
        const newCartItems = get().cartItems.map((cartItem) => {
          if (cartItem.item._id === idToIncrease) {
            if (cartItem.quantity < cartItem.stock) {
              return { ...cartItem, quantity: cartItem.quantity + 1 };
            } else {
              toast.error("Cannot add more, stock limit reached");
            }
          }
          return cartItem;
        });
        set({ cartItems: newCartItems });
      },
      decreaseQuantity: (idToDecrease: string) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.item._id === idToDecrease
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
        set({ cartItems: newCartItems });
      },
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);


interface RegionStore {
  country: string;
  currency: string;
  setCountry: (country: string) => void;
  setCurrency: (currency: string) => void;
  clearcur: () => void;
  clearcor: () => void;
}

export const useRegion = create<RegionStore>()(
  persist(
    (set) => ({
      country: '',
      currency: '',
      setCountry: (country) => set({ country }),
      setCurrency: (currency) => set({ currency }),
      clearcur: () => set({ currency: '' }),
      clearcor: () => set({ country: '' }),
    }),
    {
      name: "region-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;



