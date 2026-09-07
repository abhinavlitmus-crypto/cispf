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
    Timeline,
    Pagination,
    Table,
    InputNumber,
    DatePicker,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_DOCUMENT_LIST } from '../../../constants/query.constants';
import { useDocumentsDeleteMutation, useDocumentsSaveMutation, useGetDocumentsQuery } from '../../../query/documents.query'
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
import { useGetPermissionQuery, usePermissionSaveMutation } from '../../../query/permission.query';
import { QUERY_PERMISSION_LIST } from '../../../constants/query.constants';

const role = commonObj.userType;
const permissions = {
    canView: true,

    canEdit:
        role === "SuperAdmin" ||
        role === "PO" ||
        role === "COUNSELLORS/ORW" ||
        role === "MNE",
    canExport:
        role === "SuperAdmin" ||
        role === "MNE",

    canDelete:
        role === "SuperAdmin",

    canAdd:
        role === "SuperAdmin" ||
        role === "COUNSELLORS/ORW" ||
        role === "PO" ||
        role === "MNE",
};
const { canAdd, canDelete, canEdit, canView, canExport } = permissions;
export const Documents = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetDocumentsQuery(qData);
    // const [selected, setSelected] = useState([]);
    const useDelete = useDocumentsDeleteMutation();
    const useSave = usePermissionSaveMutation();

    const addFormRef = useRef();
    const queryClient = useQueryClient()
    const editHistoryRef = useRef();
    const permissionController = (payload) => {

        payload.tableName = "documentDetails";
        payload.isRequestStatus = "Pending";
        const data = payload;
        useSave.mutate({ data, isRequestStatus: "Pending", tableName: "documentDetails" }, {
            onSuccess: () => {
                message.success("Permission request sent.");
                queryClient.invalidateQueries({ queryKey: [QUERY_PERMISSION_LIST] });
            },
            onError: (err) => message.error(err.message),
        });
    };
    const columns = [

        {
            title: "Document Name",
            dataIndex: "docName",
            // width: 300,
        },
        {
            title: "Preview",
            dataIndex: "Url",
            // width: 300,
            render: (_, { Url }) => {
                if (Url) {
                    return (
                        <a href={Url} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-blue-500 underline hover:text-blue-700">
                            View
                        </a>
                    );
                }
            }
        },
        {
            title: "View Edit",
            key: "viewEdit",
            width: 110,
            render: (_, row) =>
                canDelete ? (
                    <Button
                        size="small"
                        onClick={() => editHistoryRef.current.open(row?._id, row)}
                    >
                        View Edit
                    </Button>
                ) : null,
        },

        {
            title: "Action",
            dataIndex: "_id",
            width: 70,
            render: (v, row) => {
                const today = new Date();
                const expiryDate = row?.expiryDate ? new Date(row.expiryDate) : null;
                const isExpired =
                    expiryDate &&
                    (today - expiryDate) / (1000 * 60 * 60 * 24) > 45;


                const isPending = row?.isRequestStatus === "Pending";
                const isApproved = row?.isRequestStatus === "Approved";
                const isRejected = row?.isRequestStatus === "Rejected";

                const canAccess = isApproved && !isExpired;

                return (
                    <>
                        {/* PENDING */}
                        {isPending && (
                            <Button type="default" size="small" disabled>
                                Pending
                            </Button>
                        )}

                        {/* APPROVED & NOT EXPIRED */}
                        {canAccess && (
                            <>
                                {canDelete && (
                                    <Popconfirm
                                        title="Are you sure to delete this Client?"
                                        onConfirm={() => deleteData(row._id)}
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
                                )}

                                {canEdit ? (
                                    <Button
                                        type="primary"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => addFormRef.current.openForm(row)}
                                    />
                                ) : (
                                    <Button
                                        type="primary"
                                        size="small"
                                        onClick={() => addFormRef.current.openForm(row)}
                                    >
                                        View
                                    </Button>
                                )}
                            </>
                        )}

                        {/* APPROVED BUT EXPIRED */}
                        {isApproved && isExpired && (
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => permissionController(row)}
                            >
                                Ask Approval
                            </Button>
                        )}

                        {/* REJECTED */}
                        {isRejected && (
                            <Button type="default" size="small" disabled>
                                Rejected
                            </Button>
                        )}
                    </>
                );
            },

        },
    ].filter((item) => !item.hidden);

    // ✅ Save permission + refresh permission list


    const deleteData = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: (res) => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_DOCUMENT_LIST],
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
                title={"Documents Library"}
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
    const { data: AllData } = useGetDocumentsQuery(qData);
    const { data: WholeData } = useGetDocumentsQuery({ isAll: true });
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }
    // convert JSON -> CSV + download
    const downloadCsv = async (rows, fileName = "document.csv") => {
        if (!Array.isArray(rows) || rows.length === 0) {
            message.warning("No data to export");
            return;
        }

        // OPTIONAL: map only the fields you want in CSV
        const cleaned = rows.map((r) => ({
            // ===== Document Info =====
            "Document Name": r.docName ?? "",
            "Document URL": r.Url ?? "",
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
        await downloadCsv(AllData?.data || [], "Documents_current_page.csv");
        message.success("Current page data exported successfully.");
    };

    // Export all (fetch all pages from API)

    const handleExportAll = async () => {
        await downloadCsv(WholeData?.data || [], "Documents_all_data.csv");
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
    const useSave = useDocumentsSaveMutation();

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
                        queryKey: [QUERY_DOCUMENT_LIST]
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
                title={<span>{data._id ? "Edit " : "Add "} Document Detail</span>}
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
                width={500}
            // className="app-modal-body-overflow"

            >
                <Form layout="vertical">
                    <Row gutter={[12, 0]} align={'middle'}>
                        <Col span={12}>
                            <Form.Item label="Document Name" required>
                                <Input
                                    type="text"
                                    placeholder="Enter Document Name"
                                    value={data.docName}
                                    disabled={!canEdit}
                                    onChange={(e) => {
                                        handleChange({ docName: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label={"Upload File"} required>
                                <UploadImage
                                    value={data?.Url ? [data.Url] : []}
                                    count={1}
                                    disabled={!canEdit}
                                    onChange={(v) =>
                                        handleChange({ Url: v?.[v.length - 1] || "" })
                                    }
                                    listType="picture-card"
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
            ? { ...qData, tableName: "documentDetails", docId }
            : { ...qData, tableName: "documentDetails", docId: "" }
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

