import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import TinyMce from "../../../utils/TinyMce";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useQueryClient } from "@tanstack/react-query";
import util from "../../../utils/util";
import dayjs from "dayjs";


import TanstackPagination from "../../components/Pagination";

import { useContactListData } from "../../../api-hooks/contactus";

const Enquiries = () => {
  const [ar, setAr] = useState({
    viewAccess: util.checkRightAccess("SALES"),
    addAccess: util.checkRightAccess("SALES"),
    editAccess: util.checkRightAccess("SALES"),
    deleteAccess: util.checkRightAccess("SALES"),
  });

  const {
    data: { data, qData },
    isError,
    error,
    isLoading,
    refetchWithQuery,
  } = useContactListData({ page: 1, limit: 20 });
const addFormRef = useRef();
  const queryClient = useQueryClient();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      fixed: "left",
    },

    {
      title: "Company Name",
      dataIndex: "companyName",
      fixed: "left",
    },
    {
      title: "Enquiry Type",
      dataIndex: "lookingFor",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Reached By",
      dataIndex: "reachedBy",
    },
    {
      title: "Message",
      dataIndex: "message",
      width :  200,
      render:(v)=>(
        <p className=" max-w-md max-h-12 overflow-y-auto" >{v}</p>
      )
    },

    {
      title: "Location",
      dataIndex: "",
      render: (v, row) => (
        <div className=" flex flex-wrap">
          {row.country || ""}, {row.state || ""}
        </div>
      ),
    },
    {
          title: "Enquired At",
          dataIndex: "createdAt",
          render: (value) => dayjs(value).format("DD MMMM YYYY, h:mm A"),
          fixed: "right",
        },
  ].filter((item) => !item.hidden);

  const tableProps = {
    bordered: true,
    loading: isLoading,
    size: "small",
    title: () => (
      <Search
        {...{
          addFormRef,
          refetchWithQuery,
          ar,
        }}
      />
    ),
    showHeader: true,
    footer: () => (
      <TanstackPagination {...{ qData }} onChange={refetchWithQuery} />
    ),
    tableLayout: undefined,
  };
  return (
    <div>
      {isError && error ? (
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
      ) : (
        <Card
          bordered={false}
          size="small"
          className="p-0"
          title={"List of Enquiries"}
        >
          <Table
            {...tableProps}
            pagination={{ position: ["none"], pageSize: qData.limit }}
            columns={columns}
            dataSource={data}
            scroll={{x: "max-content"}}
          />
        </Card>
      )}
    </div>
  );
};

function Search({ refetchWithQuery, addFormRef, ar }) {
  const [searchFields, setSearchFields] = useState({});

  return (
    <Form>
      <Row gutter={12}>
        <Col span={18}>
          <Row gutter={12}>
            <Col span={6}>
              <Select
                allowClear
                placeholder="Filter by Looking For"
                value={searchFields.lookingFor}
                onChange={(value) => {
                  setSearchFields({ ...searchFields, lookingFor: value });
                  refetchWithQuery({ ...searchFields, lookingFor: value, page: 1 });
                }}
                style={{ width: "100%" }}
              >
                <Select.Option value="General">General</Select.Option>
                <Select.Option value="Sales">Sales</Select.Option>
              </Select>
            </Col>
          </Row>
        </Col>
        {/* Add button column if needed */}
      </Row>
    </Form>
  );
}


export default Enquiries;
