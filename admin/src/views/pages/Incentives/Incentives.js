import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { json2csv } from "json-2-csv";
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
    DatePicker,
    Timeline,
    Checkbox,
    Tooltip,
    Tag,
    Alert,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { QUERY_INCENTIVES_QUERY } from '../../../constants/query.constants';
import { useGetIncentivesQuery, useIncentivesDeleteMutation, useIncentivesSaveMutation } from '../../../query/incentives.query'
import { useGetClientQuery } from '../../../query/client.query';
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import TanstackPagination from '../../components/Pagination';
import dayjs from 'dayjs';
import moment from 'moment';
import commonObj from '../../../commonObj';
import { useGetHistoryQuery } from '../../../query/history.query';
import { useGetPermissionQuery, usePermissionSaveMutation } from '../../../query/permission.query';
import { QUERY_PERMISSION_LIST } from '../../../constants/query.constants';
import { useGetTrainerQuery } from '../../../query/trainer.query';
import { useGetBatchQuery } from '../../../query/batch.query';

const role = commonObj.userType;
const permissions = {
    canView: true,

    canEdit:
        role === "SuperAdmin" ||
        role === "STAFF",
    canExport:
        role === "SuperAdmin" ||
        role === "STAFF" ,

    canDelete:
        role === "STAFF" ||
        role === "SuperAdmin",

    canAdd:
        role === "STAFF" ||
        role === "SuperAdmin" ,
};

const { canAdd, canDelete, canEdit, canView, canExport } = permissions;
export const Incentives = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetIncentivesQuery(qData);

    // const [selected, setSelected] = useState([]);
    const useDelete = useIncentivesDeleteMutation();

    const addFormRef = useRef();
    const editHistoryRef = useRef();
    // console.log("authors incentive",authors)
    const queryClient = useQueryClient()


    const columns = [
        {
            title: "DigiShakti Trainer UID",
            dataIndex: "digiShaktiTrainerUID"
        },
        {
            title: "Trainer Name",
            dataIndex: ["trainerDetails", "trainerName"]
        },
        {
            title: "Batch ID",
            dataIndex: "batchId"
        },
        {
            title: "Batch Name",
            dataIndex: ["batchDetails", "batchName"]
        },


        {
            title: "Payout",
            dataIndex: "amount",
            render: (_, row) => {
                return (
                    <div>
                        <div style={{ fontWeight: 600 }}>
                            ₹{row.amount}
                        </div>
                        <div style={{ fontSize: 12, color: "#888" }}>
                            {row?.batchDetails?.totalCertified} × ₹{row.price}
                        </div>
                    </div>
                );
            }
        },
        {
            title: "Approve At",
            dataIndex: "approvedAt",
            render : (date)=>  date ? new Date(date).toLocaleDateString("en-IN") : "-", 
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

        {
            title: "Status",
            dataIndex: "isRequestStatus",
            width: 100,
            render: (_, row) => {
                const statusMap = {
                    Pending: { color: "gold", label: "Pending" },
                    Approved: { color: "green", label: "Approved" },
                    Rejected: { color: "red", label: "Rejected" },
                }
                const status = row?.isRequestStatus;
                const config = statusMap[status];
                return (
                    <Tag color={config?.color || "default"}>
                        {config?.label || "Not Requested"}
                    </Tag>
                )

            }
        },
        {
            title: "Action",
            dataIndex: "_id",
            width: 70,
            render: (v, row) => {
                return (
                    <>
                        {canDelete && (
                            <Popconfirm
                                title="Are you sure to delete this Incentives?"
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
                );
            },
        }
        // {
        //     title: "Action",
        //     dataIndex: "_id",
        //     width: 70,
        //     render: (v, row) => {
        //         const today = new Date();
        //         const expiryDate = row?.expiryDate ? new Date(row.expiryDate) : null;
        //         const isExpired =
        //             expiryDate &&
        //             (today - expiryDate) / (1000 * 60 * 60 * 24) > 45;


        //         const isPending = row?.isRequestStatus === "Pending";
        //         const isApproved = row?.isRequestStatus === "Approved";
        //         const isRejected = row?.isRequestStatus === "Rejected";

        //         const canAccess = isApproved && !isExpired;

        //         return (
        //             <>
        //                 {/* PENDING */}
        //                 {isPending && (
        //                     <Button type="default" size="small" disabled>
        //                         Pending
        //                     </Button>
        //                 )}

        //                 {/* APPROVED & NOT EXPIRED */}
        //                 {canAccess && (
        //                     <>
        //                         {canDelete && (
        //                             <Popconfirm
        //                                 title="Are you sure to delete this Client?"
        //                                 onConfirm={() => deleteData(row._id)}
        //                                 okText="Yes"
        //                                 cancelText="No"
        //                             >
        //                                 <Button
        //                                     type="primary"
        //                                     size="small"
        //                                     danger
        //                                     icon={<DeleteOutlined />}
        //                                 />
        //                                 &nbsp;
        //                             </Popconfirm>
        //                         )}

        //                         {canEdit ? (
        //                             <Button
        //                                 type="primary"
        //                                 size="small"
        //                                 icon={<EditOutlined />}
        //                                 onClick={() => addFormRef.current.openForm(row)}
        //                             />
        //                         ) : (
        //                             <Button
        //                                 type="primary"
        //                                 size="small"
        //                                 onClick={() => addFormRef.current.openForm(row)}
        //                             >
        //                                 View
        //                             </Button>
        //                         )}
        //                     </>
        //                 )}

        //                 {/* APPROVED BUT EXPIRED */}
        //                 {isApproved && isExpired && (
        //                     <Button
        //                         type="primary"
        //                         size="small"
        //                         onClick={() => permissionController(row)}
        //                     >
        //                         Ask Approval
        //                     </Button>
        //                 )}

        //                 {/* REJECTED */}
        //                 {isRejected && (
        //                     <Button type="default" size="small" disabled>
        //                         Rejected
        //                     </Button>
        //                 )}
        //             </>
        //         );
        //     },

        // },
    ].filter((item) => !item.hidden);

    // ✅ Save permission + refresh permission list


    const deleteData = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: (res) => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_INCENTIVES_QUERY],
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
                title={"Incentives"}
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
    const { data: AllData } = useGetIncentivesQuery(qData);
    const { data: WholeData } = useGetIncentivesQuery({ isAll: true });
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }

    // convert JSON -> CSV + download
    const downloadCsv = async (rows, fileName = "Engagement.csv") => {
        if (!Array.isArray(rows) || rows.length === 0) {
            message.warning("No data to export");
            return;
        }

        // OPTIONAL: map only the fields you want in CSV
        const cleaned = rows.map((r) => ({
            // ===== Client Info =====
            "Client Name": r.clientDetails?.clientName ?? "",

            // ===== Contact Info =====
            "Phone": r.phone ?? "",
            "Alternative Phone": r.alternativePhone ?? "",
            "Email": r.email ?? "",
            "Contact Method": r.contactMethod ?? "",
            "Marital Status": r.maritalStatus ?? "",

            // ===== Engagement Info =====
            "Engagement Date": r.engageDate
                ? `'${moment(r.engageDate).format("DD MMM YYYY")}`
                : "",
            "Purpose of Engagement": r.purposeOfEngagement ?? "",
            "Engagement Notes": r.testingNotes ?? "",

            // ===== Testing Info =====
            "Testing ID": r.testingId ?? "",
            "Test Date": r.testDate
                ? `'${moment(r.testDate).format("DD MMM YYYY")}`
                : "",
            "Test Type": r.testType ?? "",
            "Test Method": r.testMethod ?? "",
            "Testing Lab": r.testingLab ?? "",
            "Testing Result":
                r.testingResult === "+ve"
                    ? "Positive"
                    : r.testingResult === "-ve"
                        ? "Negative"
                        : "Pending",
            "Test Result Notes": r.testResultNotes ?? "",

            // ===== Enhanced Risk Assessment =====
            "Risk Checks": r.enhancedRiskAssessment?.checks?.join(" | ") ?? "",
            "Sexual Partners (Last 6 Months)":
                r.enhancedRiskAssessment?.sexualPartner ?? "",
            "Condom Usage":
                r.enhancedRiskAssessment?.condomUsage ?? "",
            "Alcohol / Drug Use":
                r.enhancedRiskAssessment?.alcohol ?? "",
            "STI History":
                r.enhancedRiskAssessment?.STI ?? "",
            "Partner HIV Status":
                r.enhancedRiskAssessment?.partnerHivStatus ?? "",
            "Overall Risk Level":
                r.enhancedRiskAssessment?.overAllRiskStatus ?? "",

            // ===== Risk Notes =====
            "Risk Assessment Notes": r.riskAssessmentNotes ?? "",

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
        await downloadCsv(AllData?.data || [], "Engagement_current_page.csv");
        message.success("Current page data exported successfully.");
    };

    // Export all (fetch all pages from API)

    const handleExportAll = async () => {
        await downloadCsv(WholeData?.data || [], "Engagement_all_data.csv");
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
                        {/* {WholeData?.data?.length > 0 && canExport && <Button onClick={handleExportAll}>Export All</Button>} */}

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
    // console.log("ref",ref)
    const { queryClient } = props
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    // const { data: clients } = useGetClientQuery({ isAll: true, status: true });
    const { data: trainer } = useGetTrainerQuery({ isAll: true, status: true });
    const { data: batch } = useGetBatchQuery({ isAll: true, status: true });
    const usePermissionSave = usePermissionSaveMutation();
    const useSave = useIncentivesSaveMutation();
    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(dt ? { ...dt } : { status: true, price: "100", isConfirmed: false });
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
            {
                ...data,
                ...(data?._id && data?.isConfirmed && {
                    isRequestStatus: "Pending"
                })
            },
            {
                onSuccess: (res) => {
                    message.success('Data saved successfully.');
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_INCENTIVES_QUERY]
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

    const permissionController = () => {
        if (isSending) return;

        setIsSending(true);

        usePermissionSave.mutate({
            documentId: data._id,
            tableName: "incentivesDetails",
            isRequestStatus: "Pending",
        }, {
            onSuccess: () => {
                message.success("Permission request sent.");
                queryClient.invalidateQueries({
                    queryKey: [QUERY_PERMISSION_LIST]
                });
            },
            onSettled: () => {
                setIsSending(false);
            },
            onError: (err) => message.error(err.message),
        });
    };
    // useEffect(() => {
    //     if (!data._id) {
    //         const client = clients?.data?.find(c => c._id === data.clientId);

    //         handleChange({
    //             testingId: `VT-${util.removeSpecialChars(data.clientId || "")}`,
    //             engageDate: client?.outreachData?.engageDate || new Date().toISOString(),
    //         });
    //     }
    // }, [data.clientId]);
    const trainerOptions = useMemo(() => {
        const list = trainer?.data || [];

        return list.map((t) => ({
            value: t.digiShaktiTrainerUID,
            label: t.trainerName,
        }));
    }, [trainer?.data]);

    const batchOptions = useMemo(() => {
        const list = batch?.data || []
        // console.log("list", list)
        // console.log("data",data?.digiShaktiTrainerUID)
        const filter = data?.digiShaktiTrainerUID ? list.filter(l => String(l.digiShaktiTrainerUID) === String(data.digiShaktiTrainerUID)) : list;
        // console.log("filter", filter)
        return filter.map((b) => ({
            value: b.batchId,
            label: b.batchName,
        }))
    }, [batch?.data, data?.digiShaktiTrainerUID]);

    useEffect(() => {
        if (!data.digiShaktiTrainerUID || !trainer?.data) return;
        const selectedTrainer = trainer?.data.find(
            (t) => t.digiShaktiTrainerUID === data.digiShaktiTrainerUID
        )
        setData((prev) => ({
            ...prev,
            digiShaktiTrainerUID: selectedTrainer.digiShaktiTrainerUID,
            trainerName: selectedTrainer.trainerName,
            district: selectedTrainer.district,
            block: selectedTrainer.block,
        }));
    }, [data.digiShaktiTrainerUID, trainer?.data])
    // const batchOptions = useMemo(() => {
    //     const list = batch?.data || []

    //     return list.map((b) => ({
    //         value: b._id,
    //         label: b.batchName,
    //     }))
    // }, [batch?.data]);
    const totalCertified = Number(data?.batchDetails?.totalCertified || 0);
    const totalEnrolled = Number(data?.batchDetails?.totalEnrolled || 0);
    const isBatchCompleted = totalCertified === totalEnrolled && totalEnrolled > 0;
    const isLocked = ["Pending", "Approved"].includes(data?.isRequestStatus);
    return (
        <>

            <Modal
                title={<span>{data._id ? "Edit " : "Add "} Incentive</span>}
                style={{ top: 20 }}
                open={open} 
                okText={data?._id ? "Ask for Approval" : "Save"}
                onOk={save}
                okButtonProps={{ disabled: useSave.isPending || !canEdit || isLocked || (data?._id && !data?.isConfirmed)}}
                onCancel={() => {

                    setOpen(false);
                }}
                destroyOnClose
                maskClosable={false}
                width={600}
            // className="app-modal-body-overflow"

            >
                <Form layout="vertical">
                    {isLocked && (
                        <Alert
                            message={`This record is locked (${data.isRequestStatus || "Unknown"}).`}
                            description={
                                data.isRequestStatus === "Pending"
                                    ? "This record is under approval and cannot be edited."
                                    : "This record has been approved and is now locked."
                            }
                            type="warning"
                            showIcon
                            style={{ marginBottom: 12 }}
                        />
                    )}

                    <Row gutter={[12, 0]} align="middle">
                        <Col span={12}>
                            <Form.Item label="Select Trainer" required>
                                <Select
                                    placeholder="Select Trainer"
                                    value={data.digiShaktiTrainerUID}
                                    disabled={!canEdit || !!data._id || isLocked}
                                    showSearch
                                    optionFilterProp="label"
                                    onChange={(v) => handleChange({ digiShaktiTrainerUID: v })}
                                    options={trainerOptions}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Select Batch" required>
                                <Select
                                    placeholder="Select Batch"
                                    value={data.batchId}
                                    disabled={!canEdit || !!data._id || !data?.digiShaktiTrainerUID || isLocked}
                                    showSearch
                                    optionFilterProp="label"
                                    onChange={(v) => handleChange({ batchId: v })}
                                    options={batchOptions}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 0]} align={'middle'}>
                        <Col span={12}>
                            <Form.Item label="Price" required>
                                <Input
                                    type="text"
                                    // disabled={!canEdit || isLocked}
                                    disabled
                                    placeholder="Enter Price"
                                    maxLength={10}
                                    value={data.price}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^\d]/g, '');
                                        // const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                                        handleChange({ price: value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item label="DigiShakti Trainer UID" required>
                                <Input
                                    // disabled={!canEdit}
                                    disabled
                                    placeholder="Enter DigiShakti Trainer UID"
                                    value={data.digiShaktiTrainerUID}
                                    onChange={(e) =>
                                        handleChange({ digiShaktiTrainerUID: e.target.value })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 0]}>

                        {/* District */}
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item label="District" required>
                                <Input
                                    // disabled={!canEdit}
                                    disabled
                                    placeholder="Enter District"
                                    value={data.district}
                                    onChange={(e) =>
                                        handleChange({ district: e.target.value })
                                    }
                                />
                            </Form.Item>
                        </Col>

                        {/* Block */}
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item label="Block" required>
                                <Input
                                    // disabled={!canEdit}
                                    disabled
                                    placeholder="Enter Block"
                                    value={data.block}
                                    onChange={(e) =>
                                        handleChange({ block: e.target.value })
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 0]} style={{ marginTop: 10 }}>
                        <Col span={24} >
                            {/* <Tooltip title={!isBatchCompleted ? "Batch must be completed first" : ""}> */}
                            <Tooltip title={
                                !data._id
                                    ?  "Please save the record before requesting confirmation or approval."
                                    : !isBatchCompleted
                                        ? "This batch is not yet completed. Incentive can be requested only after completion."
                                        : isLocked
                                            ? `This record is locked (${data.isRequestStatus}).`
                                            : ""
                            }>
                                <Checkbox checked={data.isConfirmed} onChange={(e) => handleChange({ isConfirmed: e.target.checked })} disabled={!isBatchCompleted || isLocked}>
                                    I confirm that <b>{data.trainerName || "[Trainer Name]"}</b> has successfully completed training of{" "}
                                    <b>{data?.batchDetails?.totalCertified || "[XX]"}</b> learners and is eligible to receive the incentive amount.
                                </Checkbox>
                            </Tooltip>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col span={24} style={{ textAlign: "left", marginTop: 10 }}>
                            <Tooltip title={!data._id ? "Please save first before requesting approval" : ""}>
                                <Button type="primary" disabled={!data._id || !data.isConfirmed || !isBatchCompleted || isLocked} onClick={permissionController}>
                                    Ask for Approval
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row> */}
                </Form>
            </Modal >
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
            ? { ...qData, tableName: "testingDetails", docId }
            : { ...qData, tableName: "testingDetails", docId: "" }
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
            title={<span>Edit History {client?.clientDetails?.clientName ? `- ${client.clientDetails.clientName}` : ""}</span>}
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
