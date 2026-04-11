import { FaShippingFast, FaMapMarkerAlt, FaClock } from "react-icons/fa";

const DeliveryOptionsPage = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-700 sm:text-5xl">
            Delivery Options
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Getting your pet supplies delivered, quick and easy.
          </p>
        </header>

        <section className="mb-10 bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <FaMapMarkerAlt className="text-3xl text-blue-600 mr-4" />
            <h2 className="text-2xl font-semibold text-slate-700">
              Our Delivery Zones
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            We currently offer delivery within [Your City/Region, e.g.,
            Kathmandu Valley]. Please enter your address at checkout to confirm
            if we deliver to your specific location. We are continuously working
            to expand our delivery network.
          </p>
          {/* You could add a small map or list of specific areas if applicable */}
        </section>

        <section className="mb-10 bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <FaShippingFast className="text-3xl text-green-600 mr-4" />
            <h2 className="text-2xl font-semibold text-slate-700">
              Delivery Times & Costs
            </h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Standard Delivery
              </h3>
              <p className="text-gray-700 leading-relaxed">
                - Orders are typically delivered within{" "}
                <span className="font-medium">2-3 business days</span> after
                order confirmation.
              </p>
              <p className="text-gray-700 leading-relaxed">
                - Standard Delivery Fee:{" "}
                <span className="font-medium">NPR 100</span> (This may vary
                based on location within our zone).
              </p>
              <p className="text-gray-700 leading-relaxed">
                -{" "}
                <span className="font-medium text-green-700">
                  Free Standard Delivery
                </span>{" "}
                on orders over <span className="font-medium">NPR 2500</span>.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Express Delivery (Optional)
              </h3>
              <p className="text-gray-700 leading-relaxed">
                - Need it sooner? We offer express delivery for select areas,
                typically within <span className="font-medium">24 hours</span>{" "}
                (if ordered before [Cut-off Time, e.g., 12 PM]).
              </p>
              <p className="text-gray-700 leading-relaxed">
                - Express Delivery Fee:{" "}
                <span className="font-medium">NPR 250</span>.
              </p>
              <p className="text-gray-700 leading-relaxed">
                - Please check availability at checkout.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10 bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center mb-6">
            <FaClock className="text-3xl text-yellow-600 mr-4" />
            <h2 className="text-2xl font-semibold text-slate-700">
              Order Processing & Tracking
            </h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg mb-4">
            Once you place your order, you will receive an email confirmation.
            We process orders Monday through Saturday (excluding public
            holidays). You will receive another notification once your order has
            been dispatched, which will include tracking information if
            available.
          </p>
          <p className="text-gray-700 leading-relaxed text-lg">
            You can typically track your order via a link provided in your
            dispatch email or by logging into your account on our website.
          </p>
        </section>

        <section className="mb-10 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Important Delivery Notes
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2 text-lg">
            <li>
              Please ensure someone is available to receive the order at the
              specified delivery address.
            </li>
            <li>
              If you have any special delivery instructions (e.g., "leave with
              security," "call upon arrival"), please add them to the notes
              section during checkout.
            </li>
            <li>
              In case of a failed delivery attempt, our delivery partner will
              usually try again or contact you to reschedule. Additional charges
              may apply for multiple failed attempts.
            </li>
            <li>
              Please inspect your order upon delivery. If you notice any damage
              or discrepancies, contact us within 24 hours.
            </li>
          </ul>
        </section>

        <section className="text-center">
          <p className="text-gray-700 text-lg">
            If you have any questions about our delivery options, please don't
            hesitate to{" "}
            <a
              href="mailto:petsandvetsnepal@gmail.com"
              className="text-blue-600 hover:underline font-medium"
            >
              contact us
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default DeliveryOptionsPage;
