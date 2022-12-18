/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: [".*"],
  // appDirectory: "app",
  assetsBuildDirectory: "public/v2/build",
  // serverBuildPath: "build/index.js",
  publicPath: "/v2/build/",
  // devServerPort: 8002
  serverDependenciesToBundle: [/^konva.*/, "react-konva"],
};
