import { CheckOutlined, CloseOutlined, DeleteColumnOutlined, DeleteFilled, EyeOutlined } from "@ant-design/icons";
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
  Tag,
  Pagination,
  Timeline,
  Divider,
  Descriptions,
  Skeleton,
  Tooltip,
} from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { QUERY_PERMISSION_LIST } from "../../../constants/query.constants";
import {
  useGetPermissionQuery,
  usePermissionSaveMutation,
  usePermissionDeleteMutation,
} from "../../../query/permission.query";

import { useGetIncentiveDetailQuery } from "../../../query/incentives.query"
import util from "../../../utils/util";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import TanstackPagination from "../../components/Pagination";
import dayjs from "dayjs";
import moment from "moment";
import commonObj from "../../../commonObj";
import { useGetHistoryQuery } from "../../../query/history.query";

const role = commonObj.userType;
const permissions = {
  canView: true,
  canEdit: role === "SuperAdmin" || role === "ADMIN",
  canExport: role === "SuperAdmin" || role === "ADMIN",
  canDelete: role === "SuperAdmin",
  canApprove: role === "SuperAdmin" || role === "ADMIN",
};
const { canDelete, canEdit, canView, canExport, canApprove } = permissions;

export const PermissionApproval = () => {
  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    total: 0,
    getTotal: false,
    isPending: true, // Filter for pending permissions by default
  });

  const queryClient = useQueryClient();

  // ====== Permissions ======
  const { data: permissionsData, isLoading, isError } = useGetPermissionQuery(qData);
  // console.log("authors", permissionsData)
  // ====== Mutations ======
  const useSave = usePermissionSaveMutation();
  const useDelete = usePermissionDeleteMutation();

  // ====== Refs ======
  const viewDetailsRef = useRef();

  const deleteData = (id) => {
    useDelete.mutate(
      { ids: id },
      {
        onSuccess: () => {
          message.success("Permission deleted successfully.");
          queryClient.invalidateQueries({ queryKey: [QUERY_PERMISSION_LIST] });
        },
        onError: (err) => message.error(err.message),
      }
    );
  };

  // ✅ Approve permission
  const approvePermission = (record) => {
    // record.data.isRequestStatus = "Approved"
    // record.isRequestStatus = "Approved"
    // record.data.expiryDate = dayjs().subtract(44, "days").format();

    // console.log("record",record.data.expireyDate)
    useSave.mutate(
      // record,
      {
        _id: record._id,
        documentId: record.documentId,
        tableName: record.tableName,
        isRequestStatus: "Approved",
      },
      {
        onSuccess: () => {
          message.success("Permission approved successfully.");
          queryClient.invalidateQueries({ queryKey: [QUERY_PERMISSION_LIST] });
        },
        onError: (err) => message.error(err.message),
      }
    );
  };

  // ✅ Reject permission
  const rejectPermission = (record) => {
    // record.data.isRequestStatus = "Rejected"
    // record.isRequestStatus = "Rejected"
    useSave.mutate(

      // record,
      {
        _id: record._id,
        documentId: record.documentId,
        tableName: record.tableName,
        isRequestStatus: "Rejected",
      },
      {
        onSuccess: () => {
          message.success("Permission rejected successfully.");
          queryClient.invalidateQueries({ queryKey: [QUERY_PERMISSION_LIST] });
        },
        onError: (err) => message.error(err.message),
      }
    );
  };

  const columns = [
    // {
    //   title: "Unique Id",
    //   dataIndex: "_id",
    //   render: (value) => "VT-" + value,
    // },
    {
      title: "Request By",
      dataIndex: ["userName"],
    },
    {
      title: "Request User Type",
      dataIndex: ["userType"],
    },
    {
      title: "Module",
      dataIndex: "tableName",
      render: (value) => {
        const tableNameMap = {
          incentivesDetails: "Incentives",
          testingDetails: "Testing",
          learnerDetails: "Learners",
          trainerDetails: "Trainers",
        };
        return (
          <Tag color="blue"> {tableNameMap[value] || value}</Tag>
        )
      },
    },
    // {
    //   title: "Requested Date",
    //   dataIndex: "date",
    //   render: (value) => value ? moment(value).format("DD MMM YYYY") : "-",
    // },
    // {
    //   title: "Status",
    //   dataIndex: "isApproved",
    //   width: 120,
    //   render: (_, record) => {
    //     if (record.isApproved === true) {
    //       return (
    //         <Tag color="green">Approved</Tag>
    //       );
    //     } else if (record.isApproved === false) {
    //       return (
    //         <Tag color="red">Rejected</Tag>
    //       );
    //     } else if (record.isPermissionSent) {
    //       return (
    //         <Tag color="orange">Pending</Tag>
    //       );
    //     }
    //     return (
    //       <Tag color="default">Draft</Tag>
    //     );
    //   },
    // },

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
    {
      title: "Status",
      dataIndex: "isRequestStatus",
      render: (status) => {
        const map = {
          Pending: { color: "gold", label: "Pending" },
          Approved: { color: "green", label: "Approved" },
          Rejected: { color: "red", label: "Rejected" },
        };

        const config = map[status];
        return (
          <Tag color={config?.color || "default"}>
            {config?.label || "Unknown"}
          </Tag>
        )
      }
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: 200,
      render: (v, row) => {
        console.log("row.isRequestStatus", row);
        const isPending = row.isRequestStatus === "Pending";
        const isApproved = row.isRequestStatus === "Approved";
        const isRejected = row.isRequestStatus === "Rejected";

        return (
          <>
            {isPending && canApprove && (
              <>
                <Popconfirm
                  title="Are you sure to approve this permission?"
                  onConfirm={() => approvePermission(row)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    type="primary"
                    size="small"
                    className=" mb-1"
                    loading={useSave.isPending}
                    icon={<CheckOutlined />}
                    style={{ marginRight: 8 }}
                  >
                    Approve
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title="Are you sure to reject this permission?"
                  onConfirm={() => rejectPermission(row)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    danger
                    className="mb-1"
                    size="small"
                    loading={useSave.isPending}
                    icon={<CloseOutlined />}
                  >
                    Reject
                  </Button>
                </Popconfirm>
              </>
            )}

            {!isPending && canDelete && (
              <Popconfirm
                title="Are you sure to Delete this permission?"
                onConfirm={() => deleteData(v)}
                okText="Yes"
                loading={useSave.isPending}
                cancelText="No"
              >
                <Button
                  type="primary"
                  danger
                  size="small"
                  icon={<DeleteFilled />}

                  style={{ marginLeft: 8 }}
                >
                  Delete Data
                </Button>
              </Popconfirm>
            )}
            {!isPending && !canDelete && (
              <Tooltip title="You don't have permission to perform actions">
                <span style={{ color: "#999", fontStyle: "italic", fontSize: 12 }}>
                  No actions available
                </span>
              </Tooltip>
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
    // title: () => <Search {...{ qData, setQData, permissionsData }} />,
    showHeader: true,
    footer: () => <MyPagination {...{ qData, setQData }} />,
    tableLayout: undefined,
  };

  useEffect(() => {
    if (permissionsData && permissionsData.extra) {
      setQData((prev) => ({ ...prev, ...permissionsData.extra }));
    }
  }, [permissionsData]);

  return (
    <div>
      <Card bordered={false} size="small" className="p-0" title={"Permission Approval List"}>
        <Table
          {...tableProps}
          pagination={{ position: ["none"], pageSize: qData.limit }}
          columns={columns}
          dataSource={permissionsData?.data?.length ? permissionsData?.data : []}
        />

        {!isLoading && isError && !permissionsData?.data?.length && <DataNotLoaded />}

        <ViewDetailsModal ref={viewDetailsRef} />
      </Card>
    </div>
  );
};

// function Search({ qData, setQData, permissionsData }) {
//   const [searchFields, setSearchFields] = useState({});

//   const handleSearch = () => {
//     setQData({ ...qData, ...searchFields, page: 1 });
//   };

//   const formatValue = (value) => {
//     if (value === null || value === undefined) return "";

//     if (typeof value === "boolean") {
//       return value ? "Yes" : "No";
//     }

//     if (typeof value === "object") {
//       return JSON.stringify(value);
//     }

//     return value;
//   };

//   const downloadCsv = async (rows, fileName = "permissions.csv") => {
//     if (!Array.isArray(rows) || rows.length === 0) {
//       message.warning("No data to export");
//       return;
//     }

//     const headers = Array.from(
//       new Set(rows.flatMap((row) => Object.keys(row)))
//     );

//     const cleaned = rows.map((row) => {
//       const obj = {};
//       headers.forEach((key) => {
//         obj[key] = formatValue(row[key]);
//       });
//       return obj;
//     });

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

//   const handleExportAll = async () => {
//     await downloadCsv(permissionsData?.data || [], "permissions_all_data.csv");
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
//                 placeholder="Search by document ID or table name"
//                 value={searchFields.key}
//                 onChange={(e) => {
//                   if (!e.target.value) setQData({ ...qData, key: undefined, page: 1 });
//                   setSearchFields({ ...searchFields, key: e.target.value });
//                 }}
//               />
//             </Col>
//             <Col span={4}>
//               <Select
//                 allowClear
//                 placeholder="Status"
//                 value={searchFields.isApproved}
//                 onChange={(value) => {
//                   setSearchFields({ ...searchFields, isApproved: value });
//                 }}
//                 style={{ width: "100%" }}
//               >
//                 <Select.Option value={undefined}>All</Select.Option>
//                 <Select.Option value={true}>Approved</Select.Option>
//                 <Select.Option value={false}>Rejected</Select.Option>
//                 <Select.Option value="pending">Pending</Select.Option>
//               </Select>
//             </Col>
//             <Col span={3}>
//               <Button type="primary" htmlType="submit">
//                 Search
//               </Button>
//             </Col>
//           </Row>
//         </Col>

//         <Col span={6}>
//           <Col span={24} className="flex items-center w-full gap-x-2 justify-end">
//             {permissionsData?.data?.length > 0 && canExport && (
//               <Button onClick={handleExportAll}>Export All</Button>
//             )}
//           </Col>
//         </Col>
//       </Row>
//     </Form>
//   );
// }

const buildRows = (obj, parentKey = "") => {
  if (!obj) return [];

  const rows = [];

  Object.entries(obj).forEach(([key, value]) => {
    const finalKey = parentKey ? `${parentKey}.${key}` : key;

    // If object (but not array) → flatten deeper
    if (value && typeof value === "object" && !Array.isArray(value)) {
      rows.push(...buildRows(value, finalKey));
    } else {
      rows.push({
        key: finalKey,
        field: finalKey,
        value: Array.isArray(value) ? JSON.stringify(value) : String(value),
      });
    }
  });

  return rows;
};

const ViewDetailsModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState(null);

  useImperativeHandle(ref, () => ({
    open(data) {
      setPermission(data);
      setOpen(true);
    },
  }));

  // ✅ prepare table rows
  const tableData = useMemo(() => {
    return permission ? buildRows(permission) : [];
  }, [permission]);


  // console.log("permission",permission);
  const { data: detailData, isLoading } = useGetIncentiveDetailQuery({ ids: permission?.documentId }, {
    enabled: !!permission?.documentId && permission?.tableName === "incentivesDetails"
  })
  console.log("data popup", detailData);
  const columns = [
    {
      title: "Field",
      dataIndex: "field",
      key: "field",
      width: 320,
      ellipsis: true,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: 500,
      ellipsis: true,
    },
  ];

  return (
    // <Modal
    //   title="Permission Details"
    //   open={open}
    //   onCancel={() => setOpen(false)}
    //   footer={null}
    //   width={900}
    //   destroyOnClose
    //   maskClosable={false}
    //   style={{ top: 20 }}
    // >
    //   <>
    //     {/* Permission Info */}
    //     <Row gutter={[16, 12]}>
    //       <Col xs={24} sm={24} md={12} lg={12}>
    //         <strong>Request By:</strong> {permission?.userName}
    //       </Col>
    //       <Col xs={24} sm={24} md={12} lg={12}>
    //         <strong>Status:</strong> {permission?.isRequestStatus}
    //       </Col>
    //     </Row>
    //     <Divider />

    //     {/* Module Data */}
    //     <h3>Module Details</h3>

    //     {permission?.tableName === 'incentivesDetails' && (
    //       <>
    //         {isLoading ? "Loading" : (
    //           <Row gutter={[16, 12]}>
    //             <Col span={12}>
    //               Trainer UID: {detailData?.data?.digiShaktiTrainerUID}
    //             </Col>
    //             <Col span={12}>
    //               Batch: {detailData?.data?.batchId}
    //             </Col>
    //             <Col span={12}>
    //               Price: ₹{detailData?.data?.price}
    //             </Col>
    //             <Col span={12}>
    //               Amount: ₹{detailData?.data?.amount}
    //             </Col>
    //           </Row>
    //         )}
    //       </>
    //     )}
    //   </>
    //   {/* {permission && (
    //     <div>
    //       <Row gutter={[16, 16]}>
    //         <Col span={12}>
    //           <strong>Permission ID:</strong> VT-{permission._id}
    //         </Col>
    //         <Col span={12}>
    //           <strong>Document ID:</strong> VT-{permission.documentId}
    //         </Col>
    //         <Col span={12}>
    //           <strong>Table Name:</strong> {permission.tableName}
    //         </Col>
    //         <Col span={12}>
    //           <strong>Status :</strong> {permission.isRequestStatus}
    //         </Col>

    //         <Col span={24}>
    //           <strong>Additional Details:</strong>

    //           <Table
    //             style={{ marginTop: 8 }}
    //             columns={columns}
    //             dataSource={tableData}
    //             pagination={false}
    //             size="small"
    //             bordered
    //             scroll={{ x: 900, y: 400 }} 
    //           />
    //         </Col>
    //       </Row>
    //     </div>
    //   )} */}
    // </Modal>
    <Modal
      title="Permission Details"
      open={open}
      onCancel={() => setOpen(false)}
      footer={null}
      width={800}
      destroyOnClose
      style={{ top: 20 }}
    >
      {/* Permission Info Card */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Requested By">
            <strong>{permission?.userName}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag
              color={
                permission?.isRequestStatus === "Approved"
                  ? "green"
                  : permission?.isRequestStatus === "Rejected"
                    ? "red"
                    : "gold"
              }
            >
              {permission?.isRequestStatus}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/*  Module Details */}
      <Card title="Module Details" size="small">
        {permission?.tableName === "incentivesDetails" && (
          <>
            {isLoading ? (
              <Skeleton active />
            ) : (
              <Descriptions column={2} size="small" bordered>
                <Descriptions.Item label="Trainer UID">
                  {detailData?.data?.digiShaktiTrainerUID}
                </Descriptions.Item>

                <Descriptions.Item label="Batch">
                  {detailData?.data?.batchId}
                </Descriptions.Item>

                <Descriptions.Item label="Trainer Name">
                  {detailData?.data?.batchDetails?.trainerName}
                </Descriptions.Item>

                <Descriptions.Item label="Amount">
                  <div>
                    <strong style={{ color: "#1677ff", fontSize: 16 }}>
                      ₹{detailData?.data?.amount}
                    </strong>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      {detailData?.data?.batchDetails?.totalCertified} × ₹{detailData?.data?.price}
                    </div>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            )}
          </>
        )}
      </Card>
    </Modal>
  );
});

