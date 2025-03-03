import PromotionsCard from "../Component/PromotionsCard";
import Promotion from "../../assets/Image/Promotion.png"; 


const LayoutPromotion = () => {
  return (
       <div className="bg-white p-6 rounded-lg w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          {/* ✅ Header */}
          <div className="flex items-center mb-2">
            <img src={Promotion} alt="New" className="w-10 h-10 sm:w-12 sm:h-12 mr-3" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">โปรโมชั่น</h2>
          </div>

      {/* ✅ เรียกใช้ PromotionsCard1 พร้อมกำหนด limit */}
      <PromotionsCard limit={4} />
    </div>
  );
};

export default LayoutPromotion;
