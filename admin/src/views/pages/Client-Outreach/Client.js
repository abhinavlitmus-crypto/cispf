import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { json2csv } from "json-2-csv";
import {
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
  DatePicker,
  Timeline,
  Tag,
  Pagination,
} from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { QUERY_CLIENT_LIST, QUERY_PERMISSION_LIST } from "../../../constants/query.constants";
import {
  useGetClientQuery,
  useClientDeleteMutation,
  useClientSaveMutation,
} from "../../../query/client.query";
import util from "../../../utils/util";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import TanstackPagination from "../../components/Pagination";
import dayjs from "dayjs";
import moment from "moment";
import commonObj from "../../../commonObj";
import { useGetHistoryQuery } from "../../../query/history.query";
import { STATES } from "../../../utils/states";
import { useGetPermissionQuery, usePermissionSaveMutation } from "../../../query/permission.query";

const role = commonObj.userType;
const permissions = {
  canView: true,
  canEdit: role === "SuperAdmin" || role === "MNE" || role === "COUNSELLORS/ORW",
  canExport: role === "SuperAdmin" || role === "MNE" || role === "COUNSELLORS/ORW",
  canDelete: role === "SuperAdmin" || role === "COUNSELLORS/ORW",
  canAdd: role === "SuperAdmin" || role === "COUNSELLORS/ORW",
};
const { canAdd, canDelete, canEdit, canView, canExport } = permissions;

export const Client = () => {
  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    total: 0,
    getTotal: false,
  });

  const queryClient = useQueryClient();

  // ====== Clients ======
  const { data: authors, isLoading, isError } = useGetClientQuery(qData);


  // ====== Mutations ======
  const useSave = usePermissionSaveMutation();
  const useDelete = useClientDeleteMutation();

  // ====== Refs ======
  const addFormRef = useRef();
  const editHistoryRef = useRef();

  const deleteData = (id) => {
    useDelete.mutate(
      { ids: id },
      {
        onSuccess: () => {
          message.success("Data deleted successfully.");
          queryClient.invalidateQueries({ queryKey: [QUERY_CLIENT_LIST] });
        },
        onError: (err) => message.error(err.message),
      }
    );
  };

  // ✅ Save permission + refresh permission list
  const permissionController = (payload) => {
    
    payload.tableName = "clientDetails";
    payload.isRequestStatus = "Pending";
    const data = payload;
    useSave.mutate({data,isRequestStatus: "Pending",tableName: "clientDetails"}, {
      onSuccess: () => {
        message.success("Permission request sent.");
        queryClient.invalidateQueries({ queryKey: [QUERY_PERMISSION_LIST] });
      },
      onError: (err) => message.error(err.message),
    });
  };

  const columns = [
    {
      title: "Unique Id",
      dataIndex: "_id",
      render: (value) => "VT-" + value,
    },
    {
      title: "Client Name",
      dataIndex: "clientName",
      render: (value) =>
        value
          ?.toLowerCase()
          .trim()
          .split(/\s+/)
          .map((w) => w[0]?.toUpperCase() + w.slice(1))
          .join(" "),
    },
    { title: "State", dataIndex: "state" },
    { title: "City", dataIndex: "city" },

    {
      title: "Type of Outreach",
      dataIndex: "typeOfOutreach",
      render: (value) =>
        value === "physical" ? "Physical Outreach" : "Virtual Outreach",
    },
    { title: "Age", dataIndex: "age" },
    { title: "Gender", dataIndex: "gender" },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (_, { status }) =>
        status ? (
          <h1 className="bg-green-200 text-center text-xs rounded py-1 border border-green-300">
            Active
          </h1>
        ) : (
          <h1 className="bg-red-200 text-center text-xs rounded py-1 border border-red-300">
            Inactive
          </h1>
        ),
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
                    title="Are you sure to delete this Client?"
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

  const tableProps = {
    bordered: true,
    loading: isLoading,
    size: "small",
    title: () => <Search {...{ addFormRef, qData, setQData, authors }} />,
    showHeader: true,
    footer: () => <MyPagination {...{ qData, setQData }} />,
    tableLayout: undefined,
  };

  useEffect(() => {
    if (authors && authors.extra) {
      setQData((prev) => ({ ...prev, ...authors.extra }));
    }
  }, [authors]);

  return (
    <div>
      <Card bordered={false} size="small" className="p-0" title={"Client List"}>
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
  );
};

function Search({ qData, setQData, addFormRef }) {
  const [searchFields, setSearchFields] = useState({});
  const { data: WholeData } = useGetClientQuery({ isAll: true });

  const handleSearch = () => {
    setQData({ ...qData, ...searchFields, page: 1 });
  };

  // const downloadCsv = async (rows, fileName = "clients.csv") => {
  //   if (!Array.isArray(rows) || rows.length === 0) {
  //     message.warning("No data to export");
  //     return;
  //   }

  //   const cleaned = rows.map((r) => ({
  //     _id: r._id ?? "",
  //     "Client Name": r.clientName ?? "",
  //     Location: r.location ?? "",
  //     "Type Of Outreach": r.typeOfOutreach ?? "",
  //     Age: r.age ?? "",
  //     Gender: r.gender ?? "",
  //     Topology: r.topology ?? "",
  //     "Referral By": r.referralBy ?? "",
  //     "Outreach Date": r.outreachDate
  //       ? `'${moment(r.outreachDate).format("DD MMM YYYY")}`
  //       : "",
  //     status: r.status ? "Active" : "Inactive",
  //   }));

  //   const csv = json2csv(cleaned);
  //   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  //   const url = URL.createObjectURL(blob);

  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = fileName;
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  //   URL.revokeObjectURL(url);
  // };

  const formatValue = (value) => {
    if (value === null || value === undefined) return "";

    // Date handling
    if (
      typeof value === "string" &&
      moment(value, moment.ISO_8601, true).isValid()
    ) {
      return `${moment(value).format("DD MMM YYYY")}`;
    }

    // Boolean handling
    if (typeof value === "boolean") {
      return value ? "Active" : "Inactive";
    }

    // Object / Array handling
    if (typeof value === "object") {
      return JSON.stringify(value);
    }

    return value;
  };

  const downloadCsv = async (rows, fileName = "clients.csv") => {
    if (!Array.isArray(rows) || rows.length === 0) {
      message.warning("No data to export");
      return;
    }

    // Get all unique keys dynamically
    const headers = Array.from(
      new Set(rows.flatMap((row) => Object.keys(row)))
    );

    const cleaned = rows.map((row) => {
      const obj = {};
      headers.forEach((key) => {
        obj[key] = formatValue(row[key]);
      });
      return obj;
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

  const handleExportAll = async () => {
    await downloadCsv(WholeData?.data || [], "clients_all_data.csv");
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
                placeholder="Search by name or location"
                value={searchFields.key}
                onChange={(e) => {
                  if (!e.target.value) setQData({ ...qData, key: undefined, page: 1 });
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
          <Col span={24} className="flex items-center w-full gap-x-2 justify-end">
            {WholeData?.data?.length > 0 && canExport && (
              <Button onClick={handleExportAll}>Export All</Button>
            )}

            {canAdd && (
              <Button type="primary" onClick={() => addFormRef.current.openForm()}>
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
  const { queryClient } = props
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const useSave = useClientSaveMutation();

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
            queryKey: [QUERY_CLIENT_LIST]
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
  useEffect(() => {
    if (!data._id) {
      handleChange({ slug: util.removeSpecialChars(data.name || "") });
    }
  }, [data.name]);
  return (
    <>
      <Modal
        title={<span>{data._id ? "Edit " : "Add "} Client</span>}
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
          <Row gutter={[12, 0]} align="middle">
            <Col span={12}>
              <Form.Item label="Client Name" required>
                <Input
                  type='text'
                  disabled={!canEdit}

                  placeholder="Type client Name"
                  value={data.clientName}
                  onChange={(e) => {
                    handleChange({ clientName: e.target.value });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Age" required>
                <Input
                  type='number'
                  min={6}
                  max={3}
                  placeholder="client Age"
                  style={{ width: "100%" }}
                  size="large"
                  value={data.age}
                  onChange={(e) => {
                    handleChange({ age: e.target.value });
                  }}
                  disabled={!canEdit}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Gender" required>
                <Select placeholder="Select Gender" value={data.gender} onChange={e => { handleChange({ gender: e }) }} disabled={!canEdit} >
                  <Select.Option value={"male"}>Male</Select.Option>
                  <Select.Option value={"female"}>Female</Select.Option>
                  <Select.Option value={"transgender"}>Transgender</Select.Option>
                  <Select.Option value={"other"}>Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="State" required>
                <Select
                  placeholder="Select State"
                  value={data.state}
                  disabled={!canEdit}
                  showSearch
                  optionFilterProp="children"
                  onChange={(st) => {
                    // reset city if state changes
                    handleChange({ state: st, city: "" });
                  }}
                >
                  {STATES.map((st) => (
                    <Select.Option key={st} value={st}>
                      {st}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="City" required>
                <Input
                  type="text"
                  placeholder="Enter City"
                  value={data.city}
                  disabled={!canEdit || !data.state}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^a-zA-Z ]/g, "");
                    handleChange({ city: value });
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Typology" required>
                <Select placement='Select Typology' disabled={!canEdit} value={data.topology} onChange={e => { handleChange({ topology: e }) }} placeholder={"Select Topology"}>
                  <Select.Option value={"MSM"}>MSM (Men Who have sex with Men)</Select.Option>
                  <Select.Option value={"transgender"}>Transgender</Select.Option>
                  <Select.Option value={"FSW"}>FSW (Female Sex Workers)</Select.Option>
                  <Select.Option value={"PWID"}>'PWID (People who Inject Drugs)</Select.Option>
                  <Select.Option value={"others"}>Others</Select.Option>
                </Select>
              </Form.Item>
            </Col>


            <Col span={6}>
              <Form.Item label="Type Of Outreach" required>
                <Select value={data.typeOfOutreach} onChange={e => { handleChange({ typeOfOutreach: e }) }} placeholder={"Select Type"} disabled={!canEdit}>
                  <Select.Option value={"physical"}>Physical Outreach</Select.Option>
                  <Select.Option value={"virtual"}>Virtual Outreach</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Referral By" required>
                <Select placement='Select Referral By' value={data.referralBy} onChange={e => { handleChange({ referralBy: e }) }} placeholder={"Select Referral Method"} disabled={!canEdit}>
                  <Select.Option value={"instagram"}>Instagram</Select.Option>
                  <Select.Option value={"facebook"}>Facebook</Select.Option>
                  <Select.Option value={"friend"}>Friend</Select.Option>
                  <Select.Option value={"website"}>Website</Select.Option>
                  <Select.Option value={"tinder"}>Tinder</Select.Option>
                  <Select.Option value={"grinder"}>Grinder</Select.Option>
                  <Select.Option value={"bumble"}>Bumble</Select.Option>
                  <Select.Option value={"ts Dating"}>TS Dating</Select.Option>

                  <Select.Option value={"other"}>Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Outreach Date" required>
                {/* <DatePicker value={data.outreachDate && dayjs(moment(data.outreachDate).format("YYYY-MM-DD"))} disabled={!accessValue}
                                    format='DD MMM YYYY'
                                    disabledDate={(current) => current.isBefore(moment(new Date()).subtract(1, "day"))}
                                    onChange={(e) => { handleChange({ outreachDate: new Date(e) }) }} style={{ width: '100%' }} /> */}
                <DatePicker
                  placeholder="Select date"
                  disabled={!canEdit}
                  format="DD MMM YYYY"
                  value={data.outreachDate ? dayjs(data.outreachDate) : null}
                  disabledDate={(current) => {
                    if (!current) return false;

                    const today = dayjs().endOf("day");
                    const oneWeekAgo = dayjs().subtract(7, "day").startOf("day");

                    // disable dates AFTER today OR BEFORE last 7 days
                    return current.isAfter(today) || current.isBefore(oneWeekAgo);
                  }}
                  onChange={(d) => {
                    handleChange({ outreachDate: d || null });
                  }}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>


            <Col span={24}>
              <Form.Item label="Special Notes/Instructions" >
                <Input.TextArea
                  type='text'
                  disabled={!canEdit}
                  placeholder="Max length is 300"
                  value={data.notes}
                  maxLength={300}
                  onChange={(e) => {
                    handleChange({ notes: e.target.value });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6} offset={18} >
              <Form.Item label="Status" >
                <Select value={data.status} onChange={e => { handleChange({ status: e }) }} disabled={!canEdit} placeholder="Select Status" >
                  <Select.Option value={true}>Active</Select.Option>
                  <Select.Option value={false}>Inactive</Select.Option>
                </Select>
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
      ? { ...qData, tableName: "clientDetails", docId }
      : { ...qData, tableName: "clientDetails", docId: "" }
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
                    <Col span={12}>
                      <strong>Operation:</strong>{" "}
                      {row.operation}
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
