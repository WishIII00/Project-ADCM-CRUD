import QRcode from "../../assets/Image/QRcod.png";
import ChatButton from "../Component/ChatButton";

const ContactPage = () => {
  return (
    <div className="w-full max-w-auto mx-auto">
      <div className="flex flex-col items-center justify-center bg-gray-200 px-4 sm:px-8 md:px-12 lg:px-20 py-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 w-full text-left text-blue-600">
          ติดต่อเรา
        </h1>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ส่วน QR Code และคำอธิบาย */}
          <div className="flex flex-col items-center text-center bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <img
              src={QRcode}
              alt="QR Code"
              className="w-60 h-60 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-cover rounded-lg"
            />
            <p className="mt-4 text-lg sm:text-xl font-semibold">
              Add line chat bot
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              แชทไลน์บอทตอบคำถามอัตโนมัติ
            </p>
          </div>

          {/* ส่วนข้อมูลติดต่อ */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  title: "ติดต่อสอบถามข้อมูลสินค้าเพิ่มเติม",
                  email: "services@adcm.co.th",
                  phone: "089-359-6459",
                },
                {
                  title: "ติดต่อสอบถามข้อมูลสินค้าเพิ่มเติม",
                  email: "services@adcm.co.th",
                  phone: "089-359-6459",
                },
                {
                  title: "ติดต่อสอบถามข้อมูลสินค้าเพิ่มเติม",
                  email: "services@adcm.co.th",
                  phone: "089-359-6459",
                },
                {
                  title: "ติดต่อฝ่ายการตลาด",
                  email: "mrkt@adcm.co.th",
                  phone: "089-359-6459",
                },
              ].map((contact, index) => (
                <div
                  key={index}
                  className="text-left border-b pb-3 sm:pb-4 last:border-none"
                >
                  <h3 className="font-semibold text-base sm:text-lg">
                    {contact.title}
                  </h3>
                  <p className="text-sm sm:text-base">
                    ● อีเมล:{" "}
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      {contact.email}
                    </a>
                  </p>
                  <p className="text-sm sm:text-base">
                    ● <span className="font-semibold">โทรศัพท์</span>:{" "}
                    {contact.phone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ChatButton />
    </div>
  );
};

export default ContactPage;
