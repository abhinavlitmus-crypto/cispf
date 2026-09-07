import { EditOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';

import {
    Button,
    Card,
    Col,
    Form,
    Input,
    message,
    Modal,
    Row,
    Table,
} from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { QUERY_ME } from '../../../constants/query.constants';
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import {useGetMeQuery, useMeSaveMutation} from '../../../query/me.query';
import commonObj from '../../../commonObj';

export const Profile = () => {
    const [qData, setQData] = useState({ page: 1, limit: 10, total: 0, getTotal: false });
    const { data: authors, isLoading, isError } = useGetMeQuery({_id: commonObj._id });
    // const [selected, setSelected] = useState([]);
    const addFormRef = useRef();
    const queryClient = useQueryClient()
    const columns = [

        {
            title: "Name",
            dataIndex: [ "name"],
            render : (value)=> value?.toLowerCase().trim().split(/\s+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" "),
            // width: 300,
        },
        {
            title: "Email",
            dataIndex: "email",
            // width: 300,
        },
        {
            title: "Type",
            dataIndex: "userType",
            // width: 300,
        },
      
        {
            title: "Status",
            dataIndex: "status",
            width: 100,
            render: (_, { status }) => {
                if (status) {
                    return <h1 className='bg-green-200 text-center text-xs rounded py-1 border border-green-300'>Active</h1>;
                } else {
                    console.log("false")
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
                        {/* <Popconfirm
                            title="Are you sure to delete this Prep?"
                            onConfirm={() => {
                                deleteData(row._id);
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
                        </Popconfirm> */}
                        <Button
                            type="primary"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => {
                                addFormRef.current.openForm(row);
                            }}
                        >
                          Edit Details
                        </Button>
                    </>
                );
            },
        },
    ].filter((item) => !item.hidden);

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
        // footer: () => <MyPagination {...{ qData, setQData }} />,
      
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
                title={`Hello, ${commonObj.name} `}
            >
                <Table
                    {...tableProps}
                    pagination={{ position: ["none"], pageSize: qData.limit }}
                    columns={columns}
                    dataSource={authors?.data?.length ? authors?.data : []}
                />
                {!isLoading && isError && !authors.data.length && <DataNotLoaded />}

                <AddEditFormModal ref={addFormRef} {...{ queryClient }} />
            </Card>
        </div>
    )
}

const AddEditFormModal = forwardRef((props, ref) => {
  const { queryClient } = props;
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const useSave = useMeSaveMutation();

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      // ensure socialLink always exists as an object
      setData(dt ? { ...dt, socialLink: dt.socialLink || {} } : { status: true, socialLink: {} });
    },
  }));

  // ✅ generic handleChange that supports nested objects and merges
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
          queryKey: [QUERY_ME],
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

  return (
    <>
      <Modal
        title={<span>{data._id ? "Edit " : "Add "} Profile</span>}
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
            <Col span={12}>
              <Form.Item label="Name" required>
                <Input
                  type="text"
                  placeholder="Prateek Mishra"
                  value={data.name}
                  onChange={(e) => handleChange({ name: e.target.value })}
                />
              </Form.Item>
            </Col>

            {/* Profile Avatar */}
            <Col span={12}>
              <Form.Item label="Profile" required>
                <UploadImage
                  value={data.avatar ? [data.avatar] : []}
                  count={1}
                  onChange={(v) => {
                    setData({ ...data, avatar: v?.[v.length - 1] || "" });
                  }}
                  listType="picture-card"
                />
              </Form.Item>
            </Col>

            {/* Email */}
            <Col span={12}>
              <Form.Item label="E-Mail" required>
                <Input
                disabled={true}
                  type="email"
                  placeholder="prateek@test.com"
                  value={data.email}
                  onChange={(e) => handleChange({ email: e.target.value })}
                />
              </Form.Item>
            </Col>

            {/* Password */}
            {!data._id ? (
              <Col span={12}>
                <Form.Item label="Set Password" required>
                  <Input.Password
                    placeholder="*********"
                    value={data.password}
                    onChange={(e) =>
                      handleChange({
                        password: util.removeSpecialChars(e.target.value),
                      })
                    }
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </Col>
            ) : (
              <Col span={12}>
                <Form.Item label="Update Password">
                  <Input.Password
                    placeholder="*********"
                    value={data.password}
                    onChange={(e) => handleChange({ password: e.target.value })}
                  />
                </Form.Item>
              </Col>
            )}


          
          </Row>
        </Form>
      </Modal>
    </>
  );
});

