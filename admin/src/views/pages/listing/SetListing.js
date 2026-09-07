import { useEffect, useState, useMemo } from "react";
import { Row, Col, Card, Table, Spin, Alert, Button } from "antd";
import { useGetBListingQuery } from "../../../query/listing.query";
import {
  useBranchSaveMutation,
  useGetBranchQuery,
} from "../../../query/branch.query";

export default function ExamCityListing() {
  const qData = {
    page: 1,
    limit: 20,
    search: "",
  };

  const { data: listingData } = useGetBListingQuery(qData);

  // transform API response → only examName + cityName
  const formattedData = useMemo(() => {
    if (!listingData?.data) return [];
    return listingData.data.map((item) => ({
      _id: item._id,
      exam: item.exam?.name || "N/A",
      city: item.city?.name || "N/A",
    }));
  }, [listingData]);

  const columns = (setOpenRow) => [
    {
      title: "Exam Name",
      dataIndex: "exam",
    },
    {
      title: "City Name",
      dataIndex: "city",
    },
  ];

  return (
    <ParentChildLayout
      title="Listings"
      fetchData={async () => formattedData}
      columns={columns}
      deps={[listingData]} // ✅ added dependency to trigger re-fetch when data loads
    />
  );
}

function ParentChildLayout({
  title,
  fetchData,
  columns,
  parentId = null,
  parentName = null,
  pParentIds = [],
  deps = [],
}) {
  const allParentIds = [...pParentIds, parentId];
  const [openRow, setOpenRow] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchData(parentId);
      setList(data || []);
      if (data?.length && !openRow) setOpenRow(data[0]); // auto-select first
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId, ...deps]); // ✅ re-run when data changes

  return (
    <Row gutter={16}>
      {/* Left Component */}
      <Col span={openRow && allParentIds.length < 2 ? 10 : 24}>
        <Card
          bordered={false}
          size="small"
          title={parentName ? `${parentName} → Branches` : title}
        >
          <Table
            bordered
            loading={loading}
            columns={columns(setOpenRow)}
            dataSource={list}
            rowKey="_id"
            pagination={false}
            onRow={(record) => ({
              onClick: () => setOpenRow(record),
            })}
            rowClassName={(record) =>
              openRow && record._id === openRow._id ? "bg-gray-200" : ""
            }
          />
        </Card>
      </Col>

      {/* Right Component */}
      {openRow && allParentIds.length < 2 && (
        <Col span={14}>
          <BranchList exam={openRow.exam} city={openRow.city} />
        </Col>
      )}
    </Row>
  );
}

function BranchList({ exam, city }) {
  const [branchOptions, setBranchOptions] = useState({});
  const { mutate, isPending } = useBranchSaveMutation();

  // 🚀 only fetch when both exam & city are present
  const { data: branchData, isLoading, isError } = useGetBranchQuery(
    { page: 1, limit: 20, search: "", exam, city },
    { enabled: !!exam && !!city }
  );

 
  useEffect(() => {
  if (branchData?.data?.length) {
    const initialOptions = {};

    branchData.data.forEach((branch) => {
      // 💡 find the matching exam _id from the current examDetails object
      const matchedExam = branch?.examDetails.find((ex) => ex.name === exam);

      // 🧠 find that examId inside this branch.exams
      const examObj = Array.isArray(branch.exams)
        ? branch.exams.find((ex) => ex.examId === matchedExam?._id)
        : null;

      initialOptions[branch._id] = {
        show: examObj?.status ?? false,
        featured: examObj?.featured ?? false,
        index: examObj?.index ?? "",
      };
    });

    setBranchOptions(initialOptions);
  }
}, [branchData, exam]);


  

  // Track local changes row by row
  const handleChange = (branchId, field, value) => {
    setBranchOptions((prev) => ({
      ...prev,
      [branchId]: {
        ...prev[branchId],
        [field]: value,
      },
    }));
  };

  const saveRow = (row) => {
  const options = branchOptions[row._id] || {};

  // 💡 find the examId for this exam name from row.examDetails
  const matchedExam = row?.examDetails?.find((ex) => ex.name === exam);
  if (!matchedExam?._id) return; // no matching exam found, skip

  const examId = matchedExam._id;

  // 🧠 build the updated exam object
  const updatedExam = {
    examId, // keep examId same
    featured: options.featured ?? false,
    index: options.index ? Number(options.index) : 100,
    status: options.show ?? false,
  };

  let updatedExams = [];

  if (Array.isArray(row.exams)) {
    const exists = row.exams.some((ex) => ex.examId === examId);

    if (exists) {
      // ✅ update only that matching examId object
      updatedExams = row.exams.map((ex) =>
        ex.examId === examId ? { ...ex, ...updatedExam } : ex
      );
    } else {
      // ✅ if not found, add new exam object
      updatedExams = [...row.exams, updatedExam];
    }
  } else {
    updatedExams = [updatedExam];
  }

  const payload = {
    ...row,
    exams: updatedExams, // merged exams array with updated one
  };

  console.log("Saving row", payload);

  mutate(payload, {
    onSuccess: () => {
      // message.success("Row saved successfully.");
    },
    onError: (err) => {
      // message.error(err.message || "Save failed");
    },
  });
};


  const columns = [
    {
      title: "Branch Name",
      dataIndex: "branchName",
    },
    {
      title: "Show",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={branchOptions[row._id]?.show || false}
          onChange={(e) => handleChange(row._id, "show", e.target.checked)}
        />
      ),
    },
    {
      title: "Featured",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={branchOptions[row._id]?.featured || false}
          onChange={(e) => handleChange(row._id, "featured", e.target.checked)}
        />
      ),
    },
    {
      title: "Index",
      render: (_, row) => (
        <input
          type="number"
          className="w-16 border px-2 py-1 rounded"
          value={branchOptions[row._id]?.index || ""}
          onChange={(e) => handleChange(row._id, "index", e.target.value)}
        />
      ),
    },
    {
      title: "Actions",
      render: (_, row) => (
        <Button
          type="primary"
          size="small"
          loading={isPending}
          onClick={() => saveRow(row)}
        >
          Save
        </Button>
      ),
    },
  ];

  if (!exam || !city) return null;

  return (
    <Card bordered={false} size="small" title={`Branches for ${exam} in ${city}`}>
      {isLoading ? (
        <Spin tip="Loading branches..." />
      ) : isError ? (
        <Alert type="error" message="Failed to load branches" />
      ) : branchData?.data?.length ? (
        <Table
          bordered
          columns={columns}
          dataSource={branchData.data}
          rowKey="_id"
          pagination={false}
        />
      ) : (
        <p className="text-gray-500 p-2">No branches found.</p>
      )}
    </Card>
  );
}
