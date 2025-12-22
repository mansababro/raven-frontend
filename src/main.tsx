import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </Provider>
);
