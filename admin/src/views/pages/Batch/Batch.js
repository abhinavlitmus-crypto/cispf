import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
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
    Radio,
    Tag,
    Progress,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_BATCH_QUERY } from '../../../constants/query.constants';
import { useGetBatchQuery, useBatchDeleteMutation, useBatchSaveMutation } from '../../../query/batch.query'
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
import { STATES } from "../../../utils/states";
import { useGetTrainerQuery } from '../../../query/trainer.query';
import { useMemo } from 'react';
import { useGetLearnerQuery } from '../../../query/learner.query';
import { dummyBatches } from "../../../utils/dummyData";

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
export const Batch = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetBatchQuery(qData);
    // console.log("data batch ", authors);
    const viewDetailsRef = useRef();
    // const [selected, setSelected] = useState([]);
    const useDelete = useBatchDeleteMutation();
    const useSave = usePermissionSaveMutation();
    const addFormRef = useRef();
    const editHistoryRef = useRef();

    const queryClient = useQueryClient()
    const columns = [
        {
            title: "Batch ID",
            dataIndex: "batchId"
        },
        {
            title: "Batch Name",
            dataIndex: "batchName",
            render: (value) => value?.toLowerCase().trim().split(/\s+/).map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ")
        },
        // {
        //     title: "Learners (Enrolled / Total)",
        //     render: (_, row) => {
        //         const enrolled = row.learners ? row.learners.length : 0;
        //         const total = row.maxLearners || 0;
        //         return `${enrolled} / ${total}`
        //     }
        // },
        {
            title: "DigiShakti Trainer UID",
            dataIndex: "digiShaktiTrainerUID"
        },
        {
            title: "Trainer Name",
            dataIndex: ["trainerDetails", "trainerName"],
            render: (value) => value?.toLowerCase().trim().split(/\s+/).map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ")
        },
        {
            title: "Status",
            dataIndex: "trainingStatus",
            width: 100,
            render: (value) => {  
                // console.log("value", value)
                const status = value === true || value === "true";
                return ( status ?
                (<Tag color='green'>Completed</Tag>) : (
                    <Tag color='red'>On Going</Tag>))}
        },
        {
            title: "View Details",
            key: "viewDetails",
            width: 100,
            render: (_, row) => (
                <Button
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => viewDetailsRef.current.open(row)}
                >
                    View
                </Button>
            ),
        },

        // {
        //     title: "Test Date",
        //     dataIndex: "testDate",
        //     render: (date) =>
        //         date ? new Date(date).toLocaleDateString("en-IN") : "-",
        // },
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
        //     title: "Testing Result",
        //     dataIndex: "testingResult",
        //     // width: 300,
        //     render: (_, { testingResult }) => (
        //         <h1
        //             className={`text-center text-xs rounded py-1 border 
        //     ${testingResult === "+ve"
        //                     ? " bg-green-200 border-green-300"
        //                     : testingResult === "-ve"
        //                         ? "bg-red-200 border-red-300"
        //                         : "bg-yellow-200 border-yellow-300"
        //                 }
        // `}
        //         >
        //             {
        //                 testingResult === "+ve"
        //                     ? "Positive"
        //                     : testingResult === "-ve"
        //                         ? "Negative"
        //                         : "Pending"
        //             }
        //         </h1>
        //     ),


        // },


        {
            title: "Action",
            dataIndex: "_id",
            width: 70,
            render: (v, row) => {
                return (
                    <>
                        {canDelete && (
                            <Popconfirm
                                title="Are you sure to delete this Batch?"
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
    const permissionController = (payload) => {

        payload.tableName = "testingDetails";
        payload.isRequestStatus = "Pending";
        const data = payload;
        useSave.mutate({ data, isRequestStatus: "Pending", tableName: "testingDetails" }, {
            onSuccess: () => {
                message.success("Permission request sent.");
                queryClient.invalidateQueries({ queryKey: [QUERY_PERMISSION_LIST] });
            },
            onError: (err) => message.error(err.message),
        });
    };

    const deleteData = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: (res) => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_BATCH_QUERY],
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
                title={"Batches"}
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
                <ViewDetailsModal ref={viewDetailsRef} />
            </Card>
        </div>
    )
}

function Search({ qData, setQData, addFormRef }) {
    const [searchFields, setSearchFields] = useState({})
    const { data: AllData } = useGetBatchQuery(qData);
    const { data: WholeData } = useGetBatchQuery({ isAll: true });
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
    const { queryClient } = props
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const { data: trainer } = useGetTrainerQuery({ isAll: true, status: true });
    const { data: learner } = useGetLearnerQuery({ isAll: true, status: true });

    // const { data: clients } = useGetClientQuery({ isAll: true, status: true });
    const useSave = useBatchSaveMutation();
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
                        queryKey: [QUERY_BATCH_QUERY]
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

    useEffect(() => {
        if (!data.digiShaktiTrainerUID || !trainer?.data) return;

        // console.log("selected UID", data.digiShaktiTrainerUID);

        const selectedTrainer = trainer.data.find(
            (t) => t.digiShaktiTrainerUID === data.digiShaktiTrainerUID
        );

        if (!selectedTrainer) return;

        // console.log("trainer selected", selectedTrainer);

        setData((prev) => ({
            ...prev,
            digiShaktiTrainerUID: selectedTrainer.digiShaktiTrainerUID,
            trainerName: selectedTrainer.trainerName,
            district: selectedTrainer.district,
            block: selectedTrainer.block,
        }));
    }, [data.digiShaktiTrainerUID, trainer?.data]);

    const batchOptions = useMemo(() => {
        if (!data.digiShaktiTrainerUID) return [];
        return dummyBatches.filter(b => b.digiShaktiTrainerUID === data.digiShaktiTrainerUID).map(
            b => ({
                value: b.batchId,
                label: b.batchName
            })
        )

    }, [data.digiShaktiTrainerUID])


    useEffect(() => {
        if (!data.batchId) return;

        const batch = dummyBatches.find(b => b.batchId === data.batchId);

        if (!batch) return;

        setData(prev => ({
            ...prev,
            batchName: batch.batchName,
            // learnerDetails: batch.learners,
            totalEnrolled: batch.totalEnrolled,
            totalCertified: batch.totalCertified,
            batchName: batch.batchName,
            // learners: [] 
            learners: batch.learners
        }));

    }, [data.batchId]);
    const learnerOptions = useMemo(() => {
        if (!data.batchId) return [];

        const batch = dummyBatches.find(b => b.batchId === data.batchId);

        if (!batch) return [];

        return batch.learners.map(l => ({
            value: l.digiShaktiLearnerUID,
            label: `${l.learnerName} (${l.mobileNo})`
        }));

    }, [data.batchId]);

    // const learnerOptions = useMemo(()=>{
    //     const list = learner?.data || [];
    //     return list.map((l)=>({
    //         value: l._id,
    //         label: `${l.learnerName} (${l.mobileNo})`,
    //     }))

    // },[learner?.data])
    return (
        <>
            <Modal
                title={<span>{data._id ? "Edit " : "Add "} Batch</span>}
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
                width={800}
            // className="app-modal-body-overflow"

            >
                <Form layout="vertical">
                    <Row gutter={[12, 0]}>
                        {/* Trainer Name  */}
                        <Col span={24}>
                            <Form.Item label="Select Trainer" required>
                                <Select
                                    placeholder="Select Trainer"
                                    value={data.digiShaktiTrainerUID}
                                    disabled={!canEdit || !!data._id}
                                    showSearch
                                    optionFilterProp="label"
                                    onChange={(v) => handleChange({
                                        digiShaktiTrainerUID: v, batchId: undefined,
                                        batchName: undefined,
                                        learners: [],
                                        totalEnrolled: undefined,
                                        totalCertified: undefined
                                    })}
                                    options={trainerOptions}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 0]}>
                        {/* Batch Name  */}
                        <Col span={24}>
                            <Form.Item label="Select Batch" required>
                                <Select
                                    placeholder="Select Batch"
                                    value={data.batchId }
                                    disabled={!canEdit || !data.digiShaktiTrainerUID || !!data._id}
                                    showSearch
                                    optionFilterProp="label"
                                    onChange={(v) => handleChange({ batchId: v, learners: [] })}
                                    options={batchOptions}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 0]} align="middle">
                        {/* Learner Name */}
                        {/* <Col span={24}>
                            <Form.Item label="Select Learner" required>
                                <Select
                                    mode='multiple'
                                    placeholder="Select Learners"
                                    value={data.learners || []}
                                    disabled={!canEdit || !data.digiShaktiTrainerUID || !data.batchId}
                                    showSearch
                                    optionFilterProp="label"
                                    onChange={(v) => {
                                        handleChange({ learners: v })
                                    }}
                                    options={learnerOptions}
                                    allowClear
                                />
                            </Form.Item>
                        </Col> */}
                        <Col span={24}>
                            <Form.Item label="Learners">
                                <div style={{
                                    maxHeight: 150,
                                    overflowY: "auto",
                                    border: "1px solid #d9d9d9",
                                    borderRadius: 6,
                                    padding: 8
                                }}>
                                    {(data.learners || []).map((l) => (
                                        <Tag key={l.digiShaktiLearnerUID}>
                                            {l.learnerName} ({l.mobileNo})
                                        </Tag>
                                    ))}
                                </div>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[12, 0]}>
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
                </Form>
            </Modal>
        </>
    );
});


const ViewDetailsModal = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const [batch, setBatch] = useState(null);
    // console.log("batch", batch);
    useImperativeHandle(ref, () => ({
        open(data) {
            setBatch(data);
            setOpen(true);
        },
    }));


    const learnerColumns = [
        {
            title: "Learner Name",
            dataIndex: "learnerName",
            render: (value) =>
                value?.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()),
        },
        {
            title: "Mobile No",
            dataIndex: "mobileNo",
        },
        {
            title: "Certificate Status",
            // dataIndex: "isCertificateTaken",
            dataIndex: "isCertified",
            render: (value) =>
                value ? (
                    <Tag color="green">Certified</Tag>
                ) : (
                    <Tag color="red">Not Certified</Tag>
                ),
        },
    ];

    const enrolled = Number(batch?.totalEnrolled) || 0;
    const certified = Number(batch?.totalCertified) || 0;

    const percent = enrolled > 0 ? Math.round((certified / enrolled) * 100) : 0;
    return (
        <Modal
            title="Batch Learners"
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={900}
            destroyOnClose
            maskClosable={false}
            style={{ top: 20 }}
        >
            {batch && (
                <>

                    <Card size='small' style={{ marginBottom: 16 }}>
                        <Row gutter={[12, 12]}>
                            <Col span={12}>
                                <Card size="small" bordered>
                                    <div style={{ fontSize: 12, color: "#888" }}>Total Enrolled</div>
                                    <div style={{ fontSize: 18, fontWeight: 600 }}>
                                        {enrolled}
                                    </div>
                                </Card>
                            </Col>

                            <Col span={12}>
                                <Card size="small" bordered>
                                    <div style={{ fontSize: 12, color: "#888" }}>Certified</div>
                                    <div style={{ fontSize: 18, fontWeight: 600, color: "#52c41a" }}>
                                        {certified}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <Row gutter={[16, 0]} style={{marginTop: 12}}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <strong>Batch Name:</strong>{" "} {batch.batchName}
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <strong>Trainer:</strong> {" "}
                                {batch.trainerDetails?.trainerName
                                    ? batch.trainerDetails.trainerName.charAt(0).toUpperCase() +
                                    batch.trainerDetails.trainerName.slice(1)
                                    : ""}
                            </Col>
                            {/* <Col xs={24} sm={24} md={12} lg={12}>
                                <strong>Total learners Enrolled :</strong>{" "} {batch.totalEnrolled}
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <strong>Total learners certified :</strong>{" "} {batch.totalCertified}
                            </Col> */}
                            <Col span={24}>
                                <strong>Training Completion Status:</strong>
                                <div style={{ marginTop: 8 }}>
                                    <Progress
                                        percent={percent}
                                        size='small'
                                        status={
                                            percent === 0 ? "success" : percent > 100 ? "exception" : "active"
                                        }
                                    />
                                    <div>{certified} / {enrolled} Certified</div>
                                </div>
                            </Col>
                        </Row>
                        
                    </Card>

                    <h3 style={{ marginBottom: 12 }} className='font-bold'>
                        Trainee List
                    </h3>

                    <Table
                        columns={learnerColumns}
                        dataSource={batch.learners || []}
                        rowKey="_id"
                        pagination={false}
                        bordered
                        size='small'
                    />

                </>
            )}
        </Modal>
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