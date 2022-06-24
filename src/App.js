import React, { useEffect } from "react";
import RouteApp from "./router";
import { checkVersion } from "utils/common";

/* CacheBuster component */
import packageJson from "../package.json";
global.appVersion = packageJson.version;

export default function App() {
  useEffect(() => {
    checkVersion();
  }, []);
  return <RouteApp />;
}
