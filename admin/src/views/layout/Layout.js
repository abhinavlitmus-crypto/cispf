import { Drawer, Grid, Layout } from "antd";
import { AlignJustify } from "lucide-react";
import React, { useState } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Menu from "../components/Menu";
import Top from "../components/Top";
import Error404 from "../pages/errors/Error404";
import routes from "./route";
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
	const FOOTER_HEIGHT = 44;
	const SIDEBAR_WIDTH = 240;
	const SIDEBAR_COLLAPSED_WIDTH = 80;
	const { useBreakpoint } = Grid;
	const screens = useBreakpoint();
	// AntD breakpoints: xs < 576, sm >= 576
	const isMobile = !!screens.xs && !screens.sm;
	const { pathname } = useLocation();
	const pageTitle = newRoutes.find((v) => v.url === pathname)?.title || "";
	const sidebarOffset = isMobile
		? 0
		: collapsed
			? SIDEBAR_COLLAPSED_WIDTH
			: SIDEBAR_WIDTH;

	const handleLogout = () => {
		// if you already have util.logout() or util.removeUserData(), use that
		localStorage.clear();
		window.location.href = "/login"; // or whatever your login route is
	};

	const logo = (
		<Link
			to="/dashboard"
			className="flex shrink-0 items-center justify-center px-4"
			style={{ height: 96 }}
		>
			{collapsed && !isMobile ? (
				<span className="text-lg font-semibold tracking-wide text-white">CI</span>
			) : (
				<img
					src="/logo-white.png"
					alt="CISPF"
					className="max-h-[60px] w-auto max-w-full object-contain"
				/>
			)}
		</Link>
	);

	return (
		<Layout>
			{/* Desktop / Tablet sidebar */}
			{!isMobile && (
				<Layout.Sider
					width={SIDEBAR_WIDTH}
					collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
					collapsed={collapsed}
					collapsible={false}
					className="admin-sider"
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						height: "100vh",
						zIndex: 1001,
					}}
				>
					<div className="flex h-full flex-col">
						{logo}
						<div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-4">
							<Menu collapsed={collapsed} />
						</div>
					</div>
				</Layout.Sider>
			)}

			{/* Mobile menu */}
			{isMobile && (
				<Drawer
					title={null}
					placement="left"
					closable={false}
					onClose={() => setMobileMenuOpen(false)}
					open={mobileMenuOpen}
					styles={{ body: { padding: 0 } }}
					width={280}
				>
					{/* Make drawer full-height so we can push Logout to bottom */}
					<div className="admin-sider flex h-full flex-col">
						{logo}
						{/* Menu takes remaining height */}
						<div
							className="min-h-0 flex-1 overflow-y-auto"
							onClick={(e) => {
								if (e.target.closest("a")) setMobileMenuOpen(false);
							}}
						>
							<Menu />
						</div>

						{/* Logout fixed at bottom */}
						<div className="border-t border-white/20 p-3">
							<button
								className="w-full rounded-full border border-white/70 px-3 py-2 text-sm font-semibold text-white"
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

			<Layout.Header
				style={{
					position: "fixed",
					top: 0,
					left: sidebarOffset,
					right: 0,
					height: HEADER_HEIGHT,
					lineHeight: "normal",
					padding: isMobile ? "0 12px" : "0 24px",
					background: "#fff",
					boxShadow: "0 1px 4px rgba(16, 24, 40, 0.06)",
					transition: "left 0.2s ease",
					zIndex: 1000,
				}}
			>
				<div className="flex h-full items-center justify-between gap-x-4">
					<div className="flex min-w-0 items-center gap-x-4">
						<AlignJustify
							size={20}
							className="shrink-0 cursor-pointer text-[#4B5563]"
							onClick={() => {
								if (isMobile) {
									setMobileMenuOpen(true);
									return;
								}
								setCollapsed(!collapsed);
							}}
						/>
						<h1 className="truncate text-base font-semibold text-[#374151]">
							{pageTitle}
						</h1>
					</div>
					<div className="hidden md:block">
						<Top />
					</div>
				</div>
			</Layout.Header>

			<Layout
				style={{
					marginTop: HEADER_HEIGHT,
					marginLeft: sidebarOffset,
					transition: "margin-left 0.2s ease",
					minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
				}}
			>
				<Layout.Content
					className="admin-content"
					style={{
						padding: isMobile ? 12 : 24,
						paddingBottom: FOOTER_HEIGHT + (isMobile ? 12 : 24),
						background: "#F2F3F7",
						overflow: "auto",
						minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
					}}
				>
					{/* keyed so each module fades in when opened */}
					<div key={pathname} className="admin-page">
						<Routes>
							<Route path="/" element={<Navigate to="/dashboard" replace />} />
							<Route path="/login" element={<Navigate to="/dashboard" replace />} />
							{newRoutes.map((v) => (
								<Route
									key={v.url}
									path={v.url}
									element={<v.component />}
								/>
							))}
							<Route path="*" element={<Error404 />} />
						</Routes>
					</div>
				</Layout.Content>

				<Layout.Footer
					style={{
						position: "fixed",
						bottom: 0,
						left: sidebarOffset,
						right: 0,
						height: FOOTER_HEIGHT,
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
			</Layout>
		</Layout>
	);
}
