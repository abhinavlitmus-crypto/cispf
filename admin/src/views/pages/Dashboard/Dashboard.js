import { AppstoreOutlined, CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined, EditOutlined, ExperimentOutlined, FileTextOutlined, HddOutlined, InboxOutlined, InfoCircleOutlined, MedicineBoxOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
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
    Tooltip,
} from "antd";
import { IoIosArrowUp } from "react-icons/io";
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { QUERY_ASSET_LIST } from '../../../constants/query.constants';
import { useAssetDeleteMutation, useAssetSaveMutation, useGetAssetQuery } from '../../../query/asset.query'
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import DataNotLoaded from '../../components/DataNotLoaded';
import MyPagination from '../../components/Pagination';
import dayjs from 'dayjs';
import moment from 'moment';
import { json2csv } from 'json-2-csv';
import { useGetManagementQuery } from '../../../query/management.query';
import { useGetClientQuery } from '../../../query/client.query';
import { useGetInventoryQuery } from '../../../query/inventory.query';
import { useGetEnagementQuery } from '../../../query/engagement.query';
import { useGetArtQuery } from '../../../query/art.query';
import ReactApexChart from "react-apexcharts";
import { Link } from 'react-router-dom';
import { useGetUserQuery } from '../../../query/user.query';
import { useGetCourseQuery } from '../../../query/course.query';

const AssetKPI = ({ userWholeData, courseWholeData }) => {


    const dashboardKpis = [
        {
            key: "user",
            title: "Total User",
            value: (userWholeData?.length || 0),
            sub: "Registered",
            icon: <TeamOutlined />,
            route: "/usersapp"
        },
        {
            key: "course",
            title: "Course",
            value: (courseWholeData?.length || 0),
            sub: "Recorded",
            icon: <ExperimentOutlined />,
            route: "/course"
        },
    ];

    const gradients = [
        "bg-[linear-gradient(322.46deg,_#BABC42_-0.77%,_#566642_39.81%,_#253E50_91.24%)]",
        "bg-[linear-gradient(322.46deg,_#253E50_-0.77%,_#566642_39.81%,_#BABC42_91.24%)]"
    ];
    return (
        <Row gutter={[26, 40]} className='mb-4'>
            {
                dashboardKpis.map((item, index) => (
                    <Col xs={24} sm={12} md={8} key={item.key}>
                        <Link to={`${item.route ? item.route : ""}`} >
                            <Card size='small' bordered className={`h-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 py-2 px-3 bg-[linear-gradient(322.46deg,_#BABC42_-0.77%,_#566642_39.81%,_#253E50_91.24%)] text-white rounded-2xl ${gradients[index % gradients.length]}`}>
                                <div className="flex flex-col gap-6">

                                    <div className="flex items-center gap-4 text-white text-lg">
                                        <div className="text-4xl">{item.icon}</div>
                                        <span >{item.title}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-5xl font-semibold text-white">
                                            {item.value}
                                        </div>

                                        <div className="w-9 aspect-square flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                            {/* <span className="text-white text-sm">↗</span> */}
                                            <IoIosArrowUp size={18} className='rotate-45 text-black'/> 
                                        </div>
                                    </div>

                                </div>
                            </Card>
                        </Link>
                    </Col>
                ))

            }
        </Row>
    )
}


export const Dashboard = () => {
    const { data: userWholeData } = useGetUserQuery({ isAll: true, isDeleted: false });
    const { data: courseWholeData } = useGetCourseQuery({ isAll: true, isDeleted: false });
    return (
        <div>
            <Card
                bordered={false}
                size="small"
                className='p-0'
                title={"Dashboard"}
            >

                <AssetKPI userWholeData={userWholeData?.data} courseWholeData={courseWholeData?.data} />

                {/* <Row gutter={[16, 16]} className='my-10'>
                    <Col xs={24} md={12}>
                        <HivStatusBarChart
                            ClientWholeData={ClientWholeData?.data || []}
                            hivPositiveWholeData={positiveData?.data || []}
                            hivNegativeWholeData={negativeData?.data || []}
                            hivPendingWholeData={pendingData?.data || []}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <InventoryCategoryDonut InventoryWholeData={InventoryWholeData?.data} />
                    </Col>
                </Row>
                <Row>
                    <Col span={24} >

                        <ArtStatusBarChart
                            hivPositiveWholeData={positiveData?.data || []}
                            ArtPendingData={ArtPendingData?.data || []}
                            ArtWholeData={ArtWholeData?.data || []}
                        />

                    </Col>
                </Row> */}
            </Card>
        </div>
    )
}
