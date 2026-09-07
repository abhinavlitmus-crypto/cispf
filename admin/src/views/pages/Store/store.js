import React, {
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
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
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import UploadImage from "../../../utils/UploadImage";
import util from "../../../utils/util";

import TanstackPagination from "../../components/Pagination";
import { useStoreDelete, useStoreListData, useStoreSave } from "../../../api-hooks/store";

const Store = () => {
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
  } = useStoreListData({ page: 1, limit: 20 });

  const { mutate: deleteData, isPending } = useStoreDelete({
    qData,
    onSuccess: (res) => {
      message.success(res.message);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const columns = [
    { title: "Name", dataIndex: "storeName" },
    { title: "Phone", dataIndex: "phone" },
     { title: "Email", dataIndex: "email" },

    {
      title: "Status",
      dataIndex: "status",
      render: (v) =>
        v ? <Tag color="green">Verified</Tag> : <Tag color="red">Unverified</Tag>,
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
               icon= {<EditOutlined />}
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
    <Card title="Store">
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

  const { mutate, isPending } = useStoreSave({
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
      title={data?.storeName?"Edit Store":"Add Store"}
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
            <Form.Item label="Store Name" required>
              <Input
                placeholder="Enter store name"
                value={data?.storeName}
                onChange={(e) => handleChange("storeName", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Phone" required>
              <Input
              type="number"
                placeholder="Enter phone number"
                value={data?.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Email" required>
              <Input
                placeholder="Enter email"
                value={data?.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Address Line 1" required>
              <Input
                placeholder="Enter address line 1"
                value={data?.address1}
                onChange={(e) => handleChange("address1", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Address Line 2">
              <Input
                placeholder="Enter address line 2"
                value={data?.address2}
                onChange={(e) => handleChange("address2", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Open Days" required>
              <Select
                mode="multiple"
                allowClear
                placeholder="Select open days"
                value={data?.openDays}
                onChange={(val) => handleChange("openDays", val)}
                options={[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => ({ label: day, value: day }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Timing" required>
              <Input
                placeholder="e.g., 9:00 AM - 6:00 PM"
                value={data?.timing}
                onChange={(e) => handleChange("timing", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Store Media (Images)">
              <UploadImage
                listType="picture-card"
                multiple
                count={10}
                value={data?.media || []}
                onChange={(imgs) => handleChange("media", imgs)}
              />
            </Form.Item>
          </Col>

          <Col span={12} className="mt-5">
            <Form.Item label="Status" required>
              <Select
                value={data?.status}
                onChange={(val) => handleChange("status", val)}
                options={[
                  { label: "Verified", value: true },
                  { label: "Unverified", value: false },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});


export default Store;


