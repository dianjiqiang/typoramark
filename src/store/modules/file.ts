import { defineStore } from "pinia";

export type FileType = {
  label: string;
  id: string;
  type: string;
  path: string;
  name?: string;
  folderName?: string;
};

export type FolderType = {
  id: string;
  label: string;
  path: string;
  name: string;
  type: string;
  children: FileType[];
};

export type folderInFileType = FolderType[];

export type outlineType = {
  id: string;
  label: string;
  type: number;
  children?: outlineType[];
};

const useFile = defineStore("file", {
  state() {
    return {
      folderInFile: [] as folderInFileType,
      outlineData: [] as outlineType[],
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
