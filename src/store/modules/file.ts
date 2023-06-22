import { defineStore } from "pinia";

export type FileType = {
  name: string;
  id: string;
  path: string;
};

export type FolderType = {
  id: string;
  name: string;
  path: string;
  children: FileType[];
};

export type folderInFileType = FolderType[];

const useFile = defineStore("file", {
  state() {
    return {
      folderInFile: [] as folderInFileType[],
    };
  },
  actions: {
    getFolderNames() {
      console.log("在这里获取所有的文件夹");

      this.folderInFile = [];
    },
  },
});

export default useFile;
