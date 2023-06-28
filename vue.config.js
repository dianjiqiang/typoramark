const { defineConfig } = require("@vue/cli-service");
const AutoImport = require("unplugin-auto-import/webpack");
const Components = require("unplugin-vue-components/webpack");
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");
const hljs = require("highlight.js");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            {
              loader: "html-loader",
            },
            {
              loader: "markdown-loader",
              options: {
                highlight: (code) => {
                  if (
                    code[0] === "<" ||
                    code.includes("template") ||
                    code.includes("script")
                  ) {
                    return hljs.highlight("html", code).value;
                  } else if (code.includes("npm")) {
                    return hljs.highlight("bash", code).value;
                  } else if (code.includes("js")) {
                    return hljs.highlight("JavaScript", code).value;
                  } else if (code.includes("jsx")) {
                    return hljs.highlight("jsx", code).value;
                  } else if (code.includes("vue")) {
                    return hljs.highlight("vue", code).value;
                  } else if (code.includes("ts")) {
                    return hljs.highlight("typescript", code).value;
                  } else if (code.includes("tsx")) {
                    return hljs.highlight("tsx", code).value;
                  } else if (code.includes("typescript")) {
                    return hljs.highlight("typescript", code).value;
                  } else if (code.includes("javascript")) {
                    return hljs.highlight("javascript", code).value;
                  } else if (code.includes("c#")) {
                    return hljs.highlight("c#", code).value;
                  } else if (code.includes("c++")) {
                    return hljs.highlight("c++", code).value;
                  } else if (code.includes("shell")) {
                    return hljs.highlight("shell", code).value;
                  } else if (code.includes("txt")) {
                    return hljs.highlight("txt", code).value;
                  } else {
                    return hljs.highlight("JavaScript", code).value;
                  }
                },
                pedantic: false,
                gfm: true,
                tables: true,
                breaks: false,
                sanitize: false,
                smartLists: true,
                smartypants: false,
                xhtml: false,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      require("unplugin-element-plus/webpack")(),
      AutoImport({
        eslintrc: {
          enabled: true,
        },
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
});
