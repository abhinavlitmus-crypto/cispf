import React, { forwardRef, useImperativeHandle, useState } from "react";
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
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import UploadImage from "../../../utils/UploadImage";
import util from "../../../utils/util";

import TanstackPagination from "../../components/Pagination";
import {
  usePlanDelete,
  usePlanListData,
  usePlanSave,
} from "../../../api-hooks/plan";

const Plan = () => {
  const [ar] = useState({
    viewAccess: util.checkRightAccess("SuperAdmin"),
    addAccess: util.checkRightAccess("SuperAdmin"),
    editAccess: util.checkRightAccess("SuperAdmin"),
    deleteAccess: util.checkRightAccess("SuperAdmin"),
  });

  const addFormRef = React.useRef();

  const {
    data: { data, qData },
    isLoading,
    refetchWithQuery,
  } = usePlanListData({ page: 1, limit: 20 });

  const { mutate: deleteData } = usePlanDelete({
    qData,
    onSuccess: (res) => {
      message.success(res.message);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const columns = [
    { title: "Plan", dataIndex: "plan" },
    { title: "Price", dataIndex: "price" },
    { title: "Subscription", dataIndex: "subscriptionType" },

    {
      title: "Status",
      dataIndex: "status",
      render: (v) =>
        v ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      width: 50,
      hidden:
        !ar.addAccess && !ar.editAccess && !ar.deleteAccess && !ar.viewAccess,

      render: (v, row) => (
        <>
          {ar.deleteAccess ? (
            <Popconfirm
              title="Are you sure to delete this data?"
              onConfirm={() => {
                deleteData({ ids: row._id });
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
          ) : null}

          {ar.editAccess ? (
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                addFormRef.current.openForm(row);
              }}
            />
          ) : null}
        </>
      ),
    },
  ];

  const tableProps = {
    bordered: true,
    loading: isLoading,
    size: "small",
    title: () => (
      <Search
        {...{
          addFormRef,
          ar,
        }}
      />
    ),
    showHeader: true,
    footer: () => (
      <TanstackPagination {...{ qData }} onChange={refetchWithQuery} />
    ),
    tableLayout: undefined,
  };

  return (
    <Card title="Plan">
      <Table
        {...tableProps}
        pagination={{ position: ["none"], pageSize: qData.limit }}
        columns={columns}
        dataSource={data}
      />
      <AddEditFormModal ref={addFormRef} refetch={refetchWithQuery} />
    </Card>
  );
};

function Search({ addFormRef, ar }) {
  return (
    <Form>
      <Row gutter={12}>
        <Col span={18}></Col>

        {
          <Col span={6}>
            {ar.addAccess ? (
              <Col
                span={24}
                className="flex items-center w-full gap-x-4 justify-end"
              >
                <Col span={12} className="flex justify-end !p-0 max-w-fit">
                  <Button
                    type="primary"
                    onClick={() => {
                      addFormRef.current.openForm();
                    }}
                  >
                    Add New
                  </Button>
                </Col>
              </Col>
            ) : null}
          </Col>
        }
      </Row>
    </Form>
  );
}

const AddEditFormModal = forwardRef(({ refetch }, ref) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { ...dt } : { status: true });
    },
  }));

  const { mutate, isPending } = usePlanSave({
    onSuccess: (res) => {
      message.success(res.message || "Saved successfully");
      setOpen(false);
      refetch?.();
    },
    onError: (err) => {
      message.error(err.message || "Failed to save");
    },
  });

  const handleChange = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    mutate(data);
  };

  return (
    <Modal
      title={data?.plan?"Edit Store":"Add Store"}
      open={open}
      onCancel={() => setOpen(false)}
      onOk={handleSave}
      okText="Save"
      confirmLoading={isPending}
      width={800}
    >
      <Form layout="vertical">
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="Name your plan" required>
              <Input
                placeholder="e.g., BASIC , PREMIUM"
                value={data?.plan}
                onChange={(e) => handleChange("plan", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Subscription Type" required>
              <Select
                allowClear
                placeholder="Select open days"
                value={data?.subscriptionType}
                onChange={(val) => handleChange("subscriptionType", val)}
                options={["Yearly", "Monthly"].map((day) => ({
                  label: day,
                  value: day,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Price" required>
              <Input
              type="Number"
                placeholder="e.g., 599 - 1299"
                value={data?.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
           <Form.Item label="Store Media (Images)">
                         <UploadImage
                           listType="picture-card"
                           
                           count={1}
                           value={data?.img || []}
                           onChange={(imgs) => handleChange("img", imgs)}
                         />
                       </Form.Item>
          </Col>

          <Col span={12} className="mt-10">
            <VariantOne
              {...{
                data,
                setData,

                parentKey: "bulletPoints",
              }}
            />
          </Col>

          <Col span={12} className="mt-5">
            <Form.Item label="Status" required>
              <Select
                value={data?.status}
                onChange={(val) => handleChange("status", val)}
                options={[
                  { label: "Active", value: true },
                  { label: "Inactive", value: false },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});

function VariantOne({ data, setData, parentKey }) {
  return (
    <>
      <Row gutter={[10]}>
        <Col span={24}>
          {(data[parentKey] || []).map((item, i) => (
            <Row key={i} gutter={10} align="middle" className="mb-2">
              <Col flex="auto">
                <Input
                  value={item}
                  onChange={(e) => {
                    const updated = [...(data[parentKey] || [])];
                    updated[i] = e.target.value;
                    setData({ ...data, [parentKey]: updated });
                  }}
                />
              </Col>
              <Col>
                <Button
                  type="dashed"
                  shape="circle"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => {
                    const updated = [...(data[parentKey] || [])];
                    updated.splice(i, 1);
                    setData({ ...data, [parentKey]: updated });
                  }}
                />
              </Col>
            </Row>
          ))}
          <Button
            type="dashed"
            onClick={() => {
              const updated = [...(data[parentKey] || [])];
              updated.push("");
              setData({ ...data, [parentKey]: updated });
            }}
            icon={<PlusOutlined />}
          >
            Add Plan Benefits
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default Plan;
