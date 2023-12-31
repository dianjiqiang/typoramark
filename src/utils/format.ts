import type {
  outlineType,
  folderInFileType,
  FileType,
} from "@/store/modules/file";

export const formatMarkdown = (str: string) => {
  const reg = /<(h1|h2|h3|h4)[^>]*>(.*?)<(\/h1|\/h2|\/h3|\/h4)>/gi;

  let newTree: outlineType[] = [];
  const res = str.split(reg);
  for (let i = 0; i < res.length; i++) {
    if (res[i] === "h1") {
      i++;
      const newChild = {
        id: String(Math.random()),
        label: res[i],
        type: 1,
        children: [],
      };
      newTree.push(newChild);
    } else if (res[i] === "h2") {
      i++;
      const newChild = {
        id: String(Math.random()),
        label: res[i],
        type: 2,
        children: [],
      };
      if (newTree[newTree.length - 1]?.children) {
        newTree[newTree.length - 1]?.children?.push(newChild);
      } else {
        if (newTree[newTree.length - 1]) {
          newTree[newTree.length - 1].children = [newChild];
        } else {
          newTree = [newChild];
        }
      }
    } else if (res[i] === "h3") {
      i++;
      const newChild = {
        id: String(Math.random()),
        label: res[i],
        type: 3,
        children: [],
      };
      const c1 = newTree[newTree.length - 1].children;
      if (c1?.length) {
        const c2 = c1?.[c1.length - 1]?.children;
        if (c2?.length) {
          c2?.push(newChild);
        } else {
          c1[c1.length - 1].children = [newChild];
        }
      } else {
        if (newTree[newTree.length - 1]) {
          newTree[newTree.length - 1].children = [newChild];
        } else {
          newTree = [newChild];
        }
      }
    } else if (res[i] === "h4") {
      i++;
      const newChild = {
        id: String(Math.random()),
        label: res[i],
        type: 4,
        children: [],
      };
      const c1 = newTree[newTree.length - 1].children;
      if (c1?.length) {
        const c2 = c1?.[c1.length - 1]?.children;
        if (c2?.length) {
          const c3 = c2[c2.length - 1].children;
          if (c3?.length) {
            c3?.push(newChild);
          } else {
            c2[c2.length - 1].children = [newChild];
          }
        } else {
          c1[c1.length - 1].children = [newChild];
        }
      } else {
        if (newTree[newTree.length - 1]) {
          newTree[newTree.length - 1].children = [newChild];
        } else {
          newTree = [newChild];
        }
      }
    }
  }

  return newTree;
};

export const findFiles = (tree: folderInFileType) => {
  const newArray: FileType[] = [];
  tree.forEach((item) => {
    if (item.type === "file") {
      newArray.push(item);
    } else {
      if (item.children.length) {
        const folderName = item?.name;
        item.children.forEach((item) => {
          if (item.type === "file") {
            newArray.push({ ...item, folderName });
          }
        });
      }
    }
  });
  return newArray;
};

// export const clearCodeInspan = (str: string) => {
//   const $ = load(str);

//   // 删除带有 class 属性的 span 元素，保留内容
//   for (let index = 0; index < 5; index++) {
//     $("span[class]").each(function () {
//       $(this).replaceWith($(this).html() as string);
//     });
//   }

//   let decodedString = $.html().replaceAll("<https: ", "https://");
//   decodedString = decodedString.replaceAll('.png="">', ".png");
//   decodedString = decodedString.replaceAll('.com="" img="" ', ".com/img/");
//   decodedString = decodedString.replaceAll("¨NBSP;", " ");

//   decodedString = decodedString.replaceAll(
//     /(<html>|<\/html>|<!-- -->|<head>|<\/head>|<body>|<\/body>|<\/https:>)/gi,
//     ""
//   );

//   // 输出修改后的 HTML
//   return decodedString;
// };
