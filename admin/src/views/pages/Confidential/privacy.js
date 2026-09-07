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

export const Privacy = () => {
    const [qData, setQData] = useState({ page: 1, limit: 20, total: 0, getTotal: false });
    const { data: blogs, isLoading, isError } = useGetConfidentialQuery({...qData,type:"PRIVACY"});
    // const [selected, setSelected] = useState([]);
    // const useDelete = useBlogDeleteMutation();
    const addFormRef = useRef();
    const queryClient = useQueryClient()
    const columns = [
        // {
        //    title:"S.NO",
        //    render: (_, __, index) => index + 1,

        // },
  
        // {
        //     title: "Thumbnail Image",
        //     dataIndex: "picture",
        //     render: (v) => <Image src={v} width={80} />,
        //     width: 150,

        // },
        // {
        //     title: "Heading",
        //     dataIndex: "heading",
        // },
        // {
        //     title: "Short-Description",
        //     dataIndex: "shortDescription",
        //     width: 300,

        // },
        // {
        //     title: "Author",
        //     dataIndex: "authorDetails",
        //     render: (v) => v?.name
        // },
        // {
        //     title: "Date",
        //     dataIndex: "date",
        //     render: (v) => moment(new Date(v)).format("DD MMM YYYY"),
        // },
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


    // const deleteData = (id) => {
    //     useDelete.mutate(
    //         { ids: id },
    //         {
    //             onSuccess: (res) => {
    //                 message.success("Data deleted successfully.");
    //                 queryClient.invalidateQueries({
    //                     queryKey: [QUERY_BLOG_KEY],
    //                 })
    //             },
    //             onError: (err) => {
    //                 message.error(err.message);
    //             }
    //         }
    //     )
    // }
    const tableProps = {
        bordered: true,
        loading: isLoading,
        size: "small",
        // title: () => (
        //     <Search
        //         {...{
        //             addFormRef,
        //             // selected,
        //             qData,
        //             setQData,
        //             blogs
        //         }}
        //     />
        // ),
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
                title={"Privacy Policy"}
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

function Search({ qData, setQData, addFormRef }) {
    const [searchFields, setSearchFields] = useState({})
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }
    return (
        <Form onSubmitCapture={handleSearch}>
            <Col span={24} className='flex items-center w-full gap-x-4 justify-end'>
                        <Col span={12} className='flex justify-end !p-0 max-w-fit'>
                            <Button type="primary" onClick={() => {
                                addFormRef.current.openForm()
                            }}>
                                Edit
                            </Button>
                        </Col>
                    </Col>
           
        </Form >
    );
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
            {...data,type:"PRIVACY"},
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
                       
                       
                    </Row>
                </Form>
            </Modal>
        </>
    );
});