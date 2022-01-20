export const useToken = () => {
  return {
    token: sessionStorage.getItem("token"),
    setToken: (token) => {
      sessionStorage.setItem("todken", token);
    },
  };
};
