import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";

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
} from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  QUERY_AUTHOR_KEY,
  QUERY_BRANCH_LIST,
} from "../../../constants/query.constants";
import {
  useBranchDeleteMutation,
  useGetBranchQuery,
} from "../../../query/branch.query";
import UploadImage from "../../../utils/UploadImage";
import util from "../../../utils/util";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { useGetCityQuery } from "../../../query/city.query";
import { useGetAExamQuery } from "../../../query/exam.query";
// import { useGetBlogsQuery } from '../../../query/blog.query';
// import { useGetInstituteQuery } from '../../../query/institute.query';
import { useFormStore } from "../../store/useFormStore";
export const Branch = () => {
  const [qData, setQData] = useState({
    page: 1,
    limit: 20,
    total: 0,
    getTotal: false,
  });
  const { data: authors, isLoading, isError } = useGetBranchQuery(qData);
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const { setFormData } = useFormStore();
  const useDelete = useBranchDeleteMutation();
  const addFormRef = useRef();
  const queryClient = useQueryClient();
  const columns = [
    {
      title: "S.NO",
      render: (_, __, index) => index + 1,
    },

    {
      title: "Name",
      dataIndex: "branchName",
      // width: 300,
    },
    {
      title: "Exams",
      dataIndex: "examDetails",
      render: (examDetails) => {
        if (!examDetails || examDetails.length === 0) return "-";
        return examDetails.map((e) => e.name).join(" , ");
      },
    },
    {
      title: "Publish Date",
      dataIndex: "updatedAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("en-IN") : "-",
    },
    {
      title: "City",
      dataIndex: ["cityDetails","name"],
    },
    {
      title: "Preview Page",
      dataIndex: "slug",
      render: (slug) => {
        if (!slug) return null;
        const url = `https://coachingkhojo.com/institute/${slug}`; // 👈 adjust base path if needed
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
    ,
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (_, { status }) => {
        if (status) {
          return (
            <h1 className="bg-green-200 text-center text-xs rounded py-1 border border-green-300">
              Active
            </h1>
          );
        } else {
          return (
            <h1 className="bg-red-200 text-center text-xs rounded py-1 border border-red-300">
              Inactive
            </h1>
          );
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
              title="Are you sure to delete this Author?"
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
                // navigate(`/institute-section/branch/add-branch`)
                // addFormRef.current.openForm(row);
                setFormData(row); // ✅ save row in Zustand
                navigate("/Branch-section/add-branch");
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
            queryKey: [QUERY_BRANCH_LIST],
            
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
          authors,
        }}
      />
    ),
    showHeader: true,
    footer: () => <MyPagination {...{ qData, setQData }} />,
    // rowSelection: {
    //   onChange: (selectedRowKeys) => {
    //     setSelected(selectedRowKeys);
    //   },
    // },
    // tableLayout: undefined,
  };
  useEffect(() => {
    if (authors && authors.extra) {
      setQData((prevState) => ({
        ...prevState,
        ...authors.extra,
      }));
    }
  }, [authors]);
  return (
    <div>
      <Card
        bordered={false}
        size="small"
        className="p-0"
        title={"Branch Listing"}
      >
        <Table
          {...tableProps}
          pagination={{ position: ["none"], pageSize: qData.limit }}
          columns={columns}
          dataSource={authors?.data?.length ? authors?.data : []}
        />
        {!isLoading && isError && !authors.data.length && <DataNotLoaded />}

        {/* <AddEditFormModal ref={addFormRef} {...{ queryClient }} /> */}
      </Card>
    </div>
  );
};

function Search({ qData, setQData, addFormRef }) {
  const [searchFields, setSearchFields] = useState({});

  // Fetch Exams and Cities
  const { data: examsData, isLoading: isExamsLoading } = useGetAExamQuery({
    isAll: 1,
  });
  const { data: citiesData, isLoading: isCitiesLoading } = useGetCityQuery({
    isAll: 1,
  });

  const handleSearch = () => {
    setQData({ ...qData, ...searchFields, page: 1 });
  };

  return (
    <Form onSubmitCapture={handleSearch}>
      <Row gutter={12} align="middle">
        {/* LEFT SIDE: Search by Name */}
        <Col span={12}>
          <Row gutter={12}>
            <Col span={12}>
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
            <Col span={6}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
            </Col>
          </Row>
        </Col>

        {/* RIGHT SIDE: Filters */}
        <Col span={12} className="flex justify-end gap-4">
          {/* City Filter */}
          <Select
            allowClear
            showSearch
            placeholder="Filter by City"
            loading={isCitiesLoading}
            optionFilterProp="children"
            className="min-w-[180px]"
            value={searchFields.city}
            onChange={(value) => {
              setSearchFields({ ...searchFields, city: value });
              setQData({ ...qData, city: value || undefined, page: 1 });
            }}
          >
            {citiesData?.data?.map((city) => (
              <Select.Option key={city._id} value={city.name}>
                {city.name}
              </Select.Option>
            ))}
          </Select>

          {/* Exam Filter */}
          <Select
            allowClear
            showSearch
            placeholder="Filter by Exam"
            loading={isExamsLoading}
            optionFilterProp="children"
            className="min-w-[180px]"
            value={searchFields.exam}
            onChange={(value) => {
              setSearchFields({ ...searchFields, exam: value });
              setQData({ ...qData, exam: value || undefined, page: 1 });
            }}
          >
            {examsData?.data?.map((exam) => (
              <Select.Option key={exam._id} value={exam.name}>
                {exam.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Form>
  );
}

// const AddEditFormModal = forwardRef((props, ref) => {
//     const { queryClient } = props
//     const [data, setData] = useState({});
//     const [open, setOpen] = useState(false);
//     const useSave = useBranchSaveMutation();
//     const { data: cities, isLoadingCity, isErrorCity } = useGetCityQuery({ isAll: 1 });
//     const { data: exams, isLoadingExam, isErrorExam } = useGetAExamQuery({ isAll: 1 });
//     const { data: blogs, isLoadingBlog, isErrorBlog } = useGetBlogsQuery({ isAll: 1 });
//     const { data: institutes, isLoadingInstitute, isError } = useGetInstituteQuery({ isAll: 1 });

//     useImperativeHandle(ref, () => ({
//         openForm(dt) {
//             setOpen(true);
//             setData(dt ? { ...dt } : { status: true });
//         },
//     }));

//     const handleChange = (value) => {
//         Object.entries(value).forEach(ent => {
//             let varDt = data;
//             const k = ent[0];
//             const v = ent[1];
//             let keys = k.split('.');
//             for (let i = 0; i < keys.length; i++) {
//                 if (i + 1 === keys.length) {
//                     varDt[keys[i]] = v;
//                 } else {
//                     if (typeof varDt[keys[i]] === 'undefined') {
//                         if (parseInt(keys[i + 1]) * 1 >= 0) {
//                             varDt[keys[i]] = [];
//                         } else {
//                             varDt[keys[i]] = {};
//                         }
//                     } varDt = varDt[keys[i]];
//                 }
//             }
//         });
//         setData({ ...data });
//     }

//     const save = () => {
//         useSave.mutate(
//             data,
//             {
//                 onSuccess: (res) => {
//                     message.success('Data saved successfully.');
//                     queryClient.invalidateQueries({
//                         queryKey: [QUERY_AUTHOR_KEY]
//                     })
//                     setOpen(false);

//                 },
//                 onError: (err) => {
//                     if (typeof err.message !== "string") {
//                         message.error(err.message[Object.keys(err.message)[0]][0]);
//                     } else {
//                         message.error(err.message);
//                     }
//                 }
//             }
//         )

//     }
//     useEffect(() => {
//         if (!data._id) {
//             handleChange({ slug: util.removeSpecialChars(data.branchName || "") });
//         }
//     }, [data.branchName]);

// return (
//     <>
//         <Modal
//             title={<span>{data._id ? "Edit " : "Add "} Branch</span>}
//             style={{ top: 20 }}
//             open={open}
//             okText="Save"
//             onOk={save}
//             okButtonProps={{ disabled: useSave.isPending }}
//             onCancel={() => {
//                 setOpen(false);
//             }}
//             destroyOnClose
//             maskClosable={false}
//             width={1000}
//         // className="app-modal-body-overflow"

//         >
//             <Form layout="vertical">
//                 <Row gutter={[12, 0]} align="middle">
//                     <Col span={12}>

//                         <Form.Item label="Select Institute" required>
//                             <Select
//                                 placeholder="Select main institute"
//                                 value={data.instituteId}
//                                 allowClear
//                                 onChange={(v) => {
//                                     handleChange({ instituteId: v });
//                                 }}
//                                 options={institutes?.data?.map((v) => ({
//                                     value: v._id,
//                                     label: v.name,
//                                 }))}
//                             ></Select>
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Description" required>
//                             <TextArea
//                                 type='text'
//                                 placeholder="Type description"
//                                 value={data.description}
//                                 onChange={(e) => {
//                                     handleChange({ description: e.target.value });
//                                 }}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Select City" required>
//                             <Select
//                                 placeholder="Select City"
//                                 value={data.city}
//                                 allowClear
//                                 onChange={(v) => {
//                                     handleChange({ city: v });
//                                 }}
//                                 options={cities?.data?.map((v) => ({
//                                     value: v.name,
//                                     label: v.name,
//                                 }))}
//                             ></Select>
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Branch Name" required>
//                             <Input
//                                 type='text'
//                                 placeholder="Type Branch name e.g unacademy,udemy"
//                                 value={data.branchName}
//                                 onChange={(e) => {
//                                     handleChange({ branchName: e.target.value });
//                                 }}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Established year" required>
//                             <Input
//                                 type='Number'
//                                 maxLength={4}
//                                 placeholder="Type established year e.g 1998,2003"
//                                 value={data.established}
//                                 onChange={(e) => {
//                                     handleChange({ established: e.target.value });
//                                 }}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Slug" required>
//                             <Input
//                                 placeholder="autrl"
//                                 value={data.slug}
//                                 disabled
//                             />
//                         </Form.Item>

//                     </Col>

//                     <Col span={12}>
//                         <Form.Item label="Tagline" required>
//                             <Input
//                                 type='text'
//                                 placeholder="Type tagline here"
//                                 value={data.tagLine}
//                                 onChange={(e) => {
//                                     handleChange({ tagLine: e.target.value });
//                                 }}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Featured" required>
//                             <Select defaultValue={true} value={data.isfeatured} onChange={e => { handleChange({ isfeatured: e }) }} >
//                                 <Select.Option value={true}>Yes</Select.Option>
//                                 <Select.Option value={false}>No</Select.Option>
//                             </Select>
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Status" required>
//                             <Select defaultValue={true} value={data.status} onChange={e => { handleChange({ status: e }) }} >
//                                 <Select.Option value={true}>Active</Select.Option>
//                                 <Select.Option value={false}>Inactive</Select.Option>
//                             </Select>
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Logo" required>
//                             <UploadImage
//                                 value={data.logo ? [data.logo] : []}
//                                 onChange={(v) => {
//                                     setData({ ...data, logo: v?.[0] });
//                                 }}
//                                 listType="picture-card"

//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Pros" required>
//                             <Variant
//                                 variantDetails={data?.pros}
//                                 parentKay="pros"
//                                 handleChange={(newData) =>
//                                     handleChange({ ...data, pros: newData })
//                                 }
//                             // choosedYear={moment(data.year).format("YYYY")}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Cons" required>
//                             <Variant
//                                 variantDetails={data?.cons}
//                                 parentKay="cons"
//                                 handleChange={(newData) =>
//                                     handleChange({ ...data, cons: newData })
//                                 }
//                             // choosedYear={moment(data.year).format("YYYY")}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Center" required>
//                             <Variant
//                                 variantDetails={data?.center}
//                                 parentKay="center"
//                                 handleChange={(newData) =>
//                                     handleChange({ ...data, center: newData })
//                                 }
//                             // choosedYear={moment(data.year).format("YYYY")}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                     <Form.Item label="Select Blog" required>
//                             <Select
//                                 placeholder="blogs"
//                                 value={data.blogId}
//                                 allowClear
//                                 onChange={(v) => {
//                                     handleChange({ blogId: v });
//                                 }}
//                                 options={blogs?.data?.map((v) => ({
//                                     value: v._id,
//                                     label: v.heading,
//                                 }))}
//                             ></Select>
//                         </Form.Item>
//                     </Col>
//                     <Col span={28}>
//                         <Form.Item label="Exam Preparation Provided" required>
//                             <Variant7
//                                 variantDetails={data?.exams}
//                                 parentKay="exams"
//                                 handleChange={(newData) =>
//                                     handleChange({ ...data, exams: newData })
//                                 }
//                             // choosedYear={moment(data.year).format("YYYY")}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={28}>
//                         <Form.Item label="Faculties" required>
//                             <Variant3
//                                 variantDetails={data?.faculties}
//                                 parentKay="faculties"
//                                 handleChange={(newData) =>
//                                     handleChange({ ...data, faculties: newData })
//                                 }
//                             // choosedYear={moment(data.year).format("YYYY")}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={28}>
//                         <Form.Item label="Images" required>
//                             <Variant4
//                                 variantDetails={data?.images}
//                                 parentKay="images"
//                                 handleChange={(newData) =>
//                                     handleChange({ ...data, images: newData })
//                                 }
//                             // choosedYear={moment(data.year).format("YYYY")}
//                             />
//                             {/* <UploadImage
//                            count={10}
//                                 value={data?.images ? [data.images] : []}
//                                 onChange={(v) => {
//                                     alert(v,data.images)
//                                     // setData({ ...data, images: v });
//                                 }}
//                                 listType="picture-card"

//                             /> */}
//                         </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                         <Form.Item label="Videos Link" required>
//                             <Variant
//                                 variantDetails={data?.videos}
//                                 parentKay="videos"
//                                 handleChange={(newData) =>
//                                     handleChange({ ...data, videos: newData })
//                                 }
//                             // choosedYear={moment(data.year).format("YYYY")}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={28}>
//                         <Form.Item label="Location Details" required>
//                             <Variant5
//                                 variantDetails={data?.locationDetails}
//                                 parentKay="locationDetails"
//                                 handleChange={(newData) =>
//                                     handleChange({ ...data, locationDetails: newData })
//                                 }
//                             // choosedYear={moment(data.year).format("YYYY")}
//                             />
//                         </Form.Item>
//                     </Col>
//                     <Col span={28}>
//                         <Form.Item label="FAQs" required>
//                             <Variant6
//                                 variantDetails={data?.faq}
//                                 parentKay="faq"
//                                 handleChange={(newData) =>
//                                     handleChange({ ...data, faq: newData })
//                                 }
//                             // choosedYear={moment(data.year).format("YYYY")}
//                             />
//                         </Form.Item>
//                     </Col>

//                 </Row>
//             </Form>

//         </Modal>
//     </>
// );
// });
