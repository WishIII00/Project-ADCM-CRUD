import { useState, useEffect } from "react";
import ProductCard from "../Component/ProductCard";
import newIcon from "../../assets/Image/New.png"; 


const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/newProducts`)
      .then((res) => res.json())
      .then((data) => {
        const latestProducts = data.products.slice(-4).reverse();
        setProducts(latestProducts);
      })
      .catch((err) => console.error("Error fetching latest products:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      {/* ✅ Header */}
      <div className="flex items-center mb-6">
        <img src={newIcon} alt="New" className="w-10 h-10 sm:w-12 sm:h-12 mr-3" />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">สินค้าแนะนำ</h2>
      </div>

      {/* ✅ Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg">กำลังโหลดสินค้า...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-red-500 text-lg">ไม่พบสินค้าใหม่</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="w-full flex justify-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
