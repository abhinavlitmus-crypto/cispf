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
    Result,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_BENEFICIARIES_QUERY } from '../../../constants/query.constants';
import { useBeneficiariesDeleteMutation, useBeneficiariesSaveMutation, useGetBeneficiariesQuery } from '../../../query/beneficiaries.query'
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
import { useOTPSentMutation, useOTPVerifyMutation } from '../../../query/otp.query';
import { QUERY_OTP_QUERY } from '../../../constants/query.constants';
import { STATES } from "../../../utils/states";
import { useGetTrainerQuery } from '../../../query/trainer.query';
import { useMemo } from 'react';
import { useGetLearnerQuery } from '../../../query/learner.query';

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
export const Beneficiaries = () => {
    const moduleAccess = commonObj?.moduleAccess?.beneficiaries || null;
    // console.log("commonobj",commonObj)
    // console.log("moduleAccess", moduleAccess)
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetBeneficiariesQuery(qData);
    const [otpSent, setOtpSent] = useState(false);
    const [otpValue, setOtpValue] = useState("");
    // const [otpVerified, setOtpVerified] = useState(false);
    // console.log("benefe",authors);
    const viewDetailsRef = useRef();
    // const [selected, setSelected] = useState([]);
    const useDelete = useBeneficiariesDeleteMutation();
    // const useSave = usePermissionSaveMutation();
    const useSave = useOTPSentMutation();
    const useVerify = useOTPVerifyMutation();
    const addFormRef = useRef();
    const editHistoryRef = useRef();

    const queryClient = useQueryClient()

    const today = new Date();
    // const hasAccess =
    //     moduleAccess?.expiryDate &&
    //     dayjs(moduleAccess.expiryDate).isAfter(dayjs());
    const hasAccess =
        moduleAccess?.expiryDate &&
        dayjs(moduleAccess.expiryDate).isSame(dayjs(), "day");
    // console.log("module", moduleAccess)
    const columns = [
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
            title: "Account Number",
            dataIndex: "accountNumber",
        },
        {
            title: "Bank Name",
            dataIndex: "bankName",
        },
        {
            title: "Branch Name",
            dataIndex: "branchDetails",
        },

        
        // {
        //     title: "View Details",
        //     key: "viewDetails",
        //     width: 100,
        //     render: (_, row) => (
        //         <Button
        //             size="small"
        //             icon={<EyeOutlined />}
        //             onClick={() => viewDetailsRef.current.open(row)}
        //         >
        //             View
        //         </Button>
        //     ),
        // },
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
                                title="Are you sure to delete this Beneficiaries?"
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
    // const permissionController = (payload) => {

    //     payload.tableName = "beneficiariesdetails";
    //     payload.isRequestStatus = "Pending";
    //     const data = payload;
    //     useSave.mutate({ data, isRequestStatus: "Pending", tableName: "beneficiariesdetails" }, {
    //         onSuccess: () => {
    //             message.success("Permission request sent.");
    //             queryClient.invalidateQueries({ queryKey: [QUERY_PERMISSION_LIST] });
    //         },
    //         onError: (err) => message.error(err.message),
    //     });
    // };
    const SendOTPHandler = (payload) => {
        useSave.mutate({}, {
            onSuccess: () => {
                message.success("OTP send successfully ");
                setOtpSent(true);
                queryClient.invalidateQueries({ queryKey: [QUERY_OTP_QUERY] });
            },
            onError: (err) => message.error(err.message),
        });
    };
    const VerifyOTPHandler = () => {
        // const data = payload;
        useVerify.mutate({ otp: otpValue }, {
            onSuccess: () => {
                message.success("OTP Verify successfully ");
                // setOtpVerified(true);
                window.location.reload();
                queryClient.invalidateQueries({ queryKey: [QUERY_OTP_QUERY] });
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
                        queryKey: [QUERY_BENEFICIARIES_QUERY],
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



    if (role == "ADMIN" && !hasAccess) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // marginTop: 80
            }}>
                <Card
                    style={{
                        width: 420,
                        textAlign: "center",
                        borderRadius: 12
                    }}
                >
                    {!otpSent ? (
                        <>
                            <Result
                                status="403"
                                title="Access Restricted"
                                subTitle="To access the Beneficiaries module, please verify your identity using a one-time password (OTP)."
                            />

                            <Button
                                type="primary"
                                size="large"
                                onClick={SendOTPHandler}
                            >
                                Get OTP
                            </Button>
                        </>
                    ) : (
                        <>
                            <h2>Verify OTP</h2>

                            <p style={{ color: "#888", marginBottom: 20 }}>
                                Enter the OTP sent to your email
                            </p>

                            <Input
                                placeholder="Enter OTP"
                                value={otpValue}
                                onChange={(e) => setOtpValue(e.target.value)}
                                maxLength={6}
                                style={{ marginBottom: 20, textAlign: "center", letterSpacing: 4 }}
                            />

                            <Button
                                type="primary"
                                size="large"
                                block
                                onClick={VerifyOTPHandler}
                            >
                                Verify OTP
                            </Button>
                        </>
                    )}
                </Card>
            </div>
        );
    }
    return (
        <div>
            <Card
                bordered={false}
                size="small"
                className='p-0'
                title={"Beneficiaries"}
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
    const { data: AllData } = useGetBeneficiariesQuery(qData);
    const { data: WholeData } = useGetBeneficiariesQuery({ isAll: true });
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
    const [errors, setErrors] = useState({});
    const { data: trainer } = useGetTrainerQuery({ isAll: true, status: true });
    // console.log("data addeditFormModal", trainer);
    // const { data: clients } = useGetClientQuery({ isAll: true, status: true });
    const useSave = useBeneficiariesSaveMutation();
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
            setErrors(prev => {
                const newError = { ...prev };
                delete newError[k];
                return newError
            })
        });


        setData({ ...data });
    }



    const save = () => {
        const newErrors = {};

        if (data.accountNumber !== data.confirmAccountNumber) {
            newErrors.confirmAccountNumber = "Account numbers do not match";
        }

        if (data.ifsCode !== data.confirmIfsCode) {
            newErrors.confirmIfsCode = "IFSC codes do not match";
        }

        setErrors(newErrors);

        // if (Object.keys(newErrors).length > 0) return;

        useSave.mutate(
            data,
            {
                onSuccess: (res) => {
                    message.success('Data saved successfully.');
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_BENEFICIARIES_QUERY]
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
        // console.log("user trainer",list)
        return list.map((t) => ({
            // value: t._id,
            value: t.digiShaktiTrainerUID,
            label: t.trainerName,
        }));
    }, [trainer?.data]);

    const trainerMap = useMemo(() => {
        const map = {};
        (trainer?.data || []).forEach((t) => {
            map[t.digiShaktiTrainerUID] = t;
        });
        return map;
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
                title={<span>{data._id ? "Edit " : "Add "} Beneficiaries</span>}
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
                                    disabled={!canEdit}
                                    showSearch
                                    optionFilterProp="label"
                                    // onChange={(v) => handleChange({ trainerId: v, learners: [] })}
                                    onChange={(v) => handleChange({ digiShaktiTrainerUID: v })}
                                    // onChange={(v) => {
                                    //     const selectedTrainer = trainerMap[v];

                                    //     handleChange({
                                    //         digiShaktiTrainerUID: v,
                                    //         // learners: [],

                                    //         // digiShaktiTrainerUID: selectedTrainer?.digiShaktiTrainerUID,
                                    //         // trainerName: selectedTrainer?.trainerName,
                                    //         // district: selectedTrainer?.district,
                                    //         // block: selectedTrainer?.block,
                                    //     });
                                    // }}
                                    options={trainerOptions}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <h1 className='text-gray-900 text-lg my-3 pb-3 border-0 border-b border-b-gray-300'>
                        Trainer Details
                    </h1>
                    <Row gutter={[12, 0]} align="middle">
                        {/* Trainer ID */}
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
                        {/* Trainer Name */}
                        {/* <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item label="Trainer Name" required>
                                <Input
                                    // disabled={!canEdit}
                                    disabled
                                    placeholder="Enter Trainer Name"
                                    value={data.trainerName}
                                    onChange={(e) =>
                                        handleChange({ trainerName: e.target.value })
                                    }
                                />
                            </Form.Item>
                        </Col> */}


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



                    <h1 className='text-gray-900 text-lg my-3 pb-3 border-0 border-b border-b-gray-300'>
                        Account Details
                    </h1>
                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item label="Account Number" required>
                                <Input
                                    disabled={!canEdit}
                                    placeholder="Enter Account Number"
                                    value={data.accountNumber}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/[^\d]/g, '');
                                        handleChange({ accountNumber: value })
                                    }
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item
                                label="Re-enter Account Number"
                                required
                                validateStatus={errors.confirmAccountNumber ? "error" : ""}
                                help={errors.confirmAccountNumber}
                            >
                                <Input
                                    disabled={!canEdit}
                                    placeholder="Re-enter Account Number"
                                    value={data.confirmAccountNumber}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/[^\d]/g, '');
                                        handleChange({ confirmAccountNumber: value })
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[12, 0]}>
                        {/* Batch Name */}
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item label="Bank Name" required>
                                <Input
                                    disabled={!canEdit}
                                    placeholder="Enter Bank Name"
                                    value={data.bankName}
                                    onChange={(e) =>
                                        handleChange({ bankName: e.target.value })
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item label="Branch Details" required>
                                <Input
                                    disabled={!canEdit}
                                    placeholder="Enter Branch Details"
                                    value={data.branchDetails}
                                    onChange={(e) =>
                                        handleChange({ branchDetails: e.target.value })
                                    }
                                />
                            </Form.Item>
                        </Col>

                    </Row>

                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item label="ISF Code" required>
                                <Input
                                    disabled={!canEdit}
                                    placeholder="Enter IFSC Code"
                                    value={data.ifsCode}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                        handleChange({ ifsCode: value.toUpperCase() })
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item
                                label="Re-enter IFSC Code"
                                required
                                validateStatus={errors.confirmIfsCode ? "error" : ""}
                                help={errors.confirmIfsCode}
                            >
                                <Input
                                    disabled={!canEdit}
                                    placeholder="Re-enter IFSC Code"
                                    value={data.confirmIfsCode}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                        handleChange({ confirmIfsCode: value.toUpperCase() })
                                    }}
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

    useImperativeHandle(ref, () => ({
        open(data) {
            setBatch(data);
            setOpen(true);
        },
    }));

    const enrolled = batch?.learnerDetails?.length || 0;
    const total = Number(batch?.maxLearners) || 0;

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
                        <Row gutter={[16, 0]}>
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
                            <Col span={24}>
                                <strong>Enrollment Status:</strong>
                                <div style={{ marginTop: 8 }}>
                                    <Progress
                                        percent={total > 0 ? Math.round((enrolled / total) * 100) : 0}
                                        size='small'
                                        status={
                                            enrolled === total
                                                ? "success"
                                                : enrolled > total
                                                    ? "exception"
                                                    : "active"
                                        }
                                    />
                                    <div>{enrolled} / {total} Enrolled</div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <h3 style={{ marginBottom: 12 }} className='font-bold'>
                        Trainee Enrollment
                    </h3>

                    <Table
                        columns={learnerColumns}
                        dataSource={batch.learnerDetails || []}
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