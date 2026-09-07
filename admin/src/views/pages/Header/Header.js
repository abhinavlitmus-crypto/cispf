import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
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
    DatePicker,
    Tag,
    Typography
} from "antd";

import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_BLOG_KEY, QUERY_HEADER_LIST } from '../../../constants/query.constants';
import { useGetAuthorsQuery } from '../../../query/author.query';
import TinyMce from "../../../utils/TinyMce";
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import moment from 'moment'
import dayjs from 'dayjs';
import { useGetHeaderQuery, useHeaderSaveMutation } from '../../../query/header.query';
import { useGetAExamQuery } from '../../../query/exam.query';
import { useGetCityQuery } from '../../../query/city.query';
const { Text } = Typography;

export const Header = () => {
    const [qData, setQData] = useState({ page: 1, limit: 20, total: 0, getTotal: false });
    const { data: blogs, isLoading, isError } = useGetHeaderQuery({ ...qData, type: "DISCLAIMER" });

    const addFormRef = useRef();
    const queryClient = useQueryClient()
    const columns = [

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
                        {/*   */}

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



    const tableProps = {
        bordered: true,
        loading: isLoading,
        size: "small",

        showHeader: true,
        footer: () => <MyPagination {...{ qData, setQData }} />,

        tableLayout: undefined,
    };
    useEffect(() => {
        if (blogs && blogs.extra) {
            setQData(prevState => ({
                ...prevState,
                ...blogs.extra
            }));
        }
    }, [blogs]);
    return (
        <div>
            <Card
                bordered={false}
                size="small"
                className='p-0'
                title={"Disclaimer"}
            >
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
    )
}

const { Option } = Select;
const AddEditFormModal = forwardRef((props, ref) => {
    const { queryClient } = props;
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const useSave = useHeaderSaveMutation();
  
    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(dt ? { ...dt } : { status: true, categories: [] });
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
        useSave.mutate(
            { ...data, type: "HEADER_LINKS" },
            {
                onSuccess: () => {
                    message.success("Data saved successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_HEADER_LIST],
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
            }
        );
    };

    return (
        <Modal
            title={<span>{data._id ? "Edit " : "Add "} Header Links</span>}
            style={{ top: 20 }}
            open={open}
            okText="Save"
            onOk={save}
            okButtonProps={{ disabled: useSave.isPending }}
            onCancel={() => setOpen(false)}
            destroyOnClose
            maskClosable={false}
            width={1000}
        >
            <Form layout="vertical">
                <Row gutter={[12, 0]}>
                    <Col span={24}>
                        <Form.Item label="Header Links" required>
                            <VariantHeader
                                value={data.categories || []}
                                onChange={(v) => handleChange({ categories: v })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Status" required>
                            <Select
                                value={data?.status}
                                placeholder="Set Status"
                                onChange={(v) => handleChange({ status: v })}
                            >
                                <Select.Option value={true}>Active</Select.Option>
                                <Select.Option value={false}>Inactive</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>


                </Row>
            </Form>
        </Modal>
    );
});




export default function VariantHeader({ value = [], onChange }) {
  // ✅ Random / sample data
  

   const { data: cityList } = useGetCityQuery({ isAll: 1 });
    const { data: examList } = useGetAExamQuery({ isAll: 1 });
   
  // ==========================
  //        HANDLERS
  // ==========================
  const handleAddHeader = () => {
    onChange([...value, { name: "", subcategories: [] }]);
  };

  const handleRemoveHeader = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (index, val) => {
    const updated = [...value];
    updated[index].name = val;
    onChange(updated);
  };

  const handleAddSub = (headerIndex) => {
    const updated = [...value];
    updated[headerIndex].subcategories.push({ name: "", items: [] });
    onChange(updated);
  };

  const handleRemoveSub = (headerIndex, subIndex) => {
    const updated = [...value];
    updated[headerIndex].subcategories =
      updated[headerIndex].subcategories.filter((_, i) => i !== subIndex);
    onChange(updated);
  };

  const handleSubChange = (headerIndex, subIndex, val) => {
    const updated = [...value];
    updated[headerIndex].subcategories[subIndex].name = val;
    onChange(updated);
  };

  const handleAddItem = (headerIndex, subIndex) => {
    const updated = [...value];
    updated[headerIndex].subcategories[subIndex].items.push({
      examId: null,
      cityId: null,
    });
    onChange(updated);
  };

  const handleRemoveItem = (headerIndex, subIndex, itemIndex) => {
    const updated = [...value];
    updated[headerIndex].subcategories[subIndex].items =
      updated[headerIndex].subcategories[subIndex].items.filter(
        (_, i) => i !== itemIndex
      );
    onChange(updated);
  };

  const handleItemChange = (headerIndex, subIndex, itemIndex, key, val) => {
    const updated = [...value];
    updated[headerIndex].subcategories[subIndex].items[itemIndex][key] = val;
    onChange(updated);
  };

  // ==========================
  //        RENDER
  // ==========================
  return (
    <div className="space-y-4">
      {value.map((header, hIdx) => (
        <Card
          key={hIdx}
          title={
            <input
              className="ant-input"
              placeholder="Enter Header Name"
              value={header.name}
              onChange={(e) => handleHeaderChange(hIdx, e.target.value)}
            />
          }
          extra={
            <Button
              icon={<CloseOutlined />}
              shape="circle"
              danger
              type="dashed"
              onClick={() => handleRemoveHeader(hIdx)}
            />
          }
        >
          {header.subcategories.map((sub, sIdx) => (
            <Card
              key={sIdx}
              size="small"
              className="mb-2"
              title={
                <input
                  className="ant-input"
                  placeholder="Enter Subcategory Name"
                  value={sub.name}
                  onChange={(e) => handleSubChange(hIdx, sIdx, e.target.value)}
                />
              }
              extra={
                <Button
                  icon={<CloseOutlined />}
                  shape="circle"
                  danger
                  type="dashed"
                  onClick={() => handleRemoveSub(hIdx, sIdx)}
                />
              }
            >
              {sub.items.map((item, iIdx) => (
                <Row key={iIdx} gutter={8} align="middle" className="mb-2">
                  {/* Exam Dropdown */}
                  <Col flex="200px">
                    <Select
                      placeholder="Select Exam"
                      style={{ width: "100%" }}
                      value={item.examId || undefined}
                      onChange={(v) =>
                        handleItemChange(hIdx, sIdx, iIdx, "examId", v)
                      }
                    >
                      {examList?.data?.map((exam) => (
                        <Option key={exam._id} value={exam._id}>
                          {exam.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>

                  {/* City Dropdown */}
                  <Col flex="200px">
                    <Select
                      placeholder="Select City"
                      style={{ width: "100%" }}
                      value={item.cityId || undefined}
                      onChange={(v) =>
                        handleItemChange(hIdx, sIdx, iIdx, "cityId", v)
                      }
                    >
                      {cityList?.data?.map((city) => (
                        <Option key={city._id} value={city._id}>
                          {city.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>

                  <Col>
                    <Button
                      icon={<CloseOutlined />}
                      shape="circle"
                      danger
                      type="dashed"
                      onClick={() => handleRemoveItem(hIdx, sIdx, iIdx)}
                    />
                  </Col>
                </Row>
              ))}

              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => handleAddItem(hIdx, sIdx)}
              >
                Add Item
              </Button>
            </Card>
          ))}

          <Divider />
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => handleAddSub(hIdx)}
          >
            Add Subcategory
          </Button>
        </Card>
      ))}

      <Divider />
      <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddHeader}>
        Add Header
      </Button>
    </div>
  );
}

