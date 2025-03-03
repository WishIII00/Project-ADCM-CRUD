
import { Briefcase, Eye } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      {/* 🔹 Section: Company Overview */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">เกี่ยวกับเรา</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          บริษัท <strong>เอดีซี ไมโครซิสเต็มส์ จำกัด</strong> เป็นผู้นำด้าน Digital Enterprise IT
          ที่ให้บริการครบวงจรแก่ภาครัฐและเอกชน ด้วยผลิตภัณฑ์และพันธมิตรระดับสากลที่ได้รับการยอมรับ
        </p>
      </section>

      {/* 🔹 Section: History */}
      <section className="flex flex-col md:flex-row items-center gap-10 bg-gray-100 p-8 rounded-lg shadow-lg">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
            <Briefcase size={28} className="text-blue-500" /> ประวัติสถานประกอบการ
          </h2>
          <p className="text-gray-600 mt-4">
            เรามีทีมงานที่ได้รับใบรับรองความเชี่ยวชาญ พร้อมประสบการณ์มากกว่า 10 ปี
            ในการพัฒนาโซลูชันด้าน IT อย่างต่อเนื่อง เพื่อยกระดับขีดความสามารถขององค์กร
          </p>
        </div>
        <img
          src="https://source.unsplash.com/500x300/?technology,office"
          alt="Company Image"
          className="rounded-lg shadow-lg"
        />
      </section>

      {/* 🔹 Section: Vision */}
      <section className="mt-12 flex flex-col md:flex-row-reverse items-center gap-10 bg-blue-100 p-8 rounded-lg shadow-lg">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold text-gray-700 flex items-center gap-2">
            <Eye size={28} className="text-blue-500" /> วิสัยทัศน์
          </h2>
          <p className="text-gray-600 mt-4">
            เรามุ่งมั่นเป็นองค์กรที่ได้รับการยอมรับและชื่นชม ทั้งในด้านบุคลากรและคุณภาพการดำเนินงาน
            พร้อมเป็นผู้นำด้านนวัตกรรมเทคโนโลยีดิจิทัลในระดับประเทศและภูมิภาค
          </p>
        </div>
        <img
          src="https://source.unsplash.com/500x300/?innovation,technology"
          alt="Vision Image"
          className="rounded-lg shadow-lg"
        />
      </section>
    </div>
  );
};

export default AboutUs;
