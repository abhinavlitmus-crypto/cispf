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
import { QUERY_BLOG_KEY } from '../../../constants/query.constants';
import { useBlogDeleteMutation, useBlogSaveMutation, useGetBlogsQuery } from '../../../query/blog.query';
import { useGetAuthorsQuery } from '../../../query/author.query';
import TinyMce from "../../../utils/TinyMce";
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import moment from 'moment'
import dayjs from 'dayjs';

export const Blog = () => {
    const [qData, setQData] = useState({ page: 1, limit: 20, total: 0, getTotal: false });
    const { data: blogs, isLoading, isError } = useGetBlogsQuery(qData);

   console.log("data",blogs)
    const useDelete = useBlogDeleteMutation();
    const addFormRef = useRef();
    const queryClient = useQueryClient()
    const columns = [
        {
           title:"S.NO",
           render: (_, __, index) => index + 1,

        },
  
        {
            title: "Thumbnail Image",
            dataIndex: "picture",
            render: (v) => <Image src={v} width={80} />,
            width: 150,

        },
        {
            title: "Heading",
            dataIndex: "heading",
        },
        {
            title: "Short-Description",
            dataIndex: "shortDescription",
            width: 300,

        },
        
        {
            title: "Date",
            dataIndex: "date",
            render: (v) => moment(new Date(v)).format("DD MMM YYYY"),
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
                                addFormRef.current.openForm(row);
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
                        queryKey: [QUERY_BLOG_KEY],
                    })
                },
                onError: (err) => {
                    message.error(err.message);
                }
            }
        )
    }
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
                    blogs
                }}
            />
        ),
        showHeader: true,
        footer: () => <MyPagination {...{ qData, setQData }} />,
        // rowSelection: {
        //     onChange: (selectedRowKeys) => {
        //         setSelected(selectedRowKeys);
        //     },
        // },
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
                title={"Blogs List"}
            >
                <Table
                    {...tableProps}
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={(blogs?.data?.length) ? blogs?.data : []}
                />
                {!isLoading && isError && !blogs.data.length && <DataNotLoaded />}

                <AddEditFormModal ref={addFormRef} {...{ queryClient }} />
            </Card>
        </div>
    )
}

function Search({ qData, setQData, addFormRef }) {
    const [searchFields, setSearchFields] = useState({})
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }
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
                                }

                                }
                            />
                        </Col>
                        <Col span={3}>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Col>

                {<Col span={6}>
                    <Col span={24} className='flex items-center w-full gap-x-4 justify-end'>
                        <Col span={12} className='flex justify-end !p-0 max-w-fit'>
                            <Button type="primary" onClick={() => {
                                addFormRef.current.openForm()
                            }}>
                                Add New
                            </Button>
                        </Col>
                    </Col>
                </Col>}
            </Row >
        </Form >
    );
}


const AddEditFormModal = forwardRef((props, ref) => {
    const { queryClient } = props
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const useSave = useBlogSaveMutation();
    // const { data: authors, isLoading, isError } = useGetAuthorsQuery({ isAll: 1 });

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
            data,
            {
                onSuccess: (res) => {
                    message.success('Data saved successfully.');
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_BLOG_KEY]
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
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Status" required>
                                <Select value={data?.status} placeholder="Set Default Product" onChange={e => { handleChange({ status: e }) }} >
                                    <Select.Option value={true}>Active</Select.Option>
                                    <Select.Option value={false}>Inactive</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        
                        <Col span={24}>
                            <Form.Item label="Description" required>
                                <TinyMce value={data.description} onChange={(v) => { data.description = v }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
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
                        </Col>
                       
                    </Row>
                </Form>
            </Modal>
        </>
    );
});