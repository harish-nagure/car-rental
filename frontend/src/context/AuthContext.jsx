// Global auth state + helpers
// (login/logout/register)

import {

  createContext,

  useContext,

  useState

} from "react";

import api from "../api/axios.js";

const AuthContext =
  createContext(null);

export const useAuth = () =>
  useContext(AuthContext);

export function AuthProvider({

  children

}) {

  const [user, setUser] =
    useState(() => {

      const stored =
        localStorage.getItem(
          "user"
        );

      return stored

        ? JSON.parse(stored)

        : null;

    });

  // Save token + user
  const persist = (

    token,

    user

  ) => {

    localStorage.setItem(
      "token",
      token
    );

    localStorage.setItem(

      "user",

      JSON.stringify(user)

    );

    setUser(user);

  };

  // LOGIN

  const login = async (

    role,

    username,

    password

  ) => {

    let url = "";

    if (role === "admin") {

      url =
        "/auth/client/login";

    }

    else if (
      role === "driver"
    ) {

      url =
        "/auth/driver/login";

    }

    else {

      url =
        "/auth/customer/login";

    }

    const { data } =
      await api.post(

        url,

        {
          username,
          password
        }

      );

    persist(
      data.token,
      data.user
    );

  };

  // REGISTER

  const register = async (

    role,

    payload

  ) => {

    let url = "";

    if (role === "admin") {

      url =
        "/auth/client/register";

    }

    else if (
      role === "driver"
    ) {

      url =
        "/auth/driver/register";

    }

    else {

      url =
        "/auth/customer/register";

    }

    const { data } =
      await api.post(

        url,

        payload

      );

    persist(
      data.token,
      data.user
    );

  };

  // LOGOUT

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    setUser(null);

  };

  return (

    <AuthContext.Provider

      value={{

        user,

        login,

        register,

        logout

      }}

    >

      {children}

    </AuthContext.Provider>

  );

}