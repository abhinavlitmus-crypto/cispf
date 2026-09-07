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
import { useGetEnagementQuery } from '../../../query/engagement.query';
import { json2csv } from 'json-2-csv';
import commonObj from '../../../commonObj';
const role = commonObj.userType;
const permissions = {
    canView: true,

    canEdit:
        role === "SuperAdmin" ||
        role === "COUNCELLORS/ORW" ||
        role === "PO" ||
        role === "MNE",
    canExport:
        role === "SuperAdmin" ||
        role === "COUNCELLORS/ORW" ||
        role === "MNE",

    canDelete:
        role === "SuperAdmin" ||
        role === "COUNCELLORS/ORW" ,

    canAdd:
        role === "SuperAdmin" ||
        role === "PO" ||
        role === "COUNCELLORS/ORW" ||
        role === "MNE",
};
const { canAdd, canDelete, canEdit, canView, canExport } = permissions;
export const Hiv = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetEnagementQuery({ ...qData,isAll: true, testingResult: "+ve", linkageStatus: qData.linkageStatus, });
    const useDelete = useAttendanceDeleteMutation();
    const addFormRef = useRef();
    const queryClient = useQueryClient()
    const columns = [

        {
            title: "Name",
            dataIndex: ["clientDetails", "clientName"],
            // width: 300,
            render : (value)=> value?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            // width: 300,
        },
        {
            title: "Gender",
            dataIndex: ["clientDetails", "gender"],
            // width: 300,
        },
        {
            title: "Age",
            dataIndex: ["clientDetails", "age"],
            // width: 300,
        },
        {
            title: "ART Status",
            key: "artStatus",
            render: (_, row) => {
                console.log("dat",row);
                const isLinked = row.artDetails && row.artDetails.length > 0 && row.artDetails[0].artRegistrationNumber;
                return isLinked ? (
                    <Tag color='green'>Linked to ART</Tag>
                ) : (
                    <Tag color='orange'>Pending</Tag>
                )
            },
            width: 100,
        },


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
                    authors
                }}
            />
        ),
        showHeader: true,
        footer: () => <MyPagination {...{ qData, setQData }} />,
       
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
                title={"HIV Positivity Tracker"}
            >
                <Table
                    {...tableProps}
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={authors?.data?.length ? authors?.data : []}
                />
                {!isLoading && isError && !authors.data.length && <DataNotLoaded />}

                {/* <AddEditFormModal ref={addFormRef} {...{ queryClient }} /> */}
            </Card>
        </div>
    )
}

function Search({ qData, setQData, addFormRef }) {
    const [searchFields, setSearchFields] = useState({})
    const { data: AllData } = useGetEnagementQuery(qData);
    const { data: WholeData } = useGetEnagementQuery({ isAll: true });
    const handleSearch = () => {
        setQData({ ...qData, ...searchFields, page: 1 });
        // console.log("searchFields", qData);

    }
    // convert JSON -> CSV + download
    const downloadCsv = async (rows, fileName = "Art.csv") => {
        if (!Array.isArray(rows) || rows.length === 0) {
            message.warning("No data to export");
            return;
        }

        // OPTIONAL: map only the fields you want in CSV
        const cleaned = rows.map((r) => ({
            // ===== Client =====
            "Client Name": r.clientDetails?.clientName ?? "",

            // ===== Testing & Registration =====
            "Center Registration Name": r.centerRegistrationName ?? "",
            "HIV Test Result": r.hivTestResult ?? "",
            "PID Number": r.pidNo ?? "",
            "Testing Center Name": r.testingCenterName ?? "",

            // ===== ART Details =====
            "ART Registration Number": r.artRegistrationNumber ?? "",
            "ART Center Name": r.artCenterName ?? "",
            "ART Initiation Date": r.artInitiationDate
                ? `'${moment(r.artInitiationDate).format("DD MMM YYYY")}`
                : "",
        }));

        const csv = json2csv(cleaned);

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    };

    // Export current page (authors.data is current page data)
    const handleExport = async () => {
        await downloadCsv(AllData?.data || [], "Art_current_page.csv");
        message.success("Current page data exported successfully.");
    };

    // Export all (fetch all pages from API)

    const handleExportAll = async () => {
        await downloadCsv(WholeData?.data || [], "Art_all_data.csv");
        message.success("Whole data exported successfully.");
    };
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

                <Col span={6}>
                    <Col span={24} className="flex items-center w-full gap-x-2 justify-end">
                        {/* Export buttons BEFORE Add New */}
                        {/* <Button onClick={handleExport}>Export</Button> */}
                                                <Select
                            placeholder="Filter"
                            allowClear
                            style={{ width: 150 }}
                            dropdownStyle={{ minWidth: 150 }}
                            className='filter-select'
                            onChange={(value) => {
                                setQData({
                                    ...qData,
                                    linkageStatus: value || undefined,
                                    page: 1,
                                });
                            }}
                            options={[
                                { label: "Linked to ART", value: "linked" },
                                { label: "Pending linkage", value: "pending" },
                            ]}
                        />
                    </Col>
                </Col>
            </Row >
        </Form >
    );
}
// function Search({ qData, setQData }) {
//     const [searchFields, setSearchFields] = useState({})
    
//     // const { data: AllData } = useGetEnagementQuery(qData);
//     const { data: WholeData } = useGetEnagementQuery({ isAll: true });

//     // const WholeData = authors;
//     // const AllData = [];
//     const handleSearch = () => {
//         setQData({ ...qData, ...searchFields, page: 1 });
//         console.log("searchFields", searchFields);
//     }
//     // convert JSON -> CSV + download
//     const downloadCsv = async (rows, fileName = "HIV.csv") => {
//         if (!Array.isArray(rows) || rows.length === 0) {
//             message.warning("No data to export");
//             return;
//         }

//         // OPTIONAL: map only the fields you want in CSV
//         const cleaned = rows.map((r) => ({
//             Name: r?.clientDetails?.clientName ?? "",
//             Phone: r?.phone ?? "",
//             Gender: r?.clientDetails?.gender ?? "",
//             Age: r?.clientDetails?.age ?? "",
//             "ART Status":
//                 r?.artDetails && r.artDetails.length > 0
//                     ? "Linked to ART"
//                     : "Pending",
//         }));


//         const csv = json2csv(cleaned);

//         const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//         const url = URL.createObjectURL(blob);

//         const a = document.createElement("a");
//         a.href = url;
//         a.download = fileName;
//         document.body.appendChild(a);
//         a.click();
//         a.remove();

//         URL.revokeObjectURL(url);
//     };

//     // Export current page (authors.data is current page data)
//     // const handleExport = async () => {
//     //     await downloadCsv(AllData?.data || [], "Inventory_current_page.csv");
//     //     message.success("Current page data exported successfully.");
//     // };

//     // Export all (fetch all pages from API)

//     const handleExportAll = async () => {
//         await downloadCsv(WholeData?.data || [], "HIV_all_data.csv");
//         message.success("Whole data exported successfully.");
//     };
//     return (
//         <Form onSubmitCapture={handleSearch}>
//             <Row gutter={12}>
//                 <Col span={18}>
//                     <Row gutter={12}>
//                         <Col span={6}>
//                             <Input
//                                 allowClear
//                                 placeholder="Search by name"
//                                 value={searchFields.key}
//                                 onChange={(e) => {
//                                     if (!e.target.value) {
//                                         setQData({ ...qData, key: undefined, page: 1 });
//                                     }
//                                     setSearchFields({ ...searchFields, key: e.target.value });
//                                 }

//                                 }
//                             />
//                         </Col>
//                         <Col span={3}>
//                             <Button type="primary" htmlType="submit">
//                                 Search
//                             </Button>
//                         </Col>
//                     </Row>
//                 </Col>

//                 <Col span={6}>
//                     <Col span={24} className="flex items-center w-full gap-x-2 justify-end">
//                         {/* Export buttons BEFORE Add New */}
//                         {/* <Button onClick={handleExport}>Export</Button> */}
//                         {WholeData?.data?.length > 0 && canExport && <Button onClick={handleExportAll}>Export All</Button>}

//                         <Select
//                             placeholder="Filter"
//                             allowClear
//                             style={{ width: 150 }}
//                             dropdownStyle={{ minWidth: 150 }}
//                             className='filter-select'
//                             onChange={(value) => {
//                                 setQData({
//                                     ...qData,
//                                     linkageStatus: value || undefined,
//                                     page: 1,
//                                 });
//                             }}
//                             options={[
//                                 { label: "Linked to ART", value: "linked" },
//                                 { label: "Pending linkage", value: "pending" },
//                             ]}
//                         />
//                     </Col>
//                 </Col>
//             </Row >
//         </Form >
//     );
// }



// const AddEditFormModal = forwardRef((props, ref) => {
//     const { queryClient } = props
//     const [data, setData] = useState({});
//     const [open, setOpen] = useState(false);
//     const useSave = useAttendanceSaveMutation();
//     useImperativeHandle(ref, () => ({
//         openForm(dt) {
//             setOpen(true);
//             setData(dt ? { ...dt } : { status: true });
//         },
//     }));

//     const handleChange = (value) => {
//         Object.entries(value).forEach(ent => {
//             let varDt = data;
//             const k = ent[0];
//             const v = ent[1];
//             let keys = k.split('.');
//             for (let i = 0; i < keys.length; i++) {
//                 if (i + 1 === keys.length) {
//                     varDt[keys[i]] = v;
//                 } else {
//                     if (typeof varDt[keys[i]] === 'undefined') {
//                         if (parseInt(keys[i + 1]) * 1 >= 0) {
//                             varDt[keys[i]] = [];
//                         } else {
//                             varDt[keys[i]] = {};
//                         }
//                     } varDt = varDt[keys[i]];
//                 }
//             }
//         });
//         setData({ ...data });
//     }



//     const save = () => {
//         useSave.mutate(
//             data,
//             {
//                 onSuccess: (res) => {
//                     message.success('Data saved successfully.');
//                     queryClient.invalidateQueries({
//                         queryKey: [QUERY_ATTENDANCE_KEY]
//                     })
//                     setOpen(false);

//                 },
//                 onError: (err) => {
//                     if (typeof err.message !== "string") {
//                         message.error(err.message[Object.keys(err.message)[0]][0]);
//                     } else {
//                         message.error(err.message);
//                     }
//                 }
//             }
//         )

//     }
//     useEffect(() => {
//         if (!data._id) {
//             handleChange({ slug: util.removeSpecialChars(data.name || "") });
//         }
//     }, [data.name]);
//     return (
//         <>
//             <Modal
//                 title={<span>Attendance Detail</span>}
//                 style={{ top: 20 }}
//                 open={open}
//                 okText="Save"
//                 onOk={save}
//                 okButtonProps={{ disabled: useSave.isPending }}
//                 onCancel={() => {
//                     setOpen(false);
//                 }}
//                 destroyOnClose
//                 maskClosable={false}
//                 width={600} FFFF
//                 footer={null}
//             // className="app-modal-body-overflow"

//             >
//                 {/* {data.details && (
//                     <List
//                         dataSource={data.details}
//                         itemLayout="horizontal"
//                         renderItem={(item, index) => (
//                             <List.Item>
//                                 <Card
//                                     size="small"
//                                     style={{ width: "100%" }}
//                                     title={`Session ${index + 1}`}
//                                 >
//                                     <Row gutter={[16, 8]}>
//                                         <Col span={8}>
//                                             <strong>Check In:</strong><br />
//                                             {formatTime(item.punchIn)}
//                                         </Col>

//                                         <Col span={8}>
//                                             <strong>Check Out:</strong><br />
//                                             {
//                                                 item.punchOut ? (
//                                                     formatTime(item.punchOut)
//                                                 ) : (
//                                                     <Tag color="green">Active Session</Tag>
//                                                 )
//                                             }

//                                         </Col>

//                                         <Col span={8}>
//                                             <strong>Duration:</strong><br />
//                                             {formatDuration(item.punchIn, item.punchOut)}
//                                         </Col>
//                                     </Row>
//                                 </Card>
//                             </List.Item>
//                         )}
//                     />
//                 )} */}

//                 {
//                     data.details && (
//                         <Timeline style={{ marginTop: 16 }}>
//                             {data.details.map((item, index) => (
//                                 <Timeline.Item key={index}
//                                     color={item.punchOut ? "blue" : "green"}
//                                 >
//                                     <Card title={`Session ${index + 1}`} size='small'>
//                                         <Row gutter={[12, 8]}>
//                                             <Col span={8}>
//                                                 <strong>Check In</strong><br />
//                                                 {formatTime(item.punchIn)}
//                                             </Col>
//                                             <Col span={8}>
//                                                 <strong>Check Out</strong><br />
//                                                 {item.punchOut ? formatTime(item.punchOut) : <Tag color='green'>Active</Tag>}
//                                             </Col>
//                                             <Col span={8}>
//                                                 <strong>Duration</strong><br />
//                                                 {formatDuration(item.punchIn, item.punchOut)}
//                                             </Col>
//                                         </Row>
//                                     </Card>
//                                 </Timeline.Item>
//                             ))}
//                         </Timeline>
//                     )
//                 }




//             </Modal>
//         </>
//     );
// });
