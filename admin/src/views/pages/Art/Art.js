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
import { QUERY_AUTHOR_KEY, QUERY_ART_LIST } from '../../../constants/query.constants';
import { useGetArtQuery, useArtDeleteMutation, useArtSaveMutation } from "../../../query/art.query"
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
import { useGetPermissionQuery, usePermissionSaveMutation } from '../../../query/permission.query';
import { QUERY_PERMISSION_LIST } from '../../../constants/query.constants';

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
export const Art = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetArtQuery(qData);


    // const [selected, setSelected] = useState([]);
    const useDelete = useArtDeleteMutation();
    const useSave = usePermissionSaveMutation();
    const addFormRef = useRef();
    const editHistoryRef = useRef();
    const queryClient = useQueryClient()
    const columns = [

        {
            title: "client Name",
            dataIndex: ["clientDetails", "clientName"],
            // width: 300,
            render: (value) => value?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
        },
        {
            title: "PID Number",
            dataIndex: "pidNo",
            // width: 300,
        },
        {
            title: "Testing Center Name",
            dataIndex: "testingCenterName",
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

        // {
        //     title: "HIV Test Result",
        //     dataIndex: "hivTestResult",
        //     width: 140,
        //     render: (value) =>
        //         value ? (
        //             <span
        //                 className={`text-xs px-2 py-1 rounded border
        //   ${value === "Reactive"
        //                         ? "bg-red-200 border-red-300 text-red-800"
        //                         : "bg-green-200 border-green-300 text-green-800"
        //                     }`}
        //             >
        //                 {value}
        //             </span>
        //         ) : (
        //             "-"
        //         ),
        // },


        {
            title: "ART Registration Number",
            dataIndex: "artRegistrationNumber",
            // render: (date) => date ? new Date(date).toLocaleDateString("en-IN") : "-"

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
                                        title="Are you sure to delete this Art Linkage?"
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
        
        payload.tableName = "artDetails";
        payload.isRequestStatus = "Pending";
        const data = payload;
        useSave.mutate({data,isRequestStatus: "Pending",tableName: "artDetails"}, {
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
                        queryKey: [QUERY_ART_LIST],
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
        <div className=''>
           <div className='mb-5'>
                <Hiv/>
            </div>
            <Card
                bordered={false}
                size="small"
                className='p-0'
                title={"ART Linkage"}
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
  const [searchFields, setSearchFields] = useState({});
  const { data: AllData } = useGetArtQuery(qData);
  const { data: WholeData } = useGetArtQuery({ isAll: true });

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


const AddEditFormModal = forwardRef((props, ref) => {
    const { queryClient } = props;
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const { data: engagement } = useGetEnagementQuery({ testingResult: "+ve" });
    const { data: clients } = useGetClientQuery({ filter: "+ve" });
    const [testingLab,setTestingLab]=useState()
    const useSave = useArtSaveMutation(); // adjust hook name if needed

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(dt ? { ...dt } : { status: true });
            
            // Set testingLab state based on existing testingLabName
            if (dt?.testingLabName) {
                if (dt.testingLabName.startsWith('GOVT-')) {
                    setTestingLab('Government');
                } else if (dt.testingLabName.startsWith('OTHER-')) {
                    setTestingLab('others');
                }
            } else {
                setTestingLab(undefined);
            }
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
            onSuccess: () => {
                message.success("Data saved successfully.");
                queryClient.invalidateQueries({
                    queryKey: [QUERY_ART_LIST], // adjust key name if different
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

    return (
        <>
            <Modal
                title={<span>{data._id ? "Edit " : "Add "} ART Details</span>}
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
            >
                <Form layout="vertical">
                    {/* Client & Center Details */}
                    <h1 className="text-gray-900 text-lg my-3 pb-3 border-0 border-b border-b-gray-300">
                        Client & ART Center Details
                    </h1>
                    <Row gutter={[12, 0]} align="middle">
                        <Col span={12}>
                            <Form.Item label="Select Client" required>
                                <Select
                                    placeholder="Select client"
                                    value={data.clientId}
                                    onChange={(e) => handleChange({ clientId: e })}
                                    disabled={!!data._id}
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
                        {/* <Col span={12}>
                            <Form.Item
                                label="Center Registration Name"
                                required
                            >
                                <Input
                                    type="text"
                                    placeholder="Enter ART center registration name"
                                    value={data.centerRegistrationName}
                                    onChange={(e) =>
                                        handleChange({
                                            centerRegistrationName: e.target.value,
                                        })
                                    }
                                    disabled={!canEdit}
                                />
                            </Form.Item>
                        </Col> */}
                        <Col span={12}>
                            <Form.Item label="Testing Centre Name" required>
                                <Select
                                    placeholder="Select Testing Center"
                                    value={data.testingCenterName}
                                    disabled={!canEdit}
                                    onChange={(e) =>
                                        handleChange({ testingCenterName: e })
                                    }
                                >
                                    <Select.Option value="Redcliffe">Redcliffe</Select.Option>
                                    <Select.Option value="Thyrocare">Thyrocare</Select.Option>
                                    <Select.Option value="Govt">Govt</Select.Option>
                                    <Select.Option value="Other">Other</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="PID Number" required>
                                <Input
                                    type='text'
                                    value={data.pidNo}
                                    placeholder='e.g.,'
                                    disabled={!canEdit}
                                    onChange={(e) => { handleChange({ pidNo: e.target.value }) }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Date of ART Initiation" >
                                <DatePicker
                                    value={
                                        data.artInitiationDate &&
                                        dayjs(
                                            moment(data.artInitiationDate).format(
                                                "YYYY-MM-DD"
                                            )
                                        )
                                    }
                                    format="DD MMM YYYY"
                                    disabled={!canEdit}
                                    onChange={(e) =>
                                        handleChange({
                                            artInitiationDate: e ? new Date(e) : null,
                                        })
                                    }
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[12, 0]} align="middle">
                        {/* <Col span={12}>
                            <Form.Item label="HIV Test Result" required>
                                <Select
                                    placeholder="Select Result"
                                    disabled={!canEdit}
                                    value={data.hivTestResult}
                                    onChange={(e) =>
                                        handleChange({ hivTestResult: e })
                                    }
                                >
                                    <Select.Option value="Reactive">Reactive</Select.Option>
                                    <Select.Option value="Non Reactive">Non Reactive</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col> */}
                         <Col span={12}>
                            <Form.Item label="Testing lab" required>
                                <Select
                                    placeholder="Select Testing lab"
                                    value={testingLab}
                                    disabled={!canEdit}
                                    onChange={(e) =>
                                        setTestingLab(e)
                                    }
                                >
                                    <Select.Option value="Government">Goverment Testing Lab</Select.Option>
                                    <Select.Option value="others">others</Select.Option>
                                   </Select>
                            </Form.Item>
                                    </Col>

                                    <Col span={12}>
                            <Form.Item label="Testing Lab Name" >
                                <Input
                                    type="text"
                                    disabled={!testingLab || !canEdit}

                                    // disabled={!canEdit && testingLab === "others"}

                                    placeholder="Enter Lab name"
                                    value={data.testingLabName?.replace(/^(GOVT-|OTHER-)/, '') || ''}
                                    onChange={(e) => {
                                        const prefix = testingLab === "Government" ? "GOVT-" : "OTHER-";
                                        const labName = e.target.value.replace(/^(GOVT-|OTHER-)/, ''); // Remove existing prefix if any
                                        handleChange({ testingLabName: prefix + labName });
                                    }}
                                />
                            </Form.Item>
                        </Col>      

                        <Col span={12}>
                            <Form.Item label="ART Centre Name" >
                                <Input
                                    type="text"
                                    disabled={!canEdit}
                                    placeholder="Enter ART Centre Name"
                                    value={data.artCenterName}
                                    onChange={(e) =>
                                        handleChange({ artCenterName: e.target.value })
                                    }
                                />
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row gutter={[12, 0]}>
                        <Col span={12}>
                            <Form.Item label="Test Report">
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
                        <Col span={12}>
                            <Form.Item label="Green Book/ White Card" >
                                <UploadImage
                                    value={data.greenBookWhiteCardUrl ? [data.greenBookWhiteCardUrl] : []}
                                    disabled={!canEdit}
                                    count={1}
                                    onChange={(v) =>
                                        handleChange({ greenBookWhiteCardUrl: v?.[v.length - 1] || "" })
                                    }
                                    listType="picture-card"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Col span={24}>
                        <Form.Item label={"Add Remarks"} >
                            <Input.TextArea placeholder='Additional notes about risk art details'
                                type='text'
                                disabled={!canEdit}
                                maxLength={300}
                                value={data.artAssessmentNotes}
                                onChange={(e) => {
                                    handleChange({ artAssessmentNotes: e.target.value });
                                }}
                            />
                        </Form.Item>
                    </Col>
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
            ? { ...qData, tableName: "artDetails", docId }
            : { ...qData, tableName: "artDetails", docId: "" }
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

