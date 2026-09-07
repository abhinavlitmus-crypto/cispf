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
    Timeline,
    Pagination,
    DatePicker,
    Checkbox,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_AUTHOR_KEY, QUERY_ASSIGN_INVENTORY_LIST } from '../../../constants/query.constants';
// import { useGetAssignInventoryQuery, useAssignInventoryDeleteMutation, useAssignInventorySaveMutation } from '../../../query/inventory.query'
import { useAssignInventoryDeleteMutation, useAssignInventorySaveMutation, useGetAssignInventoryQuery } from '../../../query/assign.inventory'
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import TanstackPagination from '../../components/Pagination';
import dayjs from 'dayjs';
import moment from 'moment';
import { json2csv } from 'json-2-csv';
import commonObj from '../../../commonObj';
import { useGetHistoryQuery } from '../../../query/history.query';
import { useGetSubAdminsQuery } from '../../../query/admin.query';
import { useGetClientQuery } from '../../../query/client.query';
import { useGetInventoryQuery } from '../../../query/inventory.query'
const role = commonObj.userType;
const permissions = {
    canView: true,

    canEdit:
        role === "SuperAdmin" ||
        role === "COUNSELLORS/ORW" ||
        role === "ADMIN",
    canExport:
        role === "SuperAdmin" ||
        role === "COUNSELLORS/ORW" ||
        role === "ADMIN" ||
        role === "MNE",

    canDelete:
        role === "SuperAdmin" ||
        role === "COUNSELLORS/ORW" ||
        role === "ADMIN",

    canAdd:
        role === "SuperAdmin" ||
        role === "COUNSELLORS/ORW" ||
        role === "ADMIN",
};
const { canAdd, canDelete, canEdit, canView, canExport } = permissions;
export const AssignInventory = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetAssignInventoryQuery(qData);
    console.log("Authors",authors)
    // const [selected, setSelected] = useState([]);
    const useDelete = useAssignInventoryDeleteMutation();
    const addFormRef = useRef();
    const assignref = useRef()
    const editHistoryRef = useRef();
    const queryClient = useQueryClient()
    const columns = [
        {
            title: "Assign By",
            dataIndex: ["assignByDetails", "name"],
            // width: 300,
            render: (value) => value?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
        },
        {
            title: "Client Name",
            dataIndex: ["clientDetails", "clientName"],
            // width: 300,
            render: (value) => value?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
        },
        {
            title: "Assign Date",
            dataIndex: "assignDate",
            // width: 300,
            render: (date) => date ? new Date(date).toLocaleDateString("en-IN") : "-"
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            // width: 300,
        },
        {
            title: "Item Name",
            dataIndex: "itemName",
            // width: 300,
        },
        {
            title: "Category",
            dataIndex: "category",
            // width: 300,
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

        // {
        //     title: "Action",
        //     dataIndex: "_id",
        //     width: 70,
        //     render: (v, row) => {

        //         return (
        //             <>
        //                 {canDelete ? <Popconfirm
        //                     title="Are you sure to delete this Inventory?"
        //                     onConfirm={() => {
        //                         deleteData(row._id);
        //                     }}
        //                     okText="Yes"
        //                     cancelText="No"
        //                 >
        //                     <Button
        //                         type="primary"
        //                         size="small"
        //                         danger
        //                         icon={<DeleteOutlined />}
        //                     />
        //                     &nbsp;
        //                 </Popconfirm> : null}
        //                 {canEdit ? <Button
        //                     type="primary"
        //                     size="small"
        //                     icon={<EditOutlined />}
        //                     onClick={() => {
        //                         addFormRef.current.openForm(row);
        //                     }}
        //                 /> : <Button
        //                     type="primary"
        //                     size="small"
        //                     onClick={() => {
        //                         addFormRef.current.openForm(row);
        //                     }}
        //                 >View</Button>}
        //             </>
        //         );
        //     },
        // },
    ].filter((item) => !item.hidden);


    const deleteData = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: (res) => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_ASSIGN_INVENTORY_LIST],
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
                    assignref,
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
                title={"Inventory"}
            >
                <Table
                    {...tableProps}
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={authors?.data?.length ? authors?.data : []}
                />
                {!isLoading && isError && !authors.data.length && <DataNotLoaded />}
                <AssignDataModal ref={assignref} />
                <AddEditFormModal ref={addFormRef} {...{ queryClient }} />
                <EditHistoryModal ref={editHistoryRef} />

            </Card>
        </div>
    )
}

function Search({ qData, setQData, addFormRef, assignref }) {
    const [searchFields, setSearchFields] = useState({})
    const { data: AllData } = useGetAssignInventoryQuery(qData);
    const { data: WholeData } = useGetAssignInventoryQuery({ isAll: true });
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }
    // convert JSON -> CSV + download
    const downloadCsv = async (rows, fileName = "Inventory.csv") => {
        if (!Array.isArray(rows) || rows.length === 0) {
            message.warning("No data to export");
            return;
        }

        // OPTIONAL: map only the fields you want in CSV
        const cleaned = rows.map((r) => ({
            // ===== Item Details =====
            "Item Name": r.itemName ?? "",
            "Category": r.category ?? "",
            "Batch Number": r.batchNo ?? "",

            // ===== Expiry & Pricing =====
            "Expiry Date": r.expiryDate
                ? `'${moment(r.expiryDate).format("DD MMM YYYY")}`
                : "",
            "Unit Price": r.unitPrice ?? "",
            "Quantity Available": r.quantity ?? "",

            // ===== Supplier =====
            "Supplier Name": r.supplierName ?? "",
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
        await downloadCsv(AllData?.data || [], "Inventory_current_page.csv");
        message.success("Current page data exported successfully.");
    };

    // Export all (fetch all pages from API)

    const handleExportAll = async () => {
        await downloadCsv(WholeData?.data || [], "Assign_Inventory_all_data.csv");
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
                        <Button
                            type="primary"
                            onClick={() => assignref?.current?.open()} // ✅ opens AssignDataModal via ref
                        >
                            Assigned Data
                        </Button>

                    </Col>
                </Col>

            </Row >
        </Form >
    );
}


// ✅ UPDATED AddEditFormModal (category -> filtered items)
// Drop-in replacement for your current AddEditFormModal component

const AddEditFormModal = forwardRef((props, ref) => {
  const { queryClient } = props;

  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);

  const { data: clients } = useGetClientQuery({ isAll: true, status: true });

  // ⚠️ assuming this API returns inventory master list with fields like:
  // { _id, itemName, category, ... }
  const { data: ItemName, isLoading } = useGetInventoryQuery({ clientId: commonObj._id });

  const useSave = useAssignInventorySaveMutation();

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { ...dt } : { status: true });
    },
  }));

  const handleChange = (value) => {
    Object.entries(value).forEach(([k, v]) => {
      let varDt = data;
      const keys = k.split(".");
      for (let i = 0; i < keys.length; i++) {
        if (i + 1 === keys.length) {
          varDt[keys[i]] = v;
        } else {
          if (typeof varDt[keys[i]] === "undefined") {
            if (parseInt(keys[i + 1]) * 1 >= 0) varDt[keys[i]] = [];
            else varDt[keys[i]] = {};
          }
          varDt = varDt[keys[i]];
        }
      }
    });
    setData({ ...data });
  };

  // ✅ normalize list
  const allItems = Array.isArray(ItemName?.data) ? ItemName.data : [];

  // ✅ filter items based on selected category
  const filteredItems = data.category
    ? allItems.filter(
        (it) => String(it?.category || "").toLowerCase() === String(data.category || "").toLowerCase()
      )
    : [];

  const save = () => {
    useSave.mutate(data, {
      onSuccess: () => {
        message.success("Data saved successfully.");
        queryClient.invalidateQueries({ queryKey: [QUERY_ASSIGN_INVENTORY_LIST] });
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
    <Modal
      title={<span>{data._id ? "Edit " : "Add "} Inventory</span>}
      style={{ top: 20 }}
      open={open}
      okText="Save"
      onOk={save}
      okButtonProps={{ disabled: useSave.isPending || !canEdit }}
      onCancel={() => setOpen(false)}
      destroyOnClose
      maskClosable={false}
      width={1000}
    >
      <Form layout="vertical">
        <Row gutter={[12, 0]} align="middle">
          <Col span={8}>
            <Form.Item label="Select Client" required>
              <Select
                placeholder="Select client"
                value={data.clientId}
                disabled={!!data._id}
                onChange={(e) => handleChange({ clientId: e })}
              >
                {clients?.data?.map((client) => (
                  <Select.Option key={client._id} value={client._id}>
                    {client.clientName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Assign Date" required>
              <DatePicker
                placeholder="Select date"
                format="DD MMM YYYY"
                value={data.assignDate ? dayjs(data.assignDate) : null}
                disabledDate={(current) => {
                  if (!current) return false;
                  return current.isBefore(dayjs().startOf("day"));
                }}
                onChange={(d) => handleChange({ assignDate: d || null })}
                style={{ width: "100%" }}
                disabled={!canEdit}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="Quantity" required>
              <Input
                type="number"
                value={data.quantity}
                placeholder="Current quantity"
                onChange={(e) => handleChange({ quantity: e.target.value })}
                min={0}
                disabled={!canEdit}
              />
            </Form.Item>
          </Col>

          {/* ✅ Category FIRST */}
          <Col span={8}>
            <Form.Item label="Category" required>
              <Select
                value={data.category}
                onChange={(e) => {
                  // ✅ when category changes, reset itemName (so invalid selection can't stay)
                  handleChange({ category: e, itemName: undefined });
                }}
                placeholder="Select Category"
                disabled={!canEdit}
              >
                <Select.Option value={"condoms"}>Condoms</Select.Option>
                <Select.Option value={"HIV kit"}>HIV Kit</Select.Option>
                <Select.Option value={"prep medication"}>Prep Medication</Select.Option>
                <Select.Option value={"medical supplies"}>Medical Supplies</Select.Option>
                <Select.Option value={"other"}>other</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          {/* ✅ Item filtered by selected category */}
          <Col span={8}>
            <Form.Item label="Select Item" required>
              <Select
                disabled={!canEdit || !data.category}
                loading={isLoading}
                placeholder={data.category ? "Select Item Name" : "Select Category first"}
                value={data.itemName}
                onChange={(e) => handleChange({ itemName: e })}
                showSearch
                optionFilterProp="children"
              >
                {filteredItems.map((meds) => (
                  <Select.Option key={meds._id} value={meds.itemName}>
                    {meds.itemName}
                  </Select.Option>
                ))}
              </Select>
              {!data.category ? (
                <div style={{ marginTop: 6, fontSize: 12, color: "#999" }}>
                  Choose a category to load matching items.
                </div>
              ) : null}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});


const AssignDataModal = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const [client, setClient] = useState(null);
    const [qData, setQData] = useState({ page: 1, limit: 10 });

    useImperativeHandle(ref, () => ({
        // ✅ open only needs row (optional) for showing client name in title
        open(_, row) {
            setClient(row || null);
            setQData({ page: 1, limit: 10 });
            setOpen(true);
        },
        close() {
            setOpen(false);
        },
    }));

    // ✅ fetch assigned inventory for logged-in user
    const { data, isLoading } = useGetInventoryQuery(
        open ? { ...qData, clientId: commonObj._id } : null
    );

    const list = data?.data || [];

    // ✅ only 3 fields
    const columns = [
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            render: (v) => v || "-",
        },
        {
            title: "Item Name",
            dataIndex: "itemName",
            key: "itemName",
            render: (v) => v || "-",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            render: (v) => (v === 0 ? 0 : v || "-"),
        },
    ];

    return (
        <Modal
            title={
                <span>
                    Assign Inventory Data {client?.clientName ? `- ${client.clientName}` : ""}
                </span>
            }
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            width={900}
            destroyOnClose
            maskClosable={false}
            style={{ top: 20 }}
        >
            {isLoading ? (
                <div style={{ padding: 12 }}>Loading...</div>
            ) : !list.length ? (
                <div style={{ padding: 12 }}>No Inventory Assigned to you.</div>
            ) : (
                <>
                    <Table
                        bordered
                        size="small"
                        columns={columns}
                        dataSource={list}
                        pagination={false}
                        rowKey={(r) => r?._id}
                        tableLayout="fixed"
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                        <Pagination
                            current={qData.page}
                            pageSize={qData.limit}
                            total={data?.extra?.total || 0}
                            showSizeChanger
                            onChange={(page, pageSize) =>
                                setQData((p) => ({ ...p, page, limit: pageSize }))
                            }
                            locale={{
                                items_per_page: "",
                            }}
                        />
                    </div>
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
            ? { ...qData, tableName: "inventoryDetails", docId }
            : { ...qData, tableName: "inventoryDetails", docId: "" }
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
