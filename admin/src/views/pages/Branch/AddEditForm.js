"use client";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import TinyMce from "../../../utils/TinyMce";
import { z } from "zod";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Collapse,
  Popconfirm,
  Row,
  Select,
  Table,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import {
  QUERY_AUTHOR_KEY,
  QUERY_BRANCH_LIST,
  QUERY_VALIDATE_SERVICE_BRANCH,
} from "../../../constants/query.constants";
import {
  useBranchDeleteMutation,
  useBranchSaveMutation,
  useGetBranchQuery,
} from "../../../query/branch.query";
import { useGetCityQuery } from "../../../query/city.query";
import { useGetAExamQuery } from "../../../query/exam.query";
import { useGetBlogsQuery } from "../../../query/blog.query";
import { useGetInstituteQuery } from "../../../query/institute.query";

import UploadImage from "../../../utils/UploadImage";
import util from "../../../utils/util";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import { useFormStore } from "../../store/useFormStore";
import dayjs from "dayjs";
import moment from "moment";
import axiosInstance from "../../../utils/axios";

const { Panel } = Collapse;

async function getValidate(slug) {
  try {
    const res = await axiosInstance.post(QUERY_VALIDATE_SERVICE_BRANCH, {
      slug,
    });
    return res?.message;
  } catch (error) {
    console.log(error);
    return "Try again later";
  }
}

const branchSchema = z.object({
  instituteId: z.string().min(1, "Institute is required"),
  city: z.string().min(1, "City is required"),
});

export default function AddEditForm({ queryClient }) {
  const { formData, clearFormData, setFormData } = useFormStore();
  const [data, setData] = useState(formData || { status: true });
  const [validated, setValidated] = useState(!!data._id);
  const Navigate = useNavigate();

  const { mutate, isPending } = useBranchSaveMutation();
  const { data: cities } = useGetCityQuery({ isAll: 1 });
  const { data: exams } = useGetAExamQuery({ isAll: 1 });
  const { data: blogs } = useGetBlogsQuery({ isAll: 1 });
  const { data: institutes } = useGetInstituteQuery({ isAll: 1 });

  // keep Zustand in sync
  useEffect(() => {
    setFormData(data);
  }, [data]);

  // reset Zustand when leaving page
  useEffect(() => {
    return () => clearFormData();
  }, []);

  const handleChange = (value) => {
    Object.entries(value).forEach(([k, v]) => {
      let varDt = data;
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
  const save = (draft) => {
    let payload = {};

    if (!data._id && draft) {
      // ✅ Existing record → update using draft values (including status from draft)
      payload = {
        ...data,

        status: draft, // status comes from draft
      };
    } else {
      // ✅ New record → create payload without _id or timestamps
      payload = { ...data };
    }

    mutate(payload, {
      onSuccess: () => {
        message.success(
          data._id ? "Branch updated successfully." : "Data saved successfully."
        );

        if (!data._id) {
          // ✅ only redirect for new branch
          Navigate("/Branch-section/manage-branch");
        }

        // queryClient.invalidateQueries({ queryKey: [ QUERY_BRANCH_LIST] });
      },
      onError: (err) => {
        message.error(err.message || "Save failed");
      },
    });
  };

  useEffect(() => {
    if (!data._id) {
      console.log("running slug");
      const institute = institutes?.data?.find(
        (inst) => inst._id === data?.instituteId
      );
      const instituteName = institute ? institute.name : "";
      // const city = data.city || "";
      console.log("data.city", data.cityId);
      const city = cities?.data?.find((c) => c._id === data?.cityId);
      console.log("city", city);
      const slug = util.removeSpecialChars(`${instituteName}-${city?.slug}`);
      handleChange({ slug });
    }
  }, [data.instituteId, data.cityId, institutes]);

  // validate slug
  const validateBranch = async () => {
    try {
      // const validatedData = branchSchema.parse(data);

      const result = await getValidate(data.slug);
      console.log("validation result:", result);
      if (result == "notfound") {
        message.success("Validation successful. You can now fill the form.");
        setValidated(true);
      } else {
        message.error("Branch already exists for this institute & city.");
        setValidated(false);
      }
    } catch (err) {
      message.error("Please Provide Institute and City.");
      setValidated(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-6">
        {data._id ? "Edit Branch" : "Add Branch"}
      </h2>

      <Form layout="vertical" className="space-y-6">
        {/* Institute + City */}
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[280px]">
            <Form.Item label="Select Institute" required>
              <Select
                placeholder="Select main institute"
                value={data.instituteId}
                allowClear
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                disabled={validated || !!data._id}
                onChange={(v) => handleChange({ instituteId: v })}
                options={institutes?.data?.map((v) => ({
                  value: v._id,
                  label: v.name,
                }))}
              />
            </Form.Item>
          </div>

          <div className="flex-1 min-w-[280px]">
             <Form.Item label="Select City" required>
              <Select
                placeholder="Select main city"
                value={data.cityId}
                allowClear
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                disabled={validated || !!data._id}
                onChange={(v) => handleChange({ instituteId: v })}
                options={cities?.data?.map((v) => ({
                  value: v._id,
                  label: v.name,
                }))}
              />
            </Form.Item>
            {/* <Form.Item label="Select City" required>
              <Select
                placeholder="Select City"
                value={data.cityId}
                allowClear
                disabled={validated || !!data._id}
                onChange={(v) => handleChange({ cityId: v })}
                options={cities?.data?.map((v) => ({
                  value: v._id,
                  label: v.name,
                }))}
              />
            </Form.Item> */}
          </div>
        </div>

        {/* Exam + Slug */}
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[280px]">
            <Form.Item label="Select Exam" required>
              <Select
                placeholder="Select Exam"
                value={data.exams?.map((e) => e.examId)} // show selected exam names
                allowClear
                mode="multiple"
                onChange={(values) => {
                  // map selected values into object format
                  const formattedExams = values.map((exam) => ({
                    examId:exam,
                    featured: false,
                    index: 100,
                    status: true,
                  }));
                  handleChange({ exams: formattedExams });
                }}
                options={exams?.data?.map((v) => ({
                  value: v._id,
                  label: v.name,
                }))}
              />
            </Form.Item>
          </div>

          <div className="flex-1 min-w-[280px]">
            <Form.Item label="Slug" required>
              <Input value={data.slug} disabled />
            </Form.Item>
          </div>
        </div>

        {/* Validate button for new branch */}
        {!data._id && !validated && (
          <div className="flex justify-end">
            <Button type="primary" onClick={() => validateBranch(data.slug)}>
              Validate
            </Button>
          </div>
        )}

        {/* Rest of form only after validation */}

        {(validated || data._id) && (
          <>
            <Collapse accordion defaultActiveKey={["1"]}>
              {/* ---- Rest of your form (branchName, description, tagline, logo, blogData, variants etc.) ---- */}
              {/* Keep exactly what you already have below this point */}
              <Panel header="Top Card Information" key="1">
                <div className="flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[280px]">
                    <Form.Item label="Page Name" required>
                      <Input
                        type="text"
                        placeholder="Type Title  e.g unacademy Delhi"
                        value={data.branchName}
                        onChange={(e) =>
                          handleChange({ branchName: e.target.value })
                        }
                      />
                    </Form.Item>
                  </div>

                  <div className="flex-1 min-w-[280px]">
                    <Form.Item label="Page Description" required>
                      <TextArea
                        placeholder="Type description"
                        value={data.description}
                        onChange={(e) =>
                          handleChange({ description: e.target.value })
                        }
                      />
                    </Form.Item>
                  </div>
                </div>

                {/* Next Row - Tagline + Status */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[280px]">
                    <Form.Item label="Achievement">
                      <Input
                        type="text"
                        placeholder="Type achievement"
                        value={data.tagLine}
                        onChange={(e) =>
                          handleChange({ tagLine: e.target.value })
                        }
                      />
                    </Form.Item>
                  </div>

                  <div className="flex-1 min-w-[280px]">
                    <Form.Item label="Established year">
                      <Input
                        type="number"
                        maxLength={4}
                        placeholder="Type established year e.g 1998"
                        value={data.established}
                        onChange={(e) =>
                          handleChange({ established: e.target.value })
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
                <Divider />
                <Form.Item label="Logo" required>
                  <UploadImage
                    value={data.logo?.url ? [data.logo.url] : []}
                    count={1}
                    onChange={(v) =>
                      setData({
                        ...data,
                        logo: {
                          ...data.logo,
                          url: v?.[v.length - 1] || "", // always take the latest uploaded file
                        },
                      })
                    }
                    listType="picture-card"
                  />

                  <Input
                    placeholder="Alt text"
                    className="mt-2"
                    value={data.logo?.alt}
                    onChange={(e) =>
                      setData({
                        ...data,
                        logo: {
                          ...data.logo,
                          alt: e.target.value,
                        },
                      })
                    }
                  />

                  <Input
                    placeholder="Title"
                    className="mt-2"
                    value={data.logo?.title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        logo: {
                          ...data.logo,
                          title: e.target.value,
                        },
                      })
                    }
                  />

                  <Input.TextArea
                    placeholder="Description"
                    className="mt-2"
                    value={data.logo?.description}
                    onChange={(e) =>
                      setData({
                        ...data,
                        logo: {
                          ...data.logo,
                          description: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Item>
              </Panel>

              <Divider />

              {/* Blog Editor - Full Width */}
              <div className="w-full mt-5">
                <Form.Item label="Blog Editor">
                  <TinyMce
                    value={data.blogData}
                    onChange={(v) => {
                      data.blogData = v;
                    }}
                  />
                </Form.Item>
              </div>

              <Divider />

              <Panel header="Pros & Cons" key="2">
                {/* Variants Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item label="Pros">
                    <Variant
                      variantDetails={data?.pros}
                      parentKay="pros"
                      handleChange={(newData) =>
                        handleChange({ ...data, pros: newData })
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Cons">
                    <Variant
                      variantDetails={data?.cons}
                      parentKay="cons"
                      handleChange={(newData) =>
                        handleChange({ ...data, cons: newData })
                      }
                    />
                  </Form.Item>
                </div>
              </Panel>
              <Divider />

              {/* Full-width Variants */}
              <Panel header="Courses" key="3">
                <Form.Item label="Course & fees">
                  <Variant7
                    variantDetails={data?.courses}
                    parentKay="courses"
                    handleChange={(newData) =>
                      handleChange({ ...data, courses: newData })
                    }
                  />
                </Form.Item>
              </Panel>
              <Divider />

              <Panel header="Faculties" key="4">
                <Form.Item label="Faculties">
                  <Variant3
                    variantDetails={data?.faculties}
                    parentKay="faculties"
                    handleChange={(newData) =>
                      handleChange({ ...data, faculties: newData })
                    }
                  />
                </Form.Item>
              </Panel>
              <Divider />

              <Panel header="Gallery (Images & Videos)" key="5">
                <Form.Item>
                  <Form.Item label="images">
                    <Variant4
                      variantDetails={data?.images}
                      parentKay="images"
                      handleChange={(newData) =>
                        handleChange({ ...data, images: newData })
                      }
                    />
                  </Form.Item>
                </Form.Item>
                <Divider />

                <Form.Item label="Videos Link">
                  <Variant
                    variantDetails={data?.videos}
                    parentKay="videos"
                    handleChange={(newData) =>
                      handleChange({ ...data, videos: newData })
                    }
                  />
                </Form.Item>
              </Panel>
              <Divider />
              <Panel header="Location Details & Centers" key="6">
                <Form.Item label="Location Details" required>
                  <Variant5
                    variantDetails={data?.locationDetails}
                    parentKay="locationDetails"
                    handleChange={(newData) =>
                      handleChange({ ...data, locationDetails: newData })
                    }
                  />
                </Form.Item>
                <Form.Item label="Center" required>
                  <Variant
                    variantDetails={data?.center}
                    parentKay="center"
                    handleChange={(newData) =>
                      handleChange({ ...data, center: newData })
                    }
                  />
                </Form.Item>
              </Panel>

              <Divider />
              <Panel header="FAQs" key="7">
                <Form.Item label="FAQs">
                  <Variant6
                    variantDetails={data?.faq}
                    parentKay="faq"
                    handleChange={(newData) =>
                      handleChange({ ...data, faq: newData })
                    }
                  />
                </Form.Item>
              </Panel>

              <Panel header="SEO Information & Publish Date" key="8">
                <div className="flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[280px]">
                    <Form.Item label="Meta-Title">
                      <Input
                        placeholder="Meta-Title"
                        value={data.metaTitle}
                        onChange={(e) =>
                          handleChange({ metaTitle: e.target.value })
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className="flex-1 min-w-[280px]">
                    <Form.Item label="Meta-Description">
                      <Input
                        placeholder="Meta-Description"
                        value={data.metaDescription}
                        onChange={(e) =>
                          handleChange({ metaDescription: e.target.value })
                        }
                      />
                    </Form.Item>
                  </div>
                </div>

                {/* Row 2: Meta Description + Thumbnail + Feature Image */}
                <div className="flex flex-wrap gap-6">
                 

                  <div className="flex-1 min-w-[280px]">
                    <Form.Item label="Keywords">
                      <Variant8
                        variantDetails={data?.keywords}
                        parentKay="keywords"
                        handleChange={(newData) =>
                          handleChange({ ...data, keywords: newData })
                        }
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div className="flex-1 min-w-[280px]">
                    <Form.Item label="Counts">
                      <Input
                        placeholder="counts"
                        value={data.counts}
                        onChange={(e) =>
                          handleChange({ counts: e.target.value })
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className="flex-1 min-w-[280px]">
                    <Form.Item label="Reviews">
                      <Input
                        placeholder="reviews"
                        value={data.reviews}
                        onChange={(e) =>
                          handleChange({ reviews: e.target.value })
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </>
        )}

        {/* Footer Buttons */}
        {(validated || data._id) && (
          <div className="flex justify-end gap-4 pt-6">
            {!data?._id && <Button onClick={() => save(true)}>Draft</Button>}
            <Button
              type="primary"
              onClick={() => save(true)}
              loading={isPending}
            >
              {data?._id ? "Update" : "Publish"} {/* ✅ change text */}
            </Button>
            {data?._id && (
              <Select
                value={data.status}
                onChange={(v) => handleChange({ status: v })}
                style={{ width: 150 }}
              >
                <Select.Option value={true}>Active</Select.Option>
                <Select.Option value={false}>Inactive</Select.Option>
              </Select>
            )}
            <Select
              value={data.featured || false}
              onChange={(v) => handleChange({ featured: v })}
            >
              <Select.Option value={true}>Yes</Select.Option>
              <Select.Option value={false}>No</Select.Option>
            </Select>
          </div>
        )}
      </Form>
    </div>
  );
}

function Variant({ variantDetails: data, parentKay, handleChange }) {
  // Don’t auto-add row — just normalize when data exists
  const normalizedData = (data && data.length > 0 ? data : []).map((item) =>
    typeof item === "string" ? { heading: item } : item
  );

  const handleFieldChange = (value, fieldName, index) => {
    const newData = normalizedData.map((item, i) => {
      if (i === index) {
        return { ...item, [fieldName]: value };
      }
      return item;
    });
    // send back only array of strings
    handleChange(
      newData.map((item) => item.heading),
      parentKay
    );
  };

  const handleAddRow = () => {
    if (normalizedData.length < 5) {
      const newData = [...normalizedData, { heading: "" }];
      handleChange(
        newData.map((item) => item.heading),
        parentKay
      );
    }
  };

  const handleRemoveRow = (index) => {
    if (normalizedData.length > 0) {
      const newData = normalizedData.filter((_, idx) => idx !== index);
      handleChange(
        newData.map((item) => item.heading),
        parentKay
      );
    }
  };

  // If no rows → show "Add First Point" button instead of empty table
  if (normalizedData.length === 0) {
    return (
      <Button
        className="w-44"
        type="dashed"
        onClick={handleAddRow}
        icon={<PlusOutlined />}
      >
        Add Points
      </Button>
    );
  }

  return (
    <Table
      bordered
      size="small"
      showHeader
      pagination={false}
      columns={[
        {
          title: "Points",
          dataIndex: "heading",
          render: (heading, record, index) => (
            <Input
              placeholder="Enter point"
              value={heading}
              onChange={(e) =>
                handleFieldChange(e.target.value, "heading", index)
              }
            />
          ),
        },
        {
          width: 100,
          render: (_, __, i) => (
            <>
              {i + 1 === normalizedData.length && normalizedData.length < 5 && (
                <Button
                  icon={<PlusOutlined />}
                  shape="circle"
                  type="dashed"
                  onClick={handleAddRow}
                />
              )}
              {normalizedData.length > 0 && (
                <Button
                  icon={<CloseOutlined />}
                  shape="circle"
                  type="dashed"
                  danger
                  className="mx-2"
                  onClick={() => handleRemoveRow(i)}
                />
              )}
            </>
          ),
        },
      ]}
      dataSource={normalizedData}
      rowKey={(_, index) => index}
    />
  );
}



function Variant3({ variantDetails: data, parentKay, handleChange }) {
  const emptyFaculty = {
    name: "",
    subject: "",
    experience: "",
    profileImage: undefined,
    designation: "",
    Link: "",
  };

  const normalizedData = (data && data.length > 0 ? data : []).map((item) => ({
    name: item?.name || "",
    subject: item?.subject || "",
    experience: item?.experience || "",
    profileImage: item?.profileImage ?? undefined,
    designation: item?.designation || "",
    Link: item?.Link || "",
  }));

  const handleFieldChange = (value, fieldName, index) => {
    const newData = normalizedData.map((item, i) =>
      i === index ? { ...item, [fieldName]: value } : item
    );
    handleChange(newData, parentKay);
  };

  const handleAddRow = () => {
    if (normalizedData.length < 5) {
      handleChange([...normalizedData, { ...emptyFaculty }], parentKay);
    }
  };

  const handleRemoveRow = (index) => {
    const newData = normalizedData.filter((_, idx) => idx !== index);
    handleChange(newData, parentKay);
  };

  // if no rows → show "Add Faculty"
  if (normalizedData.length === 0) {
    return (
      <Button
        className="w-44"
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddRow}
      >
        Add Faculty
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {normalizedData.map((faculty, index) => (
        <Card
          key={index}
          size="small"
          title={`Faculty ${index + 1}`}
          extra={
            <>
              {index + 1 === normalizedData.length &&
                normalizedData.length < 5 && (
                  <Button
                    icon={<PlusOutlined />}
                    shape="circle"
                    type="dashed"
                    onClick={handleAddRow}
                  />
                )}
              <Button
                icon={<CloseOutlined />}
                shape="circle"
                type="dashed"
                danger
                className="ml-2"
                onClick={() => handleRemoveRow(index)}
              />
            </>
          }
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Input
                placeholder="Enter name"
                value={faculty.name}
                onChange={(e) =>
                  handleFieldChange(e.target.value, "name", index)
                }
              />
            </Col>
            <Col span={12}>
              <Input
                placeholder="Enter subject"
                value={faculty.subject}
                onChange={(e) =>
                  handleFieldChange(e.target.value, "subject", index)
                }
              />
            </Col>

            <Col span={12}>
              <Input
                placeholder="Enter experience"
                value={faculty.experience}
                onChange={(e) =>
                  handleFieldChange(e.target.value, "experience", index)
                }
              />
            </Col>
            <Col span={12}>
              <UploadImage
                value={faculty.profileImage ? [faculty.profileImage] : []}
                count={1}
                onChange={(v) =>
                  handleFieldChange(
                    v?.[v.length - 1] || undefined,
                    "profileImage",
                    index
                  )
                }
                listType="picture-card"
              />
            </Col>

            <Col span={12}>
              <Input
                placeholder="Enter designation"
                value={faculty.designation}
                onChange={(e) =>
                  handleFieldChange(e.target.value, "designation", index)
                }
              />
            </Col>
            <Col span={12}>
              <Input
                placeholder="Enter profile link"
                value={faculty.Link}
                onChange={(e) =>
                  handleFieldChange(e.target.value, "Link", index)
                }
              />
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
}

function Variant4({ variantDetails: data, parentKay, handleChange }) {
  const normalizedData = Array.isArray(data) ? data : [];

  const updateImageField = (index, field, value) => {
    const updated = [...normalizedData];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    handleChange(updated, parentKay);
  };

  const handleUploadChange = (file, index) => {
    const updated = [...normalizedData];
    updated[index] = {
      ...updated[index],
      url: file, // uploaded image url
    };
    handleChange(updated, parentKay);
  };

  const handleAddRow = () => {
    if (normalizedData.length < 10) {
      handleChange(
        [...normalizedData, { url: "", alt: "", title: "", description: "" }],
        parentKay
      );
    }
  };

  const handleRemoveRow = (index) => {
    const updated = normalizedData.filter((_, i) => i !== index);
    handleChange(updated, parentKay);
  };

  // If no rows → show Add button
  if (normalizedData.length === 0) {
    return (
      <Button
        className="w-44"
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddRow}
      >
        Add Image
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {normalizedData.map((img, index) => (
        <Card
          key={index}
          size="small"
          title={`Image ${index + 1}`}
          extra={
            <>
              {index + 1 === normalizedData.length &&
                normalizedData.length < 10 && (
                  <Button
                    icon={<PlusOutlined />}
                    shape="circle"
                    type="dashed"
                    onClick={handleAddRow}
                  />
                )}
              <Button
                icon={<CloseOutlined />}
                shape="circle"
                type="dashed"
                danger
                className="ml-2"
                onClick={() => handleRemoveRow(index)}
              />
            </>
          }
        >
          <Row gutter={[16, 16]} align="middle">
            <Col span={6}>
              <UploadImage
                value={img.url ? [img.url] : []}
                count={1}
                onChange={(files) =>
                  handleUploadChange(files?.[files.length - 1] || "", index)
                }
                listType="picture-card"
              />
            </Col>

            <Col span={6}>
              <Input
                placeholder="Alt text"
                value={img.alt || ""}
                onChange={(e) => updateImageField(index, "alt", e.target.value)}
              />
            </Col>
            <Col span={6}>
              <Input
                placeholder="Title"
                value={img.title || ""}
                onChange={(e) =>
                  updateImageField(index, "title", e.target.value)
                }
              />
            </Col>
            <Col span={6}>
              <Input.TextArea
                placeholder="Description"
                value={img.description || ""}
                onChange={(e) =>
                  updateImageField(index, "description", e.target.value)
                }
                autoSize={{ minRows: 1, maxRows: 3 }}
              />
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
}

function Variant5({ variantDetails: data, parentKay, handleChange }) {
  // Default location object
  const emptyLocation = {
    link: "",
    phone: "",
    email: "",
    website: "",
    social: {
      linkedin: "",
      fb: "",
      instagram: "",
      twitter: "",
    },
  };

  // Normalize incoming data → ensure it's always an object
  const normalizedData = {
    link: data?.link || "",
    phone: data?.phone || "",
    email: data?.email || "",
    website: data?.website || "",
    social: {
      linkedin: data?.social?.linkedin || "",
      fb: data?.social?.fb || "",
      instagram: data?.social?.instagram || "",
      twitter: data?.social?.twitter || "",
    },
  };

  const handleFieldChange = (value, fieldName, isSocial = false) => {
    let newData;
    if (isSocial) {
      newData = {
        ...normalizedData,
        social: { ...normalizedData.social, [fieldName]: value },
      };
    } else {
      newData = { ...normalizedData, [fieldName]: value };
    }
    handleChange(newData, parentKay);
  };

  return (
    <Card size="small" title="Location Details">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Input
            placeholder="Enter Google Map link"
            value={normalizedData.link}
            onChange={(e) => handleFieldChange(e.target.value, "link")}
          />
        </Col>
        <Col span={12}>
          <Input
            placeholder="Enter phone number"
            value={normalizedData.phone}
            onChange={(e) => handleFieldChange(e.target.value, "phone")}
          />
        </Col>

        <Col span={12}>
          <Input
            placeholder="Enter email"
            value={normalizedData.email}
            onChange={(e) => handleFieldChange(e.target.value, "email")}
          />
        </Col>
        <Col span={12}>
          <Input
            placeholder="Enter website"
            value={normalizedData.website}
            onChange={(e) => handleFieldChange(e.target.value, "website")}
          />
        </Col>

        <Col span={12}>
          <Input
            placeholder="Enter LinkedIn URL"
            value={normalizedData.social.linkedin}
            onChange={(e) =>
              handleFieldChange(e.target.value, "linkedin", true)
            }
          />
        </Col>
        <Col span={12}>
          <Input
            placeholder="Enter Facebook URL"
            value={normalizedData.social.fb}
            onChange={(e) => handleFieldChange(e.target.value, "fb", true)}
          />
        </Col>

        <Col span={12}>
          <Input
            placeholder="Enter Instagram URL"
            value={normalizedData.social.instagram}
            onChange={(e) =>
              handleFieldChange(e.target.value, "instagram", true)
            }
          />
        </Col>
        <Col span={12}>
          <Input
            placeholder="Enter Youtube URL"
            value={normalizedData.social.twitter}
            onChange={(e) => handleFieldChange(e.target.value, "twitter", true)}
          />
        </Col>
      </Row>
    </Card>
  );
}

function Variant6({ variantDetails: data, parentKay, handleChange }) {
  // Default FAQ object
  const emptyFaq = {
    question: "",
    answer: "",
  };

  // Normalize incoming data (empty array allowed now)
  const normalizedData = (data && data.length > 0 ? data : []).map((item) => ({
    question: item?.question || "",
    answer: item?.answer || "",
  }));

  const handleFieldChange = (value, fieldName, index) => {
    const newData = normalizedData.map((item, i) => {
      if (i === index) {
        return { ...item, [fieldName]: value };
      }
      return item;
    });
    handleChange(newData, parentKay); // Keep array of objects
  };

  const handleAddRow = () => {
    if (normalizedData.length < 20) {
      handleChange([...normalizedData, { ...emptyFaq }], parentKay);
    }
  };

  const handleRemoveRow = (index) => {
    const newData = normalizedData.filter((_, idx) => idx !== index);
    handleChange(newData, parentKay);
  };

  // If no FAQs yet → just show "Add FAQ" button
  if (normalizedData.length === 0) {
    return (
      <Button
        type="dashed"
        className="w-44"
        icon={<PlusOutlined />}
        onClick={handleAddRow}
      >
        Add FAQ
      </Button>
    );
  }

  return (
    <Table
      bordered
      size="large"
      showHeader
      pagination={false}
      columns={[
        {
          title: "Question",
          dataIndex: "question",
          render: (value, record, index) => (
            <Input.TextArea
              placeholder="Enter question"
              value={value}
              onChange={(e) =>
                handleFieldChange(e.target.value, "question", index)
              }
            />
          ),
        },
        {
          title: "Answer",
          dataIndex: "answer",
          render: (value, record, index) => (
            <Input.TextArea
              placeholder="Enter answer"
              autoSize={{ minRows: 2, maxRows: 6 }}
              value={value}
              onChange={(e) =>
                handleFieldChange(e.target.value, "answer", index)
              }
            />
          ),
        },
        {
          width: 100,
          render: (_, __, i) => (
            <>
              {i + 1 === normalizedData.length &&
                normalizedData.length < 20 && (
                  <Button
                    icon={<PlusOutlined />}
                    shape="circle"
                    type="dashed"
                    onClick={handleAddRow}
                  />
                )}
              {normalizedData.length > 0 && (
                <Button
                  icon={<CloseOutlined />}
                  shape="circle"
                  type="dashed"
                  danger
                  className="mx-2"
                  onClick={() => handleRemoveRow(i)}
                />
              )}
            </>
          ),
        },
      ]}
      dataSource={normalizedData}
      rowKey={(_, index) => index}
    />
  );
}

function Variant7({ variantDetails: data, parentKay, handleChange }) {
  const { data: exams, isLoadingExam } = useGetAExamQuery({ isAll: 1 });

  const emptyExam = {
    name: "",
    courseName: "",
    description: "",
    mode: "",
    fees: "",
    duration: "",
  };

  const normalizedData = (data && data.length > 0 ? data : []).map((item) => ({
    name: item?.name || "",
    courseName: item?.courseName || "",
    description: item?.description || "",
    mode: item?.mode || "",
    fees: item?.fees || "",
    duration: item?.duration || "",
  }));

  const handleFieldChange = (value, fieldName, index) => {
    const newData = normalizedData.map((item, i) =>
      i === index ? { ...item, [fieldName]: value } : item
    );
    handleChange(newData, parentKay);
  };

  const handleAddRow = () => {
    if (normalizedData.length < 20) {
      handleChange([...normalizedData, { ...emptyExam }], parentKay);
    }
  };

  const handleRemoveRow = (index) => {
    const newData = normalizedData.filter((_, idx) => idx !== index);
    handleChange(newData, parentKay);
  };

  if (normalizedData.length === 0) {
    return (
      <Button
        className="w-44"
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddRow}
      >
        Add Exam
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {normalizedData.map((item, index) => (
        <Card
          key={index}
          size="small"
          title={`Exam ${index + 1}`}
          extra={
            <>
              {index + 1 === normalizedData.length &&
                normalizedData.length < 20 && (
                  <Button
                    icon={<PlusOutlined />}
                    shape="circle"
                    type="dashed"
                    onClick={handleAddRow}
                  />
                )}
              <Button
                icon={<CloseOutlined />}
                shape="circle"
                type="dashed"
                danger
                className="ml-2"
                onClick={() => handleRemoveRow(index)}
              />
            </>
          }
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <label className="block text-sm font-medium mb-1">
                Exam Name
              </label>
              <Select
                placeholder="Select Exam"
                value={item.name || undefined}
                onChange={(val) => handleFieldChange(val, "name", index)}
                style={{ width: "100%" }}
                loading={isLoadingExam}
                options={exams?.data?.map((exam) => ({
                  value: exam.name,
                  label: exam.name,
                }))}
              />
            </Col>
            <Col span={12}>
              <label className="block text-sm font-medium mb-1">
                Course Name
              </label>
              <Input
                placeholder="Enter course name"
                value={item.courseName}
                onChange={(e) =>
                  handleFieldChange(e.target.value, "courseName", index)
                }
              />
            </Col>

            <Col span={12}>
              <label className="block text-sm font-medium mb-1">Mode</label>
              <Select
                placeholder="Select mode"
                value={item.mode || undefined}
                onChange={(val) => handleFieldChange(val, "mode", index)}
                style={{ width: "100%" }}
              >
                <Select.Option value="ONLINE">ONLINE</Select.Option>
                <Select.Option value="OFFLINE">OFFLINE</Select.Option>
                <Select.Option value="HYBRID">HYBRID</Select.Option>
              </Select>
            </Col>
            <Col span={12}>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <Input
                placeholder="Enter duration"
                value={item.duration}
                onChange={(e) =>
                  handleFieldChange(e.target.value, "duration", index)
                }
              />
            </Col>

            <Col span={12}>
              <label className="block text-sm font-medium mb-1">Fees</label>
              <Input
                placeholder="Enter fees"
                type="number"
                value={item.fees}
                onChange={(e) =>
                  handleFieldChange(e.target.value, "fees", index)
                }
              />
            </Col>
            <Col span={12}>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <Input.TextArea
                placeholder="Enter description"
                rows={2}
                value={item.description}
                onChange={(e) =>
                  handleFieldChange(e.target.value, "description", index)
                }
              />
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
}
function Variant8({ variantDetails: data, parentKay, handleChange }) {
  // Normalize incoming data into string array
  const normalizedData = Array.isArray(data)
    ? data.map((item) => (typeof item === "string" ? item : ""))
    : [];

  const handleKeywordChange = (values) => {
    // values is always an array of strings
    handleChange(values, parentKay);
  };

  return (
    <Form.Item label="">
      <Select
        mode="tags"
        style={{ width: "100%" }}
        placeholder="Type and press Enter"
        value={normalizedData} // prefilled when editing
        onChange={handleKeywordChange}
        tokenSeparators={[","]}
        maxTagCount={20} // optional UI limit
      />
    </Form.Item>
  );
}
