/* eslint-disable react-hooks/exhaustive-deps */
import {
	Table,
	Button,
	Form,
	Row,
	Col,
	Popconfirm,
	Typography,
	Select,
	Modal,
	Spin,
	Card,
	message,
	Input,
	DatePicker,
	Avatar,
	Tag,
	Space,
} from "antd";
import {
	DeleteOutlined,
	EditOutlined,
	LoadingOutlined,
	EyeOutlined,
	PlusOutlined,
	UploadOutlined,
} from "@ant-design/icons";
import React, {
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
	useRef,
} from "react";
import UploadImage from "../../../utils/UploadImage";
import serviceUser from "../../../services/userlist";
import Pagination from "../../components/Pagination";
import util from "../../../utils/util";
import Address from "./Address";
import Cart from "./Cart";
import dayjs from "dayjs";
import moment from "moment";
import Reviews from "./Reviews";

export default function User() {
	const [ar, setAr] = useState({
		viewAccess: util.checkRightAccess("User"),
		addAccess: util.checkRightAccess("User"),
		editAccess: util.checkRightAccess("User"),
		deleteAccess: util.checkRightAccess("User"),
	});

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [qData, setQData] = useState({ page: 1, limit: 20 });
	const addNewModalRef = useRef();
	const addressModalRef = useRef();
	const cartModalRef = useRef();
	const reviewsModalRef = useRef();

	const columns = [
		{
			title: "Profile",
			dataIndex: "avatar",
			render: (v, row) => (
				<Space>
					{" "}
					<Avatar src={v} /> {row.name}
				</Space>
			),
		},
		{
			title: "Email",
			dataIndex: "email",
			width: 300,
		},
		{
			title: "Phone No.",
			dataIndex: "phone",
			width: 150,
		},
		{
			title: "Address",
			dataIndex: "_id",
			width: 80,
			render: (v, row) => (
				<Button
					type="primary"
					size="small"
					onClick={() => {
						addressModalRef.current.openForm({
							_id: row._id,
							name: row.name,
						});
					}}
				>
					Address
				</Button>
			),
		},
		{
			title: "Reviews",
			dataIndex: "_id",
			width: 80,
			render: (v, row) => (
				<Button
					type="primary"
					size="small"
					onClick={() => {
						reviewsModalRef.current.openForm({
							_id: row._id,
							name: row.name,
						});
					}}
				>
					Reviews
				</Button>
			),
		},
		// {
		// 	title: 'Cart',
		// 	dataIndex: '_id',
		// 	width: 80,
		// 	render: (v, row) => <Button type="primary" size='small' onClick={() => { cartModalRef.current.openForm({ _id: row._id, name: row.name }) }} >Cart</Button>
		// },
		{
			title: "Login Status",
			dataIndex: "status",
			width: 120,
			render: (isActive) => {
				if (isActive) {
					return <Tag color="green">Active</Tag>;
				} else {
					return <Tag color="red">Blocked</Tag>;
				}
			},
		},
		{
			title: "Action",
			dataIndex: "_id",
			width: 70,
			hidden:
				!ar.addAccess &&
				!ar.editAccess &&
				!ar.deleteAccess &&
				!ar.viewAccess,
			render: (v, row) => {
				return (
					<>
						{ar.deleteAccess ? (
							<Popconfirm
								title="Are you sure to delete this User?"
								onConfirm={() => {
									deleteData(row._id);
								}}
								okText="Yes"
								cancelText="No"
							>
								<Button
									type="primary"
									size="small"
									danger
									icon={<DeleteOutlined />}
								/>
								&nbsp;
							</Popconfirm>
						) : null}

						{ar.editAccess ? (
							<Button
								type="primary"
								size="small"
								icon={<EditOutlined />}
								onClick={() => {
									addNewModalRef.current.openForm(row);
								}}
							/>
						) : null}
						{!ar.editAccess && ar.viewAccess ? (
							<Button
								type="primary"
								size="small"
								icon={<EyeOutlined />}
								onClick={() => {
									addNewModalRef.current.openForm(row);
								}}
							/>
						) : null}
					</>
				);
			},
		},
	].filter((item) => !item.hidden);

	function list() {
		if (ar.viewAccess) {
			setLoading(true);
			serviceUser
				.list(qData)
				.then((res) => {
					setData(res.data?.map((v) => ({ ...v, key: v._id })));
					setQData({
						...qData,
						limit: res.extra.limit,
						page: res.extra.page,
						total: res.extra.total,
					});
				})
				.catch((err) => {})
				.finally(() => {
					setLoading(false);
				});
		}
	}

	const deleteData = (id) => {
		serviceUser
			.delete(id)
			.then((res) => {
				message.success(res.message);
				list();
			})
			.catch((err) => {
				message.error(err.message);
			});
	};

	const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

	tableColumns[0].fixed = true;
	tableColumns[tableColumns.length - 1].fixed = "right";

	const tableProps = {
		bordered: true,
		loading,
		size: "small",
		title: () => (
			<Search
				{...{ addNewModalRef, deleteData, qData, setQData, list, ar }}
			/>
		),
		showHeader: true,
		footer: () => <Pagination {...{ qData, setQData }} />,
		tableLayout: undefined,
	};

	useEffect(() => {
		list();
	}, [qData.page, qData.limit]);

	return (
		<>
			<Card
				bordered={false}
				size="small"
				title="List of User"
				extra={
					<Row justify="end" gutter={12}>
						<Col>
							{ar.addAccess ? (
								<Button
									type="primary"
									icon={<PlusOutlined />}
									onClick={() => {
										addNewModalRef.current.openForm();
									}}
								>
									Add New
								</Button>
							) : null}
						</Col>
					</Row>
				}
			>
				<Table
					{...tableProps}
					pagination={{ position: ["none"], pageSize: qData.limit }}
					columns={tableColumns}
					dataSource={data.length ? data : []}
					scroll={{
						y: "calc(100vh - 340px)",
						x: "calc(100vw - 387px)",
					}}
				/>
				<AddForm ref={addNewModalRef} {...{ list, ar }} />
				<AddressModal ref={addressModalRef} />
				<ReviewModal ref={reviewsModalRef} />
				<CartModal ref={cartModalRef} />
			</Card>
		</>
	);
}

function Search({ qData, setQData, list }) {
	return (
		<Form onSubmitCapture={list}>
			<Row gutter={[12, 12]}>
				<Col span={6}>
					<Input
						placeholder="Search by name, email and number"
						value={qData.key}
						onChange={(e) =>
							setQData({ ...qData, key: e.target.value })
						}
						allowClear
					/>
				</Col>
				<Col span={3}>
					<Button type="primary" htmlType="submit">
						Search
					</Button>
				</Col>
			</Row>
		</Form>
	);
}

const AddForm = forwardRef((props, ref) => {
	const { list, ar } = props;
	const [open, setOpen] = useState(false);
	const [data, setData] = useState({});
	const [ajxRequesting, setAjxRequesting] = useState(false);

	const handleChange = (value) => {
		if (ar.addAccess || ar.editAccess) {
			setData({ ...data, ...value });
		}
	};

	useImperativeHandle(ref, () => ({
		openForm(dt) {
			setOpen(true);
			setData(dt ? { ...dt } : { status: true });
		},
	}));

	const save = () => {
		setAjxRequesting(true);
		serviceUser
			.save(data)
			.then((res) => {
				message.success(res.message);
				setOpen(false);
				list();
			})
			.catch((err) => {
				message.error(err.message);
			})
			.finally(() => {
				setAjxRequesting(false);
			});
	};

	return (
		<>
			<Modal
				title={(!data?._id ? "Add" : "Edit") + " User"}
				style={{ top: 20 }}
				open={open}
				okText="Save"
				onOk={save}
				okButtonProps={{ disabled: ajxRequesting }}
				onCancel={() => {
					setOpen(false);
				}}
				destroyOnClose
				maskClosable={false}
				width={500}
				footer={[
					<Button
						key="cancel"
						onClick={() => {
							setOpen(false);
						}}
					>
						{" "}
						Cancel{" "}
					</Button>,
					<Button key="save" type="primary" onClick={save}>
						{" "}
						Save{" "}
					</Button>,
				]}
			>
				<Spin
					spinning={ajxRequesting}
					indicator={
						<LoadingOutlined style={{ fontSize: 24 }} spin />
					}
				>
					<Form layout="vertical">
						<Row gutter={[12, 0]}>
							<Col span={24}>
								<Form.Item label="Name" required>
									<Input
										placeholder="Aishwary Nigam"
										value={data?.name}
										onChange={(e) => {
											handleChange({
												name: e.target.value,
											});
										}}
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item label="Phone Number" required>
									<Input
										placeholder="8299XXXXXX"
										value={data?.phone}
										onChange={(e) => {
											handleChange({
												phone: e.target.value,
											});
										}}
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item label="Email" required>
									<Input
										placeholder="aishu@arramton.com"
										value={data?.email}
										onChange={(e) => {
											handleChange({
												email: e.target.value,
											});
										}}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Date of Birth">
									<DatePicker
										value={
											data?.dob &&
											dayjs(
												moment(data.dob).format(
													"YYYY-MM-DD",
												),
											)
										}
										format="DD MMM YYYY"
										onChange={(e) => {
											handleChange({ dob: new Date(e) });
										}}
										style={{ width: "100%" }}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Date of Wedding Anniversary">
									<DatePicker
										value={
											data?.dowa &&
											dayjs(
												moment(data.dowa).format(
													"YYYY-MM-DD",
												),
											)
										}
										format="DD MMM YYYY"
										onChange={(e) => {
											handleChange({ dowa: new Date(e) });
										}}
										style={{ width: "100%" }}
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item label="Login Status" required>
									<Select
										value={data?.status}
										placeholder="Choose"
										onChange={(e) => {
											handleChange({ status: e });
										}}
									>
										<Select.Option value={true}>
											Active
										</Select.Option>
										<Select.Option value={false}>
											Inactive
										</Select.Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item label="Profile Image">
									<UploadImage
										value={
											data?.avatar ? [data?.avatar] : []
										}
										onChange={(v) => {
											setData({
												...data,
												avatar: v?.[0],
											});
										}}
										listType="picture"
										uploadButton={
											<Button
												icon={<UploadOutlined />}
												style={{ width: "100%" }}
											>
												Upload Profile Photo
											</Button>
										}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Spin>
			</Modal>
		</>
	);
});

const AddressModal = forwardRef((props, ref) => {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState({});

	useImperativeHandle(ref, () => ({
		openForm(dt) {
			setOpen(true);
			setData(dt ? { ...dt } : { status: true });
		},
	}));

	return (
		<>
			<Modal
				title={
					<>
						Addresses of{" "}
						<Typography.Text type="danger">
							{data?.name}
						</Typography.Text>
					</>
				}
				style={{ top: 20 }}
				open={open}
				onCancel={() => {
					setOpen(false);
				}}
				destroyOnClose
				maskClosable={false}
				width={1600}
				className="app-modal-body-overflow"
				footer={[
					<Button
						key="cancel"
						onClick={() => {
							setOpen(false);
						}}
					>
						Cancel
					</Button>,
				]}
			>
				<Address userId={data._id} />
			</Modal>
		</>
	);
});
const ReviewModal = forwardRef((props, ref) => {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState({});

	useImperativeHandle(ref, () => ({
		openForm(dt) {
			setOpen(true);
			setData(dt ? { ...dt } : { status: true });
		},
	}));

	return (
		<>
			<Modal
				title={
					<>
						Reviews by{" "}
						<Typography.Text type="danger">
							{data?.name}
						</Typography.Text>
					</>
				}
				style={{ top: 20 }}
				open={open}
				onCancel={() => {
					setOpen(false);
				}}
				destroyOnClose
				maskClosable={false}
				width={1600}
				className="app-modal-body-overflow"
				footer={[
					<Button
						key="cancel"
						onClick={() => {
							setOpen(false);
						}}
					>
						Cancel
					</Button>,
				]}
			>
				<Reviews userId={data._id} />
			</Modal>
		</>
	);
});

const CartModal = forwardRef((props, ref) => {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState({});

	useImperativeHandle(ref, () => ({
		openForm(dt) {
			setOpen(true);
			setData(dt ? { ...dt } : { status: true });
		},
	}));

	return (
		<>
			<Modal
				title={
					<>
						Cart of{" "}
						<Typography.Text type="danger">
							{data?.name}
						</Typography.Text>
					</>
				}
				style={{ top: 20 }}
				open={open}
				onCancel={() => {
					setOpen(false);
				}}
				destroyOnClose
				maskClosable={false}
				width={1600}
				className="app-modal-body-overflow"
				footer={[
					<Button
						key="cancel"
						onClick={() => {
							setOpen(false);
						}}
					>
						Cancel
					</Button>,
				]}
			>
				<Cart userId={data._id} />
			</Modal>
		</>
	);
});
