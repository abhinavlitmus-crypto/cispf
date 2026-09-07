import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
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
    Pagination,
    DatePicker,
    Checkbox,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_AUTHOR_KEY, QUERY_INVENTORY_LIST } from '../../../constants/query.constants';
import { useGetInventoryQuery, useInventoryDeleteMutation, useInventorySaveMutation } from '../../../query/inventory.query'
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import TanstackPagination from '../../components/Pagination';
import dayjs from 'dayjs';
import moment from 'moment';
import { json2csv } from 'json-2-csv';
import commonObj from '../../../commonObj';
import { useGetHistoryQuery } from '../../../query/history.query';
import { useGetSubAdminsQuery } from '../../../query/admin.query';

const role = commonObj.userType;
const permissions = {
    canView: true,

    canEdit:
        role === "SuperAdmin" ||
        role === "COUNCELLORS/ORW" ||
        role === "ADMIN",
    canExport:
        role === "SuperAdmin" ||
        role === "COUNCELLORS/ORW" ||
        role === "ADMIN" ||
        role === "MNE",

    canDelete:
        role === "SuperAdmin" ||
        role === "COUNCELLORS/ORW" ||
        role === "ADMIN",

    canAdd:
        role === "SuperAdmin" ||
        role === "COUNCELLORS/ORW" ||
        role === "ADMIN",
};
const { canAdd, canDelete, canEdit, canView, canExport } = permissions;
export const Inventory = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetInventoryQuery(qData);
    // const [selected, setSelected] = useState([]);
    const useDelete = useInventoryDeleteMutation();
    const addFormRef = useRef();
    const editHistoryRef = useRef();
    const queryClient = useQueryClient()
    const columns = [

        {
            title: "Item Name",
            dataIndex: "itemName",
            // width: 300,
        },
        {
            title: "Category",
            dataIndex: "category",
            // width: 300,
        },
        {
            title: "Batch Number",
            dataIndex: "batchNo",
            // width: 300,
        },
        {
            title: "Expiry Date",
            dataIndex: "expiryDate",
            // width: 300,
            render: (date) => date ? new Date(date).toLocaleDateString("en-IN") : "-"
        },
        {
            title: "Supplier",
            dataIndex: ["supplierDetails","name"],
            // width: 300,
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            // width: 300,
        },
        // {
        //     title: "View Edit",
        //     key: "viewEdit",
        //     width: 110,
        //     render: (_, row) =>
        //         canDelete ? (
        //             <Button
        //                 size="small"
        //                 onClick={() => editHistoryRef.current.open(row?._id, row)}
        //             >
        //                 View Edit
        //             </Button>
        //         ) : null,
        // },

        // {
        //     title: "Action",
        //     dataIndex: "_id",
        //     width: 70,
        //     render: (v, row) => {

        //         return (
        //             <>
        //                 {canDelete ? <Popconfirm
        //                     title="Are you sure to delete this Inventory?"
        //                     onConfirm={() => {
        //                         deleteData(row._id);
        //                     }}
        //                     okText="Yes"
        //                     cancelText="No"
        //                 >
        //                     <Button
        //                         type="primary"
        //                         size="small"
        //                         danger
        //                         icon={<DeleteOutlined />}
        //                     />
        //                     &nbsp;
        //                 </Popconfirm> : null}
        //                 {canEdit ? <Button
        //                     type="primary"
        //                     size="small"
        //                     icon={<EditOutlined />}
        //                     onClick={() => {
        //                         addFormRef.current.openForm(row);
        //                     }}
        //                 /> : <Button
        //                     type="primary"
        //                     size="small"
        //                     onClick={() => {
        //                         addFormRef.current.openForm(row);
        //                     }}
        //                 >View</Button>}
        //             </>
        //         );
        //     },
        // },
    ].filter((item) => !item.hidden);


    const deleteData = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: (res) => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_INVENTORY_LIST],
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
                title={"Inventory"}
            >
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
    const { data: AllData } = useGetInventoryQuery(qData);
    const { data: WholeData } = useGetInventoryQuery({ isAll: true });
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }
    // convert JSON -> CSV + download
    const downloadCsv = async (rows, fileName = "Inventory.csv") => {
        if (!Array.isArray(rows) || rows.length === 0) {
            message.warning("No data to export");
            return;
        }

        // OPTIONAL: map only the fields you want in CSV
        const cleaned = rows.map((r) => ({
            // ===== Item Details =====
            "Item Name": r.itemName ?? "",
            "Category": r.category ?? "",
            "Batch Number": r.batchNo ?? "",

            // ===== Expiry & Pricing =====
            "Expiry Date": r.expiryDate
                ? `'${moment(r.expiryDate).format("DD MMM YYYY")}`
                : "",
            "Unit Price": r.unitPrice ?? "",
            "Quantity Available": r.quantity ?? "",

            // ===== Supplier =====
            "Supplier Name": r.supplierName ?? "",
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
        await downloadCsv(AllData?.data || [], "Inventory_current_page.csv");
        message.success("Current page data exported successfully.");
    };

    // Export all (fetch all pages from API)

    const handleExportAll = async () => {
        await downloadCsv(WholeData?.data || [], "Inventory_all_data.csv");
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
                        {WholeData?.data?.length > 0 && canExport && <Button onClick={handleExportAll}>Export All</Button>}

                        {canAdd && <Button
                            type="primary"
                            onClick={() => addFormRef.current.openForm()}
                        >
                            Add New
                        </Button>}
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
    const useSave = useInventorySaveMutation();
    const {
        data: admins,
        isLoading,
        isError,
        isFetching,
    } = useGetSubAdminsQuery({ userType: "COUNCELLORS/ORW" });
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
                        queryKey: [QUERY_INVENTORY_LIST]
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
        if (data.expiryDate) {
            const formattedDate = data.expiryDate
                ? data.expiryDate.toString().replace(/[^0-9]/g, "") // keep only digits (e.g. 20250105)
                : "";

            handleChange({
                batchNo: `BN-${formattedDate}`
            });
        }
    }, [data.expiryDate]);
    return (
        <>
            <Modal
                title={<span>{data._id ? "Edit " : "Add "} Inventory</span>}
                style={{ top: 20 }}
                open={open}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: useSave.isPending || !canEdit }}
                onCancel={() => {
                    setOpen(false);
                }}
                destroyOnClose
                maskClosable={false}
                width={1000}
            // className="app-modal-body-overflow"

            >
                <Form layout="vertical">
                    <Row gutter={[12, 0]} align="middle">
                        <Col span={6}>
                            <Form.Item label="Item Name" required>
                                <Input
                                    type='text'
                                    value={data.itemName}
                                    placeholder='eg., Prep Tables'
                                    onChange={(e) => { handleChange({ itemName: e.target.value }) }}
                                    disabled={!canEdit}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Category" required>
                                <Select value={data.category} onChange={e => { handleChange({ category: e }) }} placeholder="Select Category" disabled={!canEdit} >
                                    <Select.Option value={"condoms"}>Condoms</Select.Option>
                                    <Select.Option value={"HIV kit"}>HIV Kit</Select.Option>
                                    <Select.Option value={"prep medication"}>Prep Medication</Select.Option>
                                    <Select.Option value={"medical supplies"}>Medical Supplies</Select.Option>
                                    <Select.Option value={"other"}>other</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Batch Number" required>
                                <Input
                                    disabled
                                    type='text'
                                    value={data.batchNo}
                                    placeholder='e.g., BT2025-001'
                                    onChange={(e) => { handleChange({ batchNo: e.target.value }) }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Expiry Date" required>
                                {/* <DatePicker value={data.expiryDate && dayjs(moment(data.expiryDate).format("YYYY-MM-DD"))}
                                    format='DD MMM YYYY'
                                    disabledDate={(current) => current.isBefore(moment(new Date()).subtract(1, "day"))}
                                    onChange={(e) => { handleChange({ expiryDate: new Date(e) }) }} style={{ width: '100%' }} /> */}
                                <DatePicker
                                    placeholder="Select date"
                                    format="DD MMM YYYY"
                                    value={data.expiryDate ? dayjs(data.expiryDate) : null}
                                    disabledDate={(current) => {
                                        if (!current) return false;
                                        return current.isBefore(dayjs().startOf("day"));
                                    }}
                                    onChange={(d) => {
                                        handleChange({ expiryDate: d || null });
                                    }}
                                    style={{ width: "100%" }}
                                    disabled={!canEdit}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Quantity" required>
                                <Input type='number' value={data.quantity} placeholder='Current quantity' onChange={(e) => { handleChange({ quantity: e.target.value }) }} min={0} disabled={!canEdit} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Unit Price (₹)" required>
                                <Input type='number' value={data.unitPrice} onChange={(e) => { handleChange({ unitPrice: e.target.value }) }} placeholder='Price per Unit' min={0} disabled={!canEdit} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Select Supplier" required>
                                <Select
                                    placeholder="Select client"
                                    disabled={!canEdit }
                                    value={data.supplierId}


                                    onChange={(e) => handleChange({ supplierId: e })}
                                >
                                    {/* {clients?.data?.map((client) => ( */}
                                    {admins?.data.map((admins) => (
                                        <Select.Option key={admins._id} value={admins?._id} >
                                            {admins?.name}

                                        </Select.Option>
                                    ))}
                                </Select>
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
            ? { ...qData, tableName: "inventoryDetails", docId }
            : { ...qData, tableName: "inventoryDetails", docId: "" }
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
