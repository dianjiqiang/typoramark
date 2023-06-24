import type { outlineType } from "@/store/modules/file";

export const formatMarkdown = (str: string) => {
  const reg = /<(h1|h2|h3|h4)[^>]*>(.*?)<(\/h1|\/h2|\/h3|\/h4)>/gi;

  const newTree: outlineType[] = [];
  const res = str.split(reg);
  for (let i = 0; i < res.length; i++) {
    if (res[i] === "h1") {
      i++;
      const newChild = {
        id: String(Math.random()),
        label: res[i],
        type: 1,
      };
      newTree.push(newChild);
    } else if (res[i] === "h2") {
      i++;
      const newChild = {
        id: String(Math.random()),
        label: res[i],
        type: 2,
      };
      if (newTree[newTree.length - 1].children) {
        newTree[newTree.length - 1].children?.push(newChild);
      } else {
        newTree[newTree.length - 1].children = [newChild];
      }
    } else if (res[i] === "h3") {
      i++;
      const newChild = {
        id: String(Math.random()),
        label: res[i],
        type: 3,
      };
      const c1 = newTree[newTree.length - 1].children;
      if (c1) {
        const c2 = c1[c1.length - 1].children;
        if (c2) {
          c2?.push(newChild);
        } else {
          c1[c1.length - 1].children = [newChild];
        }
      } else {
        newTree[newTree.length - 1].children = [newChild];
      }
    } else if (res[i] === "h4") {
      i++;
      const newChild = {
        id: String(Math.random()),
        label: res[i],
        type: 4,
      };
      const c1 = newTree[newTree.length - 1].children;
      if (c1) {
        const c2 = c1[c1.length - 1].children;
        if (c2) {
          const c3 = c2[c2.length - 1].children;
          if (c3) {
            c3?.push(newChild);
          } else {
            c2[c2.length - 1].children = [newChild];
          }
        } else {
          c1[c1.length - 1].children = [newChild];
        }
      } else {
        newTree[newTree.length - 1].children = [newChild];
      }
    }
  }
  return newTree;
};
