import { useState, createContext } from 'react';

export const userContext = createContext({
    user: null,
    setUser: () => {},
});

export function UserContextProvider({children}) {
    const [user,setUser] = useState(null);
    return (
        <userContext.Provider value={{user,setUser}}>
        {children}
        </userContext.Provider>
    )
}

