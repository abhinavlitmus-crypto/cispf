import { Col, Drawer, Grid, Layout, Row, theme } from "antd";
import { AlignJustify } from "lucide-react";
import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { SiteLogoBig, SiteLogoSmall } from "../components//Logos/SiteLogo";
import Menu from "../components/Menu";
import Top from "../components/Top";
import HelpBot from "../components/Helpbot/HelpBot";
import Error404 from "../pages/errors/Error404";
import routes from "./route";
import { calc } from "antd/es/theme/internal";
const newRoutes = [];
function convertMultiToSingle(arr, prevBaseUrl = "") {
	arr.forEach((v) => {
		if (v.type === "group") {
			convertMultiToSingle(v.children || [], prevBaseUrl);
			return;
		}
		if (v.children) {
			convertMultiToSingle(v.children, prevBaseUrl + v.url);
		} else {
			newRoutes.push({ ...v, url: prevBaseUrl + v.url });
		}
	});
}

convertMultiToSingle([...routes]);


export default function MyLayout() {
	const [collapsed, setCollapsed] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const HEADER_HEIGHT = 64;
	const FOOTER_HEIGHT = 50;
	const SIDEBAR_WIDTH = 240;
	const SIDEBAR_COLLAPSED_WIDTH = 80;
	const { useBreakpoint } = Grid;
	const screens = useBreakpoint();
	// AntD breakpoints: xs < 576, sm >= 576
	const isMobile = !!screens.xs && !screens.sm;

	const {
		token: { colorBgContainer },
	} = theme.useToken();
	const handleLogout = () => {
		// if you already have util.logout() or util.removeUserData(), use that
		localStorage.clear();
		window.location.href = "/login"; // or whatever your login route is
	};
	return (
		<Layout>
			<Layout.Header
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					height: HEADER_HEIGHT,
					padding: isMobile ? "0 10px" : "0 16px",
					background: "#fff",
					borderBottom: "1px solid #9C1ED6",
					zIndex: 1000,
				}}
			>
				<Row align="middle" justify="space-between">

					<Col className="flex items-center gap-x-3 sm:gap-x-8">
						<AlignJustify
							size={22}
							className="cursor-pointer text-black"
							onClick={() => {
								if (isMobile) {
									setMobileMenuOpen(true);
									return;
								}
								setCollapsed(!collapsed);
							}}
						/>

						<div
							className="flex items-center gap-x-3 h-[64px]"
						>
							{/*<Link to="/dashboard">
								<div className="h-7 sm:h-8 md:h-[2.8vw]">
									<img
										src="/image/logo-unfpa.png"
										alt="UNFPA"
										className="w-full h-full object-contain"
									/>
								</div>
							</Link>*/}
							<div className="h-8 sm:h-9 md:h-[3.5vw]">
								{/* <img
									src="/image/PrEP-Logo-Final-Cropped.png"
									alt="PrEP"
									className="w-full h-full object-contain"
								/> */}
							</div>
							<div className="h-7 sm:h-8 md:h-[2.9vw]">
								{/* <img
									src="/image/eltonJohn.png"
									alt="Elton John AIDS Foundation"
									className="h-full w-full object-contain"
								/> */}
							</div>
						</div>

					</Col>
					<Col className="hidden md:block">
						<Top />
					</Col>
				</Row>
			</Layout.Header>

			{/* Desktop / Tablet sidebar */}
			{!isMobile && (
				<Layout.Sider
					width={SIDEBAR_WIDTH}
					collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
					collapsed={collapsed}
					collapsible={false}
					style={{
						position: "fixed",
						top: HEADER_HEIGHT,
						left: 0,
						height: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
						overflow: "auto",
					}}
				>
					<Menu />
				</Layout.Sider>
			)}

			{/* Mobile menu */}
			{isMobile && (
				<Drawer
					title={null}
					placement="left"
					closable
					onClose={() => setMobileMenuOpen(false)}
					open={mobileMenuOpen}
					bodyStyle={{ padding: 0 }}
					width={280}
				>
					{/* Make drawer full-height so we can push Logout to bottom */}
					<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
						{/* Menu takes remaining height */}
						<div style={{ flex: 1, overflow: "auto" }}>
							<Menu />
						</div>

						{/* Logout fixed at bottom */}
						<div style={{ borderTop: "1px solid #f0f0f0", padding: 12 }}>
							<button
								style={{
									width: "100%",
									padding: "10px 12px",
									borderRadius: 8,
									border: "none",
									background: "#ff4d4f",
									color: "#fff",
									fontWeight: 600,
									cursor: "pointer",
								}}
								onClick={() => {
									setMobileMenuOpen(false);
									handleLogout();
								}}
							>
								Logout
							</button>
						</div>
					</div>
				</Drawer>
			)}
			{/* {isMobile && (
				<Drawer
					title={null}
					placement="left"
					closable
					onClose={() => setMobileMenuOpen(false)}
					open={mobileMenuOpen}
					bodyStyle={{ padding: 0 }}
					width={280}
				>
					<Menu />
				</Drawer>
			)} */}

			<Layout
				style={{
					marginTop: HEADER_HEIGHT,
					marginLeft: isMobile
						? 0
						: collapsed
							? SIDEBAR_COLLAPSED_WIDTH
							: SIDEBAR_WIDTH,
					transition: "margin-left 0.2s ease",
					minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
				}}
			>
				<Layout.Content
					style={{
						padding: isMobile ? 12 : 24,
						// background: "#ccdde33d",
						// background: "#EFF1F7",
						background: "#fff",
						overflow: "auto",
						minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
					}}
				>
					<Routes>
						{newRoutes.map((v) => (
							<Route
								key={v.url}
								path={v.url}
								element={<v.component />}
							/>
						))}
						<Route path="*" element={<Error404 />} />
					</Routes>
				</Layout.Content>

				<Layout.Footer
					style={{
						position: "fixed",
						bottom: 0,
						left: isMobile
							? 0
							: collapsed
								? SIDEBAR_COLLAPSED_WIDTH
								: SIDEBAR_WIDTH,
						right: 0,
						height: FOOTER_HEIGHT,
						padding: "0 16px",
						background: "#fff",
						borderTop: "1px solid #9C1ED6",
						zIndex: 1000,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div style={{ fontSize: 12, color: "#666" }}>
						© 2025 Your Company. All rights reserved.
					</div>
				</Layout.Footer>
				{/* <HelpBot /> */}
			</Layout>
		</Layout>
	);
}
