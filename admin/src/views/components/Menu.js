import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import routes from "../layout/route";
import { Link, useLocation } from "react-router-dom";

// function convertMultiToSingle(arr, prevBaseUrl = "") {
// 	arr.forEach((v, i) => {
// 		if (v.children?.length) {
// 			arr[i] = {
// 				...arr[i],
// 				key: prevBaseUrl + v.url,
// 				icon: <v.icon />,
// 				label: (
// 					<Link className="text-d-none" to={prevBaseUrl + v.url}>
// 						{v.title}
// 					</Link>
// 				),
// 			};
// 			convertMultiToSingle(v.children, prevBaseUrl + v.url);
// 		} else {
// 			arr[i] = {
// 				...v,
// 				key: prevBaseUrl + v.url,
// 				icon: <v.icon />,
// 				label: (
// 					<Link className="text-d-none" to={prevBaseUrl + v.url}>
// 						{v.title}
// 					</Link>
// 				),
// 			};
// 		}
// 	});
// }
// key -> keys of the submenus that contain it
const parentKeys = {};

function convertMultiToSingle(arr, prevBaseUrl = "", parents = []) {
	return arr.filter((v) => !v.hidden || v.children?.length).map((v) => {
		if (v.type === "group") {
			return {
				type: "group",
				label: v.title,
				children: convertMultiToSingle(v.children || [], prevBaseUrl, parents),
			};
		}
		const fullUrl = prevBaseUrl + v.url;
		parentKeys[fullUrl] = parents;
		return {
			key: fullUrl,
			title: v.title,
			icon: v.icon ? <v.icon /> : null,
			label: v.children?.length ? v.title : <Link to={fullUrl}>{v.title}</Link>,
			children: v.children ? convertMultiToSingle(v.children, fullUrl, [...parents, fullUrl]) : undefined,
		};
	});
}

const items = convertMultiToSingle(routes);

const App = ({ collapsed = false }) => {
	const { pathname } = useLocation();
	const [openKeys, setOpenKeys] = useState([]);

	// open the section of the current page
	useEffect(() => {
		setOpenKeys(parentKeys[pathname] || []);
	}, [pathname]);

	// only one section stays open at a time
	const handleOpenChange = (keys) => {
		const opened = keys.find((k) => !openKeys.includes(k));
		setOpenKeys(opened ? [...(parentKeys[opened] || []), opened] : keys);
	};

	return (
		<Menu
			selectedKeys={[pathname]}
			{...(collapsed ? {} : { openKeys, onOpenChange: handleOpenChange })}
			mode="inline"
			theme="dark"
			items={items}
		/>
	);
};

export default App;
