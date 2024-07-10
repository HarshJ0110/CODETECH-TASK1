import { useState } from "react";
import { createContext } from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}){
    const [userInfo, setUserInfo] = useState({});
    // const [postInfo, setPostInfo] = useState(null);

    return(
        <UserContext.Provider value={{userInfo, setUserInfo}}>
            {children}
        </UserContext.Provider>
    )
}