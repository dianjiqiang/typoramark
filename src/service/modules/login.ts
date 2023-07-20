import keyieRequest from "..";

// 用户登录
export const userLogin = (name: string, password: string) => {
  return keyieRequest.post({
    url: "/login",
    data: { name, password },
  });
};

// 测试用户登录
export const testUserLogin = () => {
  return keyieRequest.get({
    url: "/login/test",
  });
};

// 获取分享码对应的文件树
export const getShareCodeTree = (shareCode: string) => {
  return keyieRequest.get({
    url: `/markdown/file/tree/share/${shareCode}`,
  });
};

// 注册用户
export const registerUser = (name: string, password: string, code: string) => {
  return keyieRequest.post({
    url: `/markdown/file/tree/private`,
    data: { name, password, code },
  });
};
