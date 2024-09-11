"use client";

import { createContext, useRef, useEffect, useState ,useContext} from 'react';
import { UserContext } from './UserContext';
export const GroupContext = createContext();

const ws_url = process.env.NEXT_PUBLIC_WS_URL;
export const GroupProvider = ({ children }) => {
  const [joined, setjoine] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const conversationRef = useRef(null);
    const { userInfo} = useContext(UserContext);
    useEffect(() => {
      conversationRef.current = new WebSocket(`${ws_url}/create_or_add_to_groups/`);

      conversationRef.current.onopen = () => {
        conversationRef.current.send(JSON.stringify({
          my_userID: userInfo?.id,
        }));
        setIsConnected(true);
      };

        conversationRef.current.onmessage = (e) => {
          const data = JSON.parse(e.data);
          
        };

  
      conversationRef.current.onclose = () => {
        setIsConnected(false);
      };

      return () => {
        if (conversationRef.current) {
            conversationRef.current.close();
        }
      };
    }, []);

    return (
        <GroupContext.Provider value={{
            conversationRef,
            isConnected
        }}>
            {children}
        </GroupContext.Provider>
    );
};
