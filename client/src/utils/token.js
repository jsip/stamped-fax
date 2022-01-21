export const Token = () => {
  return {
    token: sessionStorage.getItem("tokensss"),
    setToken: (token) => {
      sessionStorage.setItem(`tokensss`, token);
    },
    deleteToken: () => {
      sessionStorage.removeItem(`tokensss`);
    },
  };
};
