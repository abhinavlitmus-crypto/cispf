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
    DatePicker,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_MANAGEMENT_LIST } from '../../../constants/query.constants';
import { useGetManagementQuery, useManagementDeleteMutation, useManagementSaveMutation } from '../../../query/management.query'
import { useGetAssetQuery } from '../../../query/asset.query';
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import TanstackPagination from '../../components/Pagination';
import dayjs from 'dayjs';
import moment from 'moment';
import { json2csv } from 'json-2-csv';
import { useGetSubAdminsQuery } from '../../../query/admin.query';
import { useGetHistoryQuery } from '../../../query/history.query';

export const Management = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetManagementQuery(qData);

    // const [selected, setSelected] = useState([]);
    const useDelete = useManagementDeleteMutation();
    const addFormRef = useRef();
      const editHistoryRef = useRef();
    
    const queryClient = useQueryClient()
    const columns = [


        {
            title: "Assign To",
            dataIndex: ["userDetails", "name"],
            // width: 300,
        },
        {
            title: "Asset Name",
            dataIndex: ["assetDetails", "name"],
            render: (name, row) => name || "-"
            // width: 300,
        },
        {
            title: "Assign Date",
            dataIndex: "assignDate",
            // width: 300,
            render: (date) => date ? new Date(date).toLocaleDateString("en-IN") : "",
        },
        {
            title: "Location",
            dataIndex: "location",
            // width: 300,
        },
        {
              title: "View Edit",
              key: "viewEdit",
              width: 110,
              render: (_, row) =>
                  <Button
                    size="small"
                    onClick={() => editHistoryRef.current.open(row?._id, row)}
                  >
                    View Edit
                  </Button>
               
            },
        {
            title: "Action",
            dataIndex: "_id",
            width: 70,
            render: (v, row) => {
                return (
                    <>
                        <Popconfirm
                            title="Are you sure to delete this Management?"
                            onConfirm={() => {
                                deleteData(row._id);
                            }}
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
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                                addFormRef.current.openForm(row);
                            }}
                        />
                    </>
                );
            },
        },
    ].filter((item) => !item.hidden);


    const deleteData = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: (res) => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_MANAGEMENT_LIST],
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
                title={"Assest Management"}
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
    const { data: AllData } = useGetManagementQuery(qData);
    const { data: WholeData } = useGetManagementQuery({ isAll: true });
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }
    // convert JSON -> CSV + download
    const downloadCsv = async (rows, fileName = "clients.csv") => {
        if (!Array.isArray(rows) || rows.length === 0) {
            message.warning("No data to export");
            return;
        }

        // OPTIONAL: map only the fields you want in CSV
        const cleaned = rows.map((r) => ({
            // ===== Asset Info =====
            "Asset ID": r.assetId ?? "",
            "Asset Name": r.assetDetails?.name ?? "",

            // ===== Assignment Details =====
            "Assigned To": r.assignTo ?? "",
            "Location": r.location ?? "",
            "Assigned Date": r.assignDate
                ? `'${moment(r.assignDate).format("DD MMM YYYY")}`
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

    // Export current page (authors.data is current page data)
    const handleExport = async () => {
        await downloadCsv(AllData?.data || [], "Asset_Management_current_page.csv");
        message.success("Current page data exported successfully.");
    };

    // Export all (fetch all pages from API)

    const handleExportAll = async () => {
        await downloadCsv(WholeData?.data || [], "Asset_Management_all_data.csv");
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
                        {WholeData?.data?.length > 0 && <Button onClick={handleExportAll}>Export All</Button>}

                        <Button
                            type="primary"
                            onClick={() => addFormRef.current.openForm()}
                        >
                            Add New
                        </Button>
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
    const { data: assets } = useGetAssetQuery();
    const { data: userList } = useGetSubAdminsQuery();
    const useSave = useManagementSaveMutation();
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
                        queryKey: [QUERY_MANAGEMENT_LIST]
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
                title={<span>{data._id ? "Edit " : "Add "} Asset Management</span>}
                style={{ top: 20 }}
                open={open}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: useSave.isPending }}
                onCancel={() => {
                    setOpen(false);
                }}
                destroyOnClose
                maskClosable={false}
                width={1000}
            // className="app-modal-body-overflow"

            >
                <Form layout="vertical">
                    <Row gutter={[12, 0]} align={"middle"}>
                        <Col span={24}>
                            <Form.Item label={"Select Asset"} required>
                                <Select placeholder="Select Asset" value={data.assetId} onChange={(e) => { handleChange({ assetId: e }) }} disabled={!!data._id}>
                                    {assets?.data?.map((ass) => (
                                        <Select.Option key={ass._id} value={ass._id}>
                                            {ass.name}
                                        </Select.Option>
                                    )
                                    )}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[12, 0]} align="middle">
                        <Col span={8}>
                            <Form.Item label="Assign To" required>
                                {/* <Input
                                    type='text'
                                    placeholder="Type Assign to.."
                                    value={data.assignTo}
                                    onChange={(e) => {
                                        handleChange({ assignTo: e.target.value });
                                    }}
                                /> */}
                                <Select
                                    placeholder="Select User"
                                    value={data.assignTo}
                                    disabled={!!data._id}
                                    onChange={(e) => {
                                        handleChange({ assignTo: e })
                                    }}
                                >
                                    {userList?.data?.map((user) => (
                                        <Select.Option value={user._id} key={user._id}>{user.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Assign Date" required>
                                {/* <DatePicker value={data.assignDate && dayjs(moment(data.assignDate).format("YYYY-MM-DD"))}
                                    format='DD MMM YYYY'
                                    disabledDate={(current) => current.isBefore(moment(new Date()).subtract(1, "day"))}
                                    onChange={(e) => { handleChange({ assignDate: new Date(e) }) }} style={{ width: '100%' }} /> */}
                                <DatePicker
                                    placeholder="Select date"
                                    format="DD MMM YYYY"
                                    value={data.assignDate ? dayjs(data.assignDate) : null}
                                    disabledDate={(current) => {
                                        if (!current) return false;

                                        const today = dayjs().endOf("day");
                                        const oneMonthAgo = dayjs().subtract(1, "month").startOf("day");

                                        // disable future dates + dates older than 1 month
                                        return current.isAfter(today) || current.isBefore(oneMonthAgo);
                                    }}
                                    onChange={(d) => {
                                        handleChange({ assignDate: d || null });
                                    }}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Location" required>
                                <Input
                                    type='text'
                                    placeholder="Enter Location..."
                                    value={data.location}
                                    onChange={(e) => {
                                        handleChange({ location: e.target.value });
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
      ? { ...qData, tableName: "assignDetails", docId }
      : { ...qData, tableName: "assignDetails", docId: "" }
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
