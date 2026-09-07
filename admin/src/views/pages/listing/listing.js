import {
  DeleteOutlined,
  EditOutlined,
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
  Fragment,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  QUERY_BLOG_KEY,
  QUERY_LISTING,
} from "../../../constants/query.constants";
import {
  useGetBListingQuery,
  useListingSaveMutation,
  useListingDeleteMutation,
} from "../../../query/listing.query";
import util from "../../../utils/util";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import { useGetCityQuery } from "../../../query/city.query";
import { useGetAExamQuery } from "../../../query/exam.query";
import { useFormStore } from "../../store/useFormStore";
import { useNavigate } from "react-router-dom";

export const Listing = () => {
  const [qData, setQData] = useState({
    page: 1,
    limit: 20,
    total: 0,
    getTotal: false,
  });
  const { data: blogs, isLoading, isError } = useGetBListingQuery(qData);
  const { setFormData } = useFormStore();
  const navigate = useNavigate();

  const useDelete = useListingDeleteMutation();
  const addFormRef = useRef();
  const queryClient = useQueryClient();
  const columns = [
    {
      title: "S.NO",
      render: (_, __, index) => index + 1,
    },

    {
      title: "Exam",
      dataIndex: "exam", // keep base object
      render: (exam) => exam?.name || "-",
    },
    {
      title: "City",
      dataIndex: "city",
      render: (city) => city?.name || "-",
    },
    {
      title: "Publish Data",
      dataIndex: "updatedAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("en-IN") : "-",
    },

    {
      title: "Tagline",
      dataIndex: "slug",
      render: (slug) => {
        if (!slug) return null;
        const url = `https://coachingkhojo.com/${slug}`; // 👈 adjust base path if needed
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            preview link
          </a>
        );
      },
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
           {util.checkRightAccess("SuperAdmin") && <Popconfirm
              title="Are you sure to delete this Blog?"
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
            </Popconfirm>}

            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setFormData(row); // ✅ save row in Zustand
                navigate("/listing"); // ✅ navigate to edit page
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
            queryKey: [QUERY_LISTING],
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
          // selected,
          qData,
          setQData,
          blogs,
        }}
      />
    ),
    showHeader: true,
    footer: () => <MyPagination {...{ qData, setQData }} />,

    tableLayout: undefined,
  };
  useEffect(() => {
    if (blogs && blogs.extra) {
      setQData((prevState) => ({
        ...prevState,
        ...blogs.extra,
      }));
    }
  }, [blogs]);
  return (
    <div>
      <Card bordered={false} size="small" className="p-0" title={"Blogs List"}>
        <Table
          {...tableProps}
          pagination={{ position: ["none"], pageSize: qData.limit }}
          columns={columns}
          dataSource={blogs?.data?.length ? blogs?.data : []}
        />
        {!isLoading && isError && !blogs.data.length && <DataNotLoaded />}

        <AddEditFormModal ref={addFormRef} {...{ queryClient }} />
      </Card>
    </div>
  );
};

function Search({ qData, setQData, addFormRef }) {
  const [searchFields, setSearchFields] = useState({});
  const handleSearch = () => {
    setQData({ ...qData, ...searchFields, page: 1 });
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

        {/* {<Col span={6}>
                    <Col span={24} className='flex items-center w-full gap-x-4 justify-end'>
                        <Col span={12} className='flex justify-end !p-0 max-w-fit'>
                            <Button type="primary" onClick={() => {
                                addFormRef.current.openForm()
                            }}>
                                Add New
                            </Button>
                        </Col>
                    </Col>
                </Col>} */}
      </Row>
    </Form>
  );
}

const AddEditFormModal = forwardRef((props, ref) => {
  const { queryClient } = props;
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const useSave = useListingSaveMutation();
  const { data: cities } = useGetCityQuery({ isAll: 1 });
  const { data: exams } = useGetAExamQuery({ isAll: 1 });

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { ...dt } : { status: true });
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
      onSuccess: (res) => {
        message.success("Data saved successfully.");
        queryClient.invalidateQueries({
          queryKey: [QUERY_BLOG_KEY],
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
  useEffect(() => {
    if (!data._id && data.examId && data.cityId) {
      const examName =
        exams?.data?.find((e) => e._id === data.examId)?.name || "";
      const cityName =
        cities?.data?.find((c) => c._id === data.cityId)?.name || "";

      if (examName && cityName) {
        const slugBase = `${examName}-${cityName}`;
        handleChange({ slug: util.removeSpecialChars(slugBase.toLowerCase()) });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.examId, data.cityId, exams, cities]);

  // useEffect(() => {
  //     if (!data._id) {
  //         handleChange({ slug: util.removeSpecialChars(data.heading || "") });
  //     }
  // }, [data.heading]);
  return (
    <>
      <Modal
        title={<span>{data._id ? "Edit " : "Add "} Product</span>}
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
          <Row gutter={[12, 0]}>
            <Col span={6}>
              <Form.Item label="Select Exam" required>
                <Select
                  placeholder="Rahul Patel"
                  value={data.examId}
                  allowClear
                  onChange={(v) => {
                    handleChange({ examId: v });
                  }}
                  options={exams?.data?.map((v) => ({
                    value: v._id,
                    label: v.name,
                  }))}
                ></Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Select City" required>
                <Select
                  placeholder="e.g New Delhi , punjab"
                  value={data.cityId}
                  allowClear
                  onChange={(v) => {
                    handleChange({ cityId: v });
                  }}
                  options={cities?.data?.map((v) => ({
                    value: v._id,
                    label: v.name,
                  }))}
                ></Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Tagline" required>
                <Input
                  placeholder="Enter short description"
                  value={data.tagLine}
                  onChange={(e) => {
                    handleChange({ tagLine: e.target.value });
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Slug" required>
                <Input placeholder="autrl" value={data.slug} disabled />
              </Form.Item>
            </Col>

            {/* <Col span={6}>
                            <Form.Item label="Select Blog" required>
                                <Select
                                    placeholder=""
                                    value={data.blogId}
                                    allowClear
                                    onChange={(v) => {
                                        handleChange({ blogId: v });
                                    }}
                                    options={blogs?.data?.map((v) => ({
                                        value: v._id,
                                        label: v.heading,
                                    }))}
                                ></Select>
                            </Form.Item>
                        </Col> */}

            <Col span={8}>
              <Form.Item label="Status" required>
                <Select
                  value={data?.status}
                  placeholder="Set Default Product"
                  onChange={(e) => {
                    handleChange({ status: e });
                  }}
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
