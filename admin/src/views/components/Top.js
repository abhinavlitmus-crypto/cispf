import { BellFilled, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Space } from "antd";
import { useEffect, useState } from "react";
import commonObj from "../../commonObj";
import routes from "../layout/route";
import { AlignJustify, LogOut, User } from "lucide-react";
import { useLogoutSaveMutation } from "../../query/logout.query";
import { Link, useNavigate } from "react-router-dom";

export default function Top() {
	const [query, setQuery] = useState("");
	const [data, setData] = useState([]);
	const [showNoti, setShowNoti] = useState(false);
	const useSave = useLogoutSaveMutation();
	const navigate = useNavigate();
	const single = () => {
		let singleMenuData = [];
		for (let i = 0; i < routes?.length; i++) {
			if (routes[i].children) {
				for (let y = 0; y < routes[i]?.children?.length; y++) {
					singleMenuData?.push({
						title: routes[i].children[y].title,
						id: i,
						path: `${routes[i].url}/${routes[i].children[y].url}`,
					});
				}
			} else {
				singleMenuData?.push({
					title: routes[i].title,
					id: i,
					path: routes[i].url,
				});
			}
		}
		setData(singleMenuData);
	};
	const EraseUserData = () => {
		const dateOnly = () => {
			const d = new Date();
			d.setHours(0, 0, 0, 0);
			return d;
		};

		const todayDate = dateOnly();
		const payload = {
			userId: commonObj?._id,
			date: todayDate,
		};
		useSave.mutate(
			payload
		)
		window.localStorage.clear();
		navigate("/", { replace: true });
		window.location.reload();
	};
	useEffect(() => {
		single();
	}, [query]);
	const capitalizeFirstLetter = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);
	return (
		<>
			<Row
				gutter={[12, 0]}
				justify="space-between"
				style={{
					position: "relative",
				}}
			>
				<Col span={12}>
					{/* <Space.Compact size="large" style={{ width: "100%" }}>
						<Input placeholder="Search here..." />
						<Button type="primary">Search</Button>
					</Space.Compact> */}
				</Col>
				<Col>
					<div className="flex gap-x-8 items-center">
						<a href="/application/profile">
							<Link to={"/profile"}>
								<button className="flex items-center gap-x-2">
									<User className="w-5 h-5 text-black" />
									<p className=" text-black">
										{commonObj?.name
											? capitalizeFirstLetter(commonObj?.name)
											: "Profile"}
									</p>
								</button>
							</Link>
						</a>
						<button
							onClick={EraseUserData}
							className="flex items-center gap-x-2 text-black group"
						>
							<LogOut
								className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-x-[4px]"
							/>
							<span>Logout</span>
						</button>

					</div>
				</Col>
			</Row>
		</>
	);
}
