import keyieRequest from "..";

export const userLogin = (name: string, password: string) => {
  return keyieRequest.post({
    url: "/login",
    data: { name, password },
  });
};
