import { AppRegistry } from "react-native";
import App from "./App"; // App.js 파일 경로
import { name as appName } from "./app.json"; // app.json에서 앱 이름 가져오기

AppRegistry.registerComponent(appName, () => App);
