import React, { useState, useContext, createContext, useEffect } from "react";
import { useToast } from "./useToast";
import { AuthService } from "../services/Auth";
import { Cookie } from "../storage/Cookie";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({
  user: { name: "", email: "" },
  token: "",
  handleLogin: async (username, pass) => {},
  handleRegister: async (name, pass, email, cpf) => {},
  handleLogout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const addToast = useToast();
  const { login, register } = AuthService();

  const decodeToken = (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Token inválido: ", error);
      return null;
    }
  };

  useEffect(() => {
    const storageToken =
      token || Cookie.getCookie("user");
    if (storageToken) {
      const decodedUser = decodeToken(storageToken);
      if (decodedUser) {
        setUser({ name: decodedUser.name, email: decodedUser.email });
      }
    }
  }, []);

  useEffect(() => {
    const storageToken =
      token || Cookie.getCookie("user");
    if (storageToken) {
      const decodedUser = decodeToken(storageToken);
      if (decodedUser) {
        setUser({ name: decodedUser.name, email: decodedUser.email });
      }
    }
  }, [token]);

  const handleLogin = async (username, pass) => {
    if (!username || !pass) {
      addToast("Insira os campos corretamente!", "fail");
      return;
    }

    const response = await login(username, pass);
    if (response) {
      Cookie.setCookie("user", response.token, 1);
      setToken(response.token);
    }
    addToast(response.data, !response.token ? "fail" : "success");
  };

  const handleRegister = async (name, pass, email, cpf) => {
    if (!name || !pass || !email || !cpf) {
      addToast("Insira os campos corretamente!", "fail");
      return;
    }
    try {
      const response = await register(name, email, pass, cpf);
      if (response) {
        console.log(response);
        addToast(response.data, !response.error ? "fail" : "success");
      }
    } catch (error) {
      addToast("Erro ao fazer registro!", "fail");
    }
  };

  const handleLogout = () => {
    Cookie.eraseCookie("user");
    setToken(null);
    setUser(null);
    addToast("Logout bem-sucedido!", "success");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, handleLogin, handleRegister, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Need AuthProvider!");
  }

  return context;
};
