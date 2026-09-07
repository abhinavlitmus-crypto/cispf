import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Button,
  Card,
  Col,
  Divider,
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
import {
  useLocationDelete,
  useLocationListData,
  useLocationSave,
} from "../../../api-hooks/location";

import TinyMce from "../../../utils/TinyMce";
import TanstackPagination from "../../components/Pagination";

const Location = () => {
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
  } = useLocationListData({ page: 1, limit: 20 });

  const { mutate: deleteData } = useLocationDelete({
    qData,
    onSuccess: (res) => {
      message.success(res.message);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Address", dataIndex: "address" },

    {
      title: "Status",
      dataIndex: "status",
      render: (v) =>
        v ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>,
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
    <Card title="Locations">
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
      setData(
        dt
          ? { ...dt }
          : {
              status: true,
              keyServicesHeading: "",
              keyServicesDescription: "",
              clientsHeading: "",
              clientsDescription: "",
              userHeading: "",
              userDescription: "",
              galleryHeading: "",
              galleryDescription: "",
              keyservices: [{ title: " ", description: "" }],
              user: [
                {
                  profileImage: "",
                  designation: "",
                  name: "",
                  about: "",
                  linkedinLink: "",
                  twitterLink: "",
                  instagramLink: "",
                },
              ],
            }
      );
    },
  }));

  const { mutate, isPending } = useLocationSave({
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

  const addEntry = (key) => {
    handleChange(key, [...data[key], {}]);
  };

  const deleteEntry = (key, idx, min = 1) => {
    if (data[key].length > min) {
      const updated = [...data[key]];
      updated.splice(idx, 1);
      handleChange(key, updated);
    }
  };

  const handleNestedChange = (key, idx, field, value) => {
    const updated = [...data[key]];
    updated[idx] = { ...updated[idx], [field]: value };
    handleChange(key, updated);
  };

  useEffect(() => {
    if (!data?._id) {
      handleChange("slug", util.removeSpecialChars(data?.name || ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.name]);

  return (
    <Modal
      title="Add / Edit Locations"
      open={open}
      onCancel={() => setOpen(false)}
      onOk={handleSave}
      okText="Save"
      confirmLoading={isPending}
      width={1200}
    >
      <Form layout="vertical">
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="Name" required>
              <Input
                placeholder="Enter Name"
                value={data?.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Latitude" required>
              <Input
                placeholder="Ex-106.3468"
                value={data?.lat}
                onChange={(e) => handleChange("lat", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Longitude" required>
              <Input
                placeholder="Ex-106.3468"
                value={data?.long}
                onChange={(e) => handleChange("long", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Slug" required>
              <Input
                value={data?.slug}
                onChange={(e) =>
                  handleChange("slug", util.removeSpecialChars(e.target.value))
                }
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Email">
              <Input
                placeholder="Enter email"
                value={data?.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Phone">
              <Input
                placeholder="Enter number"
                type="text"
                value={data?.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Address" required>
              <Input
                placeholder="Ex -xyz address"
                value={data?.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Status" required>
              <Select
                value={data?.status}
                onChange={(value) => handleChange("status", value)}
                options={[
                  { label: "Active", value: true },
                  { label: "Inactive", value: false },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Flag Image" required>
              <UploadImage
                listType="picture-card"
                value={data?.flagImage ? [data?.flagImage] : []}
                onChange={(img) => handleChange("flagImage", img[0])}
              />
            </Form.Item>
          </Col>

          {/* Key Services */}
          <VariantKeyServices
            data={data}
            setData={setData}
            sectionName="Key Services"
            parentKey="keyservices"
          />
          <Col span={24}>
            <Form.Item label="Key Services Heading">
              <Input
                placeholder="Enter Key Services Main Heading"
                value={data?.keyServicesHeading}
                onChange={(e) =>
                  handleChange("keyServicesHeading", e.target.value)
                }
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Key Services Description">
              <Input.TextArea
                placeholder="Enter Key Services Description"
                value={data?.keyServicesDescription}
                onChange={(e) =>
                  handleChange("keyServicesDescription", e.target.value)
                }
              />
            </Form.Item>
          </Col>
          <Divider orientation="center">Our Clients</Divider>
          <Col span={24}>
            <Form.Item label="Heading">
              <Input
                placeholder="Enter Our Client Section's Heading"
                value={data?.clientsHeading}
                onChange={(e) => handleChange("clientsHeading", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Description">
              <Input.TextArea
                placeholder="Enter client Section Description"
                value={data?.clientsDescription}
                onChange={(e) =>
                  handleChange("clientsDescription", e.target.value)
                }
              />
            </Form.Item>
          </Col>

          {/* Users */}
          <Divider orientation="center">Users</Divider>
          <Col span={24}>
            <Form.Item label="Users Section Heading">
              <Input
                placeholder="Enter Users Section Heading"
                value={data?.userHeading}
                onChange={(e) => handleChange("userHeading", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Users Section Description">
              <Input.TextArea
                placeholder="Enter Users Section Description"
                value={data?.userDescription}
                onChange={(e) =>
                  handleChange("userDescription", e.target.value)
                }
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Users" className="font-semibold">
              {data?.user?.map((u, idx) => (
                <Card
                  key={idx}
                  className="mb-4"
                  style={{ borderRadius: 8, border: "1px solid #d9d9d9" }}
                  bodyStyle={{ padding: 16 }}
                >
                  <Row gutter={[12, 12]}>
                    <Col span={4}>
                      <Form.Item label="Profile Image">
                        <UploadImage
                          listType="picture-card"
                          value={u?.profileImage ? [u?.profileImage] : []}
                          onChange={(img) =>
                            handleNestedChange(
                              "user",
                              idx,
                              "profileImage",
                              img[0]
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="Name">
                        <Input
                          value={u?.name}
                          onChange={(e) =>
                            handleNestedChange(
                              "user",
                              idx,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="Designation">
                        <Input
                          value={u?.designation}
                          onChange={(e) =>
                            handleNestedChange(
                              "user",
                              idx,
                              "designation",
                              e.target.value
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="LinkedIn">
                        <Input
                          value={u?.linkedinLink}
                          onChange={(e) =>
                            handleNestedChange(
                              "user",
                              idx,
                              "linkedinLink",
                              e.target.value
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="Twitter">
                        <Input
                          value={u?.twitterLink}
                          onChange={(e) =>
                            handleNestedChange(
                              "user",
                              idx,
                              "twitterLink",
                              e.target.value
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label="Instagram">
                        <Input
                          value={u?.instagramLink}
                          onChange={(e) =>
                            handleNestedChange(
                              "user",
                              idx,
                              "instagramLink",
                              e.target.value
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="About">
                        <Input.TextArea
                          value={u?.about}
                          onChange={(e) =>
                            handleNestedChange(
                              "user",
                              idx,
                              "about",
                              e.target.value
                            )
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={2}
                      className="flex mb-[1%] items-end justify-end"
                    >
                      {data?.user?.length > 1 && (
                        <Button
                          type="dashed"
                          shape="circle"
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => deleteEntry("user", idx)}
                        />
                      )}
                    </Col>
                  </Row>
                </Card>
              ))}
            </Form.Item>

            {/* Add User Button */}
            {data?.user?.length && (
              <div className="flex justify-end ">
                <Button
                  type="primary"
                  block
                  onClick={() => addEntry("user", 2)}
                  className="my-2 w-[200px]"
                >
                  + Add User
                </Button>
              </div>
            )}
          </Col>
          <Divider orientation="center">Gallery</Divider>
          <Col span={24}>
            <Form.Item label="Heading">
              <Input
                placeholder="Gallery Section Heading"
                value={data?.galleryHeading}
                onChange={(e) => handleChange("galleryHeading", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Description">
              <Input.TextArea
                placeholder="Enter Gallery Section Description"
                value={data?.galleryDescription}
                onChange={(e) =>
                  handleChange("galleryDescription", e.target.value)
                }
              />
            </Form.Item>
          </Col>

          <Divider orientation="center">Details</Divider>

          <Col span={24}>
            <TinyMce
              value={data?.description}
              onChange={(v) => {
                data.description = v;
              }}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});

export default Location;

function VariantKeyServices({ data, setData, sectionName, parentKey }) {
  const list = data[parentKey] || [{ title: "", description: "" }];

  const updateItem = (index, key, value) => {
    const updated = [...list];
    updated[index][key] = value;
    setData({ ...data, [parentKey]: updated });
  };

  const removeItem = (index) => {
    const updated = [...list];
    updated.splice(index, 1);
    setData({ ...data, [parentKey]: updated });
  };

  const addItem = () => {
    const updated = [...list, { title: "", description: "" }];
    setData({ ...data, [parentKey]: updated });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: (text, _, index) => (
        <Form.Item>
          <Input
            placeholder="Enter Title"
            value={text}
            onChange={(e) => updateItem(index, "title", e.target.value)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text, _, index) => (
        <Form.Item>
          <Input.TextArea
            placeholder="Enter Description"
            value={text}
            onChange={(e) => updateItem(index, "description", e.target.value)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, __, index) => (
        <div style={{ display: "flex", gap: 8 }}>
          {list.length > 1 && (
            <Button
              type="dashed"
              shape="circle"
              danger
              icon={<CloseOutlined />}
              onClick={() => removeItem(index)}
            />
          )}
          {index === list.length - 1 && list.length < 4 && (
            <Button
              type="dashed"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={addItem}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <Col span={24}>
      <Divider orientation="center">{sectionName}</Divider>

      <Table
        rowKey={(_, index) => index}
        columns={columns}
        dataSource={list}
        pagination={false}
      />
    </Col>
  );
}
