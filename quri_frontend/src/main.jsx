import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { persistor, store } from './state';
import { Provider } from 'react-redux';
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "./state/themeContext.jsx";
import { DrawerProvider } from "./state/drawerContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <DrawerProvider>
            <App />
          </DrawerProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
