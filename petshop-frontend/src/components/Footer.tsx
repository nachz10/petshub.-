import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import footerLogo from "../assets/Footer.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1C49C2] text-gray-300 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src={footerLogo}
                alt="Pets and Vets Logo"
                className="h-16 rounded-md"
              />
            </Link>
            <p className="text-sm">
              Your trusted partner for pet supplies and veterinary services.
              We're passionate about keeping your furry, scaly, and feathery
              friends healthy and happy.
            </p>
          </div>

          <div>
            <h5 className="text-white text-lg font-semibold mb-4">
              Quick Links
            </h5>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/bookAppointment"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-lg font-semibold mb-4">
              Information
            </h5>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/delivery"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Delivery Options
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  FAQs
                </Link>
              </li>{" "}
            </ul>
          </div>

          <div>
            <h5 className="text-white text-lg font-semibold mb-4">
              Connect With Us
            </h5>
            <a
              href="mailto:petsandvetsnepal@gmail.com"
              className="flex items-center space-x-2 mb-4 hover:text-blue-400 transition-colors duration-300"
            >
              <FaEnvelope className="text-xl" />
              <span>petsandvetsnepal@gmail.com</span>
            </a>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-gray-300 hover:text-blue-500 transition-colors duration-300"
              >
                <FaFacebookF size={24} />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-300 hover:text-pink-500 transition-colors duration-300"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-gray-300 hover:text-sky-400 transition-colors duration-300"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-sm">
            © {currentYear} Pets and Vets. All Rights Reserved.
          </p>
          <p className="text-xs mt-1">Website by Aayush</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
