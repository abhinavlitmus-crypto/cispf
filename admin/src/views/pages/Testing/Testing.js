import { DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
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
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_CONSENT, QUERY_ENGAGEMENT_LIST } from '../../../constants/query.constants';
import { useEnagementDeleteMutation, useEnagementSaveMutation, useGetEnagementQuery, useTestingSaveMutation } from '../../../query/engagement.query'
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
import { useConsentSentMutation } from '../../../query/consent.query';
import { useGetPermissionQuery, usePermissionSaveMutation } from '../../../query/permission.query';
import { QUERY_PERMISSION_LIST } from '../../../constants/query.constants';

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
export const Testing = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetEnagementQuery(qData, { testingData: true });


    // const [selected, setSelected] = useState([]);
    const useDelete = useEnagementDeleteMutation();
    const useSave = usePermissionSaveMutation();
    const addFormRef = useRef();
    const editHistoryRef = useRef();

    const queryClient = useQueryClient()
    
    const downloadTestReport = (testReportUrl, clientName) => {
        if (!testReportUrl) {
            message.warning('No test report available for download');
            return;
        }
        
        // Fetch the file and create a blob for direct download
        fetch(testReportUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                // Create a temporary link element to trigger download
                const link = document.createElement('a');
                const url = window.URL.createObjectURL(blob);
                link.href = url;
                link.download = `TestReport_${clientName?.replace(/\s+/g, '_') || 'Unknown'}_${Date.now()}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                
                message.success('Test report downloaded successfully');
            })
            .catch(error => {
                console.error('Download error:', error);
                // Fallback to opening in new tab if download fails
                const link = document.createElement('a');
                link.href = testReportUrl;
                link.target = '_blank';
                link.download = `TestReport_${clientName?.replace(/\s+/g, '_') || 'Unknown'}_${Date.now()}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                message.warning('Opening report in new tab due to download restrictions');
            });
    };

    const columns = [

        {
            title: "Unique Id",
            dataIndex: "testingId"
        },
        {
            title: "Client name",
            dataIndex: ["clientDetails", "clientName"],
            render: (name, row) => name?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
            // width: 300,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            // width: 300,
        },
      
        {
            title: "Test Type",
            dataIndex: "testType",
            // width: 300,
        },

        {
            title: "Test Date",
            dataIndex: "testDate",
            render: (date) =>
                date ? new Date(date).toLocaleDateString("en-IN") : "-",
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
            title: "Testing Result",
            dataIndex: "testingResult",
            // width: 300,
            render: (_, { testingResult }) => (
                <h1
                    className={`text-center text-xs rounded py-1 border 
            ${testingResult === "+ve"
                            ? " bg-green-200 border-green-300"
                            : testingResult === "-ve"
                                ? "bg-red-200 border-red-300"
                                : "bg-yellow-200 border-yellow-300"
                        }
        `}
                >
                    {
                        testingResult === "+ve"
                            ? "Positive"
                            : testingResult === "-ve"
                                ? "Negative"
                                : "Pending"
                    }
                </h1>
            ),


        },



        {
            title: "Download Media",
            key: "downloadReport",
            width: 100,
            render: (_, row) => (
                <Button
                    size="small"
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => downloadTestReport(row.testReportUrl, row.clientDetails?.clientName)}
                    disabled={!row.testReportUrl}
                    title={row.testReportUrl ? "Download Media" : "No Media Available"}
                >
                    Download
                </Button>
            ),
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
                                        title="Are you sure to delete this Testing?"
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
    const permissionController = (payload) => {
        
        payload.tableName = "testingDetails";
        payload.isRequestStatus = "Pending";
        const data = payload;
        useSave.mutate({data,isRequestStatus: "Pending",tableName: "testingDetails"}, {
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
                        queryKey: [QUERY_ENGAGEMENT_LIST],
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
                title={"Testing"}
            >
                <Table
                    {...tableProps}
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={authors?.data?.length ? authors?.data : []}
                />
                {!isLoading && isError && !authors?.data?.length && <DataNotLoaded />}
                <AddEditFormModal ref={addFormRef} {...{ queryClient }} />
                <EditHistoryModal ref={editHistoryRef} />

            </Card>
        </div>
    )
}

function Search({ qData, setQData, addFormRef }) {
    const [searchFields, setSearchFields] = useState({})
    const { data: AllData } = useGetEnagementQuery(qData);
    const { data: WholeData } = useGetEnagementQuery({ isAll: true });
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
            // "Test Method": r.testMethod ?? "",
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
    const { data: clients } = useGetClientQuery({ isAll: true, status: true });
    const { data: engagementClient } = useGetEnagementQuery({ testingData: false });
    // console.log("engagement", engagementClient);
    const useSave = useTestingSaveMutation();
    const useSentConsent = useConsentSentMutation();
    const { data: engagement } = useGetEnagementQuery({ testingResult: "-ve" });
    const [num, setNum] = useState(0);
    const [name, setName] = useState("");
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

    const handleTakeConsent = () => {
        if (!data.clientId) return;
        const payload = { phone: String(num) };
        const name =
            engagement?.data.find((c) => c.clientDetails._id === data.clientId)
                ?.clientDetails.clientName || "";
        payload.name = name;
        useSentConsent.mutate(payload, {
            onSuccess: (res) => {
                message.success("Consent sent successfully");

                queryClient.invalidateQueries({
                    queryKey: [QUERY_CONSENT],
                });
            },
            onError: (err) => {
                message.error(err.message || "Failed to send consent");
            },
        });
    };

    const save = () => {
        useSave.mutate(
            data,
            {
                onSuccess: (res) => {
                    message.success('Data saved successfully.');
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_ENGAGEMENT_LIST]
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
    //         // console.log("client data", clients)
    //         const matchedEngagement = engagementClient?.data?.find(
    //             e => e.clientId === data.clientId
    //         );
    //         // console.log("engagement  data", engagementClient)
    //         // console.log("match engagement ", matchedEngagement);
    //         // console.log("data id", data._id);
    //         data._id = client?._id
    //     }
    // }, [data.clientId, data._id]);

    useEffect(() => {
        if (!data._id) {
            const client = clients?.data?.find(c => c._id === data.clientId);
            // console.log("client data", clients)
            const matchedEngagement = engagementClient?.data?.find(
                e => e.clientId === data.clientId
            );

            // console.log("engagement  data", engagementClient)
            // console.log("match engagement ", matchedEngagement);
            // console.log("data id", data._id);
            data._id = matchedEngagement?._id;


            data.phone = matchedEngagement?.phone;
            data.alternativePhone = matchedEngagement?.phone;
            data.email = matchedEngagement?.email;
            data.contactMethod = matchedEngagement?.contactMethod;
            data.maritalStatus = matchedEngagement?.maritalStatus;
            data.testingNotes = matchedEngagement?.testingNotes;
            data.engageDate = matchedEngagement?.engageDate;
            data.purposeOfEngagement = matchedEngagement?.purposeOfEngagement;
            // console.log("data id", data._id);
            const phone = matchedEngagement?.phone;
            if (!phone) return;
            setNum(prev => phone);
            console.log("Phone number:", phone);
            console.log("enagement", engagement)
            console.log("client id", data.clientId)
            // console.log("Phone number:", phone);
            // console.log("enagement", engagement)
            // console.log("client id", data.clientId)

            handleChange({
                testingId: `VT-${util.removeSpecialChars(data.clientId || "")}`,
                engageDate: client?.outreachData?.engageDate || new Date().toISOString(),
            });
        }
    }, [data.clientId]);
    return (
        <>
            <Modal
                title={<span>{data._id ? "Edit " : "Add "} Testing</span>}
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

                    <h1 className='text-gray-900 text-lg my-3 pb-3 border-0 border-b border-b-gray-300'>
                        Select Client from Onboarding Clients list
                    </h1>
                    <Row gutter={[12, 0]} align="middle">
                        <Col span={24}>
                            <Form.Item label="Select Client" required>
                                <Select
                                    placeholder="Select client"
                                    value={data?.clientId}
                                    disabled={!!data._id}
                                    onChange={(e) => handleChange({ clientId: e })}
                                >
                                    {engagementClient?.data?.map((client) => (
                                        <Select.Option key={client?.clientDetails?._id} value={client.clientDetails._id} >
                                            {client?.clientDetails?.clientName}
                                        </Select.Option>
                                    ))}
                                </Select>

                            </Form.Item>
                        </Col>
                    </Row>

                    <h1 className='text-gray-900 text-lg my-3 pb-3 border-0 border-b border-b-gray-300'>
                        Risk Assessment
                    </h1>
                    <Row gutter={[12, 0]}>
                        <Col span={12}>
                            <Form.Item label="Number of Sexual Partners (Last 6 Months)" required>
                                <Input
                                    type='number'
                                    min={0}
                                    max={500}
                                    defaultValue={0}
                                    value={data.enhancedRiskAssessment?.sexualPartner}
                                    onChange={(e) => {
                                        handleChange({
                                            enhancedRiskAssessment: {
                                                ...data.enhancedRiskAssessment,
                                                sexualPartner: e.target.value,
                                            },
                                        });
                                    }}
                                    disabled={!canEdit}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Risk Assessment" required>
                                <Select value={data.enhancedRiskAssessment?.checks} disabled={!canEdit}
                                    onChange={e => {
                                        handleChange({
                                            enhancedRiskAssessment: {
                                                ...data.enhancedRiskAssessment,
                                                checks: e,
                                            },
                                        });
                                    }}
                                    mode="multiple"
                                    placeholder="Please select Risk"
                                >
                                    <Select.Option value="Unprotected Sexual Activity">Unprotected Sexual Activity</Select.Option>
                                    <Select.Option value="Multiple Concurrent Partners">Multiple Concurrent Partners</Select.Option>
                                    <Select.Option value="HIV Positive Partner">HIV Positive Partner</Select.Option>
                                    <Select.Option value="Injection Drug Use">Injection Drug Use</Select.Option>
                                    <Select.Option value="Share Needles">Share Needles</Select.Option>
                                    <Select.Option value="Commercial Sex Work">Commercial Sex Work</Select.Option>
                                    <Select.Option value="Recent STI Symptoms">Recent STI Symptoms</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item label={"Condom Usage Frequency"} required>
                                <Select placeholder="Select Status" disabled={!canEdit} value={data.enhancedRiskAssessment?.condomUsage} onChange={(e) => {
                                    handleChange({
                                        enhancedRiskAssessment: {
                                            ...data.enhancedRiskAssessment,
                                            condomUsage: e,
                                        },
                                    });
                                }}>
                                    <Select.Option value="ALWAYS">ALWAYS</Select.Option>
                                    <Select.Option value="SOMETIMES">SOMETIMES</Select.Option>
                                    <Select.Option value="NEVER">NEVER</Select.Option>
                                    <Select.Option value="RARELY">RARELY</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={"Alcohol/Drug Use"} required>
                                <Select disabled={!canEdit} placeholder="Select ALcohol/Drug Use" value={data.enhancedRiskAssessment?.alcohol} onChange={(e) => {
                                    handleChange({
                                        enhancedRiskAssessment: {
                                            ...data.enhancedRiskAssessment,
                                            alcohol: e,
                                        },
                                    });
                                }}>
                                    <Select.Option value="No">No</Select.Option>
                                    <Select.Option value="Frequent">Yes - Frequent</Select.Option>
                                    <Select.Option value="Occasional">Yes - Occasional</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={"STI History"} required>
                                <Select disabled={!canEdit} placeholder="Select STI History" value={data.enhancedRiskAssessment?.STI} onChange={(e) => {
                                    handleChange({
                                        enhancedRiskAssessment: {
                                            ...data.enhancedRiskAssessment,
                                            STI: e,
                                        },
                                    });
                                }}>
                                    <Select.Option value="NO">No</Select.Option>
                                    <Select.Option value="CURRENT">Yes - Current</Select.Option>
                                    <Select.Option value="PAST">Yes - Past</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={"Partner HIV Status"} required>
                                <Select disabled={!canEdit} placeholder="Select HIV Status" value={data.enhancedRiskAssessment?.partnerHivStatus} onChange={(e) => {
                                    handleChange({
                                        enhancedRiskAssessment: {
                                            ...data.enhancedRiskAssessment,
                                            partnerHivStatus: e,
                                        },
                                    });
                                }}>
                                    <Select.Option value="unknown">Unknown</Select.Option>
                                    <Select.Option value="-ve">Negative</Select.Option>
                                    <Select.Option value="+ve">Positive</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label={"Overall Risk Score"} required>
                                <h1 className="text-gray-500 border" >to be updated by formula</h1>
                                {/* <Select disabled={!canEdit} placeholder="Select Overall Risk " value={data.enhancedRiskAssessment?.overAllRiskStatus} onChange={(e) => {
                                    handleChange({
                                        enhancedRiskAssessment: {
                                            ...data.enhancedRiskAssessment,
                                            overAllRiskStatus: e,
                                        },
                                    });
                                }}>
                                    <Select.Option value="LOW">LOW</Select.Option>
                                    <Select.Option value="MEDIUM">MEDIUM</Select.Option>
                                    <Select.Option value="HIGH">HIGH</Select.Option>
                                </Select> */}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={"Risk Assessment Notes"} >
                                <Input.TextArea placeholder='Additional notes about risk factors and assessment'
                                    type='text'
                                    disabled={!canEdit}
                                    maxLength={300}
                                    value={data.riskAssessmentNotes}
                                    onChange={(e) => {
                                        handleChange({ riskAssessmentNotes: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* <h1 className='text-gray-900 text-lg my-3 pb-3 border-0 border-b border-b-gray-300'>
                        Engagement Stage - Contact Information
                    </h1> */}
                    {/* <Row gutter={[12, 0]} align={'middle'}>
                        <Col span={6}>
                            <Form.Item label="Contact Number" required>
                                <Input
                                    type="text"
                                    disabled={!canEdit}
                                    placeholder="Enter phone (10 digit)"
                                    maxLength={10}
                                    value={data.phone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                                        handleChange({ phone: value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Alternate Number" >
                                <Input
                                    type="text"
                                    disabled={!canEdit}
                                    placeholder="Enter phone (10 digit)"
                                    maxLength={10}
                                    value={data.alternativePhone}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                                        handleChange({ alternativePhone: value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Email" >
                                <Input
                                    type="text"
                                    disabled={!canEdit}
                                    placeholder="Enter Email"
                                    value={data.email}
                                    onChange={(e) => {
                                        handleChange({ email: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Preferred Contact Method">
                                <Select placeholder="Select Method" value={data.contactMethod} onChange={e => { handleChange({ contactMethod: e }) }} disabled={!canEdit} >
                                    <Select.Option value={"whatsapp"}>WhatsApp</Select.Option>
                                    <Select.Option value={"email"}>Email</Select.Option>
                                    <Select.Option value={"sms"}>SMS</Select.Option>
                                    <Select.Option value={"call"}>Phone Call</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item label="Marital Status">
                                <Select value={data.maritalStatus} onChange={e => { handleChange({ maritalStatus: e }) }} placeholder={"Select Status"} disabled={!canEdit}>
                                    <Select.Option value={"unmarried"}>UnMarried</Select.Option>
                                    <Select.Option value={"married"}>Married</Select.Option>
                                    <Select.Option value={"divorced"}>Divorced</Select.Option>
                                    <Select.Option value={"widowed"}>Widowed</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Special Instructions/Notes (Engagement Stage)" >
                                <Input.TextArea
                                    type='text'
                                    disabled={!canEdit}
                                    placeholder="Max length is 300"
                                    value={data.testingNotes}
                                    maxLength={300}
                                    onChange={(e) => {
                                        handleChange({ testingNotes: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row> */}
                    {/* <h1 className='text-gray-900 text-lg my-3 pb-3 border-0 border-b border-b-gray-300'>
                        Engagement Details
                    </h1> */}
                    {/* <Row gutter={[12, 0]} align={"middle"}>
                        <Col span={12}>


                            <Form.Item label="Engagement Date" required>
                                <Input
                                    type="text"
                                    disabled
                                    placeholder="Auto Generated Date"
                                    value={data.engageDate ? dayjs(data.engageDate).format("DD MMM YYYY") : ""}
                                />
                            </Form.Item>


                        </Col>
                        <Col span={12}>
                            <Form.Item label="Purpose of Engagement" required>
                                <Select value={data.purposeOfEngagement} onChange={e => { handleChange({ purposeOfEngagement: e }) }} placeholder="Select Purpose" disabled={!canEdit}>
                                    <Select.Option value={"HIV testing"}>HIV Testing</Select.Option>
                                    <Select.Option value={"STI services"}>STI Services</Select.Option>
                                    <Select.Option value={"counselling"}>Counselling</Select.Option>
                                    <Select.Option value={"PEP"}>PEP</Select.Option>
                                    <Select.Option value={"PrEP consultation"}>PrEP Consultation</Select.Option>
                                    <Select.Option value={"Doctor counselling"}>Doctor Counselling</Select.Option>
                                    <Select.Option value={"crisis support"}>Crisis Support</Select.Option>
                                    <Select.Option value={"others"}>Others</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row> */}
                    <h1 className='text-gray-900 text-lg my-3 pb-3 border-0 border-b border-b-gray-300'>
                        HIV Testing Details
                    </h1>
                    <Row gutter={[12, 0]} align={"middle"}>
                        <Col span={8}>
                            <Form.Item label="PID Number (HIV)" >
                                <Input
                                    type="text"
                                    disabled
                                    placeholder="Lab Testing/Reference Number"
                                    value={data.testingId}
                                    onChange={(e) => {
                                        handleChange({ testingId: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Test Date" required>
                                {/* <DatePicker value={data.testDate && dayjs(moment(data.testDate).format("YYYY-MM-DD"))}
                                    format='DD MMM YYYY'
                                    disabled={!accessValue}
                                    disabledDate={(current) => current.isBefore(moment(new Date()).subtract(1, "day"))}
                                    onChange={(e) => { handleChange({ testDate: new Date(e) }) }} style={{ width: '100%' }} /> */}
                                <DatePicker
                                    placeholder="Select date"
                                    disabled={!canEdit}
                                    format="DD MMM YYYY"
                                    disabledDate={(current) => {
                                        if (!current) return false;

                                        const today = dayjs().endOf("day");
                                        const oneMonthAgo = dayjs().subtract(1, "month").startOf("day");

                                        // Disable dates AFTER today OR BEFORE 1 month ago
                                        return current.isAfter(today) || current.isBefore(oneMonthAgo);
                                    }}
                                    value={data.testDate ? dayjs(data.testDate) : null}
                                    onChange={(d) => {
                                        handleChange({ testDate: d || null });
                                    }}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Type of HIV Test" required>
                                <Select value={data.testType} onChange={e => { handleChange({ testType: e }) }} placeholder={"Select Test Type"} disabled={!canEdit} >
                                    <Select.Option value={"screening"}>Screening Test</Select.Option>
                                    <Select.Option value={"confirmatory"}>Confrimatory Test</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* <Col span={8}>
                            <Form.Item label="Test Method" required>
                                <Select value={data.testMethod} onChange={e => { handleChange({ testMethod: e }) }} placeholder={"Select Test Method"} disabled={!canEdit}>
                                    <Select.Option value={"RAPID"}>RAPID</Select.Option>
                                    <Select.Option value={"ELISA"}>ELISA</Select.Option>
                                    <Select.Option value={"NAT"}>NAT</Select.Option>
                                    <Select.Option value={"WESTERN BLOT"}>WESTERN BLOT</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col> */}
                        <Col span={8}>
                            <Form.Item label="Testing Lab" required>
                                <Select value={data.testingLab} onChange={e => { handleChange({ testingLab: e }) }} placeholder={"Select Testing Lab"} disabled={!canEdit}>
                                    <Select.Option value={"redcliffe"}>Redcliffe</Select.Option>
                                    <Select.Option value={"thyrocare"}>Thyrocare</Select.Option>
                                    <Select.Option value={"govt ICTC testing center"}>Govt ICTC Testing Center</Select.Option>
                                    <Select.Option value={"others"}>Others</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Test Result" required>
                                <Select value={data.testingResult} onChange={e => { handleChange({ testingResult: e }) }} placeholder={"Select Result"} disabled={!canEdit}>
                                    <Select.Option value={"-ve"}>Non-Reactive</Select.Option>
                                    <Select.Option value={"+ve"}>Reactive</Select.Option>
                                    {/* <Select.Option value={"pending"}>Pending</Select.Option> */}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={"Test Result Details"}>
                                <Input.TextArea placeholder='Complete testing result details, observations, recommendations from lab'
                                    type='text'
                                    maxLength={300}
                                    disabled={!canEdit}
                                    value={data.testResultNotes}
                                    onChange={(e) => {
                                        handleChange({ testResultNotes: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Test Report" >
                                <UploadImage
                                    value={data.testReportUrl ? [data.testReportUrl] : []}
                                    disabled={!canEdit}
                                    count={1}
                                    onChange={(v) =>
                                        handleChange({ testReportUrl: v?.[v.length - 1] || "" })
                                    }
                                    listType="picture-card"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 0]}>
                        <Col span={3}>
                            <Button
                                disabled={
                                    !data.clientId || useSentConsent.isPending || !canEdit
                                }
                                onClick={handleTakeConsent}
                                className={`text-white ${!data.clientId || useSentConsent.isPending ? "bg-gray-300 cursor-not-allowed" : "bg-green-500"}`}
                            >
                                {useSentConsent.isPending ? "Sending..." : "Take Consent"}
                            </Button>
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
