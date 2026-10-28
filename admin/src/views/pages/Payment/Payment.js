import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { json2csv } from "json-2-csv";
import html2pdf from "html2pdf.js";
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
import { QUERY_PAYMENT_QUERY } from '../../../constants/query.constants';
import { useGetPaymentQuery, usePaymentDeleteMutation, usePaymentSaveMutation } from '../../../query/payment.query'
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
        role === "ADMIN",
    canExport:
        role === "SuperAdmin" ||
        role === "ADMIN",

    canDelete:
        role === "ADMIN" ||
        role === "SuperAdmin",

    canAdd:
        role === "ADMIN" ||
        role === "SuperAdmin",
};

const { canAdd, canDelete, canEdit, canView, canExport } = permissions;
export const Payment = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetPaymentQuery(qData);
    // console.log("data, payment", authors);
    // const [selected, setSelected] = useState([]);
    const useDelete = usePaymentDeleteMutation();

    const addFormRef = useRef();
    const editHistoryRef = useRef();
    // console.log("authors incentive",authors)
    const queryClient = useQueryClient()


    const columns = [
        {
            title: "Reference Number",
            dataIndex: "_id"
        },
        {
            title: "DigiShakti Trainer UID",
            dataIndex: "digiShaktiTrainerUID"
        },
        {
            title: "Trainer Name",
            dataIndex: "trainerName"
        },
        // {
        //     title: "Date of Certification",
        //     dataIndex: "dateOfCertification",
        //     render: (date) =>
        //         date ? new Date(date).toLocaleDateString("en-IN") : "-",
        // },
        {
            title: "Payout",
            dataIndex: "totalPayout",
            render: (_, row) => {
                return (
                    <div>
                        <div style={{ fontWeight: 600 }}>
                            ₹{row.totalPayout}
                        </div>
                        {/* <div style={{ fontSize: 12, color: "#888" }}>
                            {row?.batchDetails?.totalCertified} × ₹{row.price}
                        </div> */}
                    </div>
                );
            }
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
            dataIndex: "isPaymentStatus",
            width: 100,
            render: (_, row) => {
                const statusMap = {
                    Pending: { color: "gold", label: "Pending" },
                    Paid: { color: "green", label: "Paid" },
                    Process: { color: "red", label: "Process" },
                }
                const status = row?.isPaymentStatus;
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
                        queryKey: [QUERY_PAYMENT_QUERY],
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
                title={"Payments"}
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
    // const { data: AllData } = useGetPaymentQuery(qData);
    const { data: WholeData } = useGetPaymentQuery({ isAll: true, pendingStatus: true });
    // console.log("search data, payment", WholeData)
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }

    // convert JSON -> CSV + download
    const downloadCsv = async (rows, fileName = "NEFT_Form.csv") => {
        if (!Array.isArray(rows) || rows.length === 0) {
            message.warning("No data to export");
            return;
        }
        let totalAmount = 0;
        // OPTIONAL: map only the fields you want in CSV
        const cleaned = rows.map((r, index) => {
            const amount = Number(r.totalPayout) || 0;
            totalAmount += amount;
            return ({
                "Sl No": index + 1,
                "Name of the Payee": r.trainerName ?? "",
                "Account Number": r.accountNumber ?? "",
                "IFSC Code": r.ifsCode ?? "",
                "Bank Name": r.bankName ?? "",
                "Branch Name": r.branchDetails ?? "",
                "Amount": r.totalPayout ?? 0,
            })
        });

        cleaned.push({
            "Sl No": "",
            "Name of the Payee": "Total",
            "Account Number": "",
            "IFSC Code": "",
            "Bank Name": "",
            "Branch Name": "",
            "Amount": totalAmount,
        });

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


    const handleNEFT = async () => {
        await downloadCsv(WholeData?.data || [], "NEFT_Form.csv");
        message.success("NEFT form generated successfully.");
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
                        <Button onClick={handleNEFT}>
                            Generate NEFT Form
                        </Button>
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
    const [errors, setErrors] = useState({});
    // const { data: clients } = useGetClientQuery({ isAll: true, status: true });
    // const { data: trainer } = useGetTrainerQuery({ isAll: true, status: true });
    // const { data: batch } = useGetBatchQuery({ isAll: true, status: true, forPayment: true });
    const { data: paymentData } = useGetPaymentQuery({ isAll: true, status: true, forPayment: true, enabled: open });
    // console.log("payment data", paymentData)
    const useSave = usePaymentSaveMutation();
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

    const validateReferenceNumber = () => {
        const newErrors = {};
        setErrors("")
        if (data?.reReferenceNumber && data?.reReferenceNumber !== data._id) {
            newErrors.reReferenceNumber = "Reference number does not match";
        }

        setErrors(newErrors);
    };

    const save = () => {

        useSave.mutate(
            {
                ...data,
                ...(data?._id && data?.proofOfPayment && {
                    isPaymentStatus: "Process"
                }),
                ...(data?._id && data?.proofOfPayment && data?.proofOfReceipt && {
                    isPaymentStatus: "Paid"
                })
            },
            {
                onSuccess: (res) => {
                    message.success('Data saved successfully.');
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_PAYMENT_QUERY]
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
        // const list = trainer?.data || [];
        const list = paymentData?.data || [];

        return list.map((t) => ({
            // value: t.digiShaktiTrainerUID,
            value: t._id, // digiShatiTrainerUID
            label: t.trainerName,
        }));
    }, [paymentData?.data]);



    useEffect(() => {
        if (!data.digiShaktiTrainerUID || !paymentData?.data) return;
        if (data._id) return; // Don't run on edit
        const selectedTrainer = paymentData?.data.find(
            (t) => String(t._id) === String(data.digiShaktiTrainerUID)
        )
        if (!selectedTrainer) {
            setData(prev => ({
                ...prev,
                batches: [],
                totalPayout: 0
            }));
            return;
        }
        setData((prev) => ({
            ...prev,
            digiShaktiTrainerUID: selectedTrainer._id,
            trainerName: selectedTrainer.trainerName,
            district: selectedTrainer.district,
            block: selectedTrainer.block,
            batches: selectedTrainer.batches || [],
            totalPayout: selectedTrainer.totalPayout || 0,
            accountNumber: selectedTrainer.accountNumber,
            bankName: selectedTrainer.bankName,
            ifsCode: selectedTrainer.ifsCode,
            branchDetails: selectedTrainer.branchDetails,
        }));
    }, [data.digiShaktiTrainerUID, paymentData?.data])

    const handleDownloadPDF = (data) => {
        const html = generateAcknowledgementHTML(data);

        const element = document.createElement("div");
        element.innerHTML = html;

        html2pdf()
            .set({
                margin: 10,
                filename: `Acknowledgement_${data._id}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
            })
            .from(element)
            .save();
    };
    return (
        <>

            <Modal
                title={<span>{data._id ? "Edit " : "Add "} Payment</span>}
                style={{ top: 20 }}
                open={open}
                okText={"Save"}
                onOk={save}
                okButtonProps={{ disabled: useSave.isPending || !canEdit || data?.isPaymentStatus === "Paid" }}
                onCancel={() => {

                    setOpen(false);
                }}
                destroyOnClose
                maskClosable={false}
                width={600}
            // className="app-modal-body-overflow"

            >
                <Form layout="vertical">
                    <Row gutter={[12, 0]} align="middle">
                        <Col span={24}>
                            <Form.Item label="Select Trainer" required>
                                <Select
                                    placeholder="Select Trainer"
                                    value={data.digiShaktiTrainerUID}
                                    disabled={!canEdit || !!data._id}
                                    showSearch
                                    optionFilterProp="label"
                                    onChange={(v) => handleChange({ digiShaktiTrainerUID: v })}
                                    options={trainerOptions}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label={"Approved Batch"}>
                                <div style={{
                                    maxHeight: 150,
                                    overflowY: "auto",
                                    border: "1px solid #d9d9d9",
                                    borderRadius: 6,
                                    padding: 8
                                }}>{!data?.digiShaktiTrainerUID ? (
                                    <span style={{ color: "#888", fontStyle: "italic" }}>
                                        Please select a trainer to view approved batches
                                    </span>
                                ) : data?.batches?.length > 0 ? (
                                    data.batches.map((b) => (
                                        <Tag key={b.batchId}>
                                            {b.batchName} ({b.batchId})
                                        </Tag>
                                    ))
                                ) : (
                                    <span style={{ color: "#888", fontStyle: "italic" }}>
                                        No new approved batches available for payment
                                    </span>
                                )}</div>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            {/* <Form.Item label="Date of Certification" >
                                <DatePicker
                                    placeholder="Select date"
                                    disabled={!canEdit || data?.isPaymentStatus === "Paid"}
                                    format="DD MMM YYYY"
                                    value={data.dateOfCertification ? dayjs(data.dateOfCertification) : null}
                                    onChange={(d) => {
                                        handleChange({ dateOfCertification: d || null });
                                    }}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item> */}
                        </Col>
                    </Row>
                    <Row gutter={[12, 0]} align={'middle'}>
                        <Col span={12}>
                            <Form.Item label="Total Payout">
                                <Input
                                    disabled
                                    value={`₹ ${data.totalPayout || 0}`}
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
                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Form.Item
                                label="Reference Number"
                                validateStatus={errors.reReferenceNumber ? "error" : ""}
                                help={errors.reReferenceNumber}
                            >
                                <Tooltip title={!data?._id ? "Please Save the record before uploading" : !data?.proofOfPayment ? "Upload Proof of Payment first" : ""}>
                                    <Input
                                        disabled={!canEdit || !data?._id || !data?.proofOfPayment}
                                        placeholder="Enter reference number to verify"
                                        help={
                                            errors.reReferenceNumber ||
                                            "Optional: Verify reference number before uploading proof of receipt."
                                        }
                                        value={data.reReferenceNumber}
                                        onChange={(e) => {
                                            handleChange({ reReferenceNumber: e.target.value });
                                            validateReferenceNumber();
                                        }}
                                    />
                                </Tooltip>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Tooltip title={
                                !data._id
                                    ? "Please save the record before uploading"
                                    : ""
                            }>
                                <Form.Item label="Proof of Payment">
                                    <UploadImage
                                        disabled={!canEdit || !data?._id || data?.isPaymentStatus === "Paid" || data?.isPaymentStatus === "Process"}
                                        value={data.proofOfPayment ? [data.proofOfPayment] : []}
                                        count={1}
                                        onChange={(v) => {
                                            // console.log("vvv", v);
                                            setData({ ...data, proofOfPayment: v?.[v.length - 1] || "" });
                                        }}
                                        listType="picture-card"
                                    />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12}>
                            <Tooltip title={
                                !data._id
                                    ? "Please save first"
                                    : !data.proofOfPayment
                                        ? "Upload Proof of Payment first"
                                        : data.reReferenceNumber !== data._id
                                            ? "Verify reference number before uploading receipt"
                                            : ""
                            }>
                                <Form.Item label="Proof of Receipt" >
                                    <UploadImage
                                        disabled={!canEdit || !data._id || !data.proofOfPayment || data?.isPaymentStatus === "Paid" || data.reReferenceNumber !== data._id}
                                        value={data.proofOfReceipt ? [data.proofOfReceipt] : []}
                                        count={1}
                                        onChange={(v) => {
                                            // console.log("vvv", v);
                                            setData({ ...data, proofOfReceipt: v?.[v.length - 1] || "" });
                                        }}
                                        listType="picture-card"
                                    />
                                </Form.Item>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: "left", marginTop: 10 }}>
                            <Tooltip title={!data._id ? "Please save first before Downloading Form" : !data?.proofOfPayment ? "Please Upload Proof of Payment before downloading Form" : ""}>
                                <Button type="primary" disabled={!canEdit || !data._id || !data?.proofOfPayment || data?.isPaymentStatus === "Paid"} onClick={() => handleDownloadPDF(data)}>
                                    Generate Acknowledgement Form
                                </Button>
                            </Tooltip>
                        </Col>
                    </Row>
                </Form>
            </Modal >
        </>
    );
});

const generateAcknowledgementHTML = (data) => {
    const today = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    return `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #000;">

        <!-- HEADER -->
        <table width="100%" style=" margin-bottom:10px;">
            <tr>
                <td width="20%">
                    <img src="${process.env.PUBLIC_URL}/image/logo-unfpa.png" style="width:80px;" />
                </td>
                <td width="60%" style="text-align:center;">
                    <div style="font-size:12px;">MISSION SHAKTI – DIGISHAKTI PROGRAM</div>
                    <div style="font-size:20px; font-weight:bold;">INCENTIVE MANAGEMENT SYSTEM</div>
                    <div style="font-size:12px;">OFFICIAL RECORD FOR ADMINISTRATIVE USE</div>
                </td>
                <td width="20%" style="text-align:right; font-size:12px;">
                    <div>Date: ${today}</div>
                    
                </td>
            </tr>
        </table>

        <!-- TITLE -->
        <div style="border:1px solid #000; text-align:center; padding:8px; font-weight:bold;">
            INCENTIVE PAYMENT ACKNOWLEDGEMENT FORM
        </div>

        <!-- ACKNOWLEDGEMENT -->
        <div style="border:1px solid #000; border-top:none; padding:10px;">
            <div style="font-weight:bold; margin-bottom:5px;">ACKNOWLEDGEMENT</div>
            <div style="font-size:13px;">
                This is to confirm that an incentive payment has been approved and processed under the DigiShakti program in accordance with the approved guidelines.
            </div>
        </div>

        <!-- PAYMENT SUMMARY -->
        <div style="border:1px solid #000; border-top:none; padding:10px;">
            <div style="font-weight:bold; margin-bottom:8px;">PAYMENT SUMMARY</div>

            <table width="100%" style="border-collapse: collapse;">
                <tr>
                    <td style="border:1px solid #000; padding:8px; width:50%;">
                        Approved Incentive Amount
                    </td>
                    <td style="border:1px solid #000; padding:8px;">
                        ₹ ${data.totalPayout || 0}
                    </td>
                </tr>
                <tr>
                    <td style="border:1px solid #000; padding:8px;">
                        Payment Reference Number
                    </td>
                    <td style="border:1px solid #000; padding:8px;">
                        ${String(data._id).toUpperCase()}
                    </td>
                </tr>
            </table>
        </div>

        <!-- RECORD NOTE -->
        <div style="border:1px solid #000; border-top:none; padding:10px;">
            <div style="font-weight:bold; margin-bottom:8px;">RECORD NOTE</div>

            <div style="border:1px solid #000; padding:10px; font-size:13px;">
                This document serves as an official acknowledgement for administrative and audit purposes.
                The reference number above is system-generated and unique to this transaction.
            </div>
        </div>

        <!-- AUTHORIZATION -->
        <div style="border:1px solid #000; border-top:none; padding:10px;">
            <div style="font-weight:bold; margin-bottom:30px;">
                AUTHORIZATION AND RECEIPT CONFIRMATION
            </div>

            <table width="100%">
                <tr>
                    <td style="text-align:center;">
                        <div style="margin-top:40px; border-top:1px solid #000; width:200px; margin-left:auto; margin-right:auto;"></div>
                        <div style="font-size:12px;">APPROVED BY ADMIN</div>
                        <div style="font-size:11px;">Name and Signature</div>
                    </td>

                    <td style="text-align:center;">
                        <div style="margin-top:40px; border-top:1px solid #000; width:200px; margin-left:auto; margin-right:auto;"></div>
                        <div style="font-size:12px;">RECEIVED BY BENEFICIARY</div>
                        <div style="font-size:11px;">Signature / Thumb Impression</div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- FOOTER -->
        <div style="border:1px solid #000; border-top:none; text-align:center; padding:8px; font-size:11px;">
            This form is generated through the Incentive Management System and is maintained for record and audit reference.
        </div>

    </div>
    `;
};

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