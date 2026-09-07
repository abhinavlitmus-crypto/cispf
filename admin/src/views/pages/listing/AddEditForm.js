"use client";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TinyMce from "../../../utils/TinyMce";
import {
  Button,
  Divider,
  Col,
  Row,
  Form,
  Table,
  Input,
  message,
  Collapse,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useGetCityQuery } from "../../../query/city.query";
import { useGetAExamQuery } from "../../../query/exam.query";
import UploadImage from "../../../utils/UploadImage";
import util from "../../../utils/util";
import { useFormStore } from "../../store/useFormStore";
import axiosInstance from "../../../utils/axios";
import {
  QUERY_BRANCH_LIST,
  QUERY_VALIDATE_SERVICE_LISTING,
} from "../../../constants/query.constants";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useGetBListingQuery, useListingSaveMutation } from "../../../query/listing.query";
// validate slug on backend

async function getValidate(slug) {
  try {
    const res = await axiosInstance.post(QUERY_VALIDATE_SERVICE_LISTING, {
      slug,
    });
    return res?.message;
  } catch (error) {
    console.log(error);
    return "Try again later";
  }
}

async function getbranch(exam, city) {
  try {
    console.log(exam, city);
    const res = await axiosInstance.get(
      `${QUERY_BRANCH_LIST}/list?exam=${exam}&city=${city}`
    );
    console.log(res);

    return res?.message;
  } catch (error) {
    console.log(error);
    return "Try again later";
  }
}

export default function AddEditForm({ queryClient }) {
  const { formData, clearFormData, setFormData } = useFormStore();
  const Navigate = useNavigate();
  const [data, setData] = useState(() => {
    const initial = formData || { status: true };

    return {
      ...initial,
      examId: initial.exam?._id || initial.examId || null,
      cityId: initial.city?._id || initial.cityId || null,
    };
  });

  const [validated, setValidated] = useState(!!data._id);
  const [, setBranch] = useState([]);
  const { mutate, isPending } = useListingSaveMutation();
  const { data: cities } = useGetCityQuery({ isAll: 1 });
  const { data: exams } = useGetAExamQuery({ isAll: 1 });
  const { data: branches } = useGetBListingQuery({ isAll: 1 });

  useEffect(() => {
    setFormData(data);
  }, [data, setFormData]);

  useEffect(() => {
    return () => clearFormData();
  }, [clearFormData]);

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

  const save = (isDraft = false) => {
    const payload = {
      ...data,
      // status: !isDraft ? false : true, // Draft=false, Publish=true
    };

    mutate(payload, {
      onSuccess: () => {
        message.success(
          data._id ? "Branch updated successfully." : "Data saved successfully."
        );
        if (!data._id) {
          Navigate("/listing/manage-listing");
        }
      },
      onError: (err) => {
        message.error(err?.message || "Save failed");
      },
    });
  };

  const createSlug = () => {
    if (data.examId && data.cityId && exams?.data && cities?.data) {
      const exam = exams?.data?.find((ex) => ex._id === data.examId);
      const examName = exam ? exam.name : "";

      const city = cities?.data?.find((c) => c._id === data.cityId);
      const cityName = city ? city.name : "";

      if (examName && cityName) {
        const slug = util.removeSpecialChars(
          `${examName}-coaching-${cityName}`
        );
        handleChange({ slug });
      }
    }
  };

  const validateBranch = async () => {
    try {
      createSlug();
      const result = await getValidate(data.slug);
      console.log("validation result:", result);
      if (result === "notfound") {
        message.success("Validation successful. You can now fill the form.");
        setValidated(true);

        const list = await getbranch(data.exam, data.city);
        setBranch(list);
      } else {
        message.error("Listing already exists for this exam & city.");
        setValidated(false);
      }
    } catch (err) {
      message.error(
        "Please select Exam and City (and set Publish Date if required)."
      );
      setValidated(false);
    }
  };

  const examOptions =
    exams?.data?.map((v) => ({ value: v._id, label: v.name })) || [];
  const cityOptions =
    cities?.data?.map((v) => ({ value: v._id, label: v.name })) || [];

  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-6">
        {data._id ? "Edit Listing" : "Add Listing"}
      </h2>

      <Form layout="vertical" className="space-y-6">
        {/* Exam & City */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
           <Form.Item label="Select Exam" required>
                        <Select
                          placeholder="Select main Exam"
                          value={data.ex}
                          allowClear
                          showSearch
                          optionFilterProp="label"
                          filterOption={(input, option) =>
                            (option?.label ?? "")
                              .toLowerCase()
                              .includes(input.toLowerCase())
                          }
                          disabled={validated || !!data._id}
                          onChange={(v) => handleChange({ examId: v })}
                          options={examOptions}
                        />
                      </Form.Item>
            {/* <Form.Item label="Select Exam" required>
              <Select
                placeholder="Select Exam"
                value={data.examId}
                allowClear
                disabled={validated || !!data._id}
                onChange={(v) => handleChange({ examId: v })}
                options={examOptions}
              />
            </Form.Item> */}
          </Col>
          <Col xs={24} md={12}>
           <Form.Item label="Select City" required>
                        <Select
                          placeholder="Select main City"
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
                          onChange={(v) => handleChange({ cityId: v })}
                          options={cityOptions}
                        />
                      </Form.Item>
            {/* <Form.Item label="Select City" required>
              <Select
                placeholder="Select City"
                value={data.cityId}
                allowClear
                disabled={validated || !!data._id}
                onChange={(v) => handleChange({ cityId: v })}
                options={cityOptions}
              />
            </Form.Item> */}
          </Col>
        </Row>

        {/* Slug & Publish Date */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item label="Slug">
              <Input value={data.slug} disabled />
            </Form.Item>
          </Col>
          
        </Row>

        {!data._id && !validated && (
          <div className="flex justify-end">
            <Button type="primary" onClick={validateBranch}>
              Validate
            </Button>
          </div>
        )}

        {(validated || data._id) && (
          <>
            <Divider />
            <Col xs={24}>
              <Form.Item label="Listing Description" >
                <TextArea
                  placeholder="Type description"
                  rows={4}
                  value={data.description}
                  onChange={(e) =>
                    handleChange({ description: e.target.value })
                  }
                />
              </Form.Item>
            </Col>

            {/* ✅ SEO Collapse */}
            <Collapse accordion defaultActiveKey={["seo"]}>
              <Collapse.Panel header="SEO Information" key="seo">
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Form.Item label="Meta-Title">
                      <Input
                        placeholder="Meta-Title"
                        value={data.metaTitle}
                        onChange={(e) =>
                          handleChange({ metaTitle: e.target.value })
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item label="Meta-Description">
                      <Input
                        placeholder="Meta-Description"
                        value={data.metaDescription}
                        onChange={(e) =>
                          handleChange({ metaDescription: e.target.value })
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Form.Item label="Keywords" >
                      <Variant8
                        variantDetails={data?.keywords}
                        parentKay="keywords"
                        handleChange={(newData) =>
                          handleChange({ ...data, keywords: newData })
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>

            {/* Editor */}
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item label="Editor">
                  <TinyMce
                    value={data.blogData}
                    onChange={(v) => {
                      data.blogData = v;
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            {/* FAQs */}
            <Collapse accordion>
              <Collapse.Panel header="FAQs" key="faqs">
                <Form.Item label="FAQs" >
                  <Variant6
                    variantDetails={data?.faq}
                    parentKay="faq"
                    handleChange={(newData) =>
                      handleChange({ ...data, faq: newData })
                    }
                  />
                </Form.Item>
              </Collapse.Panel>
            </Collapse>

            {/* Quicklinks */}
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item label="Select QuickLink" >
                  <Select
                    mode="multiple"
                    showSearch
                    placeholder="Select branches"
                    value={data.quickLinks}
                    allowClear
                    optionFilterProp="children"
                    onChange={(v) => {
                      if (v.length > 5) {
                        message.warning(
                          "You can select a maximum of 5 branches only!"
                        );
                        return;
                      }
                      handleChange({ quickLinks: v });
                    }}
                    filterOption={(input, option) => {
                      const label = (option?.label ?? "").toLowerCase();
                      const value = (option?.value ?? "").toLowerCase();
                      return (
                        label.includes(input.toLowerCase()) ||
                        value.includes(input.toLowerCase())
                      );
                    }}
                    options={branches?.data?.map((v) => ({
                      value: v.slug,
                      label: v.name,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item label="Featured Image" >
                  <UploadImage
                    value={
                      data.featuredImage?.url ? [data.featuredImage.url] : []
                    }
                    count={1}
                    onChange={(v) =>
                      setData({
                        ...data,
                        featuredImage: {
                          ...data.featuredImage,
                          url: v?.[v.length - 1] || "",
                        },
                      })
                    }
                    listType="picture-card"
                  />

                  <Input
                    placeholder="Alt text"
                    className="mt-2"
                    value={data.featuredImage?.alt}
                    onChange={(e) =>
                      setData({
                        ...data,
                        featuredImage: {
                          ...data.featuredImage,
                          alt: e.target.value,
                        },
                      })
                    }
                  />

                  <Input
                    placeholder="Title"
                    className="mt-2"
                    value={data.featuredImage?.title}
                    onChange={(e) =>
                      setData({
                        ...data,
                        featuredImage: {
                          ...data.featuredImage,
                          title: e.target.value,
                        },
                      })
                    }
                  />

                  <Input.TextArea
                    placeholder="Description"
                    className="mt-2"
                    value={data.featuredImage?.description}
                    onChange={(e) =>
                      setData({
                        ...data,
                        featuredImage: {
                          ...data.featuredImage,
                          description: e.target.value,
                        },
                      })
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* ✅ Footer Buttons */}
            <div className="flex justify-end items-center gap-4 pt-6">
              {!data?._id && <Button onClick={() => save(false)}>Draft</Button>}
              <Button
                type="primary"
                onClick={() => save(true)}
                loading={isPending}
              >
                {data._id ? "Update" : "Publish"}
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
            </div>
          </>
        )}
      </Form>
    </div>
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
