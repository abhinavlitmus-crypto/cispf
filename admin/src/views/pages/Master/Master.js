import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
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
  Pagination,
  Timeline,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGetMasterQuery } from "../../../query/master.query";
import UploadImage from "../../../utils/UploadImage";
import util from "../../../utils/util";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import TanstackPagination from "../../components/Pagination";
import dayjs from "dayjs";
import moment from "moment";
import { useGetClientQuery } from "../../../query/client.query";
import { json2csv } from "json-2-csv";
import { useGetEnagementQuery } from "../../../query/engagement.query";
import commonObj from "../../../commonObj";
import { useGetHistoryQuery } from "../../../query/history.query";
import { Hiv } from "../Hiv/Hiv";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const role = commonObj.userType;
const permissions = {
  canView: true,
  canEdit: role === "SuperAdmin" || role === "COUNSELLORS/ORW" || role === "MNE",
  canExport:
    role === "SuperAdmin" || role === "COUNSELLORS/ORW" || role === "MNE",
  canDelete: role === "SuperAdmin" || role === "COUNSELLORS/ORW",
  canAdd: role === "SuperAdmin" || role === "COUNSELLORS/ORW",
};
const { canAdd, canDelete, canEdit, canView, canExport } = permissions;

export const Master = () => {
  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    total: 0,
    getTotal: false,
  });

  const { data: authors, isLoading, isError } = useGetMasterQuery(qData);
  const addFormRef = useRef();
  console.log("Authors",authors)
  // ----------------------------
  // helpers
  // ----------------------------
  const safeString = (v) => {
    if (v === null || v === undefined) return "-";
    if (typeof v === "boolean") return v ? "Yes" : "No";
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
  };

  // ✅ build columns from array-of-objects (ALL keys)
  const buildColumnsFromArray = (arr = []) => {
    if (!Array.isArray(arr) || arr.length === 0) return [];

    const allKeys = Array.from(
      new Set(arr.flatMap((obj) => Object.keys(obj || {})))
    );

    return allKeys.map((key) => ({
      title: key
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .trim()
        .toUpperCase(),
      dataIndex: key,
      key,
      width: 160,
      render: (v) => safeString(v),
    }));
  };

  // ✅ build main columns from authors.data excluding artDetails & prepDetails
  const columns = useMemo(() => {
    const rows = authors?.data || [];
    if (!rows.length) return [];

    const excluded = new Set(["artDetails", "prepDetails"]);

    const allKeys = Array.from(
      new Set(rows.flatMap((row) => Object.keys(row || {})))
    ).filter((k) => !excluded.has(k));

    return allKeys.map((key) => ({
      title: key
        .replace(/([A-Z])/g, " $1")
        .replace(/_/g, " ")
        .trim()
        .toUpperCase(),
      dataIndex: key,
      key,
      width: 180,
      render: (v) => safeString(v),
    }));
  }, [authors]);

  const tableProps = {
    bordered: true,
    loading: isLoading,
    size: "small",
    title: () => (
      <Search
        {...{
          addFormRef,
          qData,
          setQData,
          authors,
        }}
      />
    ),
    showHeader: true,
    footer: () => <MyPagination {...{ qData, setQData }} />,
    tableLayout: "fixed",
  };

  useEffect(() => {
    if (authors && authors.extra) {
      setQData((prev) => ({ ...prev, ...authors.extra }));
    }
  }, [authors]);

  return (
    <Card bordered={false} size="small" className="p-0" title={"Master Line"}>
      <Table
        {...tableProps}
        pagination={{ position: ["none"], pageSize: qData.limit }}
        columns={columns}
        dataSource={authors?.data?.length ? authors?.data : []}
        rowKey={(row) => row?._id || row?.id || JSON.stringify(row)}
        scroll={{ x: "max-content" }} // ✅ main table X scroll
        expandable={{
          expandedRowRender: (record) => {
            const artArr = Array.isArray(record?.artDetails)
              ? record.artDetails
              : [];
            const prepArr = Array.isArray(record?.prepDetails)
              ? record.prepDetails
              : [];

            const artCols = buildColumnsFromArray(artArr);
            const prepCols = buildColumnsFromArray(prepArr);

            return (
              <div style={{ padding: 8 }}>
                {/* ✅ ART DETAILS TABLE (ALL KEYS) */}
                <div style={{ marginBottom: 16 }}>
                  <strong>Art Details</strong>
                  <Table
                    style={{ marginTop: 8 }}
                    size="small"
                    bordered
                    pagination={false}
                    columns={artCols}
                    dataSource={artArr}
                    rowKey={(r, i) =>
                      r?._id || r?.id || `art-${record?._id || "row"}-${i}`
                    }
                    scroll={{ x: "max-content" }} // ✅ art table X scroll
                    locale={{ emptyText: "No Art Details" }}
                  />
                </div>

                {/* ✅ PREP DETAILS TABLE (ALL KEYS) */}
                <div>
                  <strong>Prep Details</strong>
                  <Table
                    style={{ marginTop: 8 }}
                    size="small"
                    bordered
                    pagination={false}
                    columns={prepCols}
                    dataSource={prepArr}
                    rowKey={(r, i) =>
                      r?._id || r?.id || `prep-${record?._id || "row"}-${i}`
                    }
                    scroll={{ x: "max-content" }} // ✅ prep table X scroll
                    locale={{ emptyText: "No Prep Details" }}
                  />
                </div>
              </div>
            );
          },
          rowExpandable: (record) =>
            (Array.isArray(record?.artDetails) && record.artDetails.length > 0) ||
            (Array.isArray(record?.prepDetails) && record.prepDetails.length > 0),
        }}
      />

      {!isLoading && isError && !(authors?.data?.length) && <DataNotLoaded />}
    </Card>
  );
};




function Search({ qData, setQData, addFormRef }) {
  const [searchFields, setSearchFields] = useState({});
  const { data: AllData } = useGetMasterQuery(qData);
  const { data: WholeData } = useGetMasterQuery({ isAll: true });

  const handleSearch = () => {
    setQData({ ...qData, ...searchFields, page: 1 });
  };

  // convert JSON -> CSV + download (UNCHANGED)
  const downloadCsv = async (rows, fileName = "Art.csv") => {
    if (!Array.isArray(rows) || rows.length === 0) {
      message.warning("No data to export");
      return;
    }

    const cleaned = rows.map((r) => ({
      "Client Name": r.clientDetails?.clientName ?? "",

      "Center Registration Name": r.centerRegistrationName ?? "",
      "HIV Test Result": r.hivTestResult ?? "",
      "PID Number": r.pidNo ?? "",
      "Testing Center Name": r.testingCenterName ?? "",

      "ART Registration Number": r.artRegistrationNumber ?? "",
      "ART Center Name": r.artCenterName ?? "",
      "ART Initiation Date": r.artInitiationDate
        ? `'${moment(r.artInitiationDate).format("DD MMM YYYY")}`
        : "",
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
    await downloadCsv(AllData?.data || [], "Art_current_page.csv");
    message.success("Current page data exported successfully.");
  };

  // ============================
  // ✅ UPDATED: Export ALL as ZIP (folder = _id) + images
  // Images: testReportUrl + greenBookWhiteCardUrl
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

      // ✅ CSV inside ZIP (same columns as your CSV export)
      const cleaned = rows.map((r) => ({
        "Client Name": r.clientDetails?.clientName ?? "",

        "Center Registration Name": r.centerRegistrationName ?? "",
        "HIV Test Result": r.hivTestResult ?? "",
        "PID Number": r.pidNo ?? "",
        "Testing Center Name": r.testingCenterName ?? "",

        "ART Registration Number": r.artRegistrationNumber ?? "",
        "ART Center Name": r.artCenterName ?? "",
        "ART Initiation Date": r.artInitiationDate
          ? `'${moment(r.artInitiationDate).format("DD MMM YYYY")}`
          : "",
      }));

      const csv = json2csv(cleaned);

      // ✅ ZIP: requires these imports at top of file:
      // import JSZip from "jszip";
      // import { saveAs } from "file-saver";
      const zip = new JSZip();
      zip.file("Art_all_data.csv", csv);

      message.loading({
        content: "Preparing ZIP export (downloading images)...",
        key: "zip",
        duration: 0,
      });

      // folders per record = _id
      for (const r of rows) {
        const folderBase = r?._id || "";
        if (!folderBase) continue;

        const folderName = safeName(folderBase);
        const folder = zip.folder(folderName);
        if (!folder) continue;

        const docs = [
          { label: "test_report", url: r.testReportUrl },
          { label: "green_book_white_card", url: r.greenBookWhiteCardUrl },
        ].filter((d) => !!d.url);

        for (const d of docs) {
          try {
            const ext = getExtFromUrl(d.url);
            const blob = await fetchBlob(d.url);
            folder.file(`${d.label}${ext}`, blob);
          } catch (e) {
            folder.file(`${d.label}_FAILED.txt`, String(e?.message || e));
          }
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });

      saveAs(zipBlob, `Art_export_${moment().format("YYYY-MM-DD_HH-mm")}.zip`);

      message.success({
        content: "Whole data ZIP exported successfully.",
        key: "zip",
      });
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
            {/* <Button onClick={handleExport}>Export</Button> */}
            {WholeData?.data?.length > 0 && canExport && (
              <Button onClick={handleExportAll}>Export All</Button>
            )}

            {/* {canAdd && (
              <Button
                type="primary"
                onClick={() => addFormRef.current.openForm()}
              >
                Add New
              </Button>
            )} */}
          </Col>
        </Col>
      </Row>
    </Form>
  );
}


