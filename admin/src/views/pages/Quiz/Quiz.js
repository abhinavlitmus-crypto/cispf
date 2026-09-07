import {
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    PlayCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
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
    Table,
    Tag,
} from "antd";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { QUERY_QUIZ_KEY } from "../../../constants/query.constants";
import { useGetQuizQuery, useQuizDeleteMutation, useQuizSaveMutation } from "../../../query/quiz.query"
import util from "../../../utils/util";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import Loader from "../../components/Loaders/loader";
import UploadImage from "../../../utils/UploadImage";
import commonObj from '../../../commonObj';
import { STATES } from "../../../utils/states";


export const Quiz = () => {
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
    } = useGetQuizQuery(qData);
    const [selected, setSelected] = useState([]);
    const useDelete = useQuizDeleteMutation();

    const addFormRef = useRef();
    const queryClient = useQueryClient();
    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            render: (value) => value?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
            // width: 300,
        },

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
                            title="Are you sure to delete this Quiz?"
                            onConfirm={() => {
                                // console.log(row._id);
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
                        queryKey: [QUERY_QUIZ_KEY],
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
                title={"Quiz List"}
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
            </Card>
        </div>
    );
};

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
                                placeholder="Search by Title"
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
    const useSave = useQuizSaveMutation();


    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            // ensure socialLink always exists as an object
            setData(dt ? { ...dt } : { status: true });
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
                    queryKey: [QUERY_QUIZ_KEY],
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
    useEffect(() => {
        if (!data._id) {
            handleChange({ slug: util.removeSpecialChars(data.title || "") })
        }
    }, [data?.title])
    return (
        <>
            <Modal
                title={<span>{data._id ? "Edit " : "Add "} Quiz</span>}
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
                        <Col xs={24}>
                            <Form.Item label="Title" required>
                                <Input
                                    type="text"
                                    placeholder="Enter Title"
                                    value={data.title}
                                    onChange={(e) => handleChange({ title: e.target.value })}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Description" required>
                                <Input.TextArea
                                    type='text'
                                    placeholder="Enter Description"
                                    value={data.description}
                                    onChange={(e) => {
                                        handleChange({ description: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Slug" required>
                                <Input
                                    placeholder="autrl"
                                    value={data.slug}
                                    disabled
                                />
                            </Form.Item>

                        </Col>
                        <Col span={24}>
                            <h2 className="text-md font-bold mb-4">Quiz Questions</h2>
                            <QuestionManager
                                questions={data?.questionDetails}
                                handleChange={(newQuestions) => handleChange({ questionDetails: newQuestions })}
                            />
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
            </Modal >
        </>
    );
});

function QuestionManager({ questions: data = [], handleChange }) {
    const emptyQuestion = {
        question: "",
        options: ["", ""],
        answer: "",
    }

    const normalizedData = Array.isArray(data) ? data : [];

    const handleAddQuestion = () => {
        handleChange([...normalizedData, { ...emptyQuestion }]);
    }

    const handleRemoveQuestion = (index) => {
        const newData = normalizedData.filter((_, idx) => idx !== index);
        handleChange(newData);
    }

    const updateQuestionField = (index, field, value) => {
        const newData = normalizedData.map((item, idx) => (
            idx === index ? { ...item, [field]: value } : item
        ));
        handleChange(newData);
    }

    const handleOptionsChange = (qIndex, optIndex, value) => {
        const newData = normalizedData.map((item, i) => {
            if (i === qIndex) {
                const newOptions = [...item.options];
                newOptions[optIndex] = value;
                return { ...item, options: newOptions };
            }
            return item;
        });
        handleChange(newData);
    }

    const addOption = (qIndex) => {
        const newData = normalizedData.map((item, i) => {
            if (i === qIndex) {
                return { ...item, options: [...item.options, ""] }
            }
            return item;
        });
        handleChange(newData);
    }

    if (normalizedData.length === 0) {
        return (
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddQuestion} block >Add First Question</Button>
        )
    }
    return (
        <div className="space-y-6">
            {normalizedData.map((item, qIndex) => (
                <Card
                    key={qIndex}
                    size="small"
                    title={`Question ${qIndex + 1}`}
                    className="bg-gray-50"
                    extra={
                        <Button
                            icon={<DeleteOutlined />}
                            type="text"
                            danger
                            onClick={() => handleRemoveQuestion(qIndex)}
                        />
                    }
                >
                    <Row gutter={[12, 12]}>
                        <Col span={24}>
                            <Form.Item label="Question Text">
                                <Input
                                    value={item.question}
                                    onChange={(e) => updateQuestionField(qIndex, "question", e.target.value)}
                                    placeholder="e.g What is the capital of France"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <label className="text-xs font-semibold mb-2 block">Options & Answer</label>
                            {item.options.map((opt, optIndex) => (
                                <div key={optIndex} className="flex gap-2 mb-2">
                                    <Input
                                        placeholder={`Option ${optIndex + 1}`}
                                        value={opt}
                                        onChange={(e) => handleOptionsChange(qIndex, optIndex, e.target.value)}
                                    />
                                    <Button type={item.answer === opt && opt !== "" ? "primary" : "default"} onClick={() => updateQuestionField(qIndex, "answer", opt)}>Correct</Button>
                                </div>
                            ))}
                            <Button type="link" size="small" icon={<PlusOutlined />} onClick={() => addOption(qIndex)}>
                                Add Option
                            </Button>
                            <Col span={24}>
                                <Tag color="blue">Selected Answer: {item.answer || "None"}</Tag>
                            </Col>
                        </Col>
                    </Row>
                </Card>
            ))}
            <Button type="primary" ghost icon={<PlusOutlined />} onClick={handleAddQuestion} block>
                Add Another Question
            </Button>
        </div>
    )
}

