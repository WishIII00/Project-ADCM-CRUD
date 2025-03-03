import React from 'react';
import { X } from 'lucide-react'; // ใช้ไอคอนกากบาท

export default function CompareTable({ products, setSelectedProducts }) {

  const removeProduct = (productId) => {
    // ลบสินค้าออกจาก sessionStorage
    const updatedProducts = products.filter(product => product._id !== productId);
    sessionStorage.setItem('selectedProducts', JSON.stringify(updatedProducts));

    // อัปเดต state
    setSelectedProducts(updatedProducts);
  };

  return (
    <div className="compare-table">
      {/* ใช้ grid layout สำหรับแสดงสินค้า */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => (
          <div key={index} className="border p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow relative">
            {/* ปุ่มกากบาท */}
            <button 
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              onClick={() => removeProduct(product._id)}
            >
              <X size={20} strokeWidth={2} color="red" />
            </button>

            <img 
              src={`http://localhost:3000/uploads/products/${product.images[0]?.fileName}`}
              alt={product.itemDescription || "ไม่มีชื่อสินค้า"} 
              className="w-full h-[200px] object-contain mb-4 rounded-lg" 
            />
            <h3 className="text-lg font-semibold text-gray-700">{product.itemDescription}</h3>
            
            {/* ใช้ scroll horizontal เมื่อขนาดหน้าจอเล็ก */}
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full table-auto text-gray-700">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 bg-gray-200">ประเภท</th>
                    <th className="border px-4 py-2 bg-gray-200">รายละเอียด</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border px-4 py-2">ประเภท</td>
                    <td className="border px-4 py-2">{product.category}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="border px-4 py-2">ราคา</td>
                    <td className="border px-4 py-2">{product.price ? `${product.price.toLocaleString()} บาท` : 'ไม่ระบุราคา'}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border px-4 py-2">แบรนด์</td>
                    <td className="border px-4 py-2">{product.brand}</td>
                  </tr>

                  {/* สเปคสินค้า */}
                  <tr className="bg-gray-100">
                    <td colSpan="2" className="border px-4 py-2 font-semibold text-lg text-gray-800">สเปค</td>
                  </tr>
                  {product.specifications.map((spec, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border px-4 py-2">{spec.name}</td>
                      <td className="border px-4 py-2">{spec.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}