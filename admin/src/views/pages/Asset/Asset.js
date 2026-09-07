import { AppstoreOutlined, CheckCircleOutlined, DeleteOutlined, EditOutlined, InboxOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';

import {
    Avatar,
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Table,
    InputNumber,
    Timeline,
    DatePicker,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_ASSET_LIST } from '../../../constants/query.constants';
import { useAssetDeleteMutation, useAssetSaveMutation, useGetAssetQuery } from '../../../query/asset.query'
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import TanstackPagination from '../../components/Pagination';
import dayjs from 'dayjs';
import moment from 'moment';
import { json2csv } from 'json-2-csv';
import { useGetManagementQuery } from '../../../query/management.query';
import { useGetHistoryQuery } from '../../../query/history.query';

const AssetKPI = ({ Wholedata = [], AssignData = [] }) => {

    const items = [
        {
            title: "Total Assets",
            value: Wholedata?.length || 0,
            sub: "Registered",
            icon: <AppstoreOutlined />,
            iconBg: "#eef2ff",
            iconColor: "#4f6bed",
        },
        {
            title: "In Use",
            value: AssignData?.length || 0,
            sub: "Assigned",
            icon: <CheckCircleOutlined />,
            iconBg: "#ecfdf5",
            iconColor: "#16a34a",
        },
        {
            title: "Available",
            value: (Wholedata?.length || 0) - (AssignData?.length || 0),
            sub: "Ready to Assign",
            icon: <InboxOutlined />,
            iconBg: "#fff7ed",
            iconColor: "#ea580c",
        },
    ];

    return (
        <Row gutter={[16, 10]} className='mb-4'>
            {
                items.map((item) => (
                    <Col xs={24} sm={12} md={8}>
                        <Card size='small' bordered className='h-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105' style={{ borderLeft: "4px solid #94aaf7", }}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className='text-sm text-gray-500'>{item.title}</div>
                                    <div className='text-2xl font-semibold'>{item.value}</div>
                                    <div className='text-xs text-green-600'>{item.sub}</div>
                                </div>
                                <div
                                    className="w-7 h-8 flex justify-center items-center text-[1.5rem] shrink-0 rounded-lg"
                                    style={{
                                        backgroundColor: item.iconBg,
                                        color: item.iconColor,
                                    }}
                                >
                                    {item.icon}
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))

            }
        </Row>
    )
}
export const Asset = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetAssetQuery(qData);
    const { data: WholeData } = useGetAssetQuery({ isAll: true });
    const { data: AssignData } = useGetManagementQuery({ isAll: true });
    // const [selected, setSelected] = useState([]);
    const useDelete = useAssetDeleteMutation();
    const addFormRef = useRef();
    const editHistoryRef = useRef();

    const queryClient = useQueryClient()
    const columns = [
        {
    title: "S.No",
    render: (_, __, index) => (
      <h1>{index + 1}</h1>
    ),
  },
        {
            title: "Asset Name",
            dataIndex: "name",
            // width: 300,
        },
        {
            title: "Value",
            dataIndex: "price",
            // width: 300,
        },
        {
            title: "Categories",
            dataIndex: "categories",
            // width: 300,
        },
        {
            title: "Condition",
            dataIndex: "condition",
            // width: 300,
        },
        {
            title: "Purchase Date",
            dataIndex: "purchaseDate",
            render: (date) =>
                date ? new Date(date).toLocaleDateString("en-IN") : "-",
        },
        {
            title: "View Edit",
            key: "viewEdit",
            width: 110,
            render: (_, row) =>

                <Button
                    size="small"
                    onClick={() => editHistoryRef.current.open(row?._id, row)}
                >
                    View Edit
                </Button>

        },
        {
            title: "Action",
            dataIndex: "_id",
            width: 70,
            render: (v, row) => {
                return (
                    <>
                        <Popconfirm
                            title="Are you sure to delete this Asset?"
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
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                                addFormRef.current.openForm(row);
                            }}
                        />
                    </>
                );
            },
        },
    ].filter((item) => !item.hidden);


    const deleteData = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: (res) => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_ASSET_LIST],
                    })
                },
                onError: (err) => {
                    message.error(err.message);
                }
            }
        )
    }

    const tableProps = {
        bordered: true,
        loading: isLoading,
        size: "small",
        title: () => (
            <Search
                {...{
                    addFormRef,
                    // selected,
                    qData,
                    setQData,
                    authors
                }}
            />
        ),
        showHeader: true,
        footer: () => <MyPagination {...{ qData, setQData }} />,
        // rowSelection: {
        //     onChange: (selectedRowKeys) => {
        //         setSelected(selectedRowKeys);
        //     },
        // },
        tableLayout: undefined,
    };
    useEffect(() => {
        if (authors && authors.extra) {
            setQData(prevState => ({
                ...prevState,
                ...authors.extra
            }));
        }
    }, [authors]);
    return (
        <div>
            <Card
                bordered={false}
                size="small"
                className='p-0'
                title={"Asset Management"}
            >
                <AssetKPI Wholedata={WholeData?.data} AssignData={AssignData?.data} />
                <Table
                    {...tableProps}
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={authors?.data?.length ? authors?.data : []}
                />
                {!isLoading && isError && !authors.data.length && <DataNotLoaded />}

                <AddEditFormModal ref={addFormRef} {...{ queryClient }} />
                <EditHistoryModal ref={editHistoryRef} />

            </Card>
        </div>
    )
}

function Search({ qData, setQData, addFormRef }) {
    const [searchFields, setSearchFields] = useState({})
    const { data: AllData } = useGetAssetQuery(qData);
    const { data: WholeData } = useGetAssetQuery({ isAll: true });
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }
    // convert JSON -> CSV + download
    const downloadCsv = async (rows, fileName = "Assets.csv") => {
        if (!Array.isArray(rows) || rows.length === 0) {
            message.warning("No data to export");
            return;
        }

        // OPTIONAL: map only the fields you want in CSV
        const cleaned = rows.map((r) => ({
            // ===== Asset Info =====
            "Asset Name": r.name ?? "",
            "Price": r.price ?? "",
            "Category": r.categories ?? "",
            "Condition": r.condition ?? "",

            // ===== Purchase =====
            "Purchase Date": r.purchaseDate
                ? `'${moment(r.purchaseDate).format("DD MMM YYYY")}`
                : "",
        }));

        const csv = json2csv(cleaned);

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    };

    // Export current page (authors.data is current page data)
    const handleExport = async () => {
        await downloadCsv(AllData?.data || [], "Assets_current_page.csv");
        message.success("Current page data exported successfully.");
    };

    // Export all (fetch all pages from API)

    const handleExportAll = async () => {
        await downloadCsv(WholeData?.data || [], "Assets_all_data.csv");
        message.success("Whole data exported successfully.");
    };
    return (
        <Form onSubmitCapture={handleSearch}>
            <Row gutter={12}>
                <Col span={18}>
                    <Row gutter={12}>
                        <Col span={6}>
                            <Input
                                allowClear
                                placeholder="Search by name"
                                value={searchFields.key}
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        setQData({ ...qData, key: undefined, page: 1 });
                                    }
                                    setSearchFields({ ...searchFields, key: e.target.value });
                                }

                                }
                            />
                        </Col>
                        <Col span={3}>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Col>

                <Col span={6}>
                    <Col span={24} className="flex items-center w-full gap-x-2 justify-end">
                        {/* Export buttons BEFORE Add New */}
                        {/* <Button onClick={handleExport}>Export</Button> */}
                        {WholeData?.data?.length > 0 && <Button onClick={handleExportAll}>Export All</Button>}

                        <Button
                            type="primary"
                            onClick={() => addFormRef.current.openForm()}
                        >
                            Add New
                        </Button>
                    </Col>
                </Col>
            </Row >
        </Form >
    );
}


const AddEditFormModal = forwardRef((props, ref) => {
    const { queryClient } = props
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const useSave = useAssetSaveMutation();

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(dt ? { ...dt } : { status: true });
        },
    }));

    const handleChange = (value) => {
        Object.entries(value).forEach(ent => {
            let varDt = data;
            const k = ent[0];
            const v = ent[1];
            let keys = k.split('.');
            for (let i = 0; i < keys.length; i++) {
                if (i + 1 === keys.length) {
                    varDt[keys[i]] = v;
                } else {
                    if (typeof varDt[keys[i]] === 'undefined') {
                        if (parseInt(keys[i + 1]) * 1 >= 0) {
                            varDt[keys[i]] = [];
                        } else {
                            varDt[keys[i]] = {};
                        }
                    } varDt = varDt[keys[i]];
                }
            }
        });
        setData({ ...data });
    }



    const save = () => {
        useSave.mutate(
            data,
            {
                onSuccess: (res) => {
                    message.success('Data saved successfully.');
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_ASSET_LIST]
                    })
                    setOpen(false);

                },
                onError: (err) => {
                    if (typeof err.message !== "string") {
                        message.error(err.message[Object.keys(err.message)[0]][0]);
                    } else {
                        message.error(err.message);
                    }
                }
            }
        )

    }
    useEffect(() => {
        if (!data._id) {
            handleChange({ slug: util.removeSpecialChars(data.name || "") });
        }
    }, [data.name]);
    return (
        <>
            <Modal
                title={<span>{data._id ? "Edit " : "Add "} Asset Detail</span>}
                style={{ top: 20 }}
                open={open}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: useSave.isPending }}
                onCancel={() => {
                    setOpen(false);
                }}
                destroyOnClose
                maskClosable={false}
                width={1000}
            // className="app-modal-body-overflow"

            >
                <Form layout="vertical">
                    <Row gutter={[12, 0]} align={'middle'}>
                        <Col span={6}>
                            <Form.Item label="Asset Name" required>
                                <Input
                                    type="text"
                                    placeholder="Enter Asset Name"
                                    value={data.name}
                                    onChange={(e) => {
                                        handleChange({ name: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Price (₹)" required>
                                <Input type='number' value={data.price} onChange={(e) => { handleChange({ price: e.target.value }) }} placeholder='Enter Asset Price' min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Asset Category" required>
                                <Select value={data.categories} onChange={e => { handleChange({ categories: e }) }} placeholder="Select category" >
                                    <Select.Option value={"technology"}>Technology</Select.Option>
                                    <Select.Option value={"formal"}>Formal</Select.Option>
                                    <Select.Option value={"others"}>Others</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item label="Asset Condition" required>
                                <Select value={data.condition} onChange={e => { handleChange({ condition: e }) }} placeholder={"Select Condition"}>
                                    <Select.Option value={"GOOD"}>GOOD</Select.Option>
                                    <Select.Option value={"BAD"}>BAD</Select.Option>
                                    <Select.Option value={"EXCELLENT"}>EXCELLENT</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Purchase Date" required>
                                {/* <DatePicker value={data.purchaseDate && dayjs(moment(data.purchaseDate).format("YYYY-MM-DD"))}
                                    format='DD MMM YYYY'
                                    disabledDate={(current) => current.isBefore(moment(new Date()).subtract(1, "day"))}
                                    onChange={(e) => { handleChange({ purchaseDate: new Date(e) }) }} style={{ width: '100%' }} /> */}
                                <DatePicker
                                    placeholder="Select date"
                                    format="DD MMM YYYY"
                                    value={data.purchaseDate ? dayjs(data.purchaseDate) : null}
                                    onChange={(d) => {
                                        // d is Dayjs | null
                                        handleChange({ purchaseDate: d || null });
                                    }}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            </Modal>
        </>
    );
});


const EditHistoryModal = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const [docId, setDocId] = useState(null);
    const [client, setClient] = useState(null);
    const [qData, setQData] = useState({ page: 1, limit: 10, isAll: false });

    useImperativeHandle(ref, () => ({
        open(id, row) {
            setDocId(String(id));
            setClient(row || null);
            setQData({ page: 1, limit: 10, isAll: false });
            setOpen(true);
        },
    }));

    const { data, isLoading } = useGetHistoryQuery(
        open && docId
            ? { ...qData, tableName: "assetDetails", docId }
            : { ...qData, tableName: "assetDetails", docId: "" }
    );

    const list = data?.data || [];

    const renderChangesTable = (historyRow) => {
        const keys = Object.keys(historyRow?.newData || {});
        if (!keys.length) return <div>-</div>;

        const rows = keys.map((k) => ({
            key: k,
            field: k,
            oldValue: historyRow?.oldData?.[k],
            newValue: historyRow?.newData?.[k],
        }));

        const changeCols = [
            { title: "Field", dataIndex: "field", width: 200, render: (v) => <b>{v}</b> },
            {
                title: "Old",
                dataIndex: "oldValue",
                render: (v) => (
                    <span className="text-red-600">
                        {v === undefined || v === null ? "-" : String(v)}
                    </span>
                ),
            },
            {
                title: "New",
                dataIndex: "newValue",
                render: (v) => (
                    <span className="text-green-700">
                        {v === undefined || v === null ? "-" : String(v)}
                    </span>
                ),
            },
        ];

        return (
            <Table
                bordered
                size="small"
                columns={changeCols}
                dataSource={rows}
                pagination={false}
                rowKey="key"
                tableLayout="fixed"
                style={{ width: "100%" }}
            />
        );
    };

    return (
        <Modal
            title={<span>Edit History {client?.clientName ? `- ${client.clientName}` : ""}</span>}
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={1000}
            destroyOnClose
            maskClosable={false}
            style={{ top: 20 }}
        >
            {isLoading ? (
                <div style={{ padding: 12 }}>Loading...</div>
            ) : !list.length ? (
                <div style={{ padding: 12 }}>No edit history found.</div>
            ) : (
                <>
                    <Timeline style={{ marginTop: 10 }}>
                        {list.map((row, index) => (
                            <Timeline.Item key={row._id} color="blue">
                                <Card
                                    size="small"
                                    title={`Change ${index + 1}`}
                                    extra={
                                        <span className="text-xs text-gray-600">
                                            {row?.createdAt ? moment(row.createdAt).format("DD MMM YYYY, hh:mm A") : "-"}
                                        </span>
                                    }
                                >
                                    <Row gutter={[12, 8]} style={{ marginBottom: 10 }}>
                                        <Col span={12}>
                                            <strong>Edited By:</strong> {row?.editedByDetails?.name || row?.editedBy || "-"}
                                        </Col>
                                        <Col span={12}>
                                            <strong>Date:</strong>{" "}
                                            {row?.createdAt ? moment(row.createdAt).format("DD MMM YYYY, hh:mm A") : "-"}
                                        </Col>
                                    </Row>

                                    {renderChangesTable(row)}
                                </Card>
                            </Timeline.Item>
                        ))}
                    </Timeline>

                    {/* ✅ Pagination without empty Table (so no "No data") */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                        <TanstackPagination
                          qData={{
                            ...qData,
                            total: data?.extra?.total || 0,
                          }}
                          setQData={setQData}
                        />
                    </div>
                </>
            )}
        </Modal>
    );
});