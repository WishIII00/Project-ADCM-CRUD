import { useState, useEffect } from 'react';
import CompareTable from '../Component/ComparisonTable';
import { useNavigate } from 'react-router-dom';
import ChatButton from "../Component/ChatButton";

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  // ดึงสินค้าที่เลือกจาก sessionStorage
  useEffect(() => {
    const storedProducts = JSON.parse(sessionStorage.getItem('selectedProducts') || '[]');
    setSelectedProducts(storedProducts);
  }, []);

  // ฟังก์ชันเพิ่มสินค้า
  const addProduct = (product) => {
    if (selectedProducts.length >= 4) {
      alert('คุณสามารถเปรียบเทียบสินค้าได้สูงสุดแค่ 3 รายการ');
      return;
    }

    const updatedProducts = [...selectedProducts, product];
    setSelectedProducts(updatedProducts);
    sessionStorage.setItem('selectedProducts', JSON.stringify(updatedProducts));
  };

  return (
    <div className="compare-page p-8">
      <h1 className="text-4xl font-semibold mb-4">เปรียบเทียบสินค้า</h1>

      {/* ปุ่มเพิ่มสินค้า */}
      <button 
        onClick={() => navigate('/')} // ลิงก์ไปหน้าแสดงรายการสินค้าที่จะเลือก
        className="bg-blue-500 text-white text-xl  py-2 px-4 rounded-lg mb-4 hover:bg-blue-600"
      >
        เพิ่มสินค้า
      </button>

      {selectedProducts.length > 0 ? (
        <CompareTable products={selectedProducts} setSelectedProducts={setSelectedProducts} />
      ) : (
        <p>ยังไม่มีการเลือกสินค้าที่จะเปรียบเทียบ</p>
      )}
      <ChatButton/>
    </div>
  );
}