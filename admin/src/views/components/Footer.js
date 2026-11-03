import { Layout } from "antd";

export default function Footer({ left = 0, height = 44 }) {
	return (
		<Layout.Footer
			style={{
				position: "fixed",
				bottom: 0,
				left,
				right: 0,
				height,
				padding: "0 16px",
				background: "#fff",
				borderTop: "1px solid #E3E8EC",
				transition: "left 0.2s ease",
				zIndex: 1000,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div style={{ fontSize: 12, color: "#666" }}>
				© {new Date().getFullYear()} CISPF. All rights reserved.
			</div>
		</Layout.Footer>
	);
}
