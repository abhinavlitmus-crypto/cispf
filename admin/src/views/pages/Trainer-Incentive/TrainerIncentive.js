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
    Statistic,
    Alert,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_TRAINER_INCENTIVE_QUERY } from '../../../constants/query.constants';
import { useGetTrainerIncentiveQuery, useTrainerIncentiveDeleteMutation, useTrainerIncentiveSaveMutation } from '../../../query/trainerIncentive.query'
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

const role = commonObj.userType;
const permissions = {
    canView: true,

    canEdit:
        role === "SuperAdmin" ||
        role === "COUNSELLORS/ORW" ||
        role === "MNE",
    canExport:
        role === "SuperAdmin" ||
        role === "COUNSELLORS/ORW" ||
        role === "MNE",

    canDelete:
        role === "SuperAdmin" ||
        role === "COUNSELLORS/ORW",

    canAdd:
        role === "SuperAdmin" ||
        role === "COUNSELLORS/ORW",
};

const { canAdd, canDelete, canEdit, canView, canExport } = permissions;
export const TrainerIncentive = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetTrainerIncentiveQuery(qData);
    const viewDetailsRef = useRef();
    // const [selected, setSelected] = useState([]);
    const useDelete = useTrainerIncentiveDeleteMutation();
    const useSave = usePermissionSaveMutation();
    const addFormRef = useRef();
    const editHistoryRef = useRef();

    const queryClient = useQueryClient()
    const columns = [

        {
            title: "Batch Name",
            dataIndex: "batchName",
            render: (value) => value?.toLowerCase().trim().split(/\s+/).map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ")
        },

        {
            title: "Trainer Name",
            dataIndex: "trainerName",
            render: (value) => value?.toLowerCase().trim().split(/\s+/).map((w) => w[0]?.toUpperCase() + w.slice(1)).join(" ")
        },
        {
            title: "Total Payout",
            dataIndex: "totalPayout",
            render: (value) => `₹ ${value?.toLocaleString()}`
        },
        {
            title: "Completion",
            render: (_, row) => (
                <Progress size={"small"} percent={Math.round((row.certifiedCount / row.totalLearners) * 100)} />
            )
        },
        {
            title: "Status",
            dataIndex:"incentiveStatus",
            render: (value)=>{
                if(value === "Paid") return <Tag color='blue'>Paid</Tag>
                if(value === "Eligible") return <Tag color='green'>Eligible</Tag>
                return <Tag color='orange'>In Progress</Tag>
            }
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


        // {
        //     title: "Action",
        //     dataIndex: "_id",
        //     width: 70,
        //     render: (v, row) => {
        //         return (
        //             <>
        //                 {canDelete && (
        //                     <Popconfirm
        //                         title="Are you sure to delete this Batch?"
        //                         onConfirm={() => deleteData(row._id)}
        //                         okText="Yes"
        //                         cancelText="No"
        //                     >
        //                         <Button
        //                             type="primary"
        //                             size="small"
        //                             danger
        //                             icon={<DeleteOutlined />}
        //                         />
        //                         &nbsp;
        //                     </Popconfirm>
        //                 )}

        //                 {canEdit ? (
        //                     <Button
        //                         type="primary"
        //                         size="small"
        //                         icon={<EditOutlined />}
        //                         onClick={() => addFormRef.current.openForm(row)}
        //                     />
        //                 ) : (
        //                     <Button
        //                         type="primary"
        //                         size="small"
        //                         onClick={() => addFormRef.current.openForm(row)}
        //                     >
        //                         View
        //                     </Button>
        //                 )}
        //             </>
        //         );
        //     },
        // }

        // previous action
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
                        queryKey: [QUERY_TRAINER_INCENTIVE_QUERY],
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
                title={"Trainer Incentive"}
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
    const { data: AllData } = useGetTrainerIncentiveQuery(qData);
    const { data: WholeData } = useGetTrainerIncentiveQuery({ isAll: true });
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

                        {/* {canAdd && <Button
                            type="primary"
                            onClick={() => addFormRef.current.openForm()}
                        >
                            Add New
                        </Button>} */}
                    </Col>
                </Col>
            </Row >
        </Form >
    );
}
const ViewDetailsModal = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const [batch, setBatch] = useState(null);

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
            dataIndex: "isCertificateTaken",
            render: (value) =>
                value ? (
                    <Tag color="green">Certified</Tag>
                ) : (
                    <Tag color="red">Not Certified</Tag>
                ),
        },
    ];

    return (
        <Modal
            title="Certification Completion"
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={900}
            destroyOnClose
            maskClosable={false}
            style={{ top: 20 }}
        >
            {batch?.isBatchCompleted && (
                <Alert
                    type='success'
                    message="Batch Completed — Trainer Eligible for Incentive"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}
            {batch && (
                <>

                    <Card size='small' style={{ marginBottom: 16 }}>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Statistic title="Total Learners" value={batch?.totalLearners} />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Statistic title="Certified" value={batch?.certifiedCount} />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Statistic title="Pending" value={batch?.totalLearners - batch?.certifiedCount} />
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={6}>
                                <Statistic
                                    title="Total Payout"
                                    value={batch?.totalPayout}
                                    prefix="₹"
                                />
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 12 }}>
                            <Col span={24}>
                                <div style={{
                                    background: "#fafafa",
                                    padding: 12,
                                    borderRadius: 6,
                                    border: "1px solid #f0f0f0"
                                }}>
                                    <strong>Incentive Rate:</strong> ₹ {batch?.price} per learner
                                </div>
                            </Col>
                        </Row>
                        <Row gutter={[16, 0]}>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <strong>Batch Name:</strong>{" "} {batch?.batchName}
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12}>
                                <strong>Trainer:</strong> {" "}
                                {batch?.trainerName
                                    ? batch.trainerName.charAt(0).toUpperCase() +
                                    batch.trainerName.slice(1)
                                    : ""}
                            </Col>

                            <Col span={24}>
                                <strong>Certification Progress Bar:</strong>
                                <div style={{ marginTop: 8 }}>
                                    <Progress
                                        percent={batch?.totalLearners ? Math.round((batch?.certifiedCount / batch?.totalLearners) * 100) : 0}
                                        size='small'
                                        status={
                                            batch?.isBatchCompleted ? "success" : "active"
                                        }
                                    />
                                    <div>{batch?.certifiedCount} / {batch?.totalLearners} Learner</div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <h3 style={{ marginBottom: 12 }} className='font-bold'>
                        Trainee Enrollment
                    </h3>

                    <Table
                        columns={learnerColumns}
                        dataSource={batch?.learners || []}
                        rowKey="_id"
                        pagination={false}
                        bordered
                        size='small'
                        scroll={{x:500,y:500}}
                    />

                </>
            )}
        </Modal>
    );
});

const AddEditFormModal = forwardRef((props, ref) => {
    const { queryClient } = props
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const { data: trainer } = useGetTrainerQuery({ isAll: true, status: true });
    const { data: learner } = useGetLearnerQuery({ isAll: true, status: true });

    // const { data: clients } = useGetClientQuery({ isAll: true, status: true });
    const useSave = useTrainerIncentiveSaveMutation();
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
                        queryKey: [QUERY_TRAINER_INCENTIVE_QUERY]
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
            value: t._id,
            label: t.trainerName,
        }));
    }, [trainer?.data]);


    const learnerOptions = useMemo(() => {
        const list = learner?.data || [];
        const filter = data.trainerId ? list.filter(l => String(l.trainerId) === String(data.trainerId)) : list;
        return filter.map((l) => ({
            value: l._id,
            label: `${l.learnerName} (${l.mobileNo})`,
        }))

    }, [learner?.data, data.trainerId])

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
                                    value={data.trainerId}
                                    disabled={!canEdit}
                                    showSearch
                                    optionFilterProp="label"
                                    onChange={(v) => handleChange({ trainerId: v, learners: [] })}
                                    options={trainerOptions}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 0]} align="middle">
                        {/* Learner Name */}
                        <Col span={24}>
                            <Form.Item label="Select Learner" required>
                                <Select
                                    mode='multiple'
                                    placeholder="Select Learners"
                                    value={data.learners || []}
                                    disabled={!canEdit || !data.trainerId}
                                    showSearch
                                    optionFilterProp="label"
                                    onChange={(v) => handleChange({ learners: v })}
                                    options={learnerOptions}
                                    allowClear
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[12, 0]}>
                        {/* Batch Name */}
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item label="Batch Name" required>
                                <Input
                                    disabled={!canEdit}
                                    placeholder="Enter Batch Name"
                                    value={data.batchName}
                                    onChange={(e) =>
                                        handleChange({ batchName: e.target.value })
                                    }
                                />
                            </Form.Item>
                        </Col>
                        {/* Max Learner */}
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item label="Max Learner" required>
                                <Input
                                    disabled={!canEdit}
                                    placeholder="Enter Max Learner"
                                    value={data.maxLearners}
                                    onChange={(e) =>
                                        handleChange({ maxLearners: e.target.value })
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