import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import DeleteProductButton from "../Components/DeleteProductButton";
import EditProductButton from "../Components/EditProductButton";

export default function LatestProductsTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/newProducts?page=${page}&limit=${limit}`)
      .then((response) => {
        const sortedProducts = (response.data.products || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setProducts(sortedProducts);
        setTotalPages(Math.ceil(response.data.count / limit));
      })
      .catch(() => setError("โหลดข้อมูลล้มเหลว"))
      .finally(() => setLoading(false));
  }, [page]);

  const handleDelete = (deletedId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product._id !== deletedId)
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border border-gray-200">
      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4">
        <h3 className="text-lg sm:text-xl font-bold">สินค้าล่าสุด</h3>
        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:ring focus:ring-blue-200 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading / Error */}
      {loading ? (
        <p className="text-gray-500">กำลังโหลด...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">ไม่มีสินค้าล่าสุด</p>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-blue-600 text-white text-xs sm:text-sm">
                <tr>
                  <th className="p-3 text-left whitespace-nowrap">ลำดับ</th>
                  <th className="p-3 text-left whitespace-nowrap">รูป</th>
                  <th className="p-3 text-left whitespace-nowrap">แบรนด์</th>
                  <th className="p-3 text-left whitespace-nowrap">
                    ชื่อสินค้า
                  </th>
                  <th className="p-3 text-left whitespace-nowrap">หมวดหมู่</th>
                  <th className="p-3 text-left whitespace-nowrap">มาตฐาน ICT</th>
                  <th className="p-3 text-left whitespace-nowrap">ราคา</th>
                  <th className="p-3 text-center whitespace-nowrap">แก้ไข</th>
                  <th className="p-3 text-center whitespace-nowrap">ลบ</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((product) =>
                    product.itemDescription
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((product, index) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{(page - 1) * limit + index + 1}</td>
                      <td className="p-3">
                        {product.images?.length > 0 ? (
                          <img
                            src={`http://localhost:3000/uploads/products/${product.images[0].fileName}`}
                            alt={product.itemDescription}
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md"
                          />
                        ) : (
                          <span className="text-gray-400">ไม่มีรูป</span>
                        )}
                      </td>
                      <td className="p-3">{product.brand || "-"}</td>
                      <td className="p-3">
                        <span
                          className="truncate max-w-[150px] sm:max-w-[200px] inline-block"
                          title={product.itemDescription}
                        >
                          {product.itemDescription.length > 20
                            ? `${product.itemDescription.substring(0, 20)}...`
                            : product.itemDescription}
                        </span>
                      </td>
                      <td className="p-3">{product.category || "-"}</td>
                      <td className="p-3 text-center">
                        {product.specICT ? (
                          <Check className="text-green-600" size={25} />
                        ) : (
                          <X className="text-red-600" size={25} />
                        )}
                      </td>
                      <td className="p-3">
                        {product.price ? `${product.price} บาท` : "-"}
                      </td>
                      <td className="p-3 text-center">
                        <EditProductButton productId={product._id} />
                      </td>
                      <td className="p-3 text-center">
                        <DeleteProductButton
                          productId={product._id}
                          onDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
            <button
              className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft size={16} /> ก่อนหน้า
            </button>
            <span className="text-gray-700 text-sm">
              หน้าที่ {page} / {totalPages}
            </span>
            <button
              className="flex items-center gap-1 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              ถัดไป <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
