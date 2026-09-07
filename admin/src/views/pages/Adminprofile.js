/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Layout, Typography, Divider, Tabs, message, Card } from "antd";
import Profile from "./profile";
import ChangePassword from "./changePass";

import { useGetAdminProfileQuery } from "../../query/admin.query";
const { Sider, Content } = Layout;

const contentStyle = {
	textAlign: "center",
	minHeight: 120,
	lineHeight: "120px",
	// color: '#fff',
	backgroundColor: "white",
};
const siderStyle = {
	textAlign: "center",
	lineHeight: "50px",
	backgroundColor: "white",
	marginLeft: "20px",
	boxShowdow: "10px",
};

const AdminProfile = () => {
	const [type, setType] = useState("todaysFollowUp");
	const [data, setData] = useState("");
	const [fileList, setFileList] = useState([]);
	const {data: apiRes} = useGetAdminProfileQuery()


	useEffect(() => {
		if(apiRes?.data){
			setData(apiRes?.data?.result);
		}
	}, [apiRes]);


	return (
		<>
			<div className="bannerImg">
				
			</div>
			<Card
				hoverable
				className="profile-wrapper"
				style={{
					backgroundColor: "transparent",
					marginTop: "8rem",
					border: "none",
				}}
			>
				<Layout style={{ backgroundColor: "transparent" }}>
					<Card hoverable>
						<Sider style={siderStyle}>
							<Typography.Title level={5}>
								<b>
									{" "}
									😉 Hello,  {data?.name} 
								</b>
							</Typography.Title>
							<Divider />
							<Typography.Title level={4}>
								<b> Contact Number</b>
							</Typography.Title>
							<Typography.Title level={5} style={{ margin: 0 }}>
								{" "}
								{data?.phone}
							</Typography.Title>
							<Divider />
							<Typography.Title level={4}>
								<b> Email Id</b>
							</Typography.Title>
							<Typography.Title level={5} style={{ margin: 0 }}>
								{" "}
								{data?.email}
							</Typography.Title>
						</Sider>
					</Card>
					<Card hoverable style={{ marginLeft: "20px", width:"100%" }}>
						<Layout >
							<Content style={contentStyle}>
								<Tabs
									type="card"
									style={{
										marginLeft: "10px",
										color: "#000",
									}}
									onChange={(v) => {
										setType(v);
									}}
									items={[
										{
											label: "Account Setting",
											key: "accountSetting",
											children: <Profile />,
										},
										{
											label: "Change Password",
											key: "changePassword",
											children: <ChangePassword />,
										},
									]}
								/>
							</Content>
						</Layout>
					</Card>
				</Layout>
			</Card>
		</>
	);
};

export default AdminProfile;
