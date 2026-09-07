import {
  PlusOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Table,
  Tag,
  Space,
  Typography,
} from "antd";
import React, {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { QUERY_HOMEPAGE_KEY } from "../../constants/query.constants";
import {
  useGetTestimonialsQuery,
  useTestimonialDeleteMutation,
  useTestimonialSaveMutation,
} from "../../query/testimonial.query";
import UploadImage from "../../utils/UploadImage";
import DataNotLoaded from "../components/DataNotLoaded";
import MyPagination from "../components/Pagination";
import {
  useGetHomepagesQuery,
  useHomepageSaveMutation,
} from "../../query/homepage.query";
import { useGetSpecialitesQuery } from "../../query/product.query";
import { useGetAboutPageByIdQuery } from "../../query/about.query";
import { useGetMedicalteamQuery } from "../../query/medicalTeam.query";
import { useGetFleetPageListQuery } from "../../query/fleet.query";

const { Title } = Typography;

export const Homepage = () => {
  const addFormRef = useRef();

  const [qData, setQData] = useState({
    page: 1,
    limit: 20,
    total: 0,
    getTotal: false,
  });
  const queryClient = useQueryClient();

  const { data: apiRes, isLoading, isError } = useGetHomepagesQuery();

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      render: () => (
        <Title level={4} style={{ textAlign: "center" }} color="green">
          Home Page Customization
        </Title>
      ),
    },

    // {
    //     title: "Status",
    //     dataIndex: "status",
    //     width: 60,
    //     render: (isActive) => {
    //         if (isActive) {
    //             return <Tag color="green">Active</Tag>;
    //         } else {
    //             return <Tag color="red">Inactive</Tag>;
    //         }
    //     },
    // },
    {
      title: "Actions",
      dataIndex: "_id",
      width: 50,
      render: (v, row) => (
        <>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              addFormRef.current.openForm(row);
            }}
          />
        </>
      ),
    },
  ].filter((item) => !item.hidden);

  const tableProps = {
    bordered: true,
    loading: isLoading,
    size: "small",

    showHeader: true,

    tableLayout: undefined,
  };

  return (
    <div>
      <Card bordered={false} size="small" className="p-0" title={"Home Page"}>
        {/* <Col className=" flex justify-end pb-2">
          <Button
            onClick={() => {
              addFormRef.current.openForm();
            }}
          >
            Add New
          </Button>
        </Col> */}
        <Table
          {...tableProps}
          pagination={{ position: ["none"] }}
          columns={columns}
          dataSource={apiRes?.data?.length ? apiRes?.data : []}
        />
        {!isLoading && isError && !apiRes?.data.length && <DataNotLoaded />}

        <AddEditFormModal ref={addFormRef} {...{ queryClient }} />
      </Card>
    </div>
  );
};

const AddEditFormModal = forwardRef((props, ref) => {
  const useSave = useHomepageSaveMutation();

  const { queryClient } = props;
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);

  const handleChange = (value) => {
    Object.entries(value).forEach(([key, val]) => {
      let varDt = data;
      const keys = key.split(".");
      for (let i = 0; i < keys.length; i++) {
        if (i + 1 === keys.length) {
          varDt[keys[i]] = val;
        } else {
          if (typeof varDt[keys[i]] === "undefined") {
            varDt[keys[i]] = parseInt(keys[i + 1]) >= 0 ? [] : {};
          }
          varDt = varDt[keys[i]];
        }
      }
    });
    setData({ ...data });
  };
  const save = () => {
    let payload = { ...data };
    if (data._id) {
      payload._id = data._id;
    }

    useSave.mutate(payload, {
      onSuccess: (res) => {
        message.success("Data saved successfully.");
        queryClient.invalidateQueries({
          queryKey: [QUERY_HOMEPAGE_KEY],
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

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { ...dt } : {});
    },
  }));

  return (
    <Modal
      title={<span>{data._id ? "Edit " : "Add "} Home</span>}
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
      width={1200}
    >
      <Form layout="vertical">
        <Row gutter={[24, 24]}>
          {/* <Col span={24}>
            <Card bordered={false} size="small" className="p-0">
              <Divider>
                <Typography size="xl">Overlay image, Announcements</Typography>
              </Divider>

              <OverLayImage
                paragraph={data?.overlayImage}
                parentKay="overlayImage"
                handleChange={(newData) =>
                  handleChange({ overlayImage: newData })
                }
              />
            </Card>
          </Col> */}

          {/* Banners */}
          <Col span={24}>
            <Card bordered={false} size="small" className="p-0">
              <Divider>
                <Typography size="xl">Banners</Typography>
              </Divider>

              <Banners
                paragraph={
                  data?.banners || [
                    { description: "", title: "", isButtonShow: null },
                  ]
                } // Initialize with one row
                parentKay="banners"
                handleChange={(newData) => handleChange({ banners: newData })}
              />
            </Card>
          </Col>

          {/* Abou Us */}

          <Col span={24}>
            <Card bordered={false} size="small" className="p-0">
              <Divider>
                <Typography size="xl">About Us</Typography>
              </Divider>

              <AboutUs
                paragraph={data?.aboutUs}
                parentKay="aboutUs"
                handleChange={(newData) => handleChange({ aboutUs: newData })}
              />
            </Card>
          </Col>

          <Col span={24}>
            <Card bordered={false} size="small" className="p-0">
              <Divider>
                <Typography size="xl">Video Banner</Typography>
              </Divider>

              <VideoBanner
                paragraph={data?.videoBanner}
                parentKay="videoBanner"
                handleChange={(newData) => handleChange({ videoBanner: newData })}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card bordered={false} size="small" className="p-0">
              <Divider>
                <Typography size="xl">Fleet</Typography>
              </Divider>

              <Fleets
                paragraph={data?.fleet}
                parentKay="fleet"
                handleChange={(newData) => handleChange({ fleet: newData })}
              />
            </Card>
          </Col>

          <Col span={24}></Col>
        </Row>
      </Form>
    </Modal>
  );
});

function VideoBanner({
  paragraph: data = { title: "", description: "", video: "" },
  handleChange,
}) {
  return (
    <>
      {/* Title Field */}
      <Form.Item
        label="Title"
        rules={[
          {
            required: true,
            message: "Title is required",
          },
        ]}
      >
        <Input
        placeholder="Enter Title"
          value={data?.title}
          onChange={(e) => handleChange({ ...data, title: e.target.value })}
        />
      </Form.Item>

      {/* Paragraph 1 Field */}
      <Form.Item
        label="Description"
        rules={[
          {
            required: true,
            message: "Description is required",
          },
        ]}
      >
        <Input.TextArea
          value={data?.description}
          placeholder="Enter Description"
          rows={2}
          onChange={(e) =>
            handleChange({ ...data, description: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item
        label="Video"
        rules={[
          {
            required: true,
            message: "Image is required",
          },
        ]}
      >
        <UploadImage
          value={data.video ? [data.video] : []}
          onChange={(e) => handleChange({ ...data, video: e?.[0] })}
          listType="picture"
          uploadButton={
            <Tag style={{ width: "100%" }}>
              <Button
                block
                size="large"
                type="link"
                icon={<UploadOutlined />}
                style={{ width: "100%" }}
              >
                Upload Video
              </Button>
            </Tag>
          }
        />
      </Form.Item>
    </>
  );
}

function OverLayImage({
  paragraph: data = { image: "", status: "" },
  handleChange,
}) {
  return (
    <>
      <Row gutter={[23, 23]}>
        <Col span={12}>
          <Form.Item label="Image">
            <UploadImage
              value={data.image ? [data.image] : []}
              onChange={(e) => handleChange({ ...data, image: e?.[0] })}
              listType="picture"
              uploadButton={
                <Tag style={{ width: "100%" }}>
                  <Button
                    block
                    size="large"
                    type="link"
                    icon={<UploadOutlined />}
                    style={{ width: "100%" }}
                  >
                    Upload Thumbnail Image
                  </Button>
                </Tag>
              }
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Status">
            <Select
              value={data.status}
              style={{ marginTop: "10px" }}
              allowClear
              placeholder="Select Overlay Image Active or Inactive"
              onChange={(value) => handleChange({ ...data, status: value })}
            >
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
}

function Specialities({
  paragraph: data = { description: "", specialitiesIds: [], title: "" },
  handleChange,
}) {
  const {
    data: specialities,
    isLoading,
    isError,
    refetch,
  } = useGetSpecialitesQuery({ isAll: 1 });

  return (
    <>
      {/* Title Field */}
      <Form.Item
        label="Title"
        rules={[
          {
            required: true,
            message: "Title is required",
          },
        ]}
      >
        <Input
          value={data?.title}
          onChange={(e) => handleChange({ ...data, title: e.target.value })}
        />
      </Form.Item>

      {/* Paragraph 1 Field */}
      <Form.Item
        label="Description"
        rules={[
          {
            required: true,
            message: "Description is required",
          },
        ]}
      >
        <Input.TextArea
          value={data?.description}
          rows={2}
          onChange={(e) =>
            handleChange({ ...data, description: e.target.value })
          }
        />
      </Form.Item>

      <Form.Item
        label="Select Specialities"
        rules={[
          {
            required: true,
            message: "Description is required",
          },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="Select Specialities Type"
          allowClear
          showSearch
          value={data?.specialitiesIds}
          onChange={(e) => {
            handleChange({
              ...data,
              specialitiesIds: e,
            });
          }}
        >
          {specialities?.data?.map((item) => (
            <Select.Option key={item?._id} value={item?._id}>
              {item?.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
}

function AboutUs({
  paragraph: data = {
    descriptionOne: "",
    title: "",
    cards: [{ title: "", description: "" }],
  },
  handleChange,
}) {
  console.log(data, "about-data");
  return (
    <>
      <Row gutter={[5, 5]}>
        {/* Title Field */}
        <Col span={24}>
          <Form.Item
            label="Title"
            rules={[
              {
                required: true,
                message: "Title is required",
              },
            ]}
          >
            <Input
              value={data?.title}
              onChange={(e) => handleChange({ ...data, title: e.target.value })}
            />
          </Form.Item>
        </Col>
        {/* Paragraph 1 Field */}
        <Col span={24}>
          <Form.Item
            label="Descripton"
            rules={[
              {
                required: true,
                message: "Description is required",
              },
            ]}
          >
            <Input.TextArea
              value={data?.descriptionOne}
              rows={2}
              onChange={(e) =>
                handleChange({ ...data, descriptionOne: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={24}>
        <Form.Item
        label="Image"
        rules={[
          {
            required: true,
            message: "Image is required",
          },
        ]}
      >
        <UploadImage
          value={data.image ? [data.image] : []}
          onChange={(e) => handleChange({ ...data, image: e?.[0] })}
          listType="picture"
          uploadButton={
            <Tag style={{ width: "100%" }}>
              <Button
                block
                size="large"
                type="link"
                icon={<UploadOutlined />}
                style={{ width: "100%" }}
              >
                Upload Thumbnail Image
              </Button>
            </Tag>
          }
        />
      </Form.Item>
        </Col>
     
        <Col span={24}>
        <WHyChooseNks
          paragraph={data?.cards || [{ title: "", description: "" }]}
          handleChange={
            (newData) => handleChange({ ...data, cards: newData }) // FIX: Preserve `title` and `descriptionOne`
          }
        />
        </Col>
      </Row>
    </>
  );
}


function Banners({
  paragraph: data = [
    { description: "asdads", title: "asdad", isButtonShow: null },
  ],
  handleChange,
}) {
  const handleFieldChange = (value, fieldName, index) => {
    const newData = data.map((item, i) =>
      i === index ? { ...item, [fieldName]: value } : item
    );
    handleChange(newData);
  };

  const handleAddRow = () => {
    if (data.length < 5) {
      handleChange([
        ...data,
        { description: "", title: "", isButtonElement: null },
      ]);
    }
  };

  const handleRemoveRow = (index) => {
    handleChange(data.filter((_, idx) => idx !== index));
  };

  return (
    <Table
      bordered
      size="small"
      pagination={false}
      columns={[
        {
          title: "title",
          dataIndex: "title",
          render: (title, _, index) => (
            <Input
              value={title}
              placeholder="Title"
              onChange={(e) =>
                handleFieldChange(e.target.value, "title", index)
              }
            />
          ),
        },

        {
          title: "Description",
          dataIndex: "description",
          render: (description, _, index) => (
            <Input
              value={description}
              placeholder="Description"
              onChange={(e) =>
                handleFieldChange(e.target.value, "description", index)
              }
            />
          ),
        },
        // {
        //   title: "Booking Button",
        //   dataIndex: "isButtonShow",
        //   width: 150,
        //   render: (isButtonShow, _, index) => (
        //     <Select
        //       value={isButtonShow}
        //       allowClear
        //       placeholder="Select Btn Visibility"
        //       onChange={(value) =>
        //         handleFieldChange(value, "isButtonShow", index)
        //       }
        //     >
        //       <Select.Option value={true}>Active</Select.Option>
        //       <Select.Option value={false}>Inactive</Select.Option>
        //     </Select>
        //   ),
        // },

        {
          title: "image",
          dataIndex: "image",
          render: (image, _, index) => (
            <UploadImage
              value={image ? [image] : []}
              onChange={(e) => {
                handleFieldChange(e[0], "image", index);
              }}
              listType="picture"
              uploadButton={
                <Tag style={{ width: "100%" }}>
                  <Button
                    block
                    size="large"
                    type="link"
                    icon={<UploadOutlined />}
                    style={{ width: "100%" }}
                  >
                    Upload Thumbnail Image
                  </Button>
                </Tag>
              }
            />
          ),
        },
        {
          width: 100,
          render: (_, __, index) => (
            <>
              {index + 1 === data?.length && data.length < 5 ? (
                <Button
                  icon={<PlusOutlined />}
                  shape="circle"
                  type="dashed"
                  onClick={handleAddRow}
                />
              ) : null}
              {data?.length > 1 ? (
                <Button
                  icon={<CloseOutlined />}
                  shape="circle"
                  type="dashed"
                  danger
                  className="mx-2"
                  onClick={() => handleRemoveRow(index)}
                />
              ) : null}
            </>
          ),
        },
      ]}
      dataSource={data}
      rowKey={(record, index) => index}
    />
  );
}

// about us
function WHyChooseNks({
  paragraph: data = [{ description: "", title: "" }],
  handleChange,
}) {
  const handleFieldChange = (value, fieldName, index) => {
    const newData = data.map((item, i) =>
      i === index ? { ...item, [fieldName]: value } : item
    );
    handleChange(newData);
  };

  const handleAddRow = () => {
    if (data.length) {
      handleChange([...data, { description: "", title: "" }]);
    }
  };

  const handleRemoveRow = (index) => {
    handleChange(data.filter((_, idx) => idx !== index));
  };


  return (
    <Table
      bordered
      size="small"
      pagination={false}
      columns={[
        {
          title: "title",
          dataIndex: "title",
          render: (title, _, index) => (
            <Input
              value={title}
              placeholder="Title"
              onChange={(e) =>
                handleFieldChange(e.target.value, "title", index)
              }
            />
          ),
        },

        {
          title: "Description",
          dataIndex: "description",
          render: (description, _, index) => (
            <Input
              value={description}
              placeholder="Description"
              onChange={(e) =>
                handleFieldChange(e.target.value, "description", index)
              }
            />
          ),
        },
        // {
        //   title: "image",
        //   dataIndex: "image",
        //   render: (image, _, index) => (
        //     <UploadImage
        //       value={image ? [image] : []}
        //       onChange={(e) => handleFieldChange(e[0], "image", index)}
        //       listType="picture"
        //       uploadButton={
        //         <Tag style={{ width: "100%" }}>
        //           <Button
        //             block
        //             size="large"
        //             type="link"
        //             icon={<UploadOutlined />}
        //             style={{ width: "100%" }}
        //           >
        //             Upload Thumbnail Image
        //           </Button>
        //         </Tag>
        //       }
        //     />
        //   ),
        // },
        {
          width: 100,
          render: (_, __, index) => (
            <>
              {index + 1 === data?.length && data.length < 2 ? (
                <Button
                  icon={<PlusOutlined />}
                  shape="circle"
                  type="dashed"
                  onClick={handleAddRow}
                />
              ) : null}
              {data?.length > 1 ? (
                <Button
                  icon={<CloseOutlined />}
                  shape="circle"
                  type="dashed"
                  danger
                  className="mx-2"
                  onClick={() => handleRemoveRow(index)}
                />
              ) : null}
            </>
          ),
        },
      ]}
      dataSource={data}
      rowKey={(record, index) => index}
    />
  );
}



function Fleets({
  paragraph: data = {
    description: "",
    title: "",
    fleetsImg: [{ title: "", subtitle: "",image:"" }],
  },
  handleChange,
}) {
  console.log(data, "about-data");


  const {
    data: fleets,
    isLoading,
    isError,
    refetch,
  } = useGetFleetPageListQuery({ isAll: 1 });


  return (
    <>
      <Row gutter={[5, 5]}>
        {/* Title Field */}
        <Col span={24}>
          <Form.Item
            label="Title"
            rules={[
              {
                required: true,
                message: "Title is required",
              },
            ]}
          >
            <Input
              value={data?.title}
              placeholder="Enter Title"
              onChange={(e) => handleChange({ ...data, title: e.target.value })}
            />
          </Form.Item>
        </Col>
        {/* Paragraph 1 Field */}
        <Col span={24}>
          <Form.Item
            label="Descripton"
            rules={[
              {
                required: true,
                message: "Description is required",
              },
            ]}
          >
            <Input.TextArea
              value={data?.description}
              placeholder="Enter Description"
              rows={2}
              onChange={(e) =>
                handleChange({ ...data, description: e.target.value })
              }
            />
          </Form.Item>
        </Col>
        <Col span={24}>
        <Form.Item
        label="Select Fleets"
      >
        <Select
          mode="multiple"
          placeholder="Select Fleets"
          allowClear
          showSearch
          value={data?.fleetsImg}
          onChange={(e) => {
            handleChange({
              ...data,
              fleetsImg: e,
            });
          }}
        >
          {fleets?.data?.map((item) => (
            <Select.Option key={item?._id} value={item?._id}>
              {item?.title}
            </Select.Option>
          ))}
        </Select>
        </Form.Item>
        </Col>
      </Row>
    </>
  );
}



function FleetsImg({
  paragraph: data = [{ subtitle: "", title: "",image:"" }],
  handleChange,
}) {
  const handleFieldChange = (value, fieldName, index) => {
    const newData = data.map((item, i) =>
      i === index ? { ...item, [fieldName]: value } : item
    );
    handleChange(newData);
  };
  console.log(data);

  const handleAddRow = () => {
    if (data.length) {
      handleChange([...data, { subtitle: "", title: "",image:""  }]);
    }
  };

  const handleRemoveRow = (index) => {
    handleChange(data.filter((_, idx) => idx !== index));
  };


  return (
    <Table
      bordered
      size="small"
      pagination={false}
      columns={[
        {
          title: "title",
          dataIndex: "title",
          render: (title, _, index) => (
            <Input
              value={title}
              placeholder="Title"

              onChange={(e) =>
                handleFieldChange(e.target.value, "title", index)
              }
            />
          ),
        },

        {
          title: "Sub title",
          dataIndex: "subtitle",
          render: (subtitle, _, index) => (
            <Input
              value={subtitle}
              placeholder="subtitle"
              onChange={(e) =>
                handleFieldChange(e.target.value, "subtitle", index)
              }
            />
          ),
        },
        {
          title: "image",
          dataIndex: "image",
          render: (image, _, index) => (
            <UploadImage
              value={image ? [image] : []}
              onChange={(e) => handleFieldChange(e[0], "image", index)}
              listType="picture"
              uploadButton={
                <Tag style={{ width: "100%" }}>
                  <Button
                    block
                    size="large"
                    type="link"
                    icon={<UploadOutlined />}
                    style={{ width: "100%" }}
                  >
                    Upload Fleet Image
                  </Button>
                </Tag>
              }
            />
          ),
        },
        {
          width: 100,
          render: (_, __, index) => (
            <>
              {index + 1 === data?.length && data.length < 2 ? (
                <Button
                  icon={<PlusOutlined />}
                  shape="circle"
                  type="dashed"
                  onClick={handleAddRow}
                />
              ) : null}
              {data?.length > 1 ? (
                <Button
                  icon={<CloseOutlined />}
                  shape="circle"
                  type="dashed"
                  danger
                  className="mx-2"
                  onClick={() => handleRemoveRow(index)}
                />
              ) : null}
            </>
          ),
        },
      ]}
      dataSource={data}
      rowKey={(record, index) => index}
    />
  );
}
