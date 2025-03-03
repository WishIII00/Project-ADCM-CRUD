import { useNavigate } from "react-router-dom";


export default function EditProductButton({ productId }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-product/${productId}`);  // ✅ นำทางไปหน้าแก้ไขสินค้าที่ถูกต้อง
  };

  return (
    <button
      onClick={handleEdit}
      className="px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition"
      title="แก้ไขสินค้า"
    >
      ✏️ แก้ไข
    </button>
  );
}
