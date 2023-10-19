import ReactDOM from "react-dom/client";
import React from "react";

import { AuthContextProvider } from "./store/auth-context";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<AuthContextProvider>
		<App />
	</AuthContextProvider>
);
