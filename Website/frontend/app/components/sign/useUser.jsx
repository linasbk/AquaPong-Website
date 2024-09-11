"use client";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

const useUser = () => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUser(decodedToken);
        } catch (error) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }, []);
  
    return user;
  };

export default useUser;