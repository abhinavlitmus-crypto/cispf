/* eslint-disable react-hooks/exhaustive-deps */
import {
	Table,
	Button,
	Form,
	Row,
	Col,
	Popconfirm,
	Modal,
	Spin,
	Input,
	message,
	Select,
	Tag,
	Typography,
	Space,
	Image,
} from "antd";
import {
	DeleteOutlined,
	EditOutlined,
	LoadingOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import React, {
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
	useRef,
} from "react";
import Pagination from "../../components/Pagination";
import service from "../../../services/rating";
import util from "../../../utils/util";

export default function Reviews({ userId }) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [qData, setQData] = useState({ page: 1, limit: 20, userId });
	const addNewModalRef = useRef();

	const columns = [
		{
			title: "#",
			width: 40,
			render: (v, row, i) => <b>{i + 1}</b>,
		},
		{
			title: "Product Image",
			dataIndex: "productPicture",
			width: 100,
			render: (v) => (
				<Image src={v} preview={true} width={50} height={60} />
			),
		},
		{
			title: "Product Name",
			dataIndex: "productName",
			width: 300,
		},
		{
			title: "Rating",
			dataIndex: "rating",
			width: 200,
		},
		{
			title: "Posted On",
			dataIndex: "createdAt",
			width: 200,
			render: (v) => <span>{new Date(v)?.toLocaleDateString()}</span>,
		},
		{
			title: "Message",
			dataIndex: "message",
			width: 200,
			render: (v) => <span>{v || "NOT MENTIONED"}</span>,
		},
		{
			title: "Action",
			dataIndex: "_id",
			width: 70,
			render: (v, row) => {
				return (
					<>
						<Popconfirm
							title="Are you sure to delete this review?"
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
					</>
				);
			},
		},
	].filter((item) => !item.hidden);

	function list() {
		setLoading(true);
		service
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

	const deleteData = (id) => {
		service
			.delete(id)
			.then((res) => {
				message.success(res.message);
				list();
			})
			.catch((err) => {
				message.error(
					"Address can not be deleted. Reason: " + err?.message,
				);
			});
	};

	const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

	tableColumns[0].fixed = true;
	tableColumns[tableColumns.length - 1].fixed = "right";

	const tableProps = {
		bordered: true,
		loading,
		size: "small",
		showHeader: true,
		footer: () => <Pagination {...{ qData, setQData }} />,
		tableLayout: undefined,
	};

	useEffect(() => {
		list();
	}, [qData.page, qData.limit]);

	return (
		<>
			<Table
				{...tableProps}
				pagination={{ position: ["none"], pageSize: qData.limit }}
				columns={tableColumns}
				dataSource={data.length ? data : []}
				scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
			/>
		</>
	);
}

function Search({ addNewModalRef, qData, setQData, list }) {
	return (
		<Form onSubmitCapture={list} className="search-form1">
			<Row gutter={[12, 12]}>
				<Col span={20}>
					<Row gutter={[12, 12]}>
						<Col span={8}>
							<Form.Item style={{ marginBottom: 0 }}>
								<Input
									placeholder="Search by receiver name | address1 | pin code | phone"
									defaultValue={qData.key}
									onChange={(e) =>
										setQData({
											...qData,
											key: e.target.value,
										})
									}
									allowClear
								/>
							</Form.Item>
						</Col>
						<Col span={3}>
							<Form.Item style={{ marginBottom: 0 }}>
								<Button type="primary" htmlType="submit">
									Search
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Col>
			</Row>
		</Form>
	);
}
