import { useState } from "react";

const FAQPage = () => {
  const faqData = [
    {
      id: 1,
      question: "What services does Pets and Vets offer?",
      answer:
        "Pets and Vets offers a comprehensive range of veterinary services including routine check-ups, vaccinations, dental care, surgery, emergency care, nutritional counseling, and specialized treatments for various pet conditions. We also provide pet grooming, boarding facilities, and an online store for pet supplies and medications.",
    },
    {
      id: 2,
      question: "How do I book an appointment for my pet?",
      answer:
        "You can book an appointment through our website by clicking on the 'Book Appointment' button, calling our clinic directly at [Your Phone Number], or using our mobile app. For emergency cases, please call us immediately, and we'll provide instructions for immediate care.",
    },
    {
      id: 3,
      question: "What animals do you treat?",
      answer:
        "We provide medical care for a wide range of pets including dogs, cats, birds, rabbits, guinea pigs, hamsters, and other small pets. If you have an exotic pet, please contact us in advance to ensure we can provide appropriate care for your specific animal.",
    },
    {
      id: 4,
      question: "Do I need to bring anything for my pet's first visit?",
      answer:
        "For your pet's first visit, please bring any previous medical records, vaccination history, details of current medications, and information about diet and behavior. This helps us provide the best possible care for your pet. Arriving 10-15 minutes early to complete new patient forms is also recommended.",
    },
    {
      id: 5,
      question: "What are your operating hours?",
      answer:
        "Our regular operating hours are Monday to Friday from 8:00 AM to 6:00 PM, Saturday from 9:00 AM to 4:00 PM, and Sunday from 10:00 AM to 2:00 PM. For emergencies outside these hours, please call our emergency line at [Emergency Number].",
    },
    {
      id: 6,
      question: "How much do your services cost?",
      answer:
        "Our service costs vary depending on the type of treatment, pet size, and specific conditions. We provide detailed estimates before performing any procedures. For routine services like vaccinations and check-ups, please refer to our pricing page or contact our reception for current rates.",
    },
    {
      id: 7,
      question: "Do you offer pet insurance or payment plans?",
      answer:
        "We accept most major pet insurance plans and can help guide you through the claim process. Additionally, we offer various payment plans and options to make veterinary care more affordable. Please speak with our staff about the financial options that might work best for you.",
    },
    {
      id: 8,
      question: "How often should I bring my pet for check-ups?",
      answer:
        "We recommend annual wellness exams for adult pets in good health. Puppies, kittens, senior pets, and pets with chronic conditions may require more frequent visits. During your visit, our veterinarians will recommend an appropriate check-up schedule based on your pet's specific needs.",
    },
    {
      id: 9,
      question: "What should I do in case of a pet emergency?",
      answer:
        "For pet emergencies, call us immediately at [Emergency Number]. Outside of business hours, contact our emergency service or the nearest 24-hour veterinary hospital. For critical situations like difficulty breathing, severe bleeding, or suspected poisoning, don't wait – seek emergency care immediately.",
    },
    {
      id: 10,
      question: "Do you provide house calls or mobile veterinary services?",
      answer:
        "Yes, we offer limited house calls for special circumstances and certain treatments. Our mobile services include wellness exams, vaccinations, and basic treatments. Please note that house calls must be scheduled in advance and availability may be limited.",
    },
  ];

  const [expandedId, setExpandedId] = useState(null);

  const toggleFAQ = (id: any) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header section */}
        <div className="text-center mb-12 bg-white rounded-xl shadow-md p-8 border-t-4 border-blue-500">
          <div className="inline-block mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-blue-500 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 sm:text-5xl tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-gray-500">
            Find answers to the most common questions about Pets and Vets
            services, appointments, and pet care.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition duration-300 hover:shadow-md"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left p-5 focus:outline-none flex justify-between items-center"
              >
                <span className="font-medium text-lg text-slate-800">
                  {faq.question}
                </span>
                <span className="ml-4 flex-shrink-0">
                  {expandedId === faq.id ? (
                    <svg
                      className="h-6 w-6 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </span>
              </button>
              {expandedId === faq.id && (
                <div className="p-5 border-t border-gray-100 bg-gray-50">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-100 shadow-sm text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Our team is here to help. Contact us if you couldn't find the answer
            you were looking for.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a
              href="tel:+9779812345678"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Us
            </a>
            <a
              href="mailto:petsandvetsnepal@gmail.com"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 border-blue-300"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Us
            </a>
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Pets and Vets. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
