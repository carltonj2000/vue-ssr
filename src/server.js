const path = require("path");
const express = require("express");
const { createSSRApp } = require("vue");
const { renderToString } = require("@vue/server-renderer");
const manifest = require("../dist/ssr-manifest.json");

const appPath = path.join(__dirname, "../dist", manifest["app.js"]);
const App = require(appPath).default;

const server = express();
server.use("/img", express.static(path.join(__dirname, "../dist", "img")));
server.use("/css", express.static(path.join(__dirname, "../dist", "css")));
server.use("/js", express.static(path.join(__dirname, "../dist", "js")));
server.use(
  "/favicon.ico",
  express.static(path.join(__dirname, "../dist", "favicon.ico"))
);

server.get("*", async (req, res) => {
  const app = createSSRApp(App);
  const appContent = await renderToString(app);
  const html = /* html */ `
<html>
  <head><title>Hello</title><head>
  <link rel="stylesheet" href="${manifest["app.css"]}" />
  <body>
    <div id="app">
    ${appContent}
    </div>
  </body>
</html>`;
  res.end(html);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("server listening on port", PORT));
