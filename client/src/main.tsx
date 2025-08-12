import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Viewer from "./pages/Viewer.tsx";
import NavBar from "./components/NavBar.tsx";  // import the new NavBar component
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/view" element={<Viewer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
