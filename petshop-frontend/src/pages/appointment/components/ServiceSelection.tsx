import React from "react";
import { CheckCircle, Clock, Info } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  isActive: boolean;
}

interface ServiceSelectionProps {
  services: Service[];
  selectedServiceId: string;
  onSelectService: (service: Service) => void;
  error?: string;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  services,
  selectedServiceId,
  onSelectService,
  error,
}) => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800">Choose a Service</h2>
        <p className="text-slate-600 mt-2 text-lg">
          Select the type of care your pet needs.
        </p>
      </div>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700">
          <Info className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      {services.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service)}
              className={`relative group p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg
                ${
                  selectedServiceId === service.id
                    ? "bg-blue-50 border-blue-500 shadow-blue-200 shadow-md"
                    : "bg-white border-slate-200 hover:border-blue-300"
                }`}
            >
              {selectedServiceId === service.id && (
                <CheckCircle className="absolute top-4 right-4 h-6 w-6 text-blue-600" />
              )}

              <h3
                className={`font-semibold text-xl mb-2 pr-8 ${
                  selectedServiceId === service.id
                    ? "text-blue-700"
                    : "text-slate-800 group-hover:text-blue-600"
                }`}
              >
                {service.name}
              </h3>

              <p className="text-slate-600 text-sm mb-4 min-h-[40px] line-clamp-2">
                {service.description || "Detailed description coming soon."}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-200 group-hover:border-blue-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-green-600">
                    <span className="font-bold text-md">
                      Rs. {Number(service.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-5 w-5" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200">
          <Info className="mx-auto h-16 w-16 text-slate-400 mb-6" />
          <h3 className="text-slate-700 font-semibold text-xl mb-2">
            No Services Available
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            We're sorry, but there are currently no services listed. Please
            check back later or contact support.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
