import { createRoot } from "react-dom/client";
import App from "./App";
import React from 'react';
import "./index.css";
import "./api/firebase";
import { ClickToComponent } from 'click-to-react-component';
createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ClickToComponent />
        <App />
    </React.StrictMode>
);
