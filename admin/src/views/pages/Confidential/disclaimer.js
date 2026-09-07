import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
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
    Tag
} from "antd";
import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_BLOG_KEY, QUERY_CONFIDENTIAL_LIST } from '../../../constants/query.constants';
import { useGetAuthorsQuery } from '../../../query/author.query';
import TinyMce from "../../../utils/TinyMce";
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import moment from 'moment'
import dayjs from 'dayjs';
import { useGetConfidentialQuery,useConfidentialSaveMutation } from '../../../query/confidential.query';

export const Disclaimer = () => {
    const [qData, setQData] = useState({ page: 1, limit: 20, total: 0, getTotal: false });
    const { data: blogs, isLoading, isError } = useGetConfidentialQuery({...qData,type:"DISCLAIMER"});
    
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
    const { queryClient } = props
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const useSave = useConfidentialSaveMutation();
    const { data: authors, isLoading, isError } = useGetAuthorsQuery({ isAll: 1 });

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(dt ? { ...dt } : { status: true });
        },
    }));

    const handleChange = (value) => {
        Object.entries(value).forEach(ent => {
            let varDt = data;
            const k = ent[0];
            const v = ent[1];
            let keys = k.split('.');
            for (let i = 0; i < keys.length; i++) {
                if (i + 1 === keys.length) {
                    varDt[keys[i]] = v;
                } else {
                    if (typeof varDt[keys[i]] === 'undefined') {
                        if (parseInt(keys[i + 1]) * 1 >= 0) {
                            varDt[keys[i]] = [];
                        } else {
                            varDt[keys[i]] = {};
                        }
                    } varDt = varDt[keys[i]];
                }
            }
        });
        setData({ ...data });
    }



    const save = () => {
        useSave.mutate(
            {...data,type:"DISCLAIMER"},
            {
                onSuccess: (res) => {
                    message.success('Data saved successfully.');
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_CONFIDENTIAL_LIST]
                    })
                    setOpen(false);

                },
                onError: (err) => {
                    if (typeof err.message !== "string") {
                        message.error(err.message[Object.keys(err.message)[0]][0]);
                    } else {
                        message.error(err.message);
                    }
                }
            }
        )

    }
    useEffect(() => {
        if (!data._id) {
            handleChange({ slug: util.removeSpecialChars(data.heading || "") });
        }
    }, [data.heading]);
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
                        {/* <Col span={6}>
                            <Form.Item label="Select Author" required>
                                <Select
                                    placeholder="Rahul Patel"
                                    value={data.authorId}
                                    allowClear
                                    onChange={(v) => {
                                        handleChange({ authorId: v });
                                    }}
                                    options={authors?.data?.map((v) => ({
                                        value: v._id,
                                        label: v.name,
                                    }))}
                                ></Select>
                            </Form.Item>
                        </Col>
                         <Col span={6}>
                            <Form.Item label="Popularity Index" >
                                <Input
                                    placeholder="Enter Number"
                                    value={data.popularityIndex}
                                    type='number'
                                    onChange={(e) => {
                                        handleChange({ popularityIndex: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Heading" required>
                                <Input
                                    placeholder="Enter Heading"
                                    value={data.heading}
                                    onChange={(e) => {
                                        handleChange({ heading: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Slug" required>
                                <Input
                                    placeholder="autrl"
                                    value={data.slug}
                                    onChange={(e) => {
                                        handleChange({ slug: util.removeSpecialChars(e.target.value) });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Short-Description" required>
                                <Input
                                    placeholder="Enter short description"
                                    value={data.shortDescription}
                                    onChange={(e) => {
                                        handleChange({ shortDescription: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Date" required>
                                <DatePicker
                                    placeholder="Select The Blog Post Date"
                                    defaultValue={
                                        data.date &&
                                        dayjs(moment(data.date).format("YYYY-MM-DD"))
                                    }
                                    format="DD MMM YYYY"
                                    disabledDate={(current) =>
                                        current.isBefore(moment(new Date()).subtract(1, "day"))
                                    }
                                    onChange={(e) => {
                                        handleChange({ date: new Date(e) });
                                    }}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Meta-Title" required>
                                <Input
                                    placeholder="Meta-Title"
                                    value={data.metaTitle}
                                    onChange={(e) => {
                                        handleChange({ metaTitle: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Meta-Description" required>
                                <Input
                                    placeholder="Meta-Description"
                                    value={data.metaDescription}
                                    onChange={(e) => {
                                        handleChange({ metaDescription: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col> */}
                        <Col span={8}>
                            <Form.Item label="Status" required>
                                <Select value={data?.status} placeholder="Set Default Product" onChange={e => { handleChange({ status: e }) }} >
                                    <Select.Option value={true}>Active</Select.Option>
                                    <Select.Option value={false}>Inactive</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        
                        <Col span={24}>
                            <Form.Item label="Privacy Policy Data" required>
                                <TinyMce value={data.data} onChange={(v) => { data.data = v }} />
                            </Form.Item>
                        </Col>
                        {/* <Col span={8}>
                            <Form.Item label="Thumbnail Image" required>
                                <UploadImage
                                    value={data.picture ? [data.picture] : []}
                                    onChange={(v) => {
                                        setData({ ...data, picture: v?.[0] });
                                    }}
                                    listType="picture-card"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Feature Image" required>
                                <UploadImage
                                    value={data.featurePicture ? [data.featurePicture] : []}
                                    onChange={(v) => {
                                        setData({ ...data, featurePicture: v?.[0] });
                                    }}
                                    listType="picture-card"
                                />
                            </Form.Item>
                        </Col> */}
                       
                    </Row>
                </Form>
            </Modal>
        </>
    );
});
