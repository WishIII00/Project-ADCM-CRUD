import { useNavigate } from "react-router-dom";

export default function EditPromotion({ promotionId }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-promotion/${promotionId}`);
  };

  return (
    <button
      onClick={handleEdit}
      className="px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition"
      title="แก้ไขโปรโมชั่น"
    >
      ✏️ แก้ไข
    </button>
  );
}
