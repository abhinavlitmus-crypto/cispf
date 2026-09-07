import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
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
} from "antd";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { QUERY_AUTHOR_KEY } from "../../../constants/query.constants";
import {
  useInstituteSaveMutation,
  useGetInstituteQuery,
  useInstituteDeleteMutation,
} from "../../../query/institute.query";
import UploadImage from "../../../utils/UploadImage";
import util from "../../../utils/util";
import DataNotLoaded from "../../components/DataNotLoaded";
import MyPagination from "../../components/Pagination";
import { useGetLeadsQuery } from "../../../query/leads.query";

export const ListingQueries = () => {
  const [qData, setQData] = useState({
    page: 1,
    limit: 20,
    total: 0,
    getTotal: false,
  });
  const {
    data: authors,
    isLoading,
    isError,
  } = useGetLeadsQuery({ ...qData, type: "LISTING" });
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
      title: "Exam",
      dataIndex: ["details", "exam"], // direct nested key access
    },
    {
      title: "City",
      dataIndex: ["details", "city"], // direct nested key access
    },
    {
      title: "medium",
      dataIndex: ["details", "medium"], // direct nested key access
    },
    {
      title: "Institutes",
      render: (_, record) => {
        const institutes = record?.details?.selectedInstitutes || [];
        return institutes.length ? (
          <div className="flex flex-wrap gap-2">
            {institutes.map((inst, i) => (
              <h1
                key={i}
                className="bg-blue-100 text-black px-3 py-1 rounded-lg text-sm font-medium"
              >
                {inst}
              </h1>
            ))}
          </div>
        ) : (
          "—"
        );
      },
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
  ].filter((item) => !item.hidden);

  const tableProps = {
    bordered: true,
    loading: isLoading,
    size: "small",

    showHeader: true,
    footer: () => <MyPagination {...{ qData, setQData }} />,

    tableLayout: undefined,
  };
  useEffect(() => {
    if (authors && authors.extra) {
      setQData((prevState) => ({
        ...prevState,
        ...authors.extra,
      }));
    }
  }, [authors]);
  return (
    <div>
      <Card bordered={false} size="small" className="p-0" title={"Enquiries"}>
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
  );
};
