// from https://github.com/chiangs/remix-starter
import hq from "alias-hq";

const config = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  // testEnvironment: "jest-environment-jsdom",
  // setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/?(*.)+(test).(js|ts)?(x)"],
  transform: {
    "^.+\\.js$": ["esbuild-jest"],
    "^.+\\.tsx?$": [
      "esbuild-jest",
      {
        sourcemap: true,
        loaders: {
          ".test.ts": "tsx",
        },
      },
    ],
  },
  moduleNameMapper: hq.get("jest"),
};
export default config;
