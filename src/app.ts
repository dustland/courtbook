import { PropsWithChildren } from "react";
import { useLaunch, useDidShow } from "@tarojs/taro";

// Import app styles
import "./app.scss";

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");
  });

  useDidShow(() => {
    console.log("App shown");
  });

  return children;
}

export default App;
