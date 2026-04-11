import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const yourEmailAddress = "magicarcher699@gmail.com";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setStatusMessage("Please fill in all fields.");
      return;
    }
    setStatusMessage("");

    const mailtoLink = `mailto:${yourEmailAddress}?subject=${encodeURIComponent(
      `Contact Form: ${formData.subject} - From ${formData.name}`
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-800 sm:text-5xl tracking-tight">
            Get in Touch
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            We'd love to hear from you! Whether you have a question about our
            products, services, or just want to say hi, feel free to reach out.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 bg-white p-8 rounded-lg shadow-lg">
            <div>
              <h2 className="text-2xl font-semibold text-slate-700 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-600 text-lg">
                Fill up the form and our team will get back to you within 24
                hours, or contact us directly through the details below.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt className="text-3xl text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-slate-700">
                  Our Location
                </h3>
                <p className="text-gray-600">Urlabaru bazar, Urlabari</p>
                <p className="text-gray-600">Koshi, Nepal</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FaPhone className="text-3xl text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-slate-700">Call Us</h3>
                <p className="text-gray-600">+977 9827394050</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <FaEnvelope className="text-3xl text-blue-600" />
              <div>
                <h3 className="text-lg font-medium text-slate-700">Email Us</h3>
                <a
                  href={`mailto:${yourEmailAddress}`}
                  className="text-blue-600 hover:underline"
                >
                  {yourEmailAddress}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-700 mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              {statusMessage && (
                <p
                  className={`text-sm ${
                    statusMessage.includes("fill in")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {statusMessage}
                </p>
              )}
              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                >
                  <FaPaperPlane className="mr-2 h-5 w-5" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-slate-700 text-center mb-8">
            Find Us On The Map
          </h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg shadow-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.859091549654!2d85.31039081500715!3d27.69071428279859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19abb9a8a313%3A0xab2f829a4783834c!2sKathmandu%20Durbar%20Square!5e0!3m2!1sen!2snp!4v1678886451234!5m2!1sen!2snp"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
