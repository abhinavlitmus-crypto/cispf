import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "antd";
import ThemeConfig from "./theme.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = ReactDOM.createRoot(document.getElementById("root"));

const Main = () => {
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
			  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // max goes till 30 sec
			},
		  },
	}));

	return (
		<React.StrictMode>
			<QueryClientProvider client={queryClient}>
				<ConfigProvider
					theme={{
						/* algorithm: theme.darkAlgorithm,  */ ...JSON.parse(
							JSON.stringify(ThemeConfig)
						),
					}}
				>
					<App />
				</ConfigProvider>
			</QueryClientProvider>
		</React.StrictMode>
	);
};

root.render(<Main />);
