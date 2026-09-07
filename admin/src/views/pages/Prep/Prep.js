import { DeleteOutlined, EditOutlined, DownloadOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";

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
  Checkbox,
  Timeline,
  Pagination,
} from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  QUERY_AUTHOR_KEY,
  QUERY_PREP_LIST,
  QUERY_CONSENT,
} from "../../../constants/query.constants";
import {
  useGetPrepQuery,
  usePrepDeleteMutation,
  usePrepSaveMutation,
} from "../../../query/prep.query";
import { useConsentSentMutation } from "../../../query/consent.query";
import { useGetClientQuery } from "../../../query/client.query";
import UploadImage from "../../../utils/UploadImage";
import util from "../../../utils/util";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import dayjs from "dayjs";
import moment from "moment";
import {
  useDetailsEnagementQuery,
  useGetEnagementQuery,
} from "../../../query/engagement.query";
import { useGetInventoryQuery } from "../../../query/inventory.query";
import { json2csv } from "json-2-csv";
import commonObj from "../../../commonObj";
import { useGetHistoryQuery } from "../../../query/history.query";
import TanstackPagination from "../../components/Pagination";
import { useGetPermissionQuery, usePermissionSaveMutation } from "../../../query/permission.query";
import { QUERY_PERMISSION_LIST } from "../../../constants/query.constants";

import JSZip from "jszip";
import { saveAs } from "file-saver";


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
    role === "SuperAdmin" || role === "COUNSELLORS/ORW",

  canAdd:
    role === "SuperAdmin" || role === "COUNSELLORS/ORW",
};
const { canAdd, canDelete, canEdit, canView, canExport } = permissions;
export const Prep = () => {
  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    total: 0,
    getTotal: false,
  });
  const { data: authors, isLoading, isError } = useGetPrepQuery(qData);
  // const [selected, setSelected] = useState([]);
  const useDelete = usePrepDeleteMutation();
  const useSave = usePermissionSaveMutation();
  const addFormRef = useRef();
  const queryClient = useQueryClient();
  const editHistoryRef = useRef();

  const downloadAllMedia = async (row) => {
    const mediaFiles = [
      { url: row.testReportUrl, name: 'TestReport' },
      { url: row.prescriptionUrl, name: 'Prescription' },
      { url: row.paymentUrl, name: 'PaymentScreenshot' }
    ];

    const availableFiles = mediaFiles.filter(file => file.url);
    
    if (availableFiles.length === 0) {
      message.warning('No media files available for download');
      return;
    }

    const clientName = row.clientDetails?.clientName?.replace(/\s+/g, '_') || 'Unknown';
    
    try {
      for (const file of availableFiles) {
        try {
          const response = await fetch(file.url);
          if (!response.ok) throw new Error('Network response was not ok');
          const blob = await response.blob();
          
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = `${file.name}_${clientName}_${Date.now()}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          // Small delay between downloads to avoid browser blocking
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error downloading ${file.name}:`, error);
          // Fallback to opening in new tab
          const link = document.createElement('a');
          link.href = file.url;
          link.target = '_blank';
          link.download = `${file.name}_${clientName}_${Date.now()}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      message.success(`${availableFiles.length} media file(s) downloaded successfully`);
    } catch (error) {
      message.error('Error downloading media files');
    }
  };

  const columns = [
    {
      title: "Unique Id", dataIndex: "clientId", render: (value) => (
        "VT-" + value
      )
    },
    {
      title: "Client Name",
      dataIndex: ["clientDetails", "clientName"],
      // width: 300,
      render: (value) =>
        value
          ?.toLowerCase()
          .trim()
          .split(/\s+/)
          .map((w) => w[0]?.toUpperCase() + w.slice(1))
          .join(" "),
    },
    {
      title: "Willing To Start",
      dataIndex: "willingToStart",
      // width: 300,
    },
    {
      title: "Initiate Date",
      dataIndex: "initiateDate",
      // width: 300,
      render: (date) =>
        date ? new Date(date).toLocaleDateString("en-IN") : "-",
    },
    {
      title: "Number of Pills",
      dataIndex: "numberOfPills",
      // width: 300,
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
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (_, row) => {
        const { prescriptionUrl, testReportUrl, paymentUrl } = row;
        if (
          !!prescriptionUrl?.trim() &&
          !!testReportUrl?.trim() &&
          !!paymentUrl?.trim()
        ) {
  return (
    <h1 className="bg-green-200 text-center text-xs rounded py-1 border border-green-300">
      Active
    </h1>
  );
} else {
  return (
    <h1 className="bg-red-200 text-center text-xs rounded py-1 border border-yellow-200">
      pending
    </h1>
  );
}
      },
    },
{
      title: "Consent Taken",
      dataIndex: "takeConsent",
      width: 100,
        render: (_, { takeConsent }) => {
          if (takeConsent) {
            return (
              <h1 className="bg-green-200 text-center text-xs rounded py-1 border border-green-300">
                Taken
              </h1>
            );
          } else {
            return (
              <h1 className="bg-yellow-200 text-center text-xs rounded py-1 border border-red-300">
                Pending
              </h1>
            );
          }
        },
    },
    {
      title: "Download All Media",
      key: "downloadAllMedia",
      width: 120,
      render: (_, row) => {
        const hasAnyMedia = row.testReportUrl || row.prescriptionUrl || row.paymentUrl;
        return (
          <Button
            size="small"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => downloadAllMedia(row)}
            disabled={!hasAnyMedia}
            title={hasAnyMedia ? "Download All Available Media" : "No Media Available"}
          >
            Download All
          </Button>
        );
      },
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
                    title="Are you sure to delete this Prep?"
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
    
    payload.tableName = "prepDetails";
    payload.isRequestStatus = "Pending";
    const data = payload;
    useSave.mutate({data,isRequestStatus: "Pending",tableName: "prepDetails"}, {
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
          queryKey: [QUERY_PREP_LIST],
        });
      },
      onError: (err) => {
        message.error(err.message);
      },
    },
  );
};

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
        authors,
      }}
    />
  ),
  showHeader: true,
  footer: () => <MyPagination {...{ qData, setQData }} />,

  tableLayout: undefined,
};
useEffect(() => {
  if (authors && authors.extra) {
    setQData((prevState) => ({
      ...prevState,
      ...authors.extra,
    }));
  }
}, [authors]);
return (
  <div>
    <Card
      bordered={false}
      size="small"
      className="p-0"
      title={"Prep Initiation"}
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
);
};


function Search({ qData, setQData, addFormRef }) {
  const [searchFields, setSearchFields] = useState({});
  const { data: AllData } = useGetPrepQuery(qData);
  const { data: WholeData } = useGetPrepQuery({ isAll: true });

  const handleSearch = () => {
    setQData({ ...qData, ...searchFields, page: 1 });
  };

  // convert JSON -> CSV + download (UNCHANGED)
  const downloadCsv = async (rows, fileName = "Engagement.csv") => {
    if (!Array.isArray(rows) || rows.length === 0) {
      message.warning("No data to export");
      return;
    }

    const cleaned = rows.map((r) => ({
      "Client Name": r.clientDetails?.clientName ?? "",

      "Willing to Start PrEP": r.willingToStart ?? "",
      "PrEP Initiation Date": r.initiateDate
        ? `'${moment(r.initiateDate).format("DD MMM YYYY")}`
        : "",

      "Syphilis (RPR/VDRL)": r.syphilisStatus ?? "",
      "Serum Creatinine": r.serumCreatinine ?? "",
      "Hepatitis C (HCV)": r.hepatitisCStatus ?? "",
      "Hepatitis B (HBsAg)": r.hepatitisBStatus ?? "",

      "Medicine Name": r.medicineDetails?.itemName ?? "",
      "Prescription Duration": r.durationOfPrescription ?? "",
      "Quantity Dispensed": r.quantityDispensed ?? "",
      "Batch Number": r.batchNo ?? "",

      "Next Follow-up Date": r.nextFollowUp
        ? `'${moment(r.nextFollowUp).format("DD MMM YYYY")}`
        : "",

      "Test Report URL": r.testReportUrl ?? "",
      "Prescription URL": r.prescriptionUrl ?? "",
      "Payment URL": r.paymentUrl ?? "",
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

  // Export current page (UNCHANGED)
  const handleExport = async () => {
    await downloadCsv(AllData?.data || [], "Prep_current_page.csv");
    message.success("Current page data exported successfully.");
  };

  // ============================
  // ✅ UPDATED: Export ALL as ZIP
  // ============================

  const safeName = (v) =>
    String(v ?? "")
      .trim()
      .replace(/[\/\\:*?"<>|]/g, "_");

  const getExtFromUrl = (url) => {
    try {
      const clean = String(url || "").split("?")[0];
      const dot = clean.lastIndexOf(".");
      if (dot === -1) return ".jpg";
      const ext = clean.slice(dot).toLowerCase();
      return ext.length <= 6 ? ext : ".jpg";
    } catch {
      return ".jpg";
    }
  };

  const fetchBlob = async (url) => {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Failed to download (${resp.status})`);
    return await resp.blob();
  };

  const handleExportAll = async () => {
    try {
      const rows = WholeData?.data || [];
      if (!Array.isArray(rows) || rows.length === 0) {
        message.warning("No data to export");
        return;
      }

      // ✅ CSV stays separate file INSIDE ZIP (contains URL columns)
      const cleaned = rows.map((r) => ({
        "Client Name": r.clientDetails?.clientName ?? "",

        "Willing to Start PrEP": r.willingToStart ?? "",
        "PrEP Initiation Date": r.initiateDate
          ? `'${moment(r.initiateDate).format("DD MMM YYYY")}`
          : "",

        "Syphilis (RPR/VDRL)": r.syphilisStatus ?? "",
        "Serum Creatinine": r.serumCreatinine ?? "",
        "Hepatitis C (HCV)": r.hepatitisCStatus ?? "",
        "Hepatitis B (HBsAg)": r.hepatitisBStatus ?? "",

        "Medicine Name": r.medicineDetails?.itemName ?? "",
        "Prescription Duration": r.durationOfPrescription ?? "",
        "Quantity Dispensed": r.quantityDispensed ?? "",
        "Batch Number": r.batchNo ?? "",

        "Next Follow-up Date": r.nextFollowUp
          ? `'${moment(r.nextFollowUp).format("DD MMM YYYY")}`
          : "",

        // ✅ keep URLs in CSV
        "Test Report URL": r.testReportUrl ?? "",
        "Prescription URL": r.prescriptionUrl ?? "",
        "Payment URL": r.paymentUrl ?? "",
      }));

      const csv = json2csv(cleaned);

      // ✅ ZIP: requires these imports at top of file:
      // import JSZip from "jszip";
      // import { saveAs } from "file-saver";
      const zip = new JSZip();
      zip.file("Prep_all_data.csv", csv);

      message.loading({
        content: "Preparing ZIP export (downloading images)...",
        key: "zip",
        duration: 0,
      });

      // Add folders per record (VT-<clientId>) and images inside
      for (const r of rows) {
        const folderIdRaw = r.clientId ?? r._id ?? "";
        if (!folderIdRaw) continue;

        const folderName = safeName(`VT-${folderIdRaw}`);
        const folder = zip.folder(folderName);
        if (!folder) continue;

        const docs = [
          { label: "test_report", url: r.testReportUrl },
          { label: "prescription", url: r.prescriptionUrl },
          { label: "payment", url: r.paymentUrl },
        ].filter((d) => !!d.url);

        for (const d of docs) {
          try {
            const ext = getExtFromUrl(d.url);
            const blob = await fetchBlob(d.url);
            folder.file(`${d.label}${ext}`, blob); // ✅ image file stored
          } catch (e) {
            // keeps export running even if one image fails
            folder.file(`${d.label}_FAILED.txt`, String(e?.message || e));
          }
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });

      saveAs(
        zipBlob,
        `Prep_export_${moment().format("YYYY-MM-DD_HH-mm")}.zip`,
      );

      message.success({ content: "Whole data ZIP exported successfully.", key: "zip" });
    } catch (err) {
      console.error(err);
      message.error(err?.message || "Failed to export ZIP");
    }
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
                }}
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
          <Col
            span={24}
            className="flex items-center w-full gap-x-2 justify-end"
          >
            {/* Export buttons BEFORE Add New */}
            {/* <Button onClick={handleExport}>Export</Button> */}
            {WholeData?.data?.length > 0 && canExport && (
              <Button onClick={handleExportAll}>Export All</Button>
            )}

            {canAdd && (
              <Button
                type="primary"
                onClick={() => addFormRef.current.openForm()}
              >
                Add New
              </Button>
            )}
          </Col>
        </Col>
      </Row>
    </Form>
  );
}

// function Search({ qData, setQData, addFormRef }) {
//   const [searchFields, setSearchFields] = useState({});
//   const { data: AllData } = useGetPrepQuery(qData);
//   const { data: WholeData } = useGetPrepQuery({ isAll: true });
//   const handleSearch = () => {
//     setQData({ ...qData, ...searchFields, page: 1 });
//   };
//   // convert JSON -> CSV + download
//   const downloadCsv = async (rows, fileName = "Engagement.csv") => {
//     if (!Array.isArray(rows) || rows.length === 0) {
//       message.warning("No data to export");
//       return;
//     }

//     // OPTIONAL: map only the fields you want in CSV
//     const cleaned = rows.map((r) => ({
//       // ===== Client Info =====
//       "Client Name": r.clientDetails?.clientName ?? "",

//       // ===== PrEP Initiation =====
//       "Willing to Start PrEP": r.willingToStart ?? "",
//       "PrEP Initiation Date": r.initiateDate
//         ? `'${moment(r.initiateDate).format("DD MMM YYYY")}`
//         : "",

//       // ===== Panel Tests =====
//       "Syphilis (RPR/VDRL)": r.syphilisStatus ?? "",
//       "Serum Creatinine": r.serumCreatinine ?? "",
//       "Hepatitis C (HCV)": r.hepatitisCStatus ?? "",
//       "Hepatitis B (HBsAg)": r.hepatitisBStatus ?? "",

//       // ===== Medication Details =====
//       "Medicine Name": r.medicineDetails?.itemName ?? "",
//       "Prescription Duration": r.durationOfPrescription ?? "",
//       "Quantity Dispensed": r.quantityDispensed ?? "",
//       "Batch Number": r.batchNo ?? "",

//       // ===== Follow-up =====
//       "Next Follow-up Date": r.nextFollowUp
//         ? `'${moment(r.nextFollowUp).format("DD MMM YYYY")}`
//         : "",

//       // ===== Documents / URLs =====
//       "Test Report URL": r.testReportUrl ?? "",
//       "Prescription URL": r.prescriptionUrl ?? "",
//       "Payment URL": r.paymentUrl ?? "",
//     }));

//     const csv = json2csv(cleaned);

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = fileName;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();

//     URL.revokeObjectURL(url);
//   };

//   // Export current page (authors.data is current page data)
//   const handleExport = async () => {
//     await downloadCsv(AllData?.data || [], "Prep_current_page.csv");
//     message.success("Current page data exported successfully.");
//   };

//   // Export all (fetch all pages from API)

//   const handleExportAll = async () => {
//     await downloadCsv(WholeData?.data || [], "Prep_all_data.csv");
//     message.success("Whole data exported successfully.");
//   };
//   return (
//     <Form onSubmitCapture={handleSearch}>
//       <Row gutter={12}>
//         <Col span={18}>
//           <Row gutter={12}>
//             <Col span={6}>
//               <Input
//                 allowClear
//                 placeholder="Search by name"
//                 value={searchFields.key}
//                 onChange={(e) => {
//                   if (!e.target.value) {
//                     setQData({ ...qData, key: undefined, page: 1 });
//                   }
//                   setSearchFields({ ...searchFields, key: e.target.value });
//                 }}
//               />
//             </Col>
//             <Col span={3}>
//               <Button type="primary" htmlType="submit">
//                 Search
//               </Button>
//             </Col>
//           </Row>
//         </Col>

//         <Col span={6}>
//           <Col
//             span={24}
//             className="flex items-center w-full gap-x-2 justify-end"
//           >
//             {/* Export buttons BEFORE Add New */}
//             {/* <Button onClick={handleExport}>Export</Button> */}
//             {WholeData?.data?.length > 0 && canExport && (
//               <Button onClick={handleExportAll}>Export All</Button>
//             )}

//             {canAdd && (
//               <Button
//                 type="primary"
//                 onClick={() => addFormRef.current.openForm()}
//               >
//                 Add New
//               </Button>
//             )}
//           </Col>
//         </Col>
//       </Row>
//     </Form>
//   );
// }
// doctorName is field name in backend 
function Variant8({ variantDetails: data, parentKay, handleChange }) {
  // Normalize incoming data into string array
  const normalizedData = Array.isArray(data)
    ? data.map((item) => (typeof item === "string" ? item : ""))
    : [];

  const handleKeywordChange = (values) => {
    // values is always an array of strings
    handleChange(values, parentKay);
  };

  return (
    <Form.Item label="">
      <Select
        mode="tags"
        style={{ width: "100%" }}
        placeholder="Type and press Enter"
        value={normalizedData} // prefilled when editing
        onChange={handleKeywordChange}
        tokenSeparators={[","]}
        maxTagCount={20} // optional UI limit
      />
    </Form.Item>
  );
}



const AddEditFormModal = forwardRef((props, ref) => {
  const { queryClient } = props;
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const useSave = usePrepSaveMutation();
  const { data: clients } = useGetClientQuery();
  const { data: engagement } = useGetEnagementQuery({ testingResult: "-ve" });
  // console.log("engagement",engagement.data);
  const { data: medicines } = useGetInventoryQuery({
    category: "prep medication",
  });
  const useSentConsent = useConsentSentMutation();
  // console.log("inventory", medicines);
  // console.log("clients prep", clients);
  const [num, setNum] = useState(0);
  const [name, setName] = useState("");
  const { data: engagementDetails, isFetching: isEngagementFetching } =
    useDetailsEnagementQuery(
      { ids: data.clientId },
      {
        enabled: !!data.clientId, // fetch only when clientId exists
      },
    );

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { ...dt } : { status: true });
    },
  }));

  const handleChange = (value) => {
    Object.entries(value).forEach((ent) => {
      let varDt = data;
      const k = ent[0];
      const v = ent[1];
      let keys = k.split(".");
      for (let i = 0; i < keys.length; i++) {
        if (i + 1 === keys.length) {
          varDt[keys[i]] = v;
        } else {
          if (typeof varDt[keys[i]] === "undefined") {
            if (parseInt(keys[i + 1]) * 1 >= 0) {
              varDt[keys[i]] = [];
            } else {
              varDt[keys[i]] = {};
            }
          }
          varDt = varDt[keys[i]];
        }
      }
    });
    setData({ ...data });
  };

  const save = () => {
    useSave.mutate(data, {
      onSuccess: (res) => {
        message.success("Data saved successfully.");
        queryClient.invalidateQueries({
          queryKey: [QUERY_PREP_LIST],
        });
        setOpen(false);
      },
      onError: (err) => {
        if (typeof err.message !== "string") {
          message.error(err.message[Object.keys(err.message)[0]][0]);
        } else {
          message.error(err.message);
        }
      },
    });
  };
  useEffect(() => {
    if (!data.medicineId) return;

    const selectedMed = medicines?.data?.find((m) => m._id === data.medicineId);

    if (selectedMed?.batchNo) {
      handleChange({ batchNo: selectedMed.batchNo });
    } else {
      // optional: if batch not found, clear it
      handleChange({ batchNo: "" });
    }
  }, [data.medicineId, medicines?.data]);

  useEffect(() => {
    if (engagementDetails?.data?.phone) {
      setNum(engagementDetails.data.phone);
    }
  }, [engagementDetails]);

  useEffect(() => {
    if (!data?.initiateDate || !data?.numberOfPills) {
      // optional: clear nextFollowUp if either field is missing
      if (data?.nextFollowUp) handleChange({ nextFollowUp: null });
      return;
    }

    const DAYS_BY_DURATION = { 30: 24, 60: 54, 90: 84 };
    const daysToAdd = DAYS_BY_DURATION[data.numberOfPills];
    if (!daysToAdd) return;

    const nextDate = dayjs(data.initiateDate).add(daysToAdd, "day");

    // avoid looping / unnecessary set
    const alreadySame =
      data.nextFollowUp && dayjs(data.nextFollowUp).isSame(nextDate, "day");

    if (!alreadySame) {
      handleChange({ nextFollowUp: nextDate });
    }
  }, [data?.initiateDate, data?.numberOfPills]);

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
  return (
    <>
      <Modal
        title={<span>{data._id ? "Edit " : "Add "} Prep</span>}
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
          <h1 className="text-gray-900 text-lg my-3 pb-3 border-0 border-b border-b-gray-300">
            PrEP Enrollment Details
          </h1>
          <Row gutter={[12, 0]} align="middle">
            <Col span={6}>
              <Form.Item label="Select Client" required>
                <Select
                  placeholder="Select client"
                  disabled={!canEdit || !!data._id}
                  value={data.clientId}
                  onChange={(e) => handleChange({ clientId: e })}
                >
                  {/* {clients?.data?.map((client) => ( */}
                  {engagement?.data.map((client) => (
                    <Select.Option
                      key={client._id}
                      value={client?.clientDetails?._id}
                    >
                      {client?.clientDetails?.clientName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Willing to Start PrEP" required>
                <Select
                  value={data.willingToStart}
                  onChange={(e) => {
                    handleChange({ willingToStart: e });
                  }}
                  placeholder="Select Status"
                  disabled={!canEdit}
                >
                  <Select.Option value={"yes"}>Yes</Select.Option>
                  <Select.Option value={"no"}>No</Select.Option>
                  <Select.Option value={"more counselling"}>
                    Needs More Counselling
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Syphilis (RPR/VDRL)" required>
                <Select
                  value={data.syphilisStatus}
                  onChange={(e) => {
                    handleChange({ syphilisStatus: e });
                  }}
                  placeholder="Select Status"
                  disabled={!canEdit}
                >
                  <Select.Option value={"Reactive"}>Reactive</Select.Option>
                  <Select.Option value={"Non Reactive"}>
                    Non Reactive
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Serum Creatinine" required>
                <Select
                  value={data.serumCreatinine}
                  onChange={(e) => {
                    handleChange({ serumCreatinine: e });
                  }}
                  placeholder="Select Status"
                  disabled={!canEdit}
                >
                  <Select.Option value={"High"}>High</Select.Option>
                  <Select.Option value={"Moderate"}>Moderate</Select.Option>
                  <Select.Option value={"Low"}>Low</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Hepatitis C Status" required>
                <Select
                  value={data.hepatitisCStatus}
                  onChange={(e) => {
                    handleChange({ hepatitisCStatus: e });
                  }}
                  placeholder="Select Status"
                  disabled={!canEdit}
                >
                  <Select.Option value={"Reactive"}>Reactive</Select.Option>
                  <Select.Option value={"Non Reactive"}>
                    Non Reactive
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Hepatitis B Status" required>
                <Select
                  value={data.hepatitisBStatus}
                  onChange={(e) => {
                    handleChange({ hepatitisBStatus: e });
                  }}
                  placeholder="Select Status"
                  disabled={!canEdit}
                >
                  <Select.Option value={"Reactive"}>Reactive</Select.Option>
                  <Select.Option value={"Non Reactive"}>
                    Non Reactive
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Initiate Date" required>
                <DatePicker
                  placeholder="Select date"
                  disabled={!canEdit}
                  format="DD MMM YYYY"
                  value={data.initiateDate ? dayjs(data.initiateDate) : null}
                  disabledDate={(current) => {
                    if (!current) return false;

                    const today = dayjs().endOf("day");
                    const fifteenDaysAgo = dayjs()
                      .subtract(15, "day")
                      .startOf("day");

                    // Disable future dates and dates older than 15 days
                    return (
                      current.isAfter(today) || current.isBefore(fifteenDaysAgo)
                    );
                  }}
                  onChange={(d) => {
                    handleChange({ initiateDate: d || null });
                  }}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Prescription date" required>
                <DatePicker
                  placeholder="Select date"
                  disabled={!canEdit}
                  format="DD MMM YYYY"
                  value={data.dateOfPrescription ? dayjs(data.dateOfPrescription) : null}

                  onChange={(d) => {
                    handleChange({ dateOfPrescription: d || null });
                  }}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Doctor Name">
                {/* <Variant8
                  variantDetails={data?.keywords} // string now
                  parentKay="keywords"
                  handleChange={(value) =>
                    handleChange({ keywords: value })
                  }
                /> */}
                {/* <Input
                  type='text'
                  disabled={!canEdit}
                  placeholder="Type Doctor name"
                  value={data.doctorName}
                  onChange={(e) => {
                    handleChange({ doctorName: e.target.value });
                  }}
                /> */}
                <Input
                  type="text"
                  disabled={!canEdit}
                  placeholder="Enter Doctor Name"
                  value={data.doctorName}
                  onChange={(e) => {
                    handleChange({ doctorName: e.target.value })
                  }}
                />
              </Form.Item>
            </Col>

          </Row>
          <h1 className="text-gray-900 text-lg my-3 pb-3 border-0 border-b border-b-gray-300">
            Medication Details
          </h1>
          <Row gutter={[12, 0]} align="middle">
            <Col span={6}>
              <Form.Item label="Select Medicine" required>
                <Select
                  disabled={!canEdit}
                  placeholder="Select Medicine"
                  value={data.medicineId}
                  onChange={(e) => handleChange({ medicineId: e })}
                >
                  {medicines?.data?.map((meds) => (
                    <Select.Option key={meds._id} value={meds._id}>
                      {meds.itemName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Number of Pills" required>
                <Select
                  value={data.numberOfPills}
                  onChange={(e) => {
                    handleChange({ numberOfPills: e });
                  }}
                  placeholder="Select No. of Pills"
                  disabled={!canEdit}
                >
                  <Select.Option value={"30"}>30</Select.Option>
                  <Select.Option value={"60"}>60</Select.Option>
                  <Select.Option value={"90"}>90</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Batch Number" required>
                <Input
                  type="text"
                  disabled
                  placeholder="Enter batch Number"
                  value={data.batchNo}
                  onChange={(e) => {
                    handleChange({ batchNo: e.target.value });
                  }}
                />
              </Form.Item>
            </Col>
            {/* <Col span={6}>
                            <Form.Item label="Quantity Dispensed" required>
                                <Input
                                    type='number'
                                    min={0}
                                    max={500}
                                    defaultValue={0}
                                    value={data.quantityDispensed}
                                    onChange={(e) => {
                                        handleChange({ quantityDispensed: e.target.value })
                                    }}
                                    disabled={!accessValue}
                                />
                            </Form.Item>
                        </Col> */}
            <Col span={6}>
              <Form.Item label="Next Follow-up Date" required>
                <Input
                  type="text"
                  disabled
                  value={
                    data.nextFollowUp
                      ? dayjs(data.nextFollowUp).format("DD MMM YYYY")
                      : ""
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <h1 className="text-gray-900 text-lg my-3 pb-3 border-0 border-b border-b-gray-300">
            Document Uploads
          </h1>
          <Row gutter={[12, 0]}>
            <Col span={6}>
              <Form.Item label="Test Report" required>
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
            <Col span={6}>
              <Form.Item label="Prescription" required>
                <UploadImage
                  value={data.prescriptionUrl ? [data.prescriptionUrl] : []}
                  disabled={!canEdit}
                  count={1}
                  onChange={(v) =>
                    handleChange({ prescriptionUrl: v?.[v.length - 1] || "" })
                  }
                  listType="picture-card"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Payment Screenshot" required>
                <UploadImage
                  value={data.paymentUrl ? [data.paymentUrl] : []}
                  disabled={!canEdit}
                  count={1}
                  onChange={(v) =>
                    handleChange({ paymentUrl: v?.[v.length - 1] || "" })
                  }
                  listType="picture-card"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={[12, 0]}>
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
          </Row> */}
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
      ? { ...qData, tableName: "prepDetails", docId }
      : { ...qData, tableName: "prepDetails", docId: "" },
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
      {
        title: "Field",
        dataIndex: "field",
        width: 200,
        render: (v) => <b>{v}</b>,
      },
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
      title={
        <span>
          Edit History {client?.clientName ? `- ${client.clientName}` : ""}
        </span>
      }
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
                      {row?.createdAt
                        ? moment(row.createdAt).format("DD MMM YYYY, hh:mm A")
                        : "-"}
                    </span>
                  }
                >
                  <Row gutter={[12, 8]} style={{ marginBottom: 10 }}>
                    <Col span={12}>
                      <strong>Edited By:</strong>{" "}
                      {row?.editedByDetails?.name || row?.editedBy || "-"}
                    </Col>
                    <Col span={12}>
                      <strong>Date:</strong>{" "}
                      {row?.createdAt
                        ? moment(row.createdAt).format("DD MMM YYYY, hh:mm A")
                        : "-"}
                    </Col>
                  </Row>

                  {renderChangesTable(row)}
                </Card>
              </Timeline.Item>
            ))}
          </Timeline>

          {/* ✅ Pagination without empty Table (so no "No data") */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 12,
            }}
          >
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
