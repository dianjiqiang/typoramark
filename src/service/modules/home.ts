import keyieRequest from "..";

// 现在我们发送网络请求 我们现在这一步 要决定 后续then的类型 如果我们设置any全局都是any类型 我们现在要定义结果类型
interface IHomeData {
  data: any;
  returnCode: string;
  success: boolean;
}

export function getHomeMutatildata() {
  // 给我们当前某一个请求添加拦截器
  return keyieRequest.request<IHomeData>({
    url: "/home/multidata",
  });
}
