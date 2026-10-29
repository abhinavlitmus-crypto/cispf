import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import {
    Avatar,
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
    Table
} from "antd";
import dayjs from 'dayjs';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_WEBSITE_PAGE_KEY } from '../../../constants/query.constants';
import { useGetWebsitePageQuery, useWebsitePageDeleteMutation, useWebsitePageSaveMutation } from '../../../query/websitePage.query';
import TinyMce from '../../../utils/TinyMce';
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';

const DateInput = ({ value, onChange }) => (
    <DatePicker
        className='w-full'
        format="MMM D, YYYY"
        value={value ? dayjs(value) : null}
        onChange={(d) => onChange(d ? d.toISOString() : null)}
    />
);

const SingleImage = ({ value, onChange }) => (
    <UploadImage
        accept="image/*"
        listType="picture-card"
        value={value ? [value] : []}
        onChange={(e) => onChange(e?.[0] || "")}
    />
);

const MultiImage = ({ value, onChange }) => (
    <UploadImage
        accept="image/*"
        listType="picture-card"
        count={20}
        value={value || []}
        onChange={(e) => onChange(e || [])}
    />
);

// Fields that differ per page type. `set(key, value)` writes to details.<key>,
// `setSection(index, key, value)` writes to details.sections.<index>.<key>
const PAGE_CONFIG = {
    EVENT: {
        hasPublishDate: true,
        newDetails: () => ({ publishDate: dayjs().toISOString(), sections: [PAGE_CONFIG.EVENT.newSection()], featureImages: [] }),
        newSection: () => ({ image: "", date: null, description: "" }),
        TopFields: ({ details, set }) => (
            <>
                <Col span={8}>
                    <Form.Item label="Publish Date">
                        <DateInput value={details.publishDate} onChange={(v) => set("publishDate", v)} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Inside Title">
                        <Input
                            placeholder="Heading shown on the detail page"
                            value={details.insideTitle}
                            onChange={(e) => set("insideTitle", e.target.value)}
                        />
                    </Form.Item>
                </Col>
            </>
        ),
        SectionFields: ({ section, index, setSection }) => (
            <Row gutter={[12, 0]}>
                <Col span={6}>
                    <Form.Item label="Image">
                        <SingleImage value={section.image} onChange={(v) => setSection(index, "image", v)} />
                    </Form.Item>
                </Col>
                <Col span={18}>
                    <Form.Item label="Date">
                        <DateInput value={section.date} onChange={(v) => setSection(index, "date", v)} />
                    </Form.Item>
                    <Form.Item label="Description">
                        <Input.TextArea rows={3} value={section.description} onChange={(e) => setSection(index, "description", e.target.value)} />
                    </Form.Item>
                </Col>
            </Row>
        ),
        BottomFields: ({ details, set }) => (
            <>
                <h3 className='font-semibold text-base mb-2 mt-4'>Feature Images</h3>
                <MultiImage value={details.featureImages} onChange={(v) => set("featureImages", v)} />
            </>
        ),
    },
    POLICY_DISCUSSION: {
        newDetails: () => ({ sections: [PAGE_CONFIG.POLICY_DISCUSSION.newSection()] }),
        newSection: () => ({ images: [], date: null, title: "", authorName: "", authorDesignation: "", mainImage: "", mainDescription: "" }),
        SectionFields: ({ section, index, setSection }) => (
            <Row gutter={[12, 0]}>
                <Col span={6}>
                    <Form.Item label="Main Image">
                        <SingleImage value={section.mainImage} onChange={(v) => setSection(index, "mainImage", v)} />
                    </Form.Item>
                </Col>
                <Col span={18}>
                    <Row gutter={12}>
                        <Col span={16}>
                            <Form.Item label="Title">
                                <Input value={section.title} onChange={(e) => setSection(index, "title", e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="Date">
                                <DateInput value={section.date} onChange={(v) => setSection(index, "date", v)} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Author Name">
                                <Input value={section.authorName} onChange={(e) => setSection(index, "authorName", e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Author Designation">
                                <Input value={section.authorDesignation} onChange={(e) => setSection(index, "authorDesignation", e.target.value)} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={24}>
                    <Form.Item label="Main Description">
                        <TinyMce
                            value={section.mainDescription}
                            editorHeight={350}
                            onChange={(v) => setSection(index, "mainDescription", v)}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Images">
                        <MultiImage value={section.images} onChange={(v) => setSection(index, "images", v)} />
                    </Form.Item>
                </Col>
            </Row>
        ),
    },
    TEAM: {
        // Only a title (for the slug) + member sections; no page description / main image
        hideDescription: true,
        hideMainImage: true,
        sectionLabel: "Member",
        newDetails: () => ({ sections: [PAGE_CONFIG.TEAM.newSection()] }),
        newSection: () => ({ images: [], name: "", designation: "", description: "" }),
        SectionFields: ({ section, index, setSection }) => (
            <Row gutter={[12, 0]}>
                <Col span={12}>
                    <Form.Item label="Name">
                        <Input value={section.name} onChange={(e) => setSection(index, "name", e.target.value)} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Designation">
                        <Input value={section.designation} onChange={(e) => setSection(index, "designation", e.target.value)} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Description">
                        <Input.TextArea rows={3} value={section.description} onChange={(e) => setSection(index, "description", e.target.value)} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Images">
                        <MultiImage value={section.images} onChange={(v) => setSection(index, "images", v)} />
                    </Form.Item>
                </Col>
            </Row>
        ),
    },
};

// One page per sidebar entry; `type` is fixed by the menu item, never picked by the admin
export const WebsitePage = ({ type, label }) => {
    const [qData, setQData] = useState({ page: 1, limit: 20, total: 0, getTotal: false, type });
    const { data: pages, isLoading, isError } = useGetWebsitePageQuery(qData);
    const useDelete = useWebsitePageDeleteMutation();
    const addFormRef = useRef();
    const queryClient = useQueryClient();

    const columns = [
        {
            title: "Image",
            dataIndex: ["details", "mainImage"],
            width: 70,
            render: (v) => <Avatar shape="square" size={48} src={v} />,
            hidden: PAGE_CONFIG[type]?.hideMainImage,
        },
        {
            title: "Title",
            dataIndex: ["details", "title"],
            render: (v, row) => (
                <div>
                    <div className='font-medium'>{v}</div>
                    <div className='text-xs text-gray-500'>/{row.details?.slug}</div>
                </div>
            ),
        },
        {
            title: "Publish Date",
            dataIndex: ["details", "publishDate"],
            width: 130,
            render: (v) => v ? dayjs(v).format("MMM D, YYYY") : "-",
            hidden: !PAGE_CONFIG[type]?.hasPublishDate,
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
                            title={`Are you sure to delete this ${label}?`}
                            onConfirm={() => deleteData(row._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" size="small" danger icon={<DeleteOutlined />} />
                            &nbsp;
                        </Popconfirm>
                        <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => addFormRef.current.openForm(row)} />
                    </>
                );
            },
        },
    ].filter((item) => !item.hidden);

    const deleteData = (id) => {
        useDelete.mutate(
            { ids: id },
            {
                onSuccess: () => {
                    message.success("Data deleted successfully.");
                    queryClient.invalidateQueries({ queryKey: [QUERY_WEBSITE_PAGE_KEY] });
                },
                onError: (err) => message.error(err.message)
            }
        )
    }

    const tableProps = {
        bordered: true,
        loading: isLoading,
        size: "small",
        title: () => <Search {...{ addFormRef, qData, setQData, label }} />,
        showHeader: true,
        footer: () => <MyPagination {...{ qData, setQData }} />,
        tableLayout: undefined,
    };

    useEffect(() => {
        if (pages && pages.extra) {
            setQData(prevState => ({ ...prevState, ...pages.extra }));
        }
    }, [pages]);

    return (
        <div>
            <Card bordered={false} size="small" className='p-0' title={`${label} List`}>
                <Table
                    {...tableProps}
                    rowKey="_id"
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={pages?.data?.length ? pages?.data : []}
                />
                {!isLoading && isError && !pages?.data?.length && <DataNotLoaded />}

                <AddEditFormModal ref={addFormRef} {...{ queryClient, type, label }} />
            </Card>
        </div>
    )
}

export const Events = () => <WebsitePage type="EVENT" label="Event" />;
export const PolicyDiscussion = () => <WebsitePage type="POLICY_DISCUSSION" label="Policy Discussion" />;
export const Team = () => <WebsitePage type="TEAM" label="Team" />;

function Search({ qData, setQData, addFormRef, label }) {
    const [searchFields, setSearchFields] = useState({});
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
    }
    return (
        <Form onSubmitCapture={handleSearch}>
            <Row gutter={12}>
                <Col span={18}>
                    <Row gutter={12}>
                        <Col span={8}>
                            <Input
                                allowClear
                                placeholder={`Search ${label.toLowerCase()} by title`}
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
                            <Button type="primary" htmlType="submit">Search</Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={6} className='flex justify-end'>
                    <Button type="primary" onClick={() => addFormRef.current.openForm()}>Add New</Button>
                </Col>
            </Row>
        </Form>
    );
}

const AddEditFormModal = forwardRef((props, ref) => {
    const { queryClient, type, label } = props;
    const config = PAGE_CONFIG[type];
    const [data, setData] = useState({ details: {} });
    const [open, setOpen] = useState(false);
    const useSave = useWebsitePageSaveMutation();

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(dt
                ? { ...dt, details: JSON.parse(JSON.stringify(dt.details || {})) }
                : { type, status: true, details: config.newDetails() });
        },
    }));

    // Accepts dotted keys, e.g. handleChange({ "details.title": "..." })
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

    const details = data.details || {};
    const sections = details.sections || [];
    const set = (key, value) => handleChange({ [`details.${key}`]: value });
    const setSection = (index, key, value) => handleChange({ [`details.sections.${index}.${key}`]: value });
    const addSection = () => handleChange({ "details.sections": [...sections, config.newSection()] });
    const removeSection = (index) => handleChange({ "details.sections": sections.filter((_, i) => i !== index) });

    const save = () => {
        const { _id, status, details } = data;
        useSave.mutate(
            { _id, type, status, details },
            {
                onSuccess: () => {
                    message.success('Data saved successfully.');
                    queryClient.invalidateQueries({ queryKey: [QUERY_WEBSITE_PAGE_KEY] });
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
            handleChange({ "details.slug": util.removeSpecialChars(data.details?.title || "") });
        }
    }, [data.details?.title]);

    return (
        <Modal
            title={<span>{data._id ? "Edit " : "Add "} {label}</span>}
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
                    <Col span={12}>
                        <Form.Item label="Title" required>
                            <Input placeholder={`${label} title`} value={details.title} onChange={(e) => set("title", e.target.value)} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Slug" required>
                            <Input placeholder="auto generated from title" value={details.slug} disabled />
                        </Form.Item>
                    </Col>
                    {!config.hideDescription && <Col span={16}>
                        <Form.Item label="Description">
                            <Input.TextArea rows={4} value={details.description} onChange={(e) => set("description", e.target.value)} />
                        </Form.Item>
                    </Col>}
                    {!config.hideMainImage && <Col span={4}>
                        <Form.Item label="Main Image">
                            <SingleImage value={details.mainImage} onChange={(v) => set("mainImage", v)} />
                        </Form.Item>
                    </Col>}
                    <Col span={4}>
                        <Form.Item label="Status" required>
                            <Select value={data.status} onChange={e => handleChange({ status: e })}>
                                <Select.Option value={true}>Active</Select.Option>
                                <Select.Option value={false}>Inactive</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {config.TopFields && <config.TopFields {...{ details, set }} />}
                </Row>

                <div className='flex items-center justify-between mb-2 mt-2'>
                    <h3 className='font-semibold text-base'>{config.sectionLabel ? `${config.sectionLabel}s` : "Sections"}</h3>
                    <Button icon={<PlusOutlined />} onClick={addSection}>Add {config.sectionLabel || "Section"}</Button>
                </div>

                {sections.map((section, index) => (
                    <Card
                        key={index}
                        size="small"
                        className='mb-3'
                        title={`${config.sectionLabel || "Section"} ${index + 1}${section.name ? ` - ${section.name}` : ""}`}
                        extra={<Button size="small" danger icon={<DeleteOutlined />} onClick={() => removeSection(index)} />}
                    >
                        <config.SectionFields {...{ section, index, setSection }} />
                    </Card>
                ))}

                {config.BottomFields && <config.BottomFields {...{ details, set }} />}
            </Form>
        </Modal>
    );
});
