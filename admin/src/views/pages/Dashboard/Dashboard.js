import { Card } from "antd";
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import ReactApexChart from "react-apexcharts";
import { Link } from 'react-router-dom';
import { useGetCourseQuery } from '../../../query/course.query';
import { useGetUserQuery } from '../../../query/user.query';

const AssetKPI = ({ userWholeData, courseWholeData }) => {
    const dashboardKpis = [
        {
            key: "user",
            title: "Total Users",
            value: (userWholeData?.length || 0),
            route: "/usersapp"
        },
        {
            key: "course",
            title: "Courses",
            value: (courseWholeData?.length || 0),
            route: "/course"
        },
    ];

    return (
        <div className="flex flex-wrap gap-4">
            {
                dashboardKpis.map((item) => (
                    <Link to={`${item.route ? item.route : ""}`} key={item.key}>
                        <div className="min-w-[130px] rounded-lg border border-[#E3E8EC] bg-white px-6 py-4 text-center shadow-sm transition-shadow duration-200 hover:shadow-md">
                            <div className="text-4xl font-medium leading-tight text-primary">
                                {item.value}
                            </div>
                            <div className="mt-1 text-xs text-[#6B7280]">{item.title}</div>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

const UsersChart = ({ userWholeData }) => {
    const { categories, counts } = useMemo(() => {
        const months = Array.from({ length: 12 }, (_, i) => dayjs().subtract(11 - i, "month"));
        const byMonth = {};
        (userWholeData || []).forEach((user) => {
            if (!user?.createdAt) return;
            const key = dayjs(user.createdAt).format("YYYY-MM");
            byMonth[key] = (byMonth[key] || 0) + 1;
        });
        return {
            categories: months.map((m) => m.format("MMM YY")),
            counts: months.map((m) => byMonth[m.format("YYYY-MM")] || 0),
        };
    }, [userWholeData]);

    const options = {
        chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "inherit" },
        colors: ["#0D7077"],
        stroke: { curve: "straight", width: 2 },
        fill: { type: "solid", colors: ["#C5DBDF"], opacity: 0.9 },
        dataLabels: { enabled: false },
        markers: { size: 0, hover: { size: 5 } },
        grid: { borderColor: "#E3E8EC", strokeDashArray: 3 },
        xaxis: { categories, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: "#6B7280" } } },
        yaxis: { min: 0, forceNiceScale: true, labels: { style: { colors: "#6B7280" }, formatter: (v) => Math.round(v) } },
        tooltip: { y: { formatter: (v) => `${v} users` } },
    };

    return (
        <div className="mt-6 rounded-lg bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[#374151]">Users</h3>
            <p className="text-xs text-[#6B7280]">Monthly Users Summary</p>
            <ReactApexChart options={options} series={[{ name: "New users", data: counts }]} type="area" height={300} />
        </div>
    );
};

export const Dashboard = () => {
    const { data: userWholeData } = useGetUserQuery({ isAll: true, isDeleted: false });
    const { data: courseWholeData } = useGetCourseQuery({ isAll: true, isDeleted: false });
    return (
        <div>
            <Card
                bordered={false}
                size="small"
                className='p-0'
                title={"App Overview"}
            >
                <AssetKPI userWholeData={userWholeData?.data} courseWholeData={courseWholeData?.data} />
                <UsersChart userWholeData={userWholeData?.data} />
            </Card>
        </div>
    )
}
