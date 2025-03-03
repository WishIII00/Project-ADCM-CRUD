import { useEffect, useState } from "react";
import axios from "axios";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import EditPromotion from "./EditPromotion";
import DeletePromotion from "./DeletePromotion";

export default function PromotionTable() {
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortOrder, setSortOrder] = useState("latest");
  const limit = 10;

  useEffect(() => {
    fetchPromotions();
  }, [page, sortOrder]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/promotions?page=${page}&limit=${limit}&sort=${sortOrder}`
      );
      setPromotions(response.data.promotions);
      setTotalCount(response.data.count);
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        {/* ชื่อหัวข้อ */}
        <h3 className="text-lg sm:text-2xl font-bold">📢 รายการโปรโมชั่น</h3>

        {/* กล่องค้นหาและตัวกรอง (Responsive) */}
        <div className="flex flex-col sm:flex-row lg:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto lg:justify-end">
          {/* ช่องค้นหา */}
          <div className="relative w-full sm:w-64 lg:w-64">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="ค้นหาโปรโมชั่น..."
              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* ตัวกรองเรียงลำดับ */}
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value); // ✅ เปลี่ยนการเรียง
              setPage(1); // ✅ รีเซ็ตไปหน้าแรกเมื่อเปลี่ยนการเรียง
            }}
            className="px-3 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200"
          >
            <option value="latest">ล่าสุด</option>
            <option value="oldest">เก่าสุด</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500">กำลังโหลด...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-blue-600 text-white text-xs sm:text-sm">
                <tr>
                  <th className="p-3 text-left whitespace-nowrap">#</th>
                  <th className="p-3 text-left whitespace-nowrap">รูป</th>
                  <th className="p-3 text-left whitespace-nowrap">
                    ชื่อโปรโมชั่น
                  </th>
                  <th className="p-3 text-left whitespace-nowrap">สินค้า</th>
                  <th className="p-3 text-left whitespace-nowrap">ราคา</th>
                  <th className="p-3 text-center whitespace-nowrap">แก้ไข</th>
                  <th className="p-3 text-center whitespace-nowrap">ลบ</th>
                </tr>
              </thead>
              <tbody>
                {promotions
                  .filter((promotion) =>
                    promotion.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((promotion, index) => (
                    <tr
                      key={promotion._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">{startItem + index}</td>
                      <td className="p-3">
                        <img
                          src={`http://localhost:3000/uploads/promotion/${promotion.poster}`}
                          alt={promotion.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md"
                        />
                      </td>
                      <td
                        className="p-3 font-medium max-w-[150px] sm:max-w-[200px] truncate"
                        title={promotion.name}
                      >
                        {promotion.name}
                      </td>
                      <td className="p-3 max-w-[200px] sm:max-w-[300px]">
                        {promotion.items.length > 0 ? (
                          promotion.items.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="text-xs sm:text-sm truncate"
                              title={`${
                                item?.productId?.itemDescription ??
                                "ไม่มีชื่อสินค้า"
                              } (${item.quantity} ชิ้น)`}
                            >
                              -{" "}
                              {item?.productId?.itemDescription ??
                                "ไม่มีชื่อสินค้า"}{" "}
                              ({item.quantity} ชิ้น)
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">
                            ไม่มีสินค้าในโปรโมชั่น
                          </span>
                        )}
                        {promotion.items.length > 3 && (
                          <div className="text-gray-500 text-xs">
                            ...ดูเพิ่มเติม
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-blue-600 font-semibold">
                        {promotion.price.toLocaleString()} บาท
                      </td>
                      <td className="p-3 text-center">
                        <EditPromotion promotionId={promotion._id} />
                      </td>
                      <td className="p-3 text-center">
                        <DeletePromotion
                          promotionId={promotion._id}
                          fetchPromotions={fetchPromotions}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <span className="text-gray-700 text-sm">
              แสดง {startItem} - {endItem} จาก {totalCount} รายการ
            </span>

            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2">
              <button
                className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={16} /> ก่อนหน้า
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPage(idx + 1)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    page === idx + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                className="flex items-center gap-1 px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
              >
                ถัดไป <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
