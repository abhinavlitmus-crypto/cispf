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
import { QUERY_BLOG_KEY, QUERY_Footer_LIST } from '../../../constants/query.constants';
import { useGetAuthorsQuery } from '../../../query/author.query';
import TinyMce from "../../../utils/TinyMce";
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import moment from 'moment'
import dayjs from 'dayjs';
import { useGetFooterQuery, useFooterSaveMutation } from '../../../query/footer.query';
import { useGetAExamQuery } from '../../../query/exam.query';
import { useGetCityQuery } from '../../../query/city.query';
const { Text } = Typography;

export const Footer = () => {
    const [qData, setQData] = useState({ page: 1, limit: 20, total: 0, getTotal: false });
    const { data: blogs, isLoading, isError } = useGetFooterQuery({ ...qData, type: "DISCLAIMER" });

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


const AddEditFormModal = forwardRef((props, ref) => {
    const { queryClient } = props;
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const useSave = useFooterSaveMutation();

   const { data: examData, isLoading } = useGetAExamQuery({
  isAll: true
});

    const {data:cityData} = useGetCityQuery()

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
                        queryKey: [QUERY_Footer_LIST],
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
                            <VariantFooter
                                value={data.footerLinks || []}
                                onChange={(v) => setData({ ...data, footerLinks: v })}
                                exams={examData?.data}
                                cities={cityData?.data}
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


export default function VariantFooter({ value = [], onChange, exams = [], cities = [] }) {
  const handleAddRow = () => {
    onChange([...value, { exam: "", city: "" }]);
  };

  const handleRemoveRow = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (index, key, val) => {
    const updated = [...value];
    updated[index][key] = val;
    onChange(updated);
  };

  // Get available options for each dropdown to prevent duplicates
  const getAvailableExams = (currentIndex, currentCity) => {
    return exams
      .map((e) => e.name)
      .filter(
        (examName) =>
          !value.some(
            (row, i) =>
              i !== currentIndex && row.exam === examName && row.city === currentCity
          )
      );
  };

  const getAvailableCities = (currentIndex, currentExam) => {
    return cities
      .map((c) => c.name)
      .filter(
        (cityName) =>
          !value.some(
            (row, i) =>
              i !== currentIndex && row.city === cityName && row.exam === currentExam
          )
      );
  };

  return (
    <div className="space-y-3">
      {value.map((row, idx) => (
        <Row gutter={8} key={idx} align="middle">
          <Col flex={1}>
            <Select
              placeholder="Select Exam"
              value={row.exam || undefined}
              onChange={(val) => handleChange(idx, "exam", val)}
              options={getAvailableExams(idx, row.city).map((e) => ({ label: e, value: e }))}
              style={{ width: "100%" }}
            />
          </Col>
          <Col flex={1}>
            <Select
              placeholder="Select City"
              value={row.city || undefined}
              onChange={(val) => handleChange(idx, "city", val)}
              options={getAvailableCities(idx, row.exam).map((c) => ({ label: c, value: c }))}
              style={{ width: "100%" }}
            />
          </Col>
          <Col>
            <Button
              icon={<CloseOutlined />}
              danger
              type="dashed"
              onClick={() => handleRemoveRow(idx)}
            />
          </Col>
        </Row>
      ))}

      <Divider />
      <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddRow}>
        Add Footer Link
      </Button>
    </div>
  );
}

