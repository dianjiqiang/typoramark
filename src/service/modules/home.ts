import keyieRequest from "..";
import type { UploadFile } from "element-plus";

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
    url: "/markdown?url=" + file.url,
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
