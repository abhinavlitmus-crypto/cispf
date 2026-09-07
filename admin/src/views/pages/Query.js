import { DeleteOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Popconfirm,
    Row,
    Table
} from "antd";
import React, { useEffect, useRef, useState } from 'react';
import { QUERY_QUERY_KEY } from '../../constants/query.constants';
import { useGetUserQueryQuery, useQueryDeleteMutation } from '../../query/query.query';
import DataNotLoaded from '../components/DataNotLoaded';
import MyPagination from '../components/Pagination';
export const UserQuery = () => {
    const [qData, setQData] = useState({ page: 1, limit: 20, total: 0, getTotal: false });
    const { data: queries, isLoading, isError } = useGetUserQueryQuery(qData);
    const [selected, setSelected] = useState([]);
    const useDelete = useQueryDeleteMutation();
    const addFormRef = useRef();
    const queryClient = useQueryClient()
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        {
            title: "Message",
            dataIndex: "message",
        },
        {
            title: "Actions",
            dataIndex: "_id",
            width: 50,
            render: (v, row) => (
                <>
                    <Popconfirm
                        title="Are you sure to delete this data?"
                        onConfirm={() => {
                            deleteModel(row._id);
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
                </>
            )
        },
    ].filter((item) => !item.hidden);


    const deleteModel = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: (res) => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_QUERY_KEY],
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
                    selected,
                    qData,
                    setQData,
                    queries
                }}
            />
        ),
        showHeader: true,
        footer: () => <MyPagination {...{ qData, setQData }} />,
        rowSelection: {
            onChange: (selectedRowKeys) => {
                setSelected(selectedRowKeys);
            },
        },
        tableLayout: undefined,
    };
    useEffect(() => {
        if (queries && queries.extra) {
            setQData(prevState => ({
                ...prevState,
                ...queries.extra
            }));
        }
    }, [queries]);
    return (
        <div>
            <Card
                bordered={false}
                size="small"
                className='p-0'
                title={"Queries List"}
            >
                <Table
                    {...tableProps}
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={queries?.data?.length ? queries.data : []}
                />
                {!isLoading && isError && !queries.data.length && <DataNotLoaded />}
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
            </Row >
        </Form >
    );
}
