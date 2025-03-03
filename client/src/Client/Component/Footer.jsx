import LogoADCM from "../../assets/Image/Logo01.png";
import BackgroundImage from "../../assets/Image/Background.png";

const Footer = () => {
  return (
    <footer
      className="relative bg-cover bg-center bg-no-repeat mt-10 text-black"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="max-w-auto mx-auto px-4 sm:px-2 lg:px-4 pt-4 py-40  flex items-start">
        {/* Logo Section */}
        <div className="flex items-start justify-start ml-0">
          <img
            src={LogoADCM}
            alt="ADC Microsystems"
            className="h-36 w-auto object-contain"
          />
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-200 border-t border-gray-300 py-4 text-center text-sm text-black">
        &copy; {new Date().getFullYear()} ADC Microsystems Co., Ltd. สงวนลิขสิทธิ์.
      </div>
    </footer>
  );
};

export default Footer;
