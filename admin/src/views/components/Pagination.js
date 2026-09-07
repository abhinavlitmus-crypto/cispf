import { Pagination, Tag } from "antd";
import { useEffect, useState } from "react";

export default function TanstackPagination(props) {
  const { qData: initQdata, setQData } = props; // ✅ changed `onChange` → `setQData`
  const [qData, setLocalQData] = useState({ ...initQdata });

  // 🔹 Handle page or page size change
  const handleChange = (page, pageSize) => {
    const updatedData =
      qData.limit !== pageSize
        ? { ...qData, page: 1, limit: pageSize }
        : { ...qData, page };

    setLocalQData(updatedData);
    setQData(updatedData); // ✅ update parent state
  };

  // 🔹 Display text like “Showing 1–20 out of 120”
  const showTotal = () => {
    const start = (qData.page - 1) * qData.limit + 1;
    const end = Math.min(qData.page * qData.limit, qData.total);
    return (
      <Tag>
        {`Showing ${start} - ${end} out of ${qData.total}`}
      </Tag>
    );
  };

  // 🔹 Sync internal state when parent changes
  useEffect(() => {
    setLocalQData({ ...initQdata });
  }, [initQdata]);

  return (
    <>
      {qData?.total > 0 && (
        <Pagination
          total={qData.total}
          showTotal={showTotal}
          pageSize={qData.limit}
          current={qData.page}
          onChange={handleChange}
          showSizeChanger
          locale={{
            items_per_page : "",
          }}
        />
      )}
    </>
  );
}
