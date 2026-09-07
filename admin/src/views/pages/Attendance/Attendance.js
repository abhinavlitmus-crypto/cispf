import { DeleteOutlined, EditOutlined, FilterOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';

import {
    Avatar,
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
    Table,
    InputNumber,
    DatePicker,
    Popover,
    List,
    Tag,
    Timeline,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_AUTHOR_KEY, QUERY_ATTENDANCE_KEY } from '../../../constants/query.constants';
import { useAttendanceDeleteMutation, useAttendanceSaveMutation, useGetAttendanceQuery } from '../../../query/attendance.query'
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import dayjs from 'dayjs';
import moment from 'moment';

export const Attendance = () => {
    const [qData, setQData] = useState({ page: 1, limit: 30, total: 0, getTotal: false });
    const getISTMidnightUTC = () => {
        const now = new Date();

        // Create IST midnight
        const istMidnight = new Date(
            Date.UTC(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                -5,
                -30,
                0,
                0
            )
        );

        // Format like: 2026-01-01T18:30:00.000+00:00
        return istMidnight.toISOString().replace("Z", "+00:00");
    };

    const [selected, setSelected] = useState(getISTMidnightUTC());


    const { data: authors, isLoading, isError } = useGetAttendanceQuery({ selected });
    const useDelete = useAttendanceDeleteMutation();
    const addFormRef = useRef();
    const queryClient = useQueryClient();
    const columns = [

        {
            title: "Name",
            dataIndex: ["userDetails", "name"],
            // width: 300,
            render : (value)=> value?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
        },
        {
            title: "Date",
            dataIndex: "date",
            render: (date) => date ? new Date(date).toLocaleDateString("en-IN") : "-"

        },
        {
            title: "Check In Time",
            render: (_, r) =>
                r.details?.[0]?.punchIn
                    ? new Date(r.details[0].punchIn).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                    })
                    : "-"
        },


        {
            title: "Check Out Time",
            dataIndex: "punchOutTime",
            render: (_, r) =>
                r.details?.[0].punchOut ? new Date(r.details[0].punchOut).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }) : "-"
        },




        // {
        //     title: "Status",
        //     dataIndex: "status",
        //     width: 100,
        //     render: (_, { status }) => {
        //         if (status) {
        //             return <h1 className='bg-green-200 text-center text-xs rounded py-1 border border-green-300'>Active</h1>;
        //         } else {
        //             return <h1 className='bg-red-200 text-center text-xs rounded py-1 border border-red-300'>Inactive</h1>;
        //         }
        //     },
        // },
        {
            title: "Action",
            dataIndex: "_id",
            width: 70,
            render: (v, row) => {
                return (
                    <>
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                                addFormRef.current.openForm(row);
                            }}
                        >View Detail</Button>
                    </>
                );
            },
        },
        // {
        //     title: "Action",
        //     dataIndex: "_id",
        //     width: 70,
        //     render: (v, row) => {
        //         return (
        //             <>
        //                 <Popconfirm
        //                     title="Are you sure to delete this Client?"
        //                     onConfirm={() => {
        //                         deleteData(row._id);
        //                     }}
        //                     okText="Yes"
        //                     cancelText="No"
        //                 >
        //                     <Button
        //                         type="primary"
        //                         size="small"
        //                         danger
        //                         icon={<DeleteOutlined />}
        //                     />
        //                     &nbsp;
        //                 </Popconfirm>
        //                 <Button
        //                     type="primary"
        //                     size="small"
        //                     icon={<EditOutlined />}
        //                     onClick={() => {
        //                         addFormRef.current.openForm(row);
        //                     }}
        //                 />
        //             </>
        //         );
        //     },
        // },
    ].filter((item) => !item.hidden);


    const deleteData = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: (res) => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_ATTENDANCE_KEY],
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
                    authors,
                    setSelected
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
                title={"Attendance"}
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

function Search({ qData, setQData, setSelected, addFormRef }) {
    const [searchFields, setSearchFields] = useState({});

    const handleSearch = (updatedFields = searchFields) => {
        console.log("updatedFields", updatedFields);

        setQData({
            ...qData,
            ...updatedFields,
            page: 1,
        });
    };

    // 🔥 helper to force +00:00 instead of Z
    const toISOWithOffset = (date) => {
        return date.toISOString().replace("Z", "+00:00");
    };

    return (
        <Form onSubmitCapture={() => handleSearch()}>
            <Row gutter={12}>
                <Col span={18}>
                    <Row gutter={12}>
                        <Col span={6}>
                            <Input
                                allowClear
                                placeholder="Search by name"
                                value={searchFields.key}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const updatedFields = {
                                        ...searchFields,
                                        key: value || undefined,
                                    };

                                    setSearchFields(updatedFields);

                                    if (!value) {
                                        handleSearch(updatedFields);
                                    }
                                }}
                            />
                        </Col>

                        <Col span={3}>
                            <Button type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Col>

                <Col span={6}>
                    <Col
                        span={24}
                        className="flex items-center w-full gap-x-4 justify-end"
                    >
                        <Col span={12} className="flex justify-end !p-0 max-w-fit">
                            <DatePicker
                                placeholder="Select date"
                                format="DD MMM YYYY"
                                allowClear
                                style={{ width: 180 }}
                                onChange={(date) => {
                                    const normalizedDate = date
                                        ? new Date(date.toDate().setHours(0, 0, 0, 0))
                                        : undefined;

                                    const finalDate = normalizedDate
                                        ? toISOWithOffset(normalizedDate)
                                        : undefined;

                                    // ✅ same format as backend storage
                                    setSelected(finalDate);

                                    const updatedFields = {
                                        ...searchFields,
                                        date: finalDate,
                                    };

                                    setSearchFields(updatedFields);
                                    handleSearch(updatedFields);
                                }}
                            />
                        </Col>
                    </Col>
                </Col>
            </Row>
        </Form>
    );
}



const formatTime = (value) => value ? new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
}) : "-";

const formatDuration = (start, end) => {
    if (!start || !end) return "-";
    const diffMs = new Date(end) - new Date(start); // Get milliSeconds
    const mins = Math.floor(diffMs / 60000); // Get Minutes
    const h = Math.floor(mins / 60);
    const m = mins % 60; // Get remaining minutes
    return `${h ? `${h}h ` : ""}${m}m`;
}

const AddEditFormModal = forwardRef((props, ref) => {
    const { queryClient } = props
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const useSave = useAttendanceSaveMutation();
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
                        queryKey: [QUERY_ATTENDANCE_KEY]
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
    }, [data.name]);
    return (
        <>
            <Modal
                title={<span>Attendance Detail</span>}
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
                width={600} FFFF
                footer={null}
            // className="app-modal-body-overflow"

            >
                {/* {data.details && (
                    <List
                        dataSource={data.details}
                        itemLayout="horizontal"
                        renderItem={(item, index) => (
                            <List.Item>
                                <Card
                                    size="small"
                                    style={{ width: "100%" }}
                                    title={`Session ${index + 1}`}
                                >
                                    <Row gutter={[16, 8]}>
                                        <Col span={8}>
                                            <strong>Check In:</strong><br />
                                            {formatTime(item.punchIn)}
                                        </Col>

                                        <Col span={8}>
                                            <strong>Check Out:</strong><br />
                                            {
                                                item.punchOut ? (
                                                    formatTime(item.punchOut)
                                                ) : (
                                                    <Tag color="green">Active Session</Tag>
                                                )
                                            }

                                        </Col>

                                        <Col span={8}>
                                            <strong>Duration:</strong><br />
                                            {formatDuration(item.punchIn, item.punchOut)}
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        )}
                    />
                )} */}

                {
                    data.details && (
                        <Timeline style={{ marginTop: 16 }}>
                            {data.details.map((item, index) => (
                                <Timeline.Item key={index}
                                    color={item.punchOut ? "blue" : "green"}
                                >
                                    <Card title={`Session ${index + 1}`} size='small'>
                                        <Row gutter={[12, 8]}>
                                            <Col span={8}>
                                                <strong>Check In</strong><br />
                                                {formatTime(item.punchIn)}
                                            </Col>
                                            <Col span={8}>
                                                <strong>Check Out</strong><br />
                                                {item.punchOut ? formatTime(item.punchOut) : <Tag color='green'>Active</Tag>}
                                            </Col>
                                            <Col span={8}>
                                                <strong>Duration</strong><br />
                                                {formatDuration(item.punchIn, item.punchOut)}
                                            </Col>
                                        </Row>
                                    </Card>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    )
                }




            </Modal>
        </>
    );
});
