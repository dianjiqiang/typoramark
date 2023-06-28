import keyieRequest from "..";

// 现在我们发送网络请求 我们现在这一步 要决定 后续then的类型 如果我们设置any全局都是any类型 我们现在要定义结果类型

// 获取文件详情
export function getHomeMdFile(id: string) {
  // 给我们当前某一个请求添加拦截器
  return keyieRequest.request<any>({
    url: "/markdown/detail/" + id,
  });
}

// 下载文件
export function getDownLoadMdFile(id: string) {
  return keyieRequest.request<any>({
    url: "/markdown/" + id,
  });
}

// 获取文件树
export function getFileTree() {
  return keyieRequest.request<any>({
    url: "/markdown/file/tree",
  });
}
