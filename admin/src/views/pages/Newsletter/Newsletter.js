import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Table,
    Tooltip
} from "antd";
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_NEWSLETTER_KEY } from '../../../constants/query.constants';
import {
    useGetNewsletterQuery,
    useNewsletterDeleteMutation,
    useNewsletterPreviewMutation,
    useNewsletterSaveMutation,
    useNewsletterSendMutation
} from '../../../query/newsletter.query';
import UploadImage from '../../../utils/UploadImage';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';

const SOCIALS = [
    { key: "facebook", label: "Facebook", placeholder: "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcispf.org%2F" },
    { key: "twitter", label: "X (Twitter)", placeholder: "https://twitter.com/intent/tweet?url=https%3A%2F%2Fcispf.org%2F" },
    { key: "linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fcispf.org%2F" },
    { key: "whatsapp", label: "WhatsApp", placeholder: "https://api.whatsapp.com/send?text=CISPF%20Daily%20https%3A%2F%2Fcispf.org%2F" },
];

const emptySection = () => ({ image: "", title: "", description: "", buttonText: "Full Story", buttonLink: "" });

const showError = (err) => {
    if (typeof err.message !== "string") {
        message.error(err.message[Object.keys(err.message)[0]][0]);
    } else {
        message.error(err.message);
    }
}

export const Newsletter = () => {
    const [qData, setQData] = useState({ page: 1, limit: 20, total: 0, getTotal: false });
    const { data: newsletters, isLoading, isError } = useGetNewsletterQuery(qData);
    const useDelete = useNewsletterDeleteMutation();
    const addFormRef = useRef();
    const previewRef = useRef();
    const sendRef = useRef();
    const queryClient = useQueryClient();

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            width: 140,
            render: (v) => v ? dayjs(v).format("MMM D, YYYY") : "-",
        },
        {
            title: "Title",
            dataIndex: "title",
            render: (v, row) => (
                <div>
                    <div className='font-medium'>{v}</div>
                    {row.subject && <div className='text-xs text-gray-500'>{row.subject}</div>}
                </div>
            ),
        },
        {
            title: "Sections",
            dataIndex: "sections",
            width: 90,
            render: (v) => v?.length || 0,
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
            width: 150,
            render: (v, row) => {
                return (
                    <div className='flex gap-1'>
                        <Popconfirm
                            title="Are you sure to delete this Newsletter?"
                            onConfirm={() => deleteData(row._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" size="small" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                        <Tooltip title="Edit">
                            <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => addFormRef.current.openForm(row)} />
                        </Tooltip>
                        <Tooltip title="Preview">
                            <Button size="small" icon={<EyeOutlined />} onClick={() => previewRef.current.open(row._id)} />
                        </Tooltip>
                        <Tooltip title="Send">
                            <Button size="small" icon={<SendOutlined />} onClick={() => sendRef.current.open(row)} />
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    const deleteData = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: () => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({ queryKey: [QUERY_NEWSLETTER_KEY] });
                },
                onError: (err) => message.error(err.message)
            }
        )
    }

    const tableProps = {
        bordered: true,
        loading: isLoading,
        size: "small",
        title: () => <Search {...{ addFormRef, previewRef, sendRef, qData, setQData }} />,
        showHeader: true,
        footer: () => <MyPagination {...{ qData, setQData }} />,
        tableLayout: undefined,
    };

    useEffect(() => {
        if (newsletters && newsletters.extra) {
            setQData(prevState => ({ ...prevState, ...newsletters.extra }));
        }
    }, [newsletters]);

    return (
        <div>
            <Card bordered={false} size="small" className='p-0' title={"Newsletter List"}>
                <Table
                    {...tableProps}
                    rowKey="_id"
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={newsletters?.data?.length ? newsletters?.data : []}
                />
                {!isLoading && isError && !newsletters?.data?.length && <DataNotLoaded />}

                <AddEditFormModal ref={addFormRef} {...{ queryClient }} />
                <PreviewModal ref={previewRef} />
                <SendModal ref={sendRef} />
            </Card>
        </div>
    )
}

function Search({ qData, setQData, addFormRef, previewRef, sendRef }) {
    const [searchFields, setSearchFields] = useState({});
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }
    return (
        <Form onSubmitCapture={handleSearch}>
            <Row gutter={12}>
                <Col span={12}>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Input
                                allowClear
                                placeholder="Search by title / subject"
                                value={searchFields.key}
                                onChange={(e) => {
                                    if (!e.target.value) {
                                        setQData({ ...qData, key: undefined, page: 1 });
                                    }
                                    setSearchFields({ ...searchFields, key: e.target.value });
                                }}
                            />
                        </Col>
                        <Col span={4}>
                            <Button type="primary" htmlType="submit">Search</Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={12} className='flex items-center gap-x-2 justify-end'>
                    <Button icon={<EyeOutlined />} onClick={() => previewRef.current.open()}>Preview Latest</Button>
                    <Button icon={<SendOutlined />} onClick={() => sendRef.current.open()}>Send Latest</Button>
                    <Button type="primary" onClick={() => addFormRef.current.openForm()}>Add New</Button>
                </Col>
            </Row>
        </Form>
    );
}

const AddEditFormModal = forwardRef((props, ref) => {
    const { queryClient } = props;
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const useSave = useNewsletterSaveMutation();

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(dt
                ? { ...dt, sections: (dt.sections || []).map(s => ({ ...s })), socialLinks: { ...(dt.socialLinks || {}) } }
                : { title: "CISPF Daily", date: dayjs().toISOString(), status: true, sections: [emptySection()], socialLinks: {} });
        },
    }));

    const handleChange = (value) => setData(prev => ({ ...prev, ...value }));

    const updateSection = (index, value) => {
        setData(prev => {
            const sections = [...prev.sections];
            sections[index] = { ...sections[index], ...value };
            return { ...prev, sections };
        });
    }
    const addSection = () => setData(prev => ({ ...prev, sections: [...prev.sections, emptySection()] }));
    const removeSection = (index) => setData(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== index) }));
    const updateSocial = (key, value) => setData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));

    const save = () => {
        const { _id, title, subject, date, sections, socialLinks, status } = data;
        useSave.mutate(
            { _id, title, subject, date, sections, socialLinks, status },
            {
                onSuccess: () => {
                    message.success('Data saved successfully.');
                    queryClient.invalidateQueries({ queryKey: [QUERY_NEWSLETTER_KEY] });
                    setOpen(false);
                },
                onError: showError
            }
        )
    }

    return (
        <Modal
            title={<span>{data._id ? "Edit " : "Add "} Newsletter</span>}
            style={{ top: 20 }}
            open={open}
            okText="Save"
            onOk={save}
            okButtonProps={{ disabled: useSave.isPending }}
            onCancel={() => setOpen(false)}
            destroyOnClose
            maskClosable={false}
            width={1000}
        >
            <Form layout="vertical">
                <Row gutter={[12, 0]}>
                    <Col span={8}>
                        <Form.Item label="Newsletter Title">
                            <Input placeholder="CISPF Daily" value={data.title} onChange={(e) => handleChange({ title: e.target.value })} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Email Subject">
                            <Input placeholder="Defaults to title + date" value={data.subject} onChange={(e) => handleChange({ subject: e.target.value })} />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="Date" required>
                            <DatePicker
                                className='w-full'
                                format="MMM D, YYYY"
                                value={data.date ? dayjs(data.date) : null}
                                onChange={(d) => handleChange({ date: d ? d.toISOString() : undefined })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label="Status" required>
                            <Select value={data.status} onChange={e => handleChange({ status: e })}>
                                <Select.Option value={true}>Active</Select.Option>
                                <Select.Option value={false}>Inactive</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <div className='flex items-center justify-between mb-2 mt-2'>
                    <h3 className='font-semibold text-base'>Sections</h3>
                    <Button icon={<PlusOutlined />} onClick={addSection}>Add Section</Button>
                </div>

                {(data.sections || []).map((section, index) => (
                    <Card
                        key={index}
                        size="small"
                        className='mb-3'
                        title={`Section ${index + 1}`}
                        extra={
                            <Button size="small" danger icon={<DeleteOutlined />} disabled={data.sections.length === 1} onClick={() => removeSection(index)} />
                        }
                    >
                        <Row gutter={[12, 0]}>
                            <Col span={6}>
                                <Form.Item label="Image">
                                    <UploadImage
                                        accept="image/*"
                                        listType="picture-card"
                                        value={section.image ? [section.image] : []}
                                        onChange={(e) => updateSection(index, { image: e?.[0] || "" })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={18}>
                                <Form.Item label="Title" required>
                                    <Input value={section.title} onChange={(e) => updateSection(index, { title: e.target.value })} />
                                </Form.Item>
                                <Form.Item label="Description">
                                    <Input.TextArea rows={3} value={section.description} onChange={(e) => updateSection(index, { description: e.target.value })} />
                                </Form.Item>
                                <Row gutter={12}>
                                    <Col span={8}>
                                        <Form.Item label="Button Text">
                                            <Input placeholder="Full Story" value={section.buttonText} onChange={(e) => updateSection(index, { buttonText: e.target.value })} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={16}>
                                        <Form.Item label="Button Link">
                                            <Input placeholder="https://cispf.org/..." value={section.buttonLink} onChange={(e) => updateSection(index, { buttonLink: e.target.value })} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                ))}

                <h3 className='font-semibold text-base mb-2 mt-4'>Social Links</h3>
                <Row gutter={[12, 0]}>
                    {SOCIALS.map(({ key, label, placeholder }) => (
                        <Col span={12} key={key}>
                            <Form.Item label={label}>
                                <Input
                                    allowClear
                                    placeholder={placeholder}
                                    value={data.socialLinks?.[key]}
                                    onChange={(e) => updateSocial(key, e.target.value)}
                                />
                            </Form.Item>
                        </Col>
                    ))}
                </Row>
            </Form>
        </Modal>
    );
});

const PreviewModal = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const [html, setHtml] = useState("");
    const usePreview = useNewsletterPreviewMutation();

    useImperativeHandle(ref, () => ({
        open(_id) {
            setHtml("");
            setOpen(true);
            usePreview.mutate(_id, {
                onSuccess: (res) => {
                    if (res.data) setHtml(res.data);
                    else { message.warning("No active newsletter found"); setOpen(false); }
                },
                onError: (err) => { showError(err); setOpen(false); }
            });
        },
    }));

    return (
        <Modal title="Newsletter Preview" style={{ top: 20 }} open={open} footer={null} onCancel={() => setOpen(false)} width={520} destroyOnClose>
            {usePreview.isPending
                ? <div className='text-center py-10'>Loading...</div>
                : <iframe title="newsletter-preview" srcDoc={html} className='w-full border-0' style={{ height: "75vh" }} />}
        </Modal>
    );
});

const SendModal = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const [newsletter, setNewsletter] = useState(null);
    const [data, setData] = useState({ name: "", toEmail: "" });
    const useSend = useNewsletterSendMutation();

    useImperativeHandle(ref, () => ({
        open(row) {
            setNewsletter(row || null);
            setData({ name: "", toEmail: "" });
            setOpen(true);
        },
    }));

    const send = () => {
        useSend.mutate(
            { ...data, _id: newsletter?._id },
            {
                onSuccess: (res) => {
                    if (res.data) {
                        message.success(res.message || "Newsletter sent");
                        setOpen(false);
                    } else {
                        message.warning(res.message);
                    }
                },
                onError: showError
            }
        )
    }

    return (
        <Modal
            title={newsletter ? `Send "${newsletter.title}" (${dayjs(newsletter.date).format("MMM D, YYYY")})` : "Send Latest Newsletter"}
            open={open}
            okText="Send"
            onOk={send}
            okButtonProps={{ loading: useSend.isPending }}
            onCancel={() => setOpen(false)}
            destroyOnClose
            maskClosable={false}
        >
            <Form layout="vertical">
                <Form.Item label="Name" required>
                    <Input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                </Form.Item>
                <Form.Item label="To Email" required>
                    <Input type="email" value={data.toEmail} onChange={(e) => setData({ ...data, toEmail: e.target.value })} />
                </Form.Item>
            </Form>
        </Modal>
    );
});
