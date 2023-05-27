import {io} from 'socket.io-client';
import {createContext,PropsWithChildren,useContext,useMemo} from 'react';
// type socketType = typeof socket | null;
const socketContext = createContext<any>(null)

export const useSocket = () => {
    return useContext(socketContext);
}


export const SocketProvider:React.FC<PropsWithChildren> = ({children}) => {
    
    const socket = useMemo(() => io('http://localhost:3000'),[] );
    return (
        <socketContext.Provider value={{socket}}>
            {children}
        </socketContext.Provider>
    )
};


