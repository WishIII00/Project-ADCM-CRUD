import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../Layouts/AdminLayout";
import Swal from "sweetalert2";
import TypePage from "../Components/Type";

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token") || "";

  const [formData, setFormData] = useState({
    brand: "",
    cscode: "",
    itemNumber: "",
    vendorItemId: "",
    itemDescription: "",
    price: "",
    category: "",
    subcategory: "",
    specICT: false,
    specifications: [{ name: "", description: "" }],
    images: [],
    status: "",
  });

  const [brands, setBrands] = useState([]);
  const [cscodes, setCSCodes] = useState([]);
  const [previewImages, setPreviewImages] = useState(["", "", "", ""]); // รองรับ 4 รูป

  useEffect(() => {
    if (!token) navigate("/loginPage");

    const fetchData = async () => {
      try {
        const [brandRes, cscodeRes, productRes] = await Promise.all([
          axios.get("http://localhost:3000/api/brands", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/cscodes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:3000/api/newProducts/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setBrands(brandRes.data.brands);
        setCSCodes(cscodeRes.data.CSCodes);

        const productData = productRes.data;
        setFormData({
          ...productData,
          specifications: productData.specifications.length > 0
            ? productData.specifications
            : [{ name: "", description: "" }],
          images: productData.images || [],
        });

        const imagePreviews = productData.images?.map(
          (img) => `http://localhost:3000/uploads/products/${img.fileName}`
        ) || ["", "", "", ""];
        setPreviewImages(imagePreviews);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token, navigate, productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === "specICT") {
      setFormData((prevData) => ({
        ...prevData,
        specICT: checked, // ✅ อัปเดตค่า specICT
        specifications: checked ? prevData.specifications : [{ name: "", description: "" }], // ✅ ถ้ายกเลิกรีเซ็ต specifications
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };
  

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedImages = [...formData.images];
    updatedImages[index] = file;

    const updatedPreviewImages = [...previewImages];
    updatedPreviewImages[index] = URL.createObjectURL(file);

    setFormData((prevData) => ({ ...prevData, images: updatedImages }));
    setPreviewImages(updatedPreviewImages);
  };

  const handleSpecificationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSpecifications = [...formData.specifications];
    updatedSpecifications[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      specifications: updatedSpecifications,
    }));
  };

  const addSpecification = () => {
    setFormData((prevData) => ({
      ...prevData,
      specifications: [...prevData.specifications, { name: "", description: "" }],
    }));
  };

  const removeSpecification = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      specifications: prevData.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formDataToSend.append("images", file));
      } else if (key === "specifications") {
        formDataToSend.append("specifications", JSON.stringify(value));
      } else {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await axios.put(
        `http://localhost:3000/api/newProducts/${productId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          text: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/admin/dashboard"); // ✅ กลับไปหน้า dashboard หลังบันทึก
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleDelete = async () => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถกู้คืนสินค้านี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:3000/api/newProducts/${productId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "ลบสำเร็จ",
              text: "สินค้านี้ถูกลบเรียบร้อยแล้ว",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              navigate("/dashboard"); // ✅ กลับไปหน้า dashboard หลังลบ
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.response?.data?.message || "ไม่สามารถลบสินค้าได้",
          });
        }
      }
    });
  };

  return (
    <AdminLayout>
      <TypePage />
      <form
        onSubmit={handleSubmit}
        className="max-w-full mx-auto p-6 bg-white rounded shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4">แก้ไขสินค้า</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* 1. แบรนด์ */}
          <div>
            <label className="font-semibold block mb-2">แบรนด์ :</label>
            <select
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">เลือกแบรนด์</option>
              {brands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. CSCode */}
          <div>
            <label className="font-semibold block mb-2">CSCode :</label>
            <select
              name="cscode"
              value={formData.cscode}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">เลือก CSCode</option>
              {cscodes.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.description} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* 3. หมวดหมู่สินค้า */}
          <div>
            <label className="font-semibold block mb-2">หมวดหมู่สินค้า :</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            >
              <option value="">เลือกหมวดหมู่</option>
              <option value="Network">Network</option>
              <option value="IOT">IOT</option>
              <option value="Solar Cell">Solar Cell</option>
            </select>
          </div>

          {/* 4. หมวดหมู่ย่อย */}
          <div>
            <label className="font-semibold block mb-2">หมวดหมู่ย่อย :</label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* 5. หมายเลขสินค้า */}
          <div>
            <label className="font-semibold block mb-2">หมายเลขสินค้า :</label>
            <input
              type="text"
              name="itemNumber"
              value={formData.itemNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>

          {/* 6. รหัสสินค้าผู้ขาย */}
          <div>
            <label className="font-semibold block mb-2">รหัสสินค้าผู้ขาย :</label>
            <input
              type="text"
              name="vendorItemId"
              value={formData.vendorItemId}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* 7. มาตรฐาน ICT */}
          <div className="col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              name="specICT"
              checked={formData.specICT}
              onChange={handleChange}
              className="w-6 h-6 border-2 border-gray-400 rounded-md"
            />
            <label className="font-semibold text-lg cursor-pointer">
              เป็น SPEC ICT
            </label>
          </div>
        </div>

        {/* 🔹 อัปโหลดรูปสินค้า */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">รูปสินค้า</h3>
          <div className="flex flex-col items-center gap-6 p-1 py-5 bg-gray-100 rounded-2xl">
            {/* 🔹 รูปใหญ่ตรงกลาง */}
            <div className="flex justify-center">
              <label className="w-48 h-48 border-2 border-dashed bg-white border-blue-400 flex items-center justify-center cursor-pointer rounded-lg overflow-hidden">
                {previewImages[0] ? (
                  <img
                    src={previewImages[0]}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-9xl text-blue-500">+</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 0)}
                />
              </label>
            </div>

            {/* 🔹 3 รูปเล็กด้านล่าง */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-md justify-center">
              {[1, 2, 3].map((index) => (
                <label
                  key={index}
                  className="border-2 border-dashed bg-white border-blue-400 flex items-center justify-center cursor-pointer rounded-lg overflow-hidden w-28 h-28 sm:w-32 sm:h-32"
                >
                  {previewImages[index] ? (
                    <img
                      src={previewImages[index]}
                      alt={`Uploaded ${index}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl text-blue-500">+</span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, index)}
                  />
                </label>
              ))}
            </div>

            {/* 🔹 ปุ่มล้างรูป */}
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setPreviewImages(["", "", "", ""]);
                  setFormData((prevData) => ({ ...prevData, images: [] }));
                }}
                className="bg-red-500 text-white rounded hover:bg-red-600 transition-all px-5 py-3"
              >
                ล้างรูปที่อัปโหลด
              </button>
            </div>
          </div>
        </div>

        {/* 9. คำอธิบายสินค้า */}
        <div className="mt-6">
          <label className="font-semibold block mb-2">คำอธิบายสินค้า :</label>
          <textarea
            name="itemDescription"
            value={formData.itemDescription}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg min-h-[100px]"
          ></textarea>
        </div>

        {/* 10. สเปคสินค้า */}
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2">สเปคสินค้า</h3>
          {formData.specifications.map((spec, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                name="name"
                value={spec.name}
                onChange={(e) => handleSpecificationChange(index, e)}
                placeholder="ชื่อสเปค"
                className="w-1/4 p-2 border rounded-lg text-sm h-11"
              />
              <input
                type="text"
                name="description"
                value={spec.description}
                onChange={(e) => handleSpecificationChange(index, e)}
                placeholder="รายละเอียด"
                className="w-2/2 p-2 border rounded-lg text-sm h-11"
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="px-5 py-2 bg-red-500 text-white rounded-lg text-sm"
              >
                ลบ
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecification}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg text-sm"
          >
            เพิ่มสเปค
          </button>
        </div>
        

        {/* 11. ราคาสินค้า */}
        <div className="mt-6 w-1/4">
          <label className="font-semibold block mb-2">ราคาสินค้า :</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg text-sm h-11"
            />
            <span className="text-gray-600 text-sm">บาท</span>
          </div>
        </div>

        {/* 12. สถานะสินค้า */}
        <div className="mt-6">
          <label className="font-semibold block mb-2">สถานะสินค้า :</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="มีสินค้า">มีสินค้า</option>
            <option value="สินค้าหมด">สินค้าหมด</option>
            <option value="สินค้าใหม่">สินค้าใหม่</option>
            <option value="โปรโมชั่น">โปรโมชั่น</option>
          </select>
        </div>

        {/* ✅ ปุ่มควบคุม */}
        <div className="flex justify-end mt-8 gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            ยกเลิก
          </button>
           {/* 🔥 ปุ่มลบสินค้า */}
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            ลบสินค้า
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            บันทึก
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default EditProductPage;

