import React from "react";
import {
  CalendarDays,
  Clock,
  UserCircle,
  PawPrint,
  FileText,
  AlertCircle,
  CheckCircle,
  Tag,
} from "lucide-react";

interface FormDataReview {
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  servicePrice: number;
  petId: string;
  petName: string;
  isNewPet: boolean;
  petSpecies: string;
  petBreed: string;
  petAge?: string;
  petWeight?: string;
  date: string;
  time: string;
  vetId: string;
  vetName: string;
  notes: string;
}

interface ReviewBookingProps {
  formData: FormDataReview;
}

const ReviewBooking: React.FC<ReviewBookingProps> = ({ formData }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not selected";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "Not selected";
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  interface SummaryItemProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    className?: string;
  }

  const SummaryItem: React.FC<SummaryItemProps> = ({
    icon,
    label,
    value,
    className = "",
  }) => (
    <div className={`flex items-start py-4 sm:py-5 px-6 ${className}`}>
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-500">{label}</p>
        <div className="font-semibold text-slate-800 text-md break-words">
          {value}
        </div>
      </div>
    </div>
  );

  const petDisplayName = formData.isNewPet
    ? `${formData.petName} (New Pet)`
    : formData.petName || "Existing Pet";

  const petDetails = formData.isNewPet
    ? [
        formData.petSpecies,
        formData.petBreed,
        formData.petAge ? `${formData.petAge} yrs` : null,
        formData.petWeight ? `${formData.petWeight} kg` : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : [formData.petSpecies, formData.petBreed].filter(Boolean).join(" · ");

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800">
          Review Your Appointment
        </h2>
        <p className="text-slate-600 mt-2 text-lg">
          Please double-check all details before confirming.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-200">
          <SummaryItem
            icon={<Tag className="text-blue-600 h-5 w-5" />}
            label="Service"
            value={
              <>
                {formData.serviceName || "Not selected"}
                <div className="text-sm font-normal text-slate-600 mt-1 flex items-center gap-x-3">
                  <span>{formatPrice(formData.servicePrice)}</span>
                  <span className="text-slate-300">|</span>
                  <span>{formData.serviceDuration} minutes</span>
                </div>
              </>
            }
          />

          <SummaryItem
            icon={<PawPrint className="text-blue-600 h-5 w-5" />}
            label="Pet"
            value={
              <>
                {petDisplayName}
                {petDetails && (
                  <div className="text-sm font-normal text-slate-600 mt-1">
                    {petDetails}
                  </div>
                )}
              </>
            }
          />

          <SummaryItem
            icon={<CalendarDays className="text-blue-600 h-5 w-5" />}
            label="Date"
            value={formatDate(formData.date)}
          />

          <SummaryItem
            icon={<Clock className="text-blue-600 h-5 w-5" />}
            label="Time"
            value={formatTime(formData.time)}
          />

          <SummaryItem
            icon={<UserCircle className="text-blue-600 h-5 w-5" />}
            label="Veterinarian"
            value={
              formData.vetName ? `Dr. ${formData.vetName}` : "Not selected"
            }
          />

          {formData.notes && (
            <SummaryItem
              icon={<FileText className="text-blue-600 h-5 w-5" />}
              label="Additional Notes"
              value={
                <p className="text-sm font-normal text-slate-700 whitespace-pre-wrap">
                  {formData.notes}
                </p>
              }
            />
          )}
        </div>

        <div className="p-6 bg-blue-50 border-t border-blue-100">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Final Check</h4>
              <p className="text-sm text-blue-700 mb-3">
                Once you confirm, your appointment will be scheduled. A
                confirmation email will be sent to you. You can manage your
                appointment from your account dashboard.
              </p>
              <ul className="space-y-1.5 text-sm text-blue-700">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Review
                  cancellation policy if applicable.
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> Plan
                  to arrive 10-15 minutes early.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewBooking;
