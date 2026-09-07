import { Menu } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import routes from "../layout/route";
import { Link, useLocation } from "react-router-dom";

const items = [...routes];
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
function convertMultiToSingle(arr,prevBaseUrl=""){

	arr.forEach((v,i)=>{
		if (v.type === "group") {
            arr[i] = {
                type: "group",
                label: v.title,
                children: v.children ? convertMultiToSingle(v.children, prevBaseUrl) : [],
            };
            return;
        }
		const fullUrl = prevBaseUrl + v.url;
		arr[i]={
			...v,
			key: fullUrl,
			icon: v.icon? <v.icon/> : null,
			label : v.children?.length ? v.title : <Link to={fullUrl}>{v.title}</Link>,
			children : v.children ? convertMultiToSingle(v.children,fullUrl) : undefined,
		}
	})
	return arr;
}



convertMultiToSingle(items);

const App = () => {
	const { pathname } = useLocation();
	// const paths = [];
	// useLocation()
	// 	.pathname.split("/")
	// 	?.reduce((prev, cur) => {
	// 		return prev + "/" + cur;
	// 	});
	const [openKeys, setOpenKeys] = useState([]);
	const paths = useMemo(() => {
		const segments = pathname.split('/').filter(Boolean);
		const arr = [];

		segments.reduce((prev, cur) => {
			const newPath = prev + "/" + cur;
			arr.push(newPath);
			return newPath;
		}, "");
		return arr;
	}, [pathname])
	// console.log("paths",paths);
	useEffect(() => {
		setOpenKeys(paths.slice(0, -1));
	}, [paths]);



	return (
		<Menu
			selectedKeys={[pathname]}
			openKeys={openKeys}
			onOpenChange={(keys) => setOpenKeys(keys)}
			// defaultSelectedKeys={[paths.pop()]}
			// defaultOpenKeys={[...paths]}
			mode="inline"
			// theme="dark"
			items={items}
			style={{
				height: "calc(100vh - 64px)",
				overflowX: "hidden",
				overflowY: "auto",
			}}
		/>
	);
};

export default App;
