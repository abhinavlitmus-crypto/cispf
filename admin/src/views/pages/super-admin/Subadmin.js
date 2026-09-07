import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
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
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { QUERY_SUB_ADMIN_KEY } from "../../../constants/query.constants";
import {
  useSubAdminDeleteMutation,
  useSubAdminSaveMutation,
  useGetSubAdminsQuery,
} from "../../../query/admin.query";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import Loader from "../../components/Loaders/loader";
import UploadImage from "../../../utils/UploadImage";


export const SubAdmin = () => {
  const [qData, setQData] = useState({
    page: 1,
    limit: 10,
    total: 0,
    getTotal: false,
  });
  const {
    data: apiRes,
    isLoading,
    isError,
    isFetching,
  } = useGetSubAdminsQuery(qData);
  const [selected] = useState([]);
  const useDelete = useSubAdminDeleteMutation();

  const addFormRef = useRef();
  const queryClient = useQueryClient();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render : (value)=> value?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
      // width: 300,
    },
    // {
    //   title: "Contact Number",
    //   dataIndex: "phone",
    //   // width: 300,
    // },
    {
      title: "E-Mail",
      dataIndex: "email",
      // width: 300,
    },
    {
      title: "Allowed Rights",
      dataIndex: "rights",
      render: (v) => v?.map((item) => <Tag>{item}</Tag>),
      // width: 300,
    },

    {
      title: "Status",
      dataIndex: "status",
      width: 60,
      render: (isActive) => {
        if (isActive) {
          return <Tag color="green">Active</Tag>;
        } else {
          return <Tag color="red">Inactive</Tag>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: 70,
      render: (v, row) => {
        return (
          <>
            <Popconfirm
              title="Are you sure to delete this Sub-Admin?"
              onConfirm={() => {
                console.log(row._id);
                deleteModel(row._id);
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

  const deleteModel = (id) => {
    useDelete.mutate(
      { ids: id },
      {
        onSuccess: (res) => {
          message.success("Data deleted successfully.");
          queryClient.invalidateQueries({
            queryKey: [QUERY_SUB_ADMIN_KEY],
          });
        },
        onError: (err) => {
          message.error(err.message);
        },
      }
    );
  };

  const tableProps = {
    bordered: true,
    loading: isLoading,
    size: "small",
    title: () => (
      <Search
        {...{
          addFormRef,
          selected,
          qData,
          setQData,
          apiRes,
        }}
      />
    ),
    showHeader: true,
    footer: () => <MyPagination {...{ qData, setQData }} />,
    tableLayout: undefined,
  };
  useEffect(() => {
    if (apiRes && apiRes.extra) {
      setQData((prevState) => ({
        ...prevState,
        ...apiRes.extra,
      }));
    }
  }, [apiRes]);
  return (
    <div>
      <Card
        bordered={false}
        size="small"
        className="p-0"
        title={"Sub User's List"}
      >
        {isFetching ? (
          <Loader />
        ) : (
          <>
            <Table
              {...tableProps}
              pagination={{ position: ["none"], pageSize: qData.limit }}
              columns={columns}
              dataSource={apiRes?.data?.length ? apiRes.data : []}
            />
            {!isFetching && isError && <DataNotLoaded />}
          </>
        )}

        <AddEditFormModal ref={addFormRef} {...{ queryClient }} />
      </Card>
    </div>
  );
};

function Search({ qData, setQData, addFormRef }) {
  const [searchFields] = useState({});
  const handleSearch = () => {
    setQData({ ...qData, ...searchFields, page: 1 });
  };
  return (
    <Form onSubmitCapture={handleSearch}>
      <Row gutter={12}>
        <Col span={18}>
          {/* <Row gutter={12}>
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
          </Row> */}
        </Col>

        {
          <Col span={6}>
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
          </Col>
        }
      </Row>
    </Form>
  );
}

const AddEditFormModal = forwardRef((props, ref) => {
  const { queryClient } = props;
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const useSave = useSubAdminSaveMutation();

  const possibleRights = ["trainer"];

  const ROLE_RIGHTS_MAP = {
    "trainer":[
      "course",
      "category",
    ],
  };


  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      // ensure socialLink always exists as an object
      setData(dt ? { ...dt, socialLink: dt.socialLink || {} } : { status: true, socialLink: {} });
    },
  }));

  //  generic handleChange that supports nested objects and merges
  const handleChange = (value) => {
    setData((prev) => ({
      ...prev,
      ...value,
    }));
  };

  const save = () => {
    const payload = {
      ...data,
      // ensure socialLink is not null/undefined

    };

    useSave.mutate(payload, {
      onSuccess: (res) => {
        message.success("Data saved successfully.");
        queryClient.invalidateQueries({
          queryKey: [QUERY_SUB_ADMIN_KEY],
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
        title={<span>{data._id ? "Edit " : "Add "} Sub User</span>}
        style={{ top: 20 }}
        open={open}
        okText="Save"
        onOk={save}
        okButtonProps={{ disabled: useSave.isPending }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        maskClosable={false}
        width={600}
      >
        <Form layout="vertical">
          <Row gutter={[12, 0]}>
            {/* Name */}
            <Col span={12}>
              <Form.Item label="Name" required>
                <Input
                  type="text"
                  placeholder="Enter Name"
                  value={data.name}
                  onChange={(e) => handleChange({ name: e.target.value })}
                />
              </Form.Item>
            </Col>

            {/* Profile Avatar */}
            <Col span={12}>
              <Form.Item label="Profile">
                <UploadImage
                  value={data.avatar ? [data.avatar] : []}
                  count={1}
                  onChange={(v) => {

                    console.log("vvv", v);
                    setData({ ...data, avatar: v?.[v.length - 1] || "" });
                  }}
                  listType="picture-card"
                />
              </Form.Item>
            </Col>

            {/* Email */}
            <Col span={12}>
              <Form.Item label="E-Mail" required>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  value={data.email}
                  onChange={(e) => handleChange({ email: e.target.value })}
                />
              </Form.Item>
            </Col>

            {/* Password */}
            {!data._id ? (
              <Col span={12}>
                <Form.Item label="Set Password" required>
                  <Input.Password
                    placeholder="*********"
                    value={data.password}
                    minLength={8}
                    onChange={(e) =>
                      handleChange({ password: e.target.value })
                    }
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </Col>
            ) : (
              <Col span={12}>
                <Form.Item label="Update Password">
                  <Input.Password
                    placeholder="*********"
                    minLength={8}
                    value={data.password}
                    onChange={(e) => handleChange({ password: e.target.value })}
                  />
                </Form.Item>
              </Col>
            )}


            {/* Rights */}
            {/* <Col span={24}>
              <Form.Item label="Choose Rights" required>
                <Select
                  mode="multiple"
                  showSearch
                  optionFilterProp="children"
                  placeholder="eg. Client,Inventory,etc"
                  allowClear
                  value={data?.rights || []}
                  onChange={(e) => handleChange({ rights: e })}

                >
                  <Select.Option value="client">Client List</Select.Option>
                  <Select.Option value="testing">Engagement & Testing</Select.Option>
                  <Select.Option value="prep">PrEP Initiation</Select.Option>
                  <Select.Option value="inventory">Inventory</Select.Option>
                  <Select.Option value="art">Art Linkage</Select.Option>
                  <Select.Option value="asset">Asset Management</Select.Option>
                  <Select.Option value="documents">Documents</Select.Option>
                </Select>
              </Form.Item>
            </Col> */}

            {/* Choose Profile */}
            <Col span={24}>
              <Form.Item label="Role" required >
                <Select
                  placeholder="eg, trainer"
                  value={data.userType}
                  onChange={(e) => handleChange({
                    userType: e,
                    rights: ROLE_RIGHTS_MAP[e] || [],
                  })}
                >
                  {possibleRights.map((role) => <Select.Option value={role}>{role}</Select.Option>)}
                  {/* <Select.Option value="Admin">Admin</Select.Option>
                    <Select.Option value="MNE">MNE</Select.Option>
                    <Select.Option value="PO">PO</Select.Option>
                    <Select.Option value="Counsellors">Counsellors</Select.Option> */}
                </Select>
              </Form.Item>
            </Col>

            {/* Status */}
            <Col span={12}>
              <Form.Item label="Status" required>
                <Select
                  value={data.status}
                  onChange={(e) => handleChange({ status: e })}
                >
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

