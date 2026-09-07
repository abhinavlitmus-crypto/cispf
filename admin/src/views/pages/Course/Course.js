import {
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
    useMemo,
    useRef,
    useState,
} from "react";
import { QUERY_COURSE_KEY } from "../../../constants/query.constants";
import { useCourseDeleteMutation, useCourseSaveMutation, useGetCourseQuery } from "../../../query/course.query"
import util from "../../../utils/util";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import Loader from "../../components/Loaders/loader";
import UploadImage from "../../../utils/UploadImage";
import commonObj from '../../../commonObj';
import { STATES } from "../../../utils/states";
import { useGetQuizQuery } from "../../../query/quiz.query";
import { useGetLanguageQuery } from "../../../query/language.query";
import { useGetCourseTypeQuery } from "../../../query/courseType.query";

const getVideoDuration = (url) =>
    new Promise((resolve) => {
        const videoEl = document.createElement("video");
        videoEl.preload = "metadata";
        videoEl.onloadedmetadata = () => {
            resolve(Number.isFinite(videoEl.duration) ? Math.round(videoEl.duration) : undefined);
        };
        videoEl.onerror = () => resolve(undefined);
        videoEl.src = url;
    });

export const Course = () => {
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
    } = useGetCourseQuery(qData);
    const [selected, setSelected] = useState([]);
    const useDelete = useCourseDeleteMutation();
    // console.log("author",apiRes);
    const addFormRef = useRef();
    const queryClient = useQueryClient();
    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            render: (value) => value?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
            // width: 300,
        },
        {
            title: "Language",
            dataIndex: ["language", "name"]
        },
        {
            title: "Course Type",
            dataIndex: ["courseType", "name"]
        },
        {
            title: "Thumb Nail",
            dataIndex: "thumbNail",
            // render: (_, { thumbNail }) => {
            //     if (thumbNail) {
            //         return (
            //             <a href={thumbNail} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-blue-500 underline hover:text-blue-700">
            //                 View
            //             </a>
            //         );
            //     }
            // }
            render: (_, { thumbNail }) => {
                if (!thumbNail) return "-";

                return (
                    <img
                        src={thumbNail}
                        alt="thumbnail"
                        className="w-14 aspect-square object-cover rounded border border-gray-300 shadow-sm bg-white p-1 cursor-pointer hover:shadow-md transition"
                        onClick={() => window.open(thumbNail, "_blank")}
                    />
                );
            }
            // width: 300,
        },
        {
            title: "Video",
            render: (_, row) => {
                const video = row?.modules
                    ?.flatMap((mod) => mod?.lessons || [])
                    ?.find((v) => v?.videoURL);

                if (!video) return "-";

                return (
                    <div
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full cursor-pointer"
                        onClick={() => window.open(video.videoURL, "_blank")}
                    >
                        <PlayCircleOutlined />
                    </div>
                );
            }
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
                            title="Are you sure to delete this Course?"
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

    console.log("apires", apiRes)
    const deleteModel = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: (res) => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_COURSE_KEY],
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
                title={"Course List"}
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
    const useSave = useCourseSaveMutation();
    const { data: quizList } = useGetQuizQuery({ isAll: true, isDeleted: false });
    const { data: languageList } = useGetLanguageQuery({ isAll: true, isDeleted: false });
    const { data: courseTypeList } = useGetCourseTypeQuery({ isAll: true, isDeleted: false });

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            // ensure socialLink always exists as an object
            setData(dt ? {
                ...dt,
                language: dt?.language?._id || dt?.language,
                courseType: dt?.courseType?._id || dt?.courseType,

                modules: dt?.modules?.map((mod) => ({
                    ...mod,
                    quiz: mod?.quiz?._id || mod?.quiz,
                    lessons: mod?.lessons,
                })),
            } : { status: true });
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
                    queryKey: [QUERY_COURSE_KEY],
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
    const quizOptions = useMemo(() => {
        const list = quizList?.data || [];

        return list.map((t) => ({
            value: t._id,
            label: t.title
        }))
    }, [quizList?.data]);

    const languageOptions = useMemo(() => {
        const list = languageList?.data || [];
        return list.map((t) => ({
            value: t._id,
            label: t.name
        }))
    }, [languageList?.data])
    const courseTypeOptions = useMemo(() => {
        const list = courseTypeList?.data || [];
        return list.map((t) => ({
            value: t._id,
            label: t.name
        }))
    }, [courseTypeList?.data])


    return (
        <>
            <Modal
                title={<span>{data._id ? "Edit " : "Add "} Course</span>}
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
                            <Form.Item label="Title" required>
                                <Input
                                    type="text"
                                    placeholder="Enter Title"
                                    value={data.title}
                                    onChange={(e) => handleChange({ title: e.target.value })}
                                />
                            </Form.Item>
                        </Col>


                        <Col xs={12} md={12} lg={12}>
                            <Form.Item label="Thumb Nail" required>
                                <UploadImage
                                    value={data.thumbNail ? [data.thumbNail] : []}
                                    count={1}
                                    onChange={(v) => {

                                        console.log("vvv", v);
                                        setData({ ...data, thumbNail: v?.[v.length - 1] || "" });
                                    }}
                                    listType="picture-card"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={12} md={12} lg={12}>
                            <Form.Item label="Course Video">
                                <UploadImage
                                    accept="video/*"
                                    value={data.courseVideo ? [data.courseVideo] : []}
                                    count={1}
                                    onChange={(v) => {
                                        setData({ ...data, courseVideo: v?.[v.length - 1] || "" });
                                    }}
                                    listType="picture-card"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={12} md={12} lg={12}>
                            <Form.Item label="Document Label">
                                <Input
                                    value={data.documentLabel}
                                    placeholder="e.g. Course Syllabus"
                                    onChange={(e) => handleChange({ documentLabel: e.target.value })}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={12} md={12} lg={12}>
                            <Form.Item label="Upload Document">
                                <UploadImage
                                    accept="application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    value={data.documentURL ? [data.documentURL] : []}
                                    count={1}
                                    onChange={(v) => {
                                        setData({ ...data, documentURL: v?.[v.length - 1] || "" });
                                    }}
                                    listType="picture-card"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item label="Description" required>
                                <Input.TextArea
                                    type='text'
                                    placeholder="Enter Description"
                                    value={data?.description}
                                    maxLength={300}
                                    onChange={(e) => {
                                        handleChange({ description: e.target.value });
                                    }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="Assign Language" required>
                                <Select
                                    placeholder="Select Language"
                                    // value={data?.language?._id}
                                    value={data?.language}
                                    onChange={(e) =>
                                        handleChange({ language: e })
                                    }
                                    showSearch
                                    optionFilterProp="label"
                                    allowClear
                                    options={languageOptions}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item label="Assign Course Type" required>
                                <Select
                                    placeholder="Select Course Type"
                                    // value={data?.courseType?._id}
                                    value={data?.courseType}
                                    onChange={(e) =>
                                        handleChange({ courseType: e })
                                    }
                                    showSearch
                                    optionFilterProp="label"
                                    allowClear
                                    options={courseTypeOptions}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <h2 className="text-md font-bold mb-4">Course Modules</h2>
                            <ModuleManager
                                modules={data?.modules}
                                handleChange={(newModules) => handleChange({ modules: newModules })}
                                quizOptions={quizOptions}
                            />
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
});

const ModuleManager = ({ modules: data = [], handleChange, quizOptions }) => {
    const emptyModule = {
        title: "",
        description: "",
        quiz: undefined,
        documentLabel: "",
        documentURL: "",
        lessons: [],
    }

    const normalizedData = Array.isArray(data) ? data : [];

    const handleAddModule = () => {
        handleChange([...normalizedData, { ...emptyModule }])
    }

    const handleRemoveModule = (index) => {
        handleChange(normalizedData.filter((_, idx) => idx !== index));
    }

    const updateModuleField = (index, field, value) => {
        const newModules = normalizedData.map((item, idx) => (
            idx === index ? { ...item, [field]: value } : item
        ));
        handleChange(newModules)
    }


    if (normalizedData.length === 0) {
        return (
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddModule} block>
                Add First Module
            </Button>
        );
    }
    return (
        <div className="space-y-6">
            {normalizedData.map((item, Index) => (
                <Card
                    key={Index}
                    size="small"
                    title={`Module ${Index + 1}`}
                    className="bg-gray-50"
                    extra={
                        <Button icon={<DeleteOutlined />} type="text" danger onClick={() => handleRemoveModule(Index)} />
                    }
                >
                    <Row gutter={[12, 12]}>
                        {/* Title */}
                        <Col span={24}>
                            <Form.Item label="Title">
                                <Input
                                    value={item.title}
                                    placeholder="Enter Title"
                                    onChange={(e) =>
                                        updateModuleField(Index, "title", e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>

                        {/* Description */}
                        <Col span={24}>
                            <Form.Item label="Description">
                                <Input.TextArea
                                    value={item.description}
                                    placeholder="Enter Description"
                                    onChange={(e) =>
                                        updateModuleField(Index, "description", e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>

                        {/* Quiz */}
                        <Col xs={24} md={12}>
                            <Form.Item label="Assign Quiz">
                                <Select
                                    placeholder="Select Quiz"
                                    value={item.quiz}
                                    onChange={(val) =>
                                        updateModuleField(Index, "quiz", val)
                                    }
                                    showSearch
                                    optionFilterProp="label"
                                    allowClear
                                    options={quizOptions}
                                />
                            </Form.Item>
                        </Col>

                        {/* Document Label */}
                        <Col xs={24} md={12}>
                            <Form.Item label="Document Label">
                                <Input
                                    value={item.documentLabel}
                                    placeholder="e.g. Module Handout"
                                    onChange={(e) =>
                                        updateModuleField(Index, "documentLabel", e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>

                        {/* Upload Document */}
                        <Col xs={24} md={12}>
                            <Form.Item label="Upload Document">
                                <UploadImage
                                    accept="application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    value={item.documentURL ? [item.documentURL] : []}
                                    count={1}
                                    onChange={(v) => updateModuleField(Index, "documentURL", v?.[v.length - 1] || "")}
                                    listType="picture-card"
                                />
                            </Form.Item>
                        </Col>

                        {/* Lessons */}
                        <Col span={24}>
                            <h3 className="text-sm font-semibold mb-2">Lessons</h3>
                            <LessonManager
                                lessons={item.lessons}
                                handleChange={(newLessons) => updateModuleField(Index, "lessons", newLessons)}
                            />
                        </Col>
                    </Row>
                </Card>
            ))}
            <Button type="primary" ghost icon={<PlusOutlined />} onClick={handleAddModule} block>
                Add Another Module
            </Button>
        </div>
    )

}

const LessonManager = ({ lessons: data = [], handleChange }) => {
    const emptyLesson = {
        title: "",
        videoURL: "",
        description: '',
        duration: undefined,
        documentLabel: "",
        documentURL: "",
    }

    const normalizedData = Array.isArray(data) ? data : [];

    const handleAddLesson = () => {
        handleChange([...normalizedData, { ...emptyLesson }])
    }

    const handleRemoveLesson = (index) => {
        handleChange(normalizedData.filter((_, idx) => idx !== index));
    }

    const updateLessonField = (index, field, value) => {
        const newLessons = normalizedData.map((item, idx) => (
            idx === index ? { ...item, [field]: value } : item
        ));
        handleChange(newLessons)
    }

    const handleVideoChange = async (index, urls) => {
        const videoURL = urls?.[urls.length - 1] || "";
        const duration = videoURL ? await getVideoDuration(videoURL) : undefined;

        const newLessons = normalizedData.map((item, idx) => (
            idx === index ? { ...item, videoURL, duration } : item
        ));
        handleChange(newLessons)
    }

    const handleDocumentChange = (index, urls) => {
        const documentURL = urls?.[urls.length - 1] || "";
        updateLessonField(index, "documentURL", documentURL);
    }


    if (normalizedData.length === 0) {
        return (
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddLesson} block>
                Add First Lesson
            </Button>
        );
    }
    return (
        <div className="space-y-4">
            {normalizedData.map((item, Index) => (
                <Card
                    key={Index}
                    size="small"
                    title={`Lesson ${Index + 1}`}
                    className="bg-white"
                    extra={
                        <Button icon={<DeleteOutlined />} type="text" danger onClick={() => handleRemoveLesson(Index)} />
                    }
                >
                    <Row gutter={[12, 12]}>
                        {/* Title */}
                        <Col span={24}>
                            <Form.Item label="Title">
                                <Input
                                    value={item.title}
                                    placeholder="Enter Title"
                                    onChange={(e) =>
                                        updateLessonField(Index, "title", e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>

                        {/* Description */}
                        <Col span={24}>
                            <Form.Item label="Description">
                                <Input.TextArea
                                    value={item.description}
                                    placeholder="Enter Description"
                                    onChange={(e) =>
                                        updateLessonField(Index, "description", e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>

                        {/* Upload Video */}
                        <Col xs={24} md={12}>
                            <Form.Item label="Upload Video">
                                <UploadImage
                                    accept="video/*"
                                    value={item.videoURL ? [item.videoURL] : []}
                                    count={1}
                                    onChange={(v) => handleVideoChange(Index, v)}
                                    listType="picture-card"
                                />
                            </Form.Item>
                        </Col>

                        {/* Document Label */}
                        <Col xs={24} md={12}>
                            <Form.Item label="Document Label">
                                <Input
                                    value={item.documentLabel}
                                    placeholder="e.g. Lesson Notes"
                                    onChange={(e) =>
                                        updateLessonField(Index, "documentLabel", e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>

                        {/* Upload Document */}
                        <Col xs={24} md={12}>
                            <Form.Item label="Upload Document">
                                <UploadImage
                                    accept="application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    value={item.documentURL ? [item.documentURL] : []}
                                    count={1}
                                    onChange={(v) => handleDocumentChange(Index, v)}
                                    listType="picture-card"
                                />
                            </Form.Item>
                        </Col>

                    </Row>
                </Card>
            ))}
            <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddLesson} block>
                Add Another Lesson
            </Button>
        </div>
    )

}

