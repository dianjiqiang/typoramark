import keyieRequest from "..";
import type { UploadFile } from "element-plus";

// 现在我们发送网络请求 我们现在这一步 要决定 后续then的类型 如果我们设置any全局都是any类型 我们现在要定义结果类型

// 获取文件详情
export function getHomeMdFile(id: string, shareCode?: string) {
  const url1 = `/markdown/detail/${id}?shareCode=${shareCode}`;
  const url2 = `/markdown/detail/${id}`;
  // 给我们当前某一个请求添加拦截器
  return keyieRequest.request<any>({
    url: shareCode ? url1 : url2,
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
    url: "/markdown/file/tree/private",
  });
}

// 创建文件夹
export type folderReturnType = {
  data?: string;
  msg?: string;
  code: number;
};
export type createFileType = {
  url: string;
  name: string;
};
export function createFolder(file: createFileType) {
  return keyieRequest.post<folderReturnType>({
    url: "/markdown/create/dir",
    data: file,
  });
}

// 上传文件
export type uploadFileType = {
  md: UploadFile;
  url: string;
};
export function postUploadFile(file: uploadFileType) {
  return keyieRequest.file({
    url: "/markdown?url=" + encodeURIComponent(file.url),
    data: {
      md: file.md.raw,
    },
  });
}

// 删除文件夹
export function deleteFolder(url: string) {
  return keyieRequest.delete({
    url: "/markdown/delete/dir",
    data: {
      url,
    },
  });
}

// 重命名文件夹
export function patchRenameFolder(data: { oldUrl: string; newUrl: string }) {
  return keyieRequest.patch({
    url: "/markdown/rename/dir",
    data: {
      ...data,
    },
  });
}

// 下载markdown文件
export function downLoadMarkDownFile(id: string) {
  return keyieRequest.get({
    url: "/markdown/" + id,
  });
}

// 删除markdown文件
export function deleteMarkDownFile(id: string) {
  return keyieRequest.delete({
    url: "/markdown/" + id,
  });
}

// 重命名 markdown文件
export function renameMarkDownFile(data: { id: string; newFileName: string }) {
  return keyieRequest.patch({
    url: "/markdown/" + data.id,
    data: {
      newFileName: data.newFileName,
    },
  });
}

// 保存markdown文件
export function saveEditMarkdown(data: { id: string; text: string }) {
  return keyieRequest.put({
    url: "/markdown/modify/" + data.id,
    data: {
      content: data.text,
    },
  });
}

// 验证口令是否正确
export function verifyAccessKey(accessKey: string) {
  return keyieRequest.post({
    url: "/permission/verify",
    data: { accessKey },
  });
}

// 创建分享
export function createShare(sharePath: string, shareCode: string) {
  return keyieRequest.post({
    url: "/markdown/file/tree/share",
    data: { sharePath, shareCode },
  });
}

// 获取所有分享
export function getShares() {
  return keyieRequest.get({
    url: "/markdown/file/tree/share",
  });
}

// 取消某个分享
export function cancelShare(shareCode: string) {
  return keyieRequest.delete({
    url: `/markdown/file/tree/share/${shareCode}`,
  });
}
