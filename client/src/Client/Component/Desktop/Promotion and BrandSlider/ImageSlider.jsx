import { useState, useEffect } from "react";
import BrandSlider from "./BrandSlider"; 

const images = [
  {
    id: 1,
    src: "https://scontent.fphs2-1.fna.fbcdn.net/v/t39.30808-6/469571180_578163058127906_3728558406565776001_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeG2NqSNaBJYYJ2l-Wm_ka-zFpiUxohQ7BkWmJTGiFDsGYZ0CB6DlN-uzq60PQrG3mwvQYzCwtbA1wl4C_qm3FMo&_nc_ohc=G-fNSWbRRDMQ7kNvgGnGj5D&_nc_oc=AdhAolRfedzxirgScIRm9zTKRiMcpJt_iRY3RBATdZnDYUpQt8NzYvJ9r4l5mgAf78EgII7XffQGooiXNph07cXP&_nc_zt=23&_nc_ht=scontent.fphs2-1.fna&_nc_gid=AXBSJZStjDqehziziVYFxy9&oh=00_AYCZVr5ltCIRvAx4IOY0gFzizLm1cB6cOQjUsaRn_o-LvA&oe=67C28B98",
    alt: "Slide 1",
  },
  {
    id: 2,
    src: "https://scontent.fphs2-1.fna.fbcdn.net/v/t39.30808-6/469571180_578163058127906_3728558406565776001_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeG2NqSNaBJYYJ2l-Wm_ka-zFpiUxohQ7BkWmJTGiFDsGYZ0CB6DlN-uzq60PQrG3mwvQYzCwtbA1wl4C_qm3FMo&_nc_ohc=G-fNSWbRRDMQ7kNvgGnGj5D&_nc_oc=AdhAolRfedzxirgScIRm9zTKRiMcpJt_iRY3RBATdZnDYUpQt8NzYvJ9r4l5mgAf78EgII7XffQGooiXNph07cXP&_nc_zt=23&_nc_ht=scontent.fphs2-1.fna&_nc_gid=AXBSJZStjDqehziziVYFxy9&oh=00_AYCZVr5ltCIRvAx4IOY0gFzizLm1cB6cOQjUsaRn_o-LvA&oe=67C28B98",
    alt: "Slide 2",
  },
  {
    id: 3,
    src: "https://scontent.fphs2-1.fna.fbcdn.net/v/t39.30808-6/469571180_578163058127906_3728558406565776001_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeG2NqSNaBJYYJ2l-Wm_ka-zFpiUxohQ7BkWmJTGiFDsGYZ0CB6DlN-uzq60PQrG3mwvQYzCwtbA1wl4C_qm3FMo&_nc_ohc=G-fNSWbRRDMQ7kNvgGnGj5D&_nc_oc=AdhAolRfedzxirgScIRm9zTKRiMcpJt_iRY3RBATdZnDYUpQt8NzYvJ9r4l5mgAf78EgII7XffQGooiXNph07cXP&_nc_zt=23&_nc_ht=scontent.fphs2-1.fna&_nc_gid=AXBSJZStjDqehziziVYFxy9&oh=00_AYCZVr5ltCIRvAx4IOY0gFzizLm1cB6cOQjUsaRn_o-LvA&oe=67C28B98",
    alt: "Slide 3",
    caption: "",
  },
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // เลื่อนทุก 4 วินาที

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* ✅ ImageSlider (แสดงรูปสไลด์) */}
      <div className="relative w-full max-w-full md:max-w-[90%] xl:max-w-[93.5%] mx-auto mt-5 mb-5 px-2 lg:px-6">
        <div className="relative overflow-hidden rounded-lg shadow-lg">
          {/* รูปสไลด์ */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map((image) => (
              <div key={image.id} className="flex-none w-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-[550px] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <BrandSlider />
    </>
  );
};

export default ImageSlider;
