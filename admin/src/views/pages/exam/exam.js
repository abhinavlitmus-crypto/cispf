import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
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
    Table
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_EXAM_LIST } from '../../../constants/query.constants';
import { useExamDeleteMutation, useExamMutation, useGetAExamQuery } from '../../../query/exam.query';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';

export const Exam = () => {
    const [qData, setQData] = useState({ page: 1, limit: 20, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetAExamQuery(qData);
    // const [selected, setSelected] = useState([]);
    const useDelete = useExamDeleteMutation();
    const addFormRef = useRef();
    const queryClient = useQueryClient()
    const columns = [

        {
            title: "Exam Name",
            dataIndex: "name",
            // width: 300,
        },




        {
            title: "Status",
            dataIndex: "status",
            width: 100,
            render: (_, { status }) => {
                if (status) {
                    return <h1 className='bg-green-200 text-center text-xs rounded py-1 border border-green-300'>Active</h1>;
                } else {
                    return <h1 className='bg-red-200 text-center text-xs rounded py-1 border border-red-300'>Inactive</h1>;
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
                        <Popconfirm
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
                        </Popconfirm>
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
                        queryKey: [QUERY_EXAM_LIST],
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
                    authors
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
        if (authors && authors.extra) {
            setQData(prevState => ({
                ...prevState,
                ...authors.extra
            }));
        }
    }, [authors]);
    return (
        <div>
            <Card
                bordered={false}
                size="small"
                className='p-0'
                title={"Authors List"}
            >
                <Table
                    {...tableProps}
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={authors?.data?.length ? authors?.data : []}
                />
                {!isLoading && isError && !authors.data.length && <DataNotLoaded />}

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
    const useSave = useExamMutation();

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
                        queryKey: [QUERY_EXAM_LIST]
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
            handleChange({ slug: util.removeSpecialChars(data.name || "") });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.name]);
    return (
        <>
            <Modal
                title={<span>{data._id ? "Edit " : "Add "} Exam</span>}
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
                    <Row gutter={[12, 0]} align="middle">
                        <Col span={12}>
                            <Form.Item label="Exam Name" required>
                                <Input
                                    type='text'
                                    placeholder="Type city name e.g New Delhi,Mumbai"
                                    value={data.name}
                                    onChange={(e) => {
                                        handleChange({ name: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Slug" required>
                                <Input
                                    placeholder="autrl"
                                    value={data.slug}
                                    disabled
                                />
                            </Form.Item>

                        </Col>
                        <Col span={12}>
                            <Form.Item label="Status" required>
                                <Select defaultValue={true} value={data.status} onChange={e => { handleChange({ status: e }) }} >
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
