import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string;
  size?: string;
  stock: number;
  variantId?: string;
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
        const { item, quantity, color, size, stock, variantId } = data;
        const currentItems = get().cartItems;
        const isExisting = currentItems.find(
          (cartItem) => cartItem.item._id === item._id
        );
        let newCartItems = currentItems;
        if (isExisting) {
          newCartItems = currentItems.filter(
            (cartItem) => cartItem.item._id !== item._id
          );
        };

        set({ cartItems: [...newCartItems, { item, quantity, color, size, stock, variantId }] });
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
        const newCartItems = get().cartItems.map((cartItem) => {
          if (cartItem.item._id === idToDecrease) {
            if (cartItem.quantity > 1) {
              return { ...cartItem, quantity: cartItem.quantity - 1 }
            };
          };
          return cartItem;
        });
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
  exchangeRate: number;
  lastFetched: number | null;
  setCountry: (country: string) => void;
  setCurrency: (currency: string) => void;
  clearcur: () => void;
  clearcor: () => void;
}

export const useRegion = create<RegionStore>()(
  persist(
    (set, get) => ({
      country: '',
      currency: 'USD', // default to 'USD'
      exchangeRate: 1, // default to 1 for USD
      lastFetched: null,

      setCountry: (country) => set({ country }),

      setCurrency: async (currency) => {
        if (currency === 'USD') set({ exchangeRate: 1 });
        if (currency === 'PKR') set({ exchangeRate: 200 });
        const currentTime = Date.now();
        const threeDays = 3 * 24 * 3600 * 1000; // 3 days in milliseconds
        const shouldFetch =
          currency !== 'USD' && currency !== 'PKR' &&// Only fetch if the currency is not USD
          (currency !== get().currency || !get().lastFetched || currentTime - get().lastFetched! > threeDays);
        if (shouldFetch) {
          let exchangeRate;
          try {
            const response = await fetch(
              `https://api.currencyapi.com/v3/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API}&base_currency=USD&currencies=${currency}`
            );
            const data = await response.json();
            console.log('currency-api:success');
            exchangeRate = data.data?.[currency.toUpperCase()]?.value || 1;

          } catch (error) {
            const typeError = error as Error;
            console.log('currency-api:Failed:' + typeError.message);
          }

          // Access the correct exchange rate from the response
          set({ currency, exchangeRate, lastFetched: currentTime });
        } else {
          set({ currency });
          console.log('currency-api:set');
        }
      },

      clearcur: () => set({ currency: 'USD', exchangeRate: 1 }), // reset to default USD
      clearcor: () => set({ country: '' }),
    }),
    {
      name: "region-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
interface UserState {
  user: {
    clerkId: string;
    wishlist: [string];
    createdAt: string;
    updatedAt: string;
  } | null;
  setUser: (user: any) => void;
  resetUser: () => void;
}

export const useWhishListUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
}));
export default useCart;



