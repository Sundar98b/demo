import * as io from "socket.io-client";
import ErrorBoundary from "react-error-boundary";
import ReduxThunk from "redux-thunk";
import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";

import AppRoutes from "./routes";
import ErrorPage from "./components/error-page";
import Middlewares from "./pages/middleware";
import Sidebar from "./components/sidebar";
import SuspenseFallback from "./components/suspense";
import Topbar from "./components/topbar";
import Utils from "./utils";
import rootReducer from "./redux/reducers";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
let socket: any = null;
if (process.env.NODE_ENV === "production") {
  socket = io.connect("https://demo.datalligence.ai/", {
    transports: ["websocket"],
    secure: true,
  });
} else {
  socket = io.connect("http://localhost:9090", {
    transports: ["websocket"],
  });
}

//@ts-ignore
window.sockets = socket;
socket.off("server-starts");
socket.on("server-starts", (val: any) => {
  if (process.env.NODE_ENV !== "production") {
    Utils.notifyMe("Server Connected", "Connect");
  }
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(ReduxThunk)),
);

window.onbeforeunload = function() {
  socket.disconnect();
};

const App = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary FallbackComponent={ErrorPage}>   {/* Error page on components/error-page*/}
        <Middlewares>
          <BrowserRouter>
            <Topbar />
            <Sidebar />
            <Suspense fallback={<SuspenseFallback />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </Middlewares>
      </ErrorBoundary>
    </Provider>
  );
};

export default App;
