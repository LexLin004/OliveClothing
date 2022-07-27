/** UseReducer version */
import { createContext, useReducer } from 'react';

import { createAction } from '../utils/reducer/reducer.utils';

const addCartItem = (cartItems, productToAdd) => {
    // find if cartItems contains productToAdd
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === productToAdd.id
    );
    // If found, increment quantity
    if (existingCartItem) {
        return cartItems.map((cartItem) =>
            cartItem.id === productToAdd.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
        );
    }
    // return new array with modified cartItems / new cart item
    return [...cartItems, { ...productToAdd, quantity: 1 }];
};

/** retrun new array, 而不是 return mutated array的原因是 只有return new array才能re-render （其他component接受的prop是cartItem, eg. cart-item.component.jsx） */
const removeCartItem = (cartItems, cartItemToRemove) => {
    // find the cart item to remove
    const existingCartItem = cartItems.find(
        (cartItem) => cartItem.id === cartItemToRemove.id
    );
    // Check if quantity is equal to 1, if it is, remove that item from the cart
    /** filter gives us back a new array where the array is going to have removed whatever matches. */

    if (existingCartItem.quantity === 1) {
        return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id);
        /** filter out anything here that equals false.
         * if this statement evaluates true, then keep the value.
         * 
         */
    }

    // return back cartitems with matching cart item with reducd quantity
    if (existingCartItem) {
        return cartItems.map((cartItem) =>
            cartItem.id === cartItemToRemove.id
                ? { ...cartItem, quantity: cartItem.quantity - 1 }
                : cartItem
        );
    }
};

const clearCartItem = (cartItems, cartItemToClear) => {
    return cartItems.filter(cartItem => cartItem.id !== cartItemToClear.id);
};

export const CartContext = createContext({
    isCartOpen: false,
    setIsCartOpen: () => { },
    cartItems: [],
    addItemToCart: () => { },
    removeItemFromCart: () => { },
    clearItemFromCart: () => { },
    cartCount: 0,
    cartTotal: 0
});

const CART_ACTION_TYPES = {
    SET_IS_CART_OPEN: 'SET_IS_CART_OPEN',
    SET_CART_ITEMS: 'SET_CART_ITEMS',
    SET_CART_COUNT: 'SET_CART_COUNT',
    SET_CART_TOTAL: 'SET_CART_TOTAL',
};

const INITIAL_STATE = {
    cartCount: 0,
    cartTotal: 0,
    cartItems: [],
    isCartOpen: false,
};

const cartReducer = (state, action) => {
    const { type, payload } = action;

    // payload = { cartItems, cartCount, cartTotal } 应有这样的结构

    switch (type) {
        case CART_ACTION_TYPES.SET_CART_ITEMS:
            return {
                ...state,
                ...payload
            };
        case CART_ACTION_TYPES.SET_IS_CART_OPEN:
            return {
                ...state,
                isCartOpen: payload
            }
        default:
            throw new Error(`unhandled type of ${type} in cartReducer`)
    }
}

export const CartProvider = ({ children }) => {
    const [{ cartCount, cartTotal, cartItems, isCartOpen}, dispatch] = 
        useReducer(cartReducer, INITIAL_STATE);

    //separating out this new function that will allow us to dispatch the appropriate payload so that we can update our reducer with the correct value.
    const updateCartItemsReducer = (newCartItems) => {
        // generate newCartTotal
        const newCartCount = newCartItems.reduce(
            (total, cartItem) => total + cartItem.quantity,
            0
        );
        // generate newCartCount
        const newCartTotal = newCartItems.reduce(
            (total, cartItem) => total + cartItem.quantity * cartItem.price,
            0
        );
        // dispatch new action with payload = {newCartItems, newCartTotal, newCartCount}
        const payload = { cartItems: newCartItems, cartCount: newCartCount, cartTotal: newCartTotal, };

        dispatch(createAction(CART_ACTION_TYPES.SET_CART_ITEMS, payload));
    };


    const addItemToCart = (productToAdd) => {
        const newCartItems = addCartItem(cartItems, productToAdd);
        updateCartItemsReducer(newCartItems);
    };

    const removeItemFromCart = (cartItemToRemove) => {
        const newCartItems = removeCartItem(cartItems, cartItemToRemove);
        updateCartItemsReducer(newCartItems);
    };

    const clearItemFromCart = (cartItemToClear) => {
        const newCartItems = clearCartItem(cartItems, cartItemToClear);
        updateCartItemsReducer(newCartItems);
    };

    const setIsCartOpen = (bool) => {
        dispatch(createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool));
    };

    const value = { isCartOpen, setIsCartOpen, addItemToCart, removeItemFromCart, clearItemFromCart, cartItems, cartCount, cartTotal };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};


/** UseContext (useState) version */
// import { createContext, useState, useEffect } from 'react';

// const addCartItem = (cartItems, productToAdd) => {
//     // find if cartItems contains productToAdd
//     const existingCartItem = cartItems.find(
//         (cartItem) => cartItem.id === productToAdd.id
//     );
//     // If found, increment quantity
//     if (existingCartItem) {
//         return cartItems.map((cartItem) =>
//             cartItem.id === productToAdd.id
//                 ? { ...cartItem, quantity: cartItem.quantity + 1 }
//                 : cartItem
//         );
//     }
//     // return new array with modified cartItems / new cart item
//     return [...cartItems, { ...productToAdd, quantity: 1 }];
// };

// /** retrun new array, 而不是 return mutated array的原因是 只有return new array才能re-render （其他component接受的prop是cartItem, eg. cart-item.component.jsx） */
// const removeCartItem = (cartItems, cartItemToRemove) => {
//     // find the cart item to remove
//     const existingCartItem = cartItems.find(
//         (cartItem) => cartItem.id === cartItemToRemove.id
//     );
//     // Check if quantity is equal to 1, if it is, remove that item from the cart
//     /** filter gives us back a new array where the array is going to have removed whatever matches. */

//     if (existingCartItem.quantity === 1) {
//         return cartItems.filter(cartItem => cartItem.id !== cartItemToRemove.id);
//         /** filter out anything here that equals false.
//          * if this statement evaluates true, then keep the value.
//          *
//          */
//     }

//     // return back cartitems with matching cart item with reducd quantity
//     if (existingCartItem) {
//         return cartItems.map((cartItem) =>
//             cartItem.id === cartItemToRemove.id
//                 ? { ...cartItem, quantity: cartItem.quantity - 1 }
//                 : cartItem
//         );
//     }
// };

// const clearCartItem = (cartItems, cartItemToClear) => {
//     return cartItems.filter(cartItem => cartItem.id !== cartItemToClear.id);
// };

// export const CartContext = createContext({
//     isCartOpen: false,
//     setIsCartOpen: () => { },
//     cartItems: [],
//     addItemToCart: () => { },
//     removeItemFromCart: () => { },
//     clearItemFromCart: () => { },
//     cartCount: 0,
//     cartTotal: 0
// });

// export const CartProvider = ({ children }) => {
//     const [isCartOpen, setIsCartOpen] = useState(false);
//     const [cartItems, setCartItems] = useState([]);
//     const [cartCount, setCartCount] = useState(0);
//     const [cartTotal, setCartTotal] = useState(0);

//     useEffect(() => {
//         // 每当cartItems发生改变，run this function
//         const newCartCount = cartItems.reduce(
//             (total, cartItem) => total + cartItem.quantity,
//             0
//         );
//         setCartCount(newCartCount); // 重新计算cart item总数
//     }, [cartItems]);

//     useEffect(() => {
//         // 每当cartItems发生改变，run this function
//         const newCartTotal = cartItems.reduce(
//             (total, cartItem) => total + cartItem.quantity * cartItem.price,
//             0
//         );
//         setCartTotal(newCartTotal); // 重新计算cart item总数
//     }, [cartItems]);

//     const addItemToCart = (productToAdd) => {
//         // function triggered when user click the add to cart button
//         setCartItems(addCartItem(cartItems, productToAdd));
//     }

//     const removeItemFromCart = (cartItemToRemove) => {
//         // function triggered when user click the add to cart button
//         setCartItems(removeCartItem(cartItems, cartItemToRemove));
//     }

//     const clearItemFromCart = (cartItemToClear) => {
//         // function triggered when user click the add to cart button
//         setCartItems(clearCartItem(cartItems, cartItemToClear));
//     }

//     const value = { isCartOpen, setIsCartOpen, addItemToCart, removeItemFromCart, clearItemFromCart, cartItems, cartCount, cartTotal };

//     return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// };