import { useState } from "react";

const PrivacyPolicyPage = () => {
  const lastUpdatedDate = "October 26, 2023";

  const [expandedSections, setExpandedSections] = useState<any>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
  });

  const toggleSection = (sectionId: any) => {
    setExpandedSections((prev: any) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const PolicySection = ({ id, title, children }: any) => {
    const isExpanded = expandedSections[id];

    return (
      <div className="mb-6 border border-gray-100 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            <span className="inline-flex justify-center items-center w-8 h-8 mr-3 rounded-full bg-blue-100 text-blue-600 font-bold">
              {id}
            </span>
            {title}
          </h2>
          <span className="text-blue-500">
            {isExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
          </span>
        </button>
        {isExpanded && (
          <div className="p-5 bg-white border-t border-gray-100">
            <div className="prose prose-blue max-w-none text-gray-600">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero section */}
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 sm:text-5xl tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Last Updated:{" "}
            <span className="font-medium text-blue-600">{lastUpdatedDate}</span>
          </p>
          <p className="mt-6 max-w-2xl mx-auto text-gray-500">
            At Pets and Vets, we value your privacy and are committed to
            protecting your personal information. This policy explains how we
            collect, use, and safeguard your data.
          </p>
        </div>

        {/* Main content with expandable sections */}
        <div className="space-y-6">
          <PolicySection id={1} title="WHAT INFORMATION DO WE COLLECT?">
            <h3 className="text-lg font-medium text-slate-700 mb-3">
              Personal information you disclose to us
            </h3>
            <p>
              We collect personal information that you voluntarily provide to us
              when you register on the Website, express an interest in obtaining
              information about us or our products and Services, when you
              participate in activities on the Website (such as posting messages
              in our online forums or entering competitions, contests or
              giveaways) or otherwise when you contact us.
            </p>
            <p className="mt-3">
              The personal information that we collect depends on the context of
              your interactions with us and the Website, the choices you make
              and the products and features you use. The personal information we
              collect may include the following:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    Personal Identification Information:
                  </strong>{" "}
                  Name, phone number, email address, postal address, usernames,
                  passwords, and other similar contact data.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">Pet Information:</strong>{" "}
                  Pet's name, species, breed, age, medical history (when booking
                  appointments or consultations).
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">Payment Data:</strong> We
                  may collect data necessary to process your payment if you make
                  purchases, such as your payment instrument number (such as a
                  credit card number), and the security code associated with
                  your payment instrument. All payment data is stored by our
                  payment processor [Specify Your Payment Processor, e.g.,
                  eSewa, Khalti, Stripe] and you should review its privacy
                  policies and contact the payment processor directly to respond
                  to your questions.
                </div>
              </li>
            </ul>
            <p className="mt-3">
              All personal information that you provide to us must be true,
              complete and accurate, and you must notify us of any changes to
              such personal information.
            </p>

            <h3 className="text-lg font-medium text-slate-700 mt-6 mb-3">
              Information automatically collected
            </h3>
            <p>
              We automatically collect certain information when you visit, use
              or navigate the Website. This information does not reveal your
              specific identity (like your name or contact information) but may
              include device and usage information, such as your IP address,
              browser and device characteristics, operating system, language
              preferences, referring URLs, device name, country, location,
              information about how and when you use our Website and other
              technical information. This information is primarily needed to
              maintain the security and operation of our Website, and for our
              internal analytics and reporting purposes.
            </p>
            <p className="mt-3">
              Like many businesses, we also collect information through cookies
              and similar technologies. You can find out more about this in our
              Cookie Policy [Link to Cookie Policy if you have one, or expand
              here].
            </p>
          </PolicySection>

          <PolicySection id={2} title="HOW DO WE USE YOUR INFORMATION?">
            <p>
              We use personal information collected via our Website for a
              variety of business purposes described below. We process your
              personal information for these purposes in reliance on our
              legitimate business interests, in order to enter into or perform a
              contract with you, with your consent, and/or for compliance with
              our legal obligations.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    To facilitate account creation and logon process.
                  </strong>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    To manage user accounts.
                  </strong>{" "}
                  We may use your information for the purposes of managing your
                  account and keeping it in working order.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    To send administrative information to you.
                  </strong>{" "}
                  For example, information regarding your orders, appointment
                  confirmations and reminders, changes to our terms, conditions,
                  and policies.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    To fulfill and manage your orders and appointments.
                  </strong>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    To request feedback.
                  </strong>{" "}
                  We may use your information to request feedback and to contact
                  you about your use of our Website.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    To protect our Services.
                  </strong>{" "}
                  As part of our efforts to keep our Website safe and secure
                  (for example, for fraud monitoring and prevention).
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    To respond to user inquiries/offer support to users.
                  </strong>
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    For other business purposes.
                  </strong>{" "}
                  Such as data analysis, identifying usage trends, determining
                  the effectiveness of our promotional campaigns and to evaluate
                  and improve our Website, products, marketing and your
                  experience.
                </div>
              </li>
            </ul>
          </PolicySection>

          <PolicySection
            id={3}
            title="WILL YOUR INFORMATION BE SHARED WITH ANYONE?"
          >
            <p>
              We only share and disclose your information in the following
              situations:
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    Compliance with Laws:
                  </strong>{" "}
                  We may disclose your information where we are legally required
                  to do so in order to comply with applicable law, governmental
                  requests, a judicial proceeding, court order, or legal
                  process.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    Vital Interests and Legal Rights:
                  </strong>{" "}
                  We may disclose your information where we believe it is
                  necessary to investigate, prevent, or take action regarding
                  potential violations of our policies, suspected fraud,
                  situations involving potential threats to the safety of any
                  person and illegal activities, or as evidence in litigation in
                  which we are involved.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">Service Providers:</strong>{" "}
                  We may share your data with third-party vendors, service
                  providers, contractors or agents who perform services for us
                  or on our behalf and require access to such information to do
                  that work. Examples include: payment processing, data
                  analysis, email delivery, hosting services, customer service
                  and marketing efforts.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">
                    Business Transfers:
                  </strong>{" "}
                  We may share or transfer your information in connection with,
                  or during negotiations of, any merger, sale of company assets,
                  financing, or acquisition of all or a portion of our business
                  to another company.
                </div>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-100 text-blue-500 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <strong className="text-slate-700">With your Consent:</strong>{" "}
                  We may disclose your personal information for any other
                  purpose with your consent.
                </div>
              </li>
            </ul>
          </PolicySection>

          <PolicySection
            id={4}
            title="DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?"
          >
            <p>
              We may use cookies and similar tracking technologies (like web
              beacons and pixels) to access or store information. Specific
              information about how we use such technologies and how you can
              refuse certain cookies is set out in our Cookie Policy [Link to
              Cookie Policy if separate, or detail here].
            </p>
          </PolicySection>

          <PolicySection id={5} title="HOW LONG DO WE KEEP YOUR INFORMATION?">
            <p>
              We will only keep your personal information for as long as it is
              necessary for the purposes set out in this privacy notice, unless
              a longer retention period is required or permitted by law (such as
              tax, accounting or other legal requirements). No purpose in this
              notice will require us keeping your personal information for
              longer than the period of time in which users have an account with
              us.
            </p>
          </PolicySection>

          <PolicySection id={6} title="HOW DO WE KEEP YOUR INFORMATION SAFE?">
            <p>
              We have implemented appropriate technical and organizational
              security measures designed to protect the security of any personal
              information we process. However, despite our safeguards and
              efforts to secure your information, no electronic transmission
              over the Internet or information storage technology can be
              guaranteed to be 100% secure, so we cannot promise or guarantee
              that hackers, cybercriminals, or other unauthorized third parties
              will not be able to defeat our security, and improperly collect,
              access, steal, or modify your information.
            </p>
          </PolicySection>

          <PolicySection id={7} title="WHAT ARE YOUR PRIVACY RIGHTS?">
            <p>
              In some regions (like the European Economic Area or the UK), you
              have certain rights under applicable data protection laws. These
              may include the right (i) to request access and obtain a copy of
              your personal information, (ii) to request rectification or
              erasure; (iii) to restrict the processing of your personal
              information; and (iv) if applicable, to data portability. In
              certain circumstances, you may also have the right to object to
              the processing of your personal information. To make such a
              request, please use the contact details provided below.
            </p>
            <p className="mt-3">
              If you are resident in Nepal, you may have specific rights
              regarding access to personal information. Please contact us for
              more details.
            </p>
            <p className="mt-3">
              If you have an account with us, you can review and change your
              account information at any time by logging into your account
              settings and updating your user account.
            </p>
          </PolicySection>

          <PolicySection id={8} title="DO WE MAKE UPDATES TO THIS NOTICE?">
            <p>
              We may update this privacy notice from time to time. The updated
              version will be indicated by an updated "Last updated" date and
              the updated version will be effective as soon as it is accessible.
              We encourage you to review this privacy notice frequently to be
              informed of how we are protecting your information.
            </p>
          </PolicySection>

          <PolicySection
            id={9}
            title="HOW CAN YOU CONTACT US ABOUT THIS NOTICE?"
          >
            <p>
              If you have questions or comments about this notice, you may email
              us at{" "}
              <a
                href="mailto:petsandvetsnepal@gmail.com"
                className="text-blue-600 hover:underline"
              >
                petsandvetsnepal@gmail.com
              </a>{" "}
              or by post to:
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="font-medium text-slate-700">
                Pets and Vets
                <br />
                [Your Physical Address Line 1]
                <br />
                [Your Physical Address Line 2, if any]
                <br />
                [City, Country]
              </p>
            </div>
          </PolicySection>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Pets and Vets. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-4">
            <a
              href="#"
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
