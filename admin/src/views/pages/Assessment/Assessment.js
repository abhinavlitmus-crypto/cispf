import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Form,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Switch,
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
import { QUERY_ASSESSMENT_KEY } from "../../../constants/query.constants";
import {
  useAssessmentDeleteMutation,
  useAssessmentSaveMutation,
  useGetAssessmentQuery,
} from "../../../query/assessment.query";
import { useGetFormBuilderQuery } from "../../../query/formBuilder.query";
import { useGetCourseQuery } from "../../../query/course.query";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import Loader from "../../components/Loaders/loader";

export const Assessment = () => {
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
  } = useGetAssessmentQuery(qData);
  const useDelete = useAssessmentDeleteMutation();
  const useStatusSave = useAssessmentSaveMutation();

  const addFormRef = useRef();
  const queryClient = useQueryClient();

  const assignedToLabel = (row) => {
    const parts = [row.courseTitle].filter(Boolean);
    if (row.moduleTitle) parts.push(row.moduleTitle);
    if (row.lessonTitle) parts.push(row.lessonTitle);
    return parts.join(" > ") || "-";
  };

  const columns = [
    {
      title: "Form Name",
      dataIndex: "formName",
    },
    {
      title: "Assigned To",
      dataIndex: "courseTitle",
      render: (_, row) => assignedToLabel(row),
    },
    {
      title: "Target",
      dataIndex: "targetType",
      width: 90,
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: "Pass %",
      dataIndex: "passPercentage",
      width: 80,
    },
    {
      title: "Mandatory",
      dataIndex: "isMandatory",
      width: 100,
      render: (v) => (v ? <Tag color="orange">Mandatory</Tag> : <Tag>Optional</Tag>),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (isActive, row) => (
        <Switch
          checked={isActive}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          loading={useStatusSave.isPending}
          onChange={(status) => updateStatus(row, status)}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: 70,
      render: (v, row) => (
        <>
          <Popconfirm
            title="Are you sure to delete this Assessment?"
            onConfirm={() => deleteData(row._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" size="small" danger icon={<DeleteOutlined />} />
            &nbsp;
          </Popconfirm>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => addFormRef.current.openForm(row)}
          />
        </>
      ),
    },
  ];

  const deleteData = (id) => {
    useDelete.mutate(
      { ids: id },
      {
        onSuccess: () => {
          message.success("Data deleted successfully.");
          queryClient.invalidateQueries({ queryKey: [QUERY_ASSESSMENT_KEY] });
        },
        onError: (err) => {
          message.error(err.message);
        },
      }
    );
  };

  const updateStatus = (row, status) => {
    useStatusSave.mutate(
      { _id: row._id, status },
      {
        onSuccess: () => {
          message.success(`Assessment ${status ? "activated" : "deactivated"} successfully.`);
          queryClient.invalidateQueries({ queryKey: [QUERY_ASSESSMENT_KEY] });
        },
        onError: (err) => message.error(err.message || "Unable to update assessment status"),
      }
    );
  };

  const tableProps = {
    bordered: true,
    loading: isLoading,
    size: "small",
    title: () => <Search {...{ addFormRef }} />,
    showHeader: true,
    footer: () => <MyPagination {...{ qData, setQData }} />,
  };

  useEffect(() => {
    if (apiRes && apiRes.extra) {
      setQData((prevState) => ({ ...prevState, ...apiRes.extra }));
    }
  }, [apiRes]);

  return (
    <div>
      <Card bordered={false} size="small" className="p-0" title={"Assessment List"}>
        {isFetching ? (
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
        )}

        <AddEditFormModal ref={addFormRef} {...{ queryClient }} />
      </Card>
    </div>
  );
};

function Search({ addFormRef }) {
  return (
    <Row gutter={12}>
      <Col span={18} />
      <Col span={6}>
        <Col span={24} className="flex items-center w-full gap-x-4 justify-end">
          <Col span={12} className="flex justify-end !p-0 max-w-fit">
            <Button type="primary" onClick={() => addFormRef.current.openForm()}>
              Add New
            </Button>
          </Col>
        </Col>
      </Col>
    </Row>
  );
}

const AddEditFormModal = forwardRef((props, ref) => {
  const { queryClient } = props;
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const useSave = useAssessmentSaveMutation();
  const { data: formList } = useGetFormBuilderQuery({ isAll: true, status: true });
  const { data: courseList } = useGetCourseQuery({ isAll: true });

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(
        dt
          ? {
              ...dt,
              formId: dt.formId?._id || dt.formId,
              courseId: dt.courseId?._id || dt.courseId,
            }
          : { status: true, targetType: "course", passPercentage: 40, isMandatory: false }
      );
    },
  }));

  const handleChange = (value) => {
    setData((prev) => ({ ...prev, ...value }));
  };

  const formOptions = useMemo(() => {
    const list = formList?.data || [];
    return list.map((f) => ({ value: f._id, label: f.name }));
  }, [formList?.data]);

  const courseOptions = useMemo(() => {
    const list = courseList?.data || [];
    return list.map((c) => ({ value: c._id, label: c.title }));
  }, [courseList?.data]);

  const selectedCourse = useMemo(() => {
    const list = courseList?.data || [];
    return list.find((c) => c._id === data.courseId);
  }, [courseList?.data, data.courseId]);

  const moduleOptions = useMemo(() => {
    return (selectedCourse?.modules || []).map((m) => ({ value: m._id, label: m.title }));
  }, [selectedCourse]);

  const selectedModule = useMemo(() => {
    return (selectedCourse?.modules || []).find((m) => m._id === data.moduleId);
  }, [selectedCourse, data.moduleId]);

  const lessonOptions = useMemo(() => {
    return (selectedModule?.lessons || []).map((l) => ({ value: l._id, label: l.title }));
  }, [selectedModule]);

  const handleTargetTypeChange = (targetType) => {
    setData((prev) => ({
      ...prev,
      targetType,
      moduleId: targetType === "course" ? undefined : prev.moduleId,
      lessonId: targetType === "lesson" ? prev.lessonId : undefined,
    }));
  };

  const save = () => {
    if (!data.formId) {
      message.error("Please select a form");
      return;
    }
    if (!data.courseId) {
      message.error("Please select a course");
      return;
    }
    if (data.targetType === "module" && !data.moduleId) {
      message.error("Please select a module");
      return;
    }
    if (data.targetType === "lesson" && (!data.moduleId || !data.lessonId)) {
      message.error("Please select a module and lesson");
      return;
    }

    useSave.mutate(data, {
      onSuccess: () => {
        message.success("Data saved successfully.");
        queryClient.invalidateQueries({ queryKey: [QUERY_ASSESSMENT_KEY] });
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
    <Modal
      title={<span>{data._id ? "Edit " : "Add "} Assessment</span>}
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
          <Col span={24}>
            <Form.Item label="Assign Form" required>
              <Select
                placeholder="Select Form"
                value={data.formId}
                onChange={(v) => handleChange({ formId: v })}
                showSearch
                optionFilterProp="label"
                options={formOptions}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Assign Course" required>
              <Select
                placeholder="Select Course"
                value={data.courseId}
                onChange={(v) => handleChange({ courseId: v, moduleId: undefined, lessonId: undefined })}
                showSearch
                optionFilterProp="label"
                options={courseOptions}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Assign To" required>
              <Select
                value={data.targetType}
                onChange={handleTargetTypeChange}
                options={[
                  { value: "course", label: "Whole Course" },
                  { value: "module", label: "Specific Module" },
                  { value: "lesson", label: "Specific Lesson" },
                ]}
              />
            </Form.Item>
          </Col>

          {(data.targetType === "module" || data.targetType === "lesson") && (
            <Col span={24}>
              <Form.Item label="Select Module" required>
                <Select
                  placeholder="Select Module"
                  value={data.moduleId}
                  onChange={(v) => handleChange({ moduleId: v, lessonId: undefined })}
                  showSearch
                  optionFilterProp="label"
                  options={moduleOptions}
                  disabled={!data.courseId}
                />
              </Form.Item>
            </Col>
          )}

          {data.targetType === "lesson" && (
            <Col span={24}>
              <Form.Item label="Select Lesson" required>
                <Select
                  placeholder="Select Lesson"
                  value={data.lessonId}
                  onChange={(v) => handleChange({ lessonId: v })}
                  showSearch
                  optionFilterProp="label"
                  options={lessonOptions}
                  disabled={!data.moduleId}
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={12}>
            <Form.Item label="Pass Percentage" required>
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                value={data.passPercentage}
                onChange={(v) => handleChange({ passPercentage: v })}
              />
            </Form.Item>
          </Col>

          <Col xs={12}>
            <Form.Item label="Mandatory">
              <Switch
                checked={!!data.isMandatory}
                checkedChildren="Yes"
                unCheckedChildren="No"
                onChange={(v) => handleChange({ isMandatory: v })}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});
