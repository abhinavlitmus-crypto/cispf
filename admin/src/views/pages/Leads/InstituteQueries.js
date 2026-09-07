import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
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
    Table
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_AUTHOR_KEY } from '../../../constants/query.constants';
import { useInstituteSaveMutation, useGetInstituteQuery, useInstituteDeleteMutation } from '../../../query/institute.query';
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import { useGetLeadsQuery } from '../../../query/leads.query';

export const ContactInstitute = () => {
    const [qData, setQData] = useState({ page: 1, limit: 20, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetLeadsQuery({...qData, type: 'INSTITUTE' });
    // const [selected, setSelected] = useState([]);
    // const useDelete = useInstituteDeleteMutation();
    // const addFormRef = useRef();
    // const queryClient = useQueryClient()
     const columns = [
    
    {
      title: "Name",
      dataIndex: ["details", "fullName"], // direct nested key access
    },
    {
      title: "Phone",
      dataIndex: ["details", "phone"], // direct nested key access
    },
    {
      title: "Email",
      dataIndex: ["details", "email"], // direct nested key access
    },
    {
      title: "Medium",
      dataIndex: ["details", "medium"], // direct nested key access
    },
    {
      title: "Mode",
      dataIndex: ["details", "mode"], // direct nested key access
    },
     
    
    {
      title: "Exam",
      dataIndex: ["details", "exam"], // direct nested key access
    },
    {
      title: "Lead URL",
      render: (_, record) => {
        const url = record?.details?.url;
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-medium"
          >
            Source Link
          </a>
        ) : (
          <span className="text-gray-400 italic">No URL</span>
        );
      },
    },
    {
  title: "Date",
  dataIndex: ["details", "date"], // ✅ correct nested path
  render: (value) =>
    value ? new Date(value).toLocaleString("en-IN") : "—",
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
    // {
    //     title: "Action",
    //     dataIndex: "_id",
    //     width: 70,
    //     render: (v, row) => {
    //         return (
    //             <>
    //                 <Popconfirm
    //                     title="Are you sure to delete this Author?"
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


    // const deleteData = (id) => {
    //     useDelete.mutate(
    //         { ids: id },
    //         {
    //             onSuccess: (res) => {
    //                 message.success("Data deleted successfully.");
    //                 queryClient.invalidateQueries({
    //                     queryKey: [QUERY_AUTHOR_KEY],
    //                 })
    //             },
    //             onError: (err) => {
    //                 message.error(err.message);
    //             }
    //         }
    //     )
    // }

    const tableProps = {
        bordered: true,
        loading: isLoading,
        size: "small",
        // title: () => (
        //     <Search
        //         {...{
        //             addFormRef,
        //             // selected,
        //             qData,
        //             setQData,
        //             authors
        //         }}
        //     />
        // ),
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
                title={"Enquiries"}
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

