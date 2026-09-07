import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetUsers, useUserDeleteMutation } from '../../../query/user.query';
import MyPagination from '../../components/Pagination';

import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined
} from "@ant-design/icons";
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
    Tag
} from "antd";
import { QUERY_USER_KEY } from '../../../constants/query.constants';
const UserMain = () => {
    const queryClient = useQueryClient();
    const [params, setParams] = useSearchParams();
    const [qData, setQData] = useState({ page: Number(params.get('page')) || 1, limit: Number(params.get('limit')) || 20, total: 0 });
    const { data: users, isLoading } = useGetUsers(qData);
    const [selected, setSelected] = useState([]);
    const userDeleteMutuation = useUserDeleteMutation();
    const addNewModalRef = useRef(null);
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            // width: 300,
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
            title: "Country",
            dataIndex: "country",
        },
        {
            title: "City",
            dataIndex: "city",
        },
        {
            title: "Action",
            dataIndex: "_id",
            width: 70,
            render: (v, row) => {
                return (
                    <>
                        <Row>
                            <Popconfirm
                                title="Are you sure to delete this user?"
                                onConfirm={() => {
                                    userDeleteMutuation.mutate(
                                        { ids: row._id },
                                        {
                                            onSuccess: () => {
                                                message.success('User Deleted Successfully.')
                                                queryClient.invalidateQueries({ queryKey: [QUERY_USER_KEY] })

                                            },
                                            onError: (err) => {
                                                message.error(err.message)
                                            }
                                        }
                                    )
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    type="primary"
                                    size="small"
                                    danger
                                    className='flex items-center justify-center'
                                    icon={<DeleteOutlined />}
                                />
                                &nbsp;
                            </Popconfirm>
                            &nbsp;

                            <Button
                                type="primary"
                                size="small"
                                className='flex items-center justify-center'
                                icon={<EyeOutlined />}
                                onClick={() => {
                                    addNewModalRef.current.openForm(row);
                                }}
                            />
                        </Row>
                    </>
                );
            },
        },
    ].filter((item) => !item.hidden);

    const tableProps = {
        bordered: true,
        isLoading,
        size: "small",
        title: () => (
            <Search
                {...{
                    // addNewModalRef,
                    selected,
                    // deleteData,
                    qData,
                    setQData,
                }}
            />
        ),
        showHeader: true,
        footer: () => <MyPagination {...{ qData, setQData, setParams, params }} />,
        rowSelection: {
            onChange: (selectedRowKeys) => {
                setSelected(selectedRowKeys);
            },
        },
        tableLayout: undefined,
    };
    useEffect(() => {
        if (users && users.extra) {
            setQData(prevState => ({
                ...prevState,
                ...users.extra
            }));
        }
    }, [users]);
    return (
        <div>
            <Card
                bordered={false}
                size="small"
                title={
                    <>
                        <p>List of Users</p>
                    </>
                }
                extra={
                    <>
                        <Row justify="end" gutter={12}>
                            <Col>
                                {selected.length ? (
                                    <Popconfirm
                                        title="Are you sure to delete these selected images?"
                                        onConfirm={() => {
                                            // deleteData(selected);
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            type="primary"
                                            danger
                                            style={{ float: "right" }}
                                            icon={<DeleteOutlined />}
                                        >
                                            Delete Selected
                                        </Button>
                                    </Popconfirm>
                                ) : null}
                            </Col>
                            {/*<Col>
                                <Button
                                    className='flex items-center'
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        // addNewModalRef.current.openForm();
                                    }}
                                >
                                    Add New
                                </Button>
                            </Col>*/}
                        </Row>
                    </>
                }
            >
                <Table
                    {...tableProps}
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={users?.data?.length ? users.data : []}
                    scroll={{
                        y: "calc(100vh - 340px)",
                        x: "calc(100vw - 387px)",
                    }}
                />
                <AddEditFormModal ref={addNewModalRef} />
            </Card>
        </div>
    )
}

function Search({ qData, setQData }) {
    const [searchFields, setSearchFields] = useState({})
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }
    return (
        <Form onSubmitCapture={handleSearch}>
            <Row gutter={12}>
                <Col span={6}>
                    <Input
                        allowClear
                        placeholder="Search by name or code"
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
        </Form>
    );
}


const AddEditFormModal = forwardRef((props, ref) => {
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    // const useSave = useProductSaveMutation();

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


    return (
        <>
            <Modal
                title={<span>User Detail</span>}
                style={{ top: 20 }}
                open={open}
                okText="Save"
                // okButtonProps={{ disabled: useSave.isPending }}
                footer={null}
                onCancel={() => {
                    setOpen(false);
                }}
                destroyOnClose
                maskClosable={false}
                width={1000}
            // className="app-modal-body-overflow"

            >
                <Form layout="vertical">
                    <Row gutter={[24, 24]}>
                        <Col span={12}>
                            <Form.Item label="Firstname" required>
                                <Input
                                    placeholder="Enter firstname"
                                    value={data?.firstname}
                                    onChange={(e) => {
                                        handleChange({
                                            firstname: e.target.value
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Lastname" required>
                                <Input
                                    placeholder="Enter lastname"
                                    value={data?.lastname}
                                    onChange={(e) => {
                                        handleChange({
                                            lastname: e.target.value
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Phone" required>
                                <Input
                                    placeholder="Enter phone"
                                    value={data?.phone}
                                    onChange={(e) => {
                                        handleChange({
                                            phone: e.target.value
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Email" required>
                                <Input
                                    placeholder="Enter email"
                                    value={data?.email}
                                    onChange={(e) => {
                                        handleChange({
                                            email: e.target.value
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="City" required>
                                <Input
                                    placeholder="Enter city"
                                    value={data?.city}
                                    onChange={(e) => {
                                        handleChange({
                                            city: e.target.value
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Country" required>
                                <Input
                                    placeholder="Enter country"
                                    value={data?.country}
                                    onChange={(e) => {
                                        handleChange({
                                            country: e.target.value
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="3D account number" required>
                                <Input
                                    placeholder="Enter 3d account number"
                                    value={data?.accountNumber}
                                    onChange={(e) => {
                                        handleChange({
                                            accountNumber: e.target.value
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Status" required>
                                <Select

                                    value={data?.status}
                                    onChange={(e) => {
                                        handleChange({
                                            status: e
                                        });
                                    }}

                                    options={[
                                        {
                                            label: "Active",
                                            value: true
                                        },
                                        {
                                            label: "Not Active",
                                            value: false
                                        },
                                    ]}
                                    allowClear
                                    showSearch
                                    optionFilterProp='label'
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Modal>
        </>
    );
});

export default UserMain