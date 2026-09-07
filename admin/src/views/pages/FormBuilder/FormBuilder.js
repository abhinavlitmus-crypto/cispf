import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
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
  useRef,
  useState,
} from "react";
import { QUERY_FORM_BUILDER_KEY } from "../../../constants/query.constants";
import { FIELD_TYPES, FIELD_TYPE_LABELS } from "../../../constants/formBuilder.constants";
import {
  useFormBuilderDeleteMutation,
  useFormBuilderSaveMutation,
  useGetFormBuilderQuery,
} from "../../../query/formBuilder.query";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import Loader from "../../components/Loaders/loader";

const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const countFields = (details) =>
  details?.sections?.reduce((acc, s) => acc + (s.fields?.length || 0), 0) || 0;

export const FormBuilder = () => {
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
  } = useGetFormBuilderQuery(qData);
  const useDelete = useFormBuilderDeleteMutation();
  const useStatusSave = useFormBuilderSaveMutation();

  const addFormRef = useRef();
  const queryClient = useQueryClient();

  const columns = [
    {
      title: "Form Name",
      dataIndex: "name",
    },
    {
      title: "Sections",
      dataIndex: "details",
      width: 100,
      render: (v) => v?.sections?.length || 0,
    },
    {
      title: "Fields",
      dataIndex: "details",
      width: 100,
      render: (v) => <Tag>{countFields(v)} field(s)</Tag>,
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
            title="Are you sure to delete this Form?"
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
          queryClient.invalidateQueries({ queryKey: [QUERY_FORM_BUILDER_KEY] });
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
          message.success(`Form ${status ? "activated" : "deactivated"} successfully.`);
          queryClient.invalidateQueries({ queryKey: [QUERY_FORM_BUILDER_KEY] });
        },
        onError: (err) => message.error(err.message || "Unable to update form status"),
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
      <Card bordered={false} size="small" className="p-0" title="Form Builder">
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
  const [sections, setSections] = useState([]);
  const [open, setOpen] = useState(false);
  const useSave = useFormBuilderSaveMutation();

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { ...dt } : { status: true });
      setSections(dt?.details?.sections || []);
    },
  }));

  const handleChange = (value) => {
    setData((prev) => ({ ...prev, ...value }));
  };

  const save = () => {
    if (!data.name?.trim()) {
      message.error("Please enter a form name");
      return;
    }
    if (!sections.length) {
      message.error("Please add at least one section");
      return;
    }
    for (const s of sections) {
      if (!s.title?.trim()) {
        message.error("Please give every section a title");
        return;
      }
      if (!s.fields?.length) {
        message.error(`Please add at least one field in "${s.title}"`);
        return;
      }
      for (const f of s.fields) {
        if (!f.label?.trim()) {
          message.error(`Please give every field a label in "${s.title}"`);
          return;
        }
        const isSingleAnswerType =
          f.type === FIELD_TYPES.SELECT_SINGLE || f.type === FIELD_TYPES.RADIO;
        const isMultiAnswerType =
          f.type === FIELD_TYPES.SELECT_MULTIPLE || f.type === FIELD_TYPES.RADIO_MULTIPLE;

        if ((isSingleAnswerType || isMultiAnswerType) && (!f.options || f.options.length < 2)) {
          message.error(`"${f.label}" needs at least 2 options`);
          return;
        }
        if (isSingleAnswerType && !f.correctAnswer) {
          message.error(`Please mark the correct answer for "${f.label}"`);
          return;
        }
        if (isMultiAnswerType && !f.correctAnswers?.length) {
          message.error(`Please mark at least one correct answer for "${f.label}"`);
          return;
        }
      }
    }

    const upperSections = sections.map((s) => ({
      ...s,
      title: s.title.toUpperCase(),
      description: s.description ? s.description.toUpperCase() : s.description,
      fields: s.fields.map((f) => ({
        ...f,
        label: f.label.toUpperCase(),
        options: f.options ? f.options.map((opt) => opt.toUpperCase()) : f.options,
        correctAnswer:
          typeof f.correctAnswer === "string" ? f.correctAnswer.toUpperCase() : f.correctAnswer,
        correctAnswers: f.correctAnswers ? f.correctAnswers.map((a) => a.toUpperCase()) : f.correctAnswers,
      })),
    }));

    useSave.mutate(
      { ...data, name: data.name.toUpperCase(), details: { sections: upperSections } },
      {
        onSuccess: () => {
          message.success("Data saved successfully.");
          queryClient.invalidateQueries({ queryKey: [QUERY_FORM_BUILDER_KEY] });
          setOpen(false);
        },
        onError: (err) => {
          if (typeof err.message !== "string") {
            message.error(err.message[Object.keys(err.message)[0]][0]);
          } else {
            message.error(err.message);
          }
        },
      }
    );
  };

  return (
    <Modal
      title={<span>{data._id ? "Edit " : "Add "} Form</span>}
      style={{ top: 20 }}
      open={open}
      okText="Save"
      onOk={save}
      okButtonProps={{ disabled: useSave.isPending }}
      onCancel={() => setOpen(false)}
      destroyOnClose
      maskClosable={false}
      width={900}
    >
      <Form layout="vertical">
        <Row gutter={[12, 0]}>
          <Col span={24}>
            <Form.Item label="Form Name" required>
              <Input
                placeholder="e.g. Company Onboarding Form"
                value={data.name}
                onChange={(e) => handleChange({ name: e.target.value })}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <FormSectionsBuilder sections={sections} onChange={setSections} />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
});

function FormSectionsBuilder({ sections, onChange }) {
  const addSection = () => {
    onChange([...sections, { id: genId(), title: "", description: "", fields: [] }]);
  };
  const updateSection = (sectionId, values) => {
    onChange(sections.map((s) => (s.id === sectionId ? { ...s, ...values } : s)));
  };
  const removeSection = (sectionId) => {
    onChange(sections.filter((s) => s.id !== sectionId));
  };

  const addField = (sectionId) => {
    onChange(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, fields: [...(s.fields || []), { id: genId(), type: FIELD_TYPES.INPUT, label: "" }] }
          : s
      )
    );
  };
  const updateField = (sectionId, fieldId, values) => {
    onChange(
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map((f) => (f.id === fieldId ? { ...f, ...values } : f)),
            }
          : s
      )
    );
  };
  const removeField = (sectionId, fieldId) => {
    onChange(
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, fields: s.fields.filter((f) => f.id !== fieldId) }
          : s
      )
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium">Sections</span>
        <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addSection}>
          Add Section
        </Button>
      </div>

      {!sections.length && (
        <div className="text-center text-gray-400 py-6 border border-dashed rounded">
          No sections added yet. Click "Add Section" to start building the form.
        </div>
      )}

      {sections.map((section) => {
        const isSelect = (type) =>
          type === FIELD_TYPES.SELECT_SINGLE ||
          type === FIELD_TYPES.SELECT_MULTIPLE ||
          type === FIELD_TYPES.RADIO ||
          type === FIELD_TYPES.RADIO_MULTIPLE;
        const isMultiAnswer = (type) =>
          type === FIELD_TYPES.SELECT_MULTIPLE || type === FIELD_TYPES.RADIO_MULTIPLE;
        const isCheckbox = (type) => type === FIELD_TYPES.CHECKBOX;
        const isGradable = (type) => isSelect(type) || isCheckbox(type);

        return (
          <Card
            key={section.id}
            size="small"
            className="mb-3"
            extra={
              <Popconfirm
                title="Delete this section and all its fields?"
                onConfirm={() => removeSection(section.id)}
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            }
          >
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Input
                  placeholder="Section title e.g. Company Information"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                />
              </Col>
              <Col span={24}>
                <Input.TextArea
                  rows={2}
                  placeholder="Section description (optional)"
                  value={section.description}
                  onChange={(e) => updateSection(section.id, { description: e.target.value })}
                />
              </Col>
            </Row>

            <div className="mt-3">
              {section.fields?.map((field) => (
                <div key={field.id} className="border-b py-2">
                  <Row gutter={8} align="middle">
                    <Col span={6}>
                      <Select
                        size="small"
                        style={{ width: "100%" }}
                        value={field.type}
                        onChange={(v) =>
                          updateField(section.id, field.id, {
                            type: v,
                            options: isSelect(v) ? field.options || [] : undefined,
                            correctAnswer: undefined,
                            correctAnswers: undefined,
                            points: isGradable(v) ? field.points || 1 : undefined,
                          })
                        }
                      >
                        {Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => (
                          <Select.Option key={value} value={value}>
                            {label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={isSelect(field.type) ? 6 : isGradable(field.type) ? 12 : 15}>
                      <Input
                        size="small"
                        placeholder="Field label e.g. Company Name"
                        value={field.label}
                        onChange={(e) => updateField(section.id, field.id, { label: e.target.value })}
                      />
                    </Col>
                    {isSelect(field.type) && (
                      <Col span={6}>
                        <Select
                          size="small"
                          mode="tags"
                          style={{ width: "100%" }}
                          placeholder="Type option, press Enter"
                          value={field.options || []}
                          onChange={(opts) => updateField(section.id, field.id, { options: opts })}
                        />
                      </Col>
                    )}
                    {isGradable(field.type) && (
                      <Col span={3}>
                        <InputNumber
                          size="small"
                          min={0}
                          style={{ width: "100%" }}
                          placeholder="Points"
                          value={field.points ?? 1}
                          onChange={(v) => updateField(section.id, field.id, { points: v })}
                        />
                      </Col>
                    )}
                    <Col span={3} className="text-right">
                      <Popconfirm title="Delete this field?" onConfirm={() => removeField(section.id, field.id)}>
                        <Button size="small" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Col>
                  </Row>

                  {isSelect(field.type) && !!field.options?.length && (
                    <Row className="mt-2">
                      <Col span={24}>
                        <label className="text-xs text-gray-500 mb-1 block">
                          Mark {isMultiAnswer(field.type) ? "correct answer(s)" : "the correct answer"}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {field.options.map((opt) => {
                            const active = isMultiAnswer(field.type)
                              ? field.correctAnswers?.includes(opt)
                              : field.correctAnswer === opt;
                            return (
                              <Button
                                key={opt}
                                size="small"
                                type={active ? "primary" : "default"}
                                onClick={() => {
                                  if (isMultiAnswer(field.type)) {
                                    const current = field.correctAnswers || [];
                                    const next = current.includes(opt)
                                      ? current.filter((o) => o !== opt)
                                      : [...current, opt];
                                    updateField(section.id, field.id, { correctAnswers: next });
                                  } else {
                                    updateField(section.id, field.id, { correctAnswer: opt });
                                  }
                                }}
                              >
                                {opt}
                              </Button>
                            );
                          })}
                        </div>
                      </Col>
                    </Row>
                  )}

                  {isCheckbox(field.type) && (
                    <Row className="mt-2" align="middle">
                      <Col span={24} className="flex items-center gap-2">
                        <label className="text-xs text-gray-500">Correct answer: Checked</label>
                        <Switch
                          size="small"
                          checked={!!field.correctAnswer}
                          onChange={(v) => updateField(section.id, field.id, { correctAnswer: v })}
                        />
                      </Col>
                    </Row>
                  )}
                </div>
              ))}
            </div>

            <Button
              size="small"
              type="dashed"
              icon={<PlusOutlined />}
              className="mt-3"
              onClick={() => addField(section.id)}
            >
              Add Field
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
