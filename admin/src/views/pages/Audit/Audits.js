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
    DatePicker,
    Checkbox,
    Pagination,
    Timeline,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {useGetMasterQuery} from "../../../query/master.query"
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import TanstackPagination from '../../components/Pagination';
import dayjs from 'dayjs';
import moment from 'moment';
import { useGetClientQuery } from '../../../query/client.query';
import { json2csv } from 'json-2-csv';
import { useGetEnagementQuery } from '../../../query/engagement.query';
import commonObj from '../../../commonObj';
import { useGetHistoryQuery } from '../../../query/history.query';
import { Hiv } from '../Hiv/Hiv';
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
        role === "SuperAdmin" ||
        role === "COUNSELLORS/ORW" ,

    canAdd:
        role === "SuperAdmin" ||
        role === "COUNSELLORS/ORW" ,
};
const { canAdd, canDelete, canEdit, canView, canExport } = permissions;
export const Audit = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetHistoryQuery(qData);
    const addFormRef = useRef();
    const editHistoryRef = useRef();
  
    const columns = [

        {
            title: "Changes Made By",
            dataIndex: [ "editedByDetails","name"],
            // width: 300,
        },
        {
          title: "User Type",
          dataIndex: [ "editedByDetails","userType"],
          // width: 300,
        },
        {
          title: "Table Name",
          dataIndex: [ "tableName"],

          render: (text) => (
            <Button className={`bg-black text-white text-xs`}>
              {text}
            </Button>
          ),
          // width: 300,
        },
        {
          title: "Action",
          dataIndex: [ "operation"],

          render: (text) => (
            <Button className={`${text === 'create' ? 'bg-green-400' : text === 'update' ? 'bg-pink-400' : 'bg-red-400'} text-black text-xs`}>
              {text}
            </Button>
          ),
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
       
       
    ].filter((item) => !item.hidden);



    const tableProps = {
        bordered: true,
        loading: isLoading,
        size: "small",
       
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
          
            <Card
                bordered={false}
                size="small"
                className='p-0'
                title={"Master Line"}
            >
                <Table
                    {...tableProps}
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={authors?.data?.length ? authors?.data : []}
                />
                {!isLoading && isError && !authors.data.length && <DataNotLoaded />}

                <EditHistoryModal ref={editHistoryRef} />

            </Card>
    )
}

// function Search({ qData, setQData, addFormRef }) {
//   const [searchFields, setSearchFields] = useState({});
//   const { data: AllData } = useGetMasterQuery(qData);
//   const { data: WholeData } = useGetMasterQuery({ isAll: true });

//   const handleSearch = () => {
//     setQData({ ...qData, ...searchFields, page: 1 });
//   };

//   // convert JSON -> CSV + download (UNCHANGED)
//   const downloadCsv = async (rows, fileName = "Art.csv") => {
//     if (!Array.isArray(rows) || rows.length === 0) {
//       message.warning("No data to export");
//       return;
//     }

//     const cleaned = rows.map((r) => ({
//       "Client Name": r.clientDetails?.clientName ?? "",

//       "Center Registration Name": r.centerRegistrationName ?? "",
//       "HIV Test Result": r.hivTestResult ?? "",
//       "PID Number": r.pidNo ?? "",
//       "Testing Center Name": r.testingCenterName ?? "",

//       "ART Registration Number": r.artRegistrationNumber ?? "",
//       "ART Center Name": r.artCenterName ?? "",
//       "ART Initiation Date": r.artInitiationDate
//         ? `'${moment(r.artInitiationDate).format("DD MMM YYYY")}`
//         : "",
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

//   // Export current page (UNCHANGED)
//   const handleExport = async () => {
//     await downloadCsv(AllData?.data || [], "Art_current_page.csv");
//     message.success("Current page data exported successfully.");
//   };

//   // ============================
//   // ✅ UPDATED: Export ALL as ZIP (folder = _id) + images
//   // Images: testReportUrl + greenBookWhiteCardUrl
//   // ============================

//   const safeName = (v) =>
//     String(v ?? "")
//       .trim()
//       .replace(/[\/\\:*?"<>|]/g, "_");

//   const getExtFromUrl = (url) => {
//     try {
//       const clean = String(url || "").split("?")[0];
//       const dot = clean.lastIndexOf(".");
//       if (dot === -1) return ".jpg";
//       const ext = clean.slice(dot).toLowerCase();
//       return ext.length <= 6 ? ext : ".jpg";
//     } catch {
//       return ".jpg";
//     }
//   };

//   const fetchBlob = async (url) => {
//     const resp = await fetch(url);
//     if (!resp.ok) throw new Error(`Failed to download (${resp.status})`);
//     return await resp.blob();
//   };

//   const handleExportAll = async () => {
//     try {
//       const rows = WholeData?.data || [];
//       if (!Array.isArray(rows) || rows.length === 0) {
//         message.warning("No data to export");
//         return;
//       }

//       // ✅ CSV inside ZIP (same columns as your CSV export)
//       const cleaned = rows.map((r) => ({
//         "Client Name": r.clientDetails?.clientName ?? "",

//         "Center Registration Name": r.centerRegistrationName ?? "",
//         "HIV Test Result": r.hivTestResult ?? "",
//         "PID Number": r.pidNo ?? "",
//         "Testing Center Name": r.testingCenterName ?? "",

//         "ART Registration Number": r.artRegistrationNumber ?? "",
//         "ART Center Name": r.artCenterName ?? "",
//         "ART Initiation Date": r.artInitiationDate
//           ? `'${moment(r.artInitiationDate).format("DD MMM YYYY")}`
//           : "",
//       }));

//       const csv = json2csv(cleaned);

//       // ✅ ZIP: requires these imports at top of file:
//       // import JSZip from "jszip";
//       // import { saveAs } from "file-saver";
//       const zip = new JSZip();
//       zip.file("Art_all_data.csv", csv);

//       message.loading({
//         content: "Preparing ZIP export (downloading images)...",
//         key: "zip",
//         duration: 0,
//       });

//       // folders per record = _id
//       for (const r of rows) {
//         const folderBase = r?._id || "";
//         if (!folderBase) continue;

//         const folderName = safeName(folderBase);
//         const folder = zip.folder(folderName);
//         if (!folder) continue;

//         const docs = [
//           { label: "test_report", url: r.testReportUrl },
//           { label: "green_book_white_card", url: r.greenBookWhiteCardUrl },
//         ].filter((d) => !!d.url);

//         for (const d of docs) {
//           try {
//             const ext = getExtFromUrl(d.url);
//             const blob = await fetchBlob(d.url);
//             folder.file(`${d.label}${ext}`, blob);
//           } catch (e) {
//             folder.file(`${d.label}_FAILED.txt`, String(e?.message || e));
//           }
//         }
//       }

//       const zipBlob = await zip.generateAsync({ type: "blob" });

//       saveAs(zipBlob, `Art_export_${moment().format("YYYY-MM-DD_HH-mm")}.zip`);

//       message.success({
//         content: "Whole data ZIP exported successfully.",
//         key: "zip",
//       });
//     } catch (err) {
//       console.error(err);
//       message.error(err?.message || "Failed to export ZIP");
//     }
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
//             {/* <Button onClick={handleExport}>Export</Button> */}
//             {WholeData?.data?.length > 0 && canExport && (
//               <Button onClick={handleExportAll}>Export All</Button>
//             )}

//             {/* {canAdd && (
//               <Button
//                 type="primary"
//                 onClick={() => addFormRef.current.openForm()}
//               >
//                 Add New
//               </Button>
//             )} */}
//           </Col>
//         </Col>
//       </Row>
//     </Form>
//   );
// }

const EditHistoryModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [docId, setDocId] = useState(null);
  const [history, setHistory] = useState(null);

  useImperativeHandle(ref, () => ({
    open(id, row) {
      setDocId(String(id));
      setHistory(row || null);
      setOpen(true);
    },
  }));

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
      title={<span>Edit History {history?.tableName ? `- ${history.tableName}` : ""}</span>}
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={1000}
      destroyOnClose
      maskClosable={false}
      style={{ top: 20 }}
    >
      {!history ? (
        <div style={{ padding: 12 }}>No data available.</div>
      ) : (
        <div>
          <Row gutter={[12, 8]} style={{ marginBottom: 20 }}>
            <Col span={12}>
              <strong>Edited By:</strong> {history?.editedByDetails?.name || history?.editedBy || "-"}
            </Col>
            <Col span={12}>
              <strong>Date:</strong>{" "}
              {history?.createdAt ? moment(history.createdAt).format("DD MMM YYYY, hh:mm A") : "-"}
            </Col>
            <Col span={12}>
              <strong>Table:</strong> {history?.tableName || "-"}
            </Col>
            <Col span={12}>
              <strong>Operation:</strong> {history?.operation || "-"}
            </Col>
          </Row>

          <div style={{ marginBottom: 10 }}>
            <strong>Changes:</strong>
          </div>
          {renderChangesTable(history)}
        </div>
      )}
    </Modal>
  );
});


