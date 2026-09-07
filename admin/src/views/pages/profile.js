import {
	Form,
	Spin,
	Row,
	Col,
	message,
	Divider,
	Input,
	Button,
} from "antd";
import React, { useEffect, useState } from "react";

import { LoadingOutlined } from "@ant-design/icons";
import service from "../../services/user";

const Profile = ({ profile }) => {
	const [data, setData] = useState({ avatar: profile });
	const [loading, setLoading] = useState(false);
	const handleChange = (value) => {
		setData({ ...data, ...value });
	};

	function list() {
		setLoading(true);
		service
			.profile()
			.then((res) => {
				setData(res.data.result || {});
			})
			.catch((err) => {
				message.error(err.message, "error");
			})
			.finally(() => {
				setLoading(false);
			});
	}

	useEffect(() => {
		list();
	}, []);

	const save = () => {
		// setAjxRequesting(true);
		service
			.saveProfile(data)
			.then((res) => {
				message.success(res.message);
				window.location.reload();
				// setOpen(false);
				list();
			})
			.catch((err) => {
				if (typeof err.message === "object") {
					let dt = err.message[Object.keys(err.message)[0]];
					message.error(dt);
				} else {
					message.error(err.message);
				}
			})
			.finally(() => {
				// setAjxRequesting(false);
			});
	};

	return (
		<>
			<Spin
				spinning={loading}
				indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
			>
				<Divider />

				<Form layout="vertical">
					<Row gutter={[12, 2]}>
						<Col span={24}>
							<Row gutter={[12, 10]}>
								<Col span={12}>
									<Form.Item label=" Name">
										<Input
											placeholder="Name"
											value={data?.name}
											onChange={(e) => {
												handleChange({
													name: e.target.value,
												});
											}}
										/>
										<Divider style={{ margin: 0 }} />
									</Form.Item>
								</Col>
								
								<Col span={12}>
									<Form.Item label="Phone Number">
										<Input
											placeholder="7485961230"
											value={data?.phone}
											onChange={(e) => {
												handleChange({
													phone: e.target.value,
												});
											}}
										/>
										<Divider style={{ margin: 0 }} />
									</Form.Item>
								</Col>

								<Col span={12}>
									<Form.Item label="Email">
										<Input
											placeholder="test@arramton.com"
											value={data?.email}
											onChange={(e) => {
												handleChange({
													email: e.target.value,
												});
											}}
											disabled
										/>
										<Divider style={{ margin: 0 }} />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Postal Code">
										<Input
											placeholder="210301"
											value={data?.pinCode}
											onChange={(e) => {
												handleChange({
													pinCode: e.target.value,
												});
											}}
										/>
										<Divider style={{ margin: 0 }} />
									</Form.Item>
								</Col>
								{/* <Col span={12}>
                                    <Form.Item label='Country'>
                                        <Input placeholder="India" value={data?.country} onChange={e => { handleChange({ country: e.target.value }); }} />
                                        <Divider style={{ margin: 0 }} />
                                    </Form.Item>
                                </Col> */}
							</Row>
						</Col>
						<Button
							style={{ marginTop: "20px", marginLeft: "20px" }}
							type="primary"
							onClick={() => save()}
						>
							Update All
						</Button>
					</Row>
				</Form>
			</Spin>
		</>
	);
};
export default Profile;
