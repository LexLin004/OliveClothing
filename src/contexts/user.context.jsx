/** Reducer Version */

import { createContext, useEffect, useReducer } from "react";

import { onAuthStateChangedListener, createUserDocumentFromAuth } from "../utils/firebase/firebase.utils";

import { createAction } from "../utils/reducer/reducer.utils";

export const UserContext = createContext({
    /** initialize */
    currentUser: null,
    setCurrentUser: () => null,
});


export const USER_ACTION_TYPES = {
    'SET_CURRENT_USER': 'SET_CURRENT_USER'
}

const userReducer = (state, action) => {
    // console.log('dispatched');
    // console.log(action);
    const { type, payload } = action;

    switch (type) {
        case USER_ACTION_TYPES.SET_CURRENT_USER:
            return {
                ...state, // 不更改其余的state value (state中存储的是以前的值)
                currentUser: payload
            }
        default:
            throw new Error(`Unhandled type ${type} in the userReducer`);
    }
}

const INITIAL_STATE = {
    currentUser: null
}

/** provider: actual component */
export const UserProvider = ({ children }) => {
    /** UserProvider is essentially allowing any of its child ({children <app />}) components to
     * access the values inside of its use state (currentUser, setCurrentUser). */
    // const [currentUser, setCurrentUser] = useState(null); 使用了reducer 后，不需要使用useState来获取context中的内容了
    const [ state, dispatch ] = useReducer(userReducer, INITIAL_STATE);
    
    /** reducer: take two input, return two output
     * output: 
     *  state object: the current values that's being stored by this reducer.
     *  a dispatch function: it's a function that whenever you call it, you pass it an action object.
     *      So if you want this user reducer to receive an action, you have to call dispatch and dispatch will
     *      take that action and then pass it into the switch and update the reducer accordingly.
     */
    const {currentUser} = state;
    // console.log(currentUser);
    const setCurrentUser = (user) => {
        dispatch(createAction(USER_ACTION_TYPES.SET_CURRENT_USER, user));
    }

    const value = { currentUser, setCurrentUser };

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((user) => { // get null when user sign out, get user obj when sign in
            if (user) {
                createUserDocumentFromAuth(user); // 当有user obj pass through时，创建user doc in db, 若user已存在，则不会创建(createUserDocumentFromAuth已内建此功能)
            }
            setCurrentUser(user);
        }) /** 本身是open listener, 永久监听是否auth状态有变化；但我们需要关闭它当component is unmount */
        return unsubscribe
    }, []); // run once when the component mounts

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}


/** reduce instance

const userReducer = (state, action) => {
    return {
        currentUser: ...
    }
}
user reducer is just a function and what it will do is give us back some object that has the shape of the data that we want to store.
The thing about reducers is that these reducers change the object that we get back and the properties and the values inside them based on the action.
reducers return back an object. This object is the state in the reducer.
So what we get back is actually this current value from the reducer.
And the reason why is sometimes you want to reference these values in order to derive what the next value should be. So the reducer gives that to you.
and based off the state and the action is how we can determine what are the values on this object that we want to give back?
 */




/** UseContext Version */

// import { createContext, useState, useEffect } from "react";

// import { onAuthStateChangedListener, createUserDocumentFromAuth } from "../utils/firebase/firebase.utils";

// // 类似于 redux store 的作用，使得app树下的每一个component都能快速访问需要的数据
// /** as the actual value you want to access */
// export const UserContext = createContext({
//     /** initialize */
//     currentUser: null,
//     setCurrentUser: () => null,
// });

// /** provider: actual component */
// export const UserProvider = ({ children }) => {
//     /** UserProvider is essentially allowing any of its child ({children <app />}) components to
//      * access the values inside of its use state (currentUser, setCurrentUser). */
//     const [currentUser, setCurrentUser] = useState(null);
//     const value = { currentUser, setCurrentUser };

//     useEffect(() => {
//         const unsubscribe = onAuthStateChangedListener((user) => { // get null when user sign out, get user obj when sign in
//             if (user) {
//                 createUserDocumentFromAuth(user); // 当有user obj pass through时，创建user doc in db, 若user已存在，则不会创建(createUserDocumentFromAuth已内建此功能)
//             }
//             setCurrentUser(user);
//         }) /** 本身是open listener, 永久监听是否auth状态有变化；但我们需要关闭它当component is unmount */
//         return unsubscribe
//     }, []); // run once when the component mounts

//     return <UserContext.Provider value={value}>{children}</UserContext.Provider>
// }