import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import LogoADCM from "../../../assets/Image/Logo01.png";
import LanguagMobile from "./LanguageDropdown-mobile";
import _ from "lodash";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const NavbarMobile = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const suggestionsRef = useRef(null);

  const fetchProducts = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/api/newproducts/search?keyword=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      setSuggestions(data.products || []);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setError("ไม่สามารถโหลดผลลัพธ์ได้");
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useRef(_.debounce(fetchProducts, 300)).current;

  useEffect(() => {
    if (searchQuery.trim()) debouncedSearch(searchQuery);
    else setSuggestions([]);

    return () => debouncedSearch.cancel();
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSuggestions([]);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
    setSearchQuery("");
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ProductImage = ({ imageUrl }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [timeoutReached, setTimeoutReached] = useState(false);

    useEffect(() => {
      const img = new Image();
      const timer = setTimeout(() => {
        if (!imageLoaded) setTimeoutReached(true);
      }, 3000); // โหลดเกิน 3 วิ ขึ้นข้อความ

      img.src = imageUrl;
      img.onload = () => {
        clearTimeout(timer);
        setImageLoaded(true);
      };
      img.onerror = () => {
        clearTimeout(timer);
        setTimeoutReached(true);
      };

      return () => clearTimeout(timer);
    }, [imageUrl]);

    if (timeoutReached && !imageLoaded) {
      return <span className="text-xs text-gray-500">ไม่มีรูปสินค้า</span>;
    }

    return (
      <img
        src={imageUrl}
        alt="สินค้า"
        className={`w-10 h-10 object-cover rounded-md border ${
          !imageLoaded ? "opacity-0" : "opacity-100"
        }`}
        style={{ transition: "opacity 0.3s ease" }}
      />
    );
  };

  return (
    <div className="block md:hidden relative">
      {/* Logo และ Language Dropdown */}
      <div className="bg-gradient-to-r from-[#63a6dd] via-[#63a6dd] to-[#00C999] p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            to="/Home"
            className="flex items-center gap-2 text-white flex-none"
          >
            <img
              src={LogoADCM}
              alt="ADC Microsystems"
              className="h-10 w-auto object-cover cursor-pointer"
            />
          </Link>
          <LanguagMobile />
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-200 p-4">
        <div className="container mx-auto flex justify-center">
          <div className="relative flex w-full max-w-lg sm:max-w-xl">
            <input
              type="text"
              placeholder="ค้นหาสินค้า ประเภทสินค้า แบรนด์"
              className="flex-grow h-12 pl-5 rounded-l-full border border-gray-300 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-4 flex items-center justify-center border-l border-black rounded-r-full"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Suggestions */}
            {searchQuery.trim() && (
              <div
                ref={suggestionsRef}
                className="absolute left-0 top-14 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-64 overflow-auto"
              >
                {loading && <p className="p-2 text-gray-500">กำลังโหลด...</p>}
                {error && <p className="p-2 text-red-500">{error}</p>}
                {!loading && !error && suggestions.length === 0 && (
                  <p className="p-2 text-gray-500">
                    ไม่พบสินค้าที่ตรงกับการค้นหา
                  </p>
                )}
                {suggestions.length > 0 && (
                  <>
                    <p className="p-2 text-gray-500 border-b">{`พบ ${suggestions.length} รายการ`}</p>
                    <ul className="divide-y divide-gray-200">
                      {suggestions.map((product) => {
                        const imageUrl = product?.images?.[0]?.fileName
                          ? `${BASE_URL}/uploads/products/${product.images[0].fileName}`
                          : "";

                        return (
                          <li
                            key={product._id}
                            className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleProductClick(product._id)}
                          >
                            {imageUrl ? (
                              <ProductImage imageUrl={imageUrl} />
                            ) : (
                              <span className="text-xs text-gray-500">
                                ไม่มีรูปสินค้า
                              </span>
                            )}
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {product.itemDescription || "ไม่มีชื่อสินค้า"}
                            </span>
                            <button
                              className="ml-auto text-gray-500 hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSuggestions(
                                  suggestions.filter(
                                    (p) => p._id !== product._id
                                  )
                                );
                              }}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarMobile;
