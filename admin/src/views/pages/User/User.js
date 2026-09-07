import {
    DeleteOutlined,
    EditOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    UnorderedListOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
    Button,
    Card,
    Col,
    Collapse,
    Empty,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Progress,
    Row,
    Select,
    Spin,
    Table,
    Tag,
} from "antd";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from "react";
import { QUERY_USER_KEY } from "../../../constants/query.constants";
import { useGetUserQuery, useUserDeleteMutation, useUserSaveMutation } from "../../../query/user.query"
import { useGetLanguageQuery } from "../../../query/language.query";
import { useGetUserProgressQuery } from "../../../query/progress.query";
import util from "../../../utils/util";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import Loader from "../../components/Loaders/loader";
import UploadImage from "../../../utils/UploadImage";
import commonObj from '../../../commonObj';
import { STATES } from "../../../utils/states";


export const User = () => {
    const [qData, setQData] = useState({
        page: 1,
        limit: 10,
        total: 0,
        getTotal: false,
    });
    const {
        data: apiRes,
        isLoading,
        isError,
        isFetching,
    } = useGetUserQuery(qData);
    const [selected, setSelected] = useState([]);
    const useDelete = useUserDeleteMutation();
    const [activityUser, setActivityUser] = useState(null);

    const addFormRef = useRef();
    const queryClient = useQueryClient();
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (value) => value?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
            // width: 300,
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            // width: 300,
        },
        {
            title: "Age",
            dataIndex: "age",
            width: 80,
        },
        {
            title: "Language",
            dataIndex: ["language", "name"],
        },
        {
            title: "City",
            dataIndex: "city",
            render: (value) => value?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
        },
        {
            title: "State",
            dataIndex: "state",
        },
        {
            title: "Activities",
            key: "activities",
            dataIndex: "_id",
            width: 90,
            render: (v, row) => (
                <Button
                    type="default"
                    size="small"
                    icon={<UnorderedListOutlined />}
                    onClick={() => setActivityUser(row)}
                >
                    View
                </Button>
            ),
        },
        // {
        //     title: "Allowed Rights",
        //     dataIndex: "rights",
        //     render: (v) => v?.map((item) => <Tag>{item}</Tag>),
        //     // width: 300,
        // },

        // {
        //     title: "Status",
        //     dataIndex: "status",
        //     width: 60,
        //     render: (isActive) => {
        //         if (isActive) {
        //             return <Tag color="green">Active</Tag>;
        //         } else {
        //             return <Tag color="red">Inactive</Tag>;
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
                        <Popconfirm
                            title="Are you sure to delete this User?"
                            onConfirm={() => {
                                console.log(row._id);
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

    const deleteModel = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: (res) => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_USER_KEY],
                    });
                },
                onError: (err) => {
                    message.error(err.message);
                },
            }
        );
    };

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
                    apiRes,
                }}
            />
        ),
        showHeader: true,
        footer: () => <MyPagination {...{ qData, setQData }} />,
        tableLayout: undefined,
    };
    useEffect(() => {
        if (apiRes && apiRes.extra) {
            setQData((prevState) => ({
                ...prevState,
                ...apiRes.extra,
            }));
        }
    }, [apiRes]);
    return (
        <div>
            <Card
                bordered={false}
                size="small"
                className="p-0"
                title={"App User's List"}
            >
                {/* {isFetching ? (
                    <Loader />
                ) : (
                    <>
                        <Table
                            {...tableProps}
                            pagination={{ position: ["none"], pageSize: qData.limit }}
                            columns={columns}
                            dataSource={apiRes?.data?.length ? apiRes.data : []}
                        />
                        {!isFetching && isError && <DataNotLoaded />}
                    </>
                )} */}

                <Table
                    {...tableProps}
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={apiRes?.data?.length ? apiRes?.data : []}
                />

                {!isLoading && isError && !apiRes?.data?.length && <DataNotLoaded />}

                <AddEditFormModal ref={addFormRef} {...{ queryClient }} />

                <ActivitiesModal
                    user={activityUser}
                    onClose={() => setActivityUser(null)}
                />
            </Card>
        </div>
    );
};

function ActivitiesModal({ user, onClose }) {
    const { data: progressRes, isLoading } = useGetUserProgressQuery(user?._id);
    const courses = progressRes?.data || [];

    return (
        <Modal
            title={`Activities${user?.name ? " - " + user.name : ""}`}
            open={!!user}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            width={700}
        >
            {isLoading ? (
                <div className="py-10 flex justify-center">
                    <Spin />
                </div>
            ) : !courses.length ? (
                <Empty description="No learning activity yet" className="py-6" />
            ) : (
                <Collapse accordion>
                    {courses.map((course) => (
                        <Collapse.Panel
                            key={course.courseId}
                            header={
                                <div className="flex items-center justify-between gap-4 pr-4">
                                    <span>{course.title}</span>
                                    <Progress
                                        percent={course.completionPercent}
                                        size="small"
                                        style={{ maxWidth: 160 }}
                                    />
                                </div>
                            }
                        >
                            <Collapse>
                                {course.modules.map((module) => (
                                    <Collapse.Panel
                                        key={module.moduleId}
                                        header={
                                            <div className="flex items-center justify-between gap-4 pr-4">
                                                <span>{module.title}</span>
                                                <Progress
                                                    percent={module.completionPercent}
                                                    size="small"
                                                    style={{ maxWidth: 140 }}
                                                />
                                            </div>
                                        }
                                    >
                                        {module.lessons.map((lesson) => (
                                            <div
                                                key={lesson.lessonId}
                                                className="flex items-center justify-between gap-4 py-1"
                                            >
                                                <span>
                                                    {lesson.title}
                                                    {lesson.isCompleted && (
                                                        <Tag color="green" className="ml-2">
                                                            Completed
                                                        </Tag>
                                                    )}
                                                </span>
                                                <Progress
                                                    percent={lesson.watchedPercent}
                                                    size="small"
                                                    style={{ maxWidth: 140 }}
                                                />
                                            </div>
                                        ))}
                                    </Collapse.Panel>
                                ))}
                            </Collapse>
                        </Collapse.Panel>
                    ))}
                </Collapse>
            )}
        </Modal>
    );
}

function Search({ qData, setQData, addFormRef }) {
    const [searchFields, setSearchFields] = useState({});
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    };
    return (
        <Form onSubmitCapture={handleSearch}>
            <Row gutter={12}>
                <Col span={18}>
                    <Row gutter={12}>
                        <Col span={6}>
                            <Input
                                allowClear
                                placeholder="Search by Name, Number , City"
                                value={searchFields.key}
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        setQData({ ...qData, key: undefined, page: 1 });
                                    }
                                    setSearchFields({ ...searchFields, key: e.target.value });
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

                {
                    <Col span={6}>
                        <Col
                            span={24}
                            className="flex items-center w-full gap-x-4 justify-end"
                        >
                            <Col span={12} className="flex justify-end !p-0 max-w-fit">
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        addFormRef.current.openForm();
                                    }}
                                >
                                    Add New
                                </Button>
                            </Col>
                        </Col>
                    </Col>
                }
            </Row>
        </Form>
    );
}

const AddEditFormModal = forwardRef((props, ref) => {
    const { queryClient } = props;
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const useSave = useUserSaveMutation();
    const { data: languageList } = useGetLanguageQuery({ isAll: true, isDeleted: false });

    const languageOptions = useMemo(() => {
        const list = languageList?.data || [];
        return list.map((t) => ({
            value: t._id,
            label: t.name,
        }));
    }, [languageList?.data]);

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            // ensure socialLink always exists as an object
            setData(dt ? { ...dt, language: dt?.language?._id || dt?.language } : { status: true });
        },
    }));

    //  generic handleChange that supports nested objects and merges
    const handleChange = (value) => {
        setData((prev) => ({
            ...prev,
            ...value,
        }));
    };

    const save = () => {
        const payload = {
            ...data,
            // ensure socialLink is not null/undefined

        };

        useSave.mutate(payload, {
            onSuccess: (res) => {
                message.success("Data saved successfully.");
                queryClient.invalidateQueries({
                    queryKey: [QUERY_USER_KEY],
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
        });
    };

    return (
        <>
            <Modal
                title={<span>{data._id ? "Edit " : "Add "} App User</span>}
                style={{ top: 20 }}
                open={open}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: useSave.isPending }}
                onCancel={() => setOpen(false)}
                destroyOnClose
                maskClosable={false}
                width={600}
            >
                <Form layout="vertical">
                    <Row gutter={[12, 0]}>
                        {/* Name */}
                        <Col xs={24} md={12} lg={12}>
                            <Form.Item label="Name" required>
                                <Input
                                    type="text"
                                    placeholder="Enter Name"
                                    value={data.name}
                                    onChange={(e) => handleChange({ name: e.target.value })}
                                />
                            </Form.Item>
                        </Col>

                        {/* Profile Avatar */}
                        <Col xs={24} md={12} lg={12}>
                            <Form.Item label="Profile">
                                <UploadImage
                                    value={data.photoUrl ? [data.photoUrl] : []}
                                    count={1}
                                    onChange={(v) => {

                                        console.log("vvv", v);
                                        setData({ ...data, photoUrl: v?.[v.length - 1] || "" });
                                    }}
                                    listType="picture-card"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12} lg={12}>
                            <Form.Item label="Phone Number" required >
                                <Input
                                    type="text"
                                    placeholder="Enter phone (10 digit)"
                                    maxLength={10}
                                    value={data.phoneNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                                        handleChange({ phoneNumber: value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12}>
                            <Form.Item label="Age">
                                <Input
                                    type="text"
                                    placeholder="Enter Age"
                                    maxLength={3}
                                    value={data.age}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^\d]/g, '').slice(0, 3);
                                        handleChange({ age: value ? Number(value) : undefined });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12}>
                            <Form.Item label="Language">
                                <Select
                                    placeholder="Select Language"
                                    value={data.language}
                                    onChange={(e) => handleChange({ language: e })}
                                    showSearch
                                    optionFilterProp="label"
                                    allowClear
                                    options={languageOptions}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={12}>
                            <Form.Item label="State" required>
                                <Select
                                    placeholder="Select State"
                                    value={data.state}
                                    showSearch
                                    optionFilterProp="children"
                                    onChange={(st) => {
                                        // reset city if state changes
                                        handleChange({ state: st, city: "" });
                                    }}
                                >
                                    {STATES.map((st) => (
                                        <Select.Option key={st} value={st}>
                                            {st}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12} lg={12}>
                            <Form.Item label="City" required>
                                <Input
                                    type="text"
                                    placeholder="Enter City"
                                    value={data.city}
                                    disabled={!data.state}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z ]/g, "");
                                        handleChange({ city: value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        {/* Status */}
                        {/* <Col span={6} offset={18}>
                            <Form.Item label="Status" required>
                                <Select
                                    value={data.status}
                                    onChange={(e) => handleChange({ status: e })}
                                >
                                    <Select.Option value={true}>Active</Select.Option>
                                    <Select.Option value={false}>Inactive</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col> */}
                    </Row>
                </Form>
            </Modal>
        </>
    );
});

