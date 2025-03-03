import { useEffect, useState } from "react";
import axios from "axios";
import { Server } from "lucide-react";

export default function TotalProducts({ onProductDelete }) {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTotalProducts = () => {
    setLoading(true);
    axios.get("http://localhost:3000/api/newProducts")
      .then(response => setCount(response.data.count || 0))
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTotalProducts();
  }, []);

  useEffect(() => {
    fetchTotalProducts();
  }, [onProductDelete]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 flex flex-col justify-between min-w-[200px]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-1 bg-gray-100 rounded-lg">
            <Server size={28} className="text-gray-700" />
          </div>
          <p className="text-md text-gray-500 font-medium">Total Products</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">จำนวนสินค้า</p>
          <h3 className="text-3xl font-bold text-green-500">
            {loading ? "..." : error ? "Error" : count}
          </h3>
        </div>
      </div>
      <hr className="border-t-2 border-gray-300 mt-4 w-full" />
    </div>
  );
}
