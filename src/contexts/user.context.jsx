import { createContext, useState, useEffect } from "react";

import { onAuthStateChangedListener, createUserDocumentFromAuth } from "../utils/firebase/firebase.utils";

// 类似于 redux store 的作用，使得app树下的每一个component都能快速访问需要的数据
/** as the actual value you want to access */
export const UserContext = createContext({
    /** initialize */
    currentUser: null,
    setCurrentUser: () => null,
});

/** provider: actual component */
export const UserProvider = ({ children }) => {
    /** UserProvider is essentially allowing any of its child ({children <app />}) components to
     * access the values inside of its use state (currentUser, setCurrentUser). */
    const [currentUser, setCurrentUser] = useState(null);
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

