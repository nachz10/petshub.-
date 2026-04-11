import React, { useState } from "react";
import axios from "axios";
import ServiceSelection from "./ServiceSelection";
import PetSelection from "./PetSelection";
import DateTimeSelection from "./DateTimeSelection";
import VeterinarianSelection from "./VeterinarianSelection";
import NoteSection from "./NoteSection";
import ReviewBooking from "./ReviewBooking";
import ProgressSteps from "./ProgressSteps";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  isActive: boolean;
}

interface Veterinarian {
  id: string;
  fullName: string;
  specialization?: string;
  imageUrl?: string;
  isAvailable: boolean;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  imageUrl?: string;
}

interface FormData {
  serviceId: string;
  serviceName: string;
  serviceDuration: number;
  servicePrice: number;
  petId: string;
  petName: string;
  isNewPet: boolean;
  petSpecies: string;
  petBreed: string;
  petAge: string;
  petWeight: string;
  date: string;
  time: string;
  vetId: string;
  vetName: string;
  notes: string;
  availableTimeSlots: string[];
  availableVets: Array<{ id: string; name: string }>;
  availableVetsMap: Record<string, Array<{ id: string; name: string }>>;
}

interface BookingFormProps {
  services: Service[];
  vets: Veterinarian[];
  pets: Pet[];
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({
  services,
  vets,
  pets,
  onSubmit,
  isLoading,
}) => {
  const steps = [
    { id: 1, name: "Service" },
    { id: 2, name: "Pet" },
    { id: 3, name: "Date & Time" },
    { id: 4, name: "Veterinarian" },
    { id: 5, name: "Notes" },
    { id: 6, name: "Review & Book" },
  ];

  const [currentStep, setCurrentStep] = useState(1);
  console.log("Current Step:", currentStep);
  const [formData, setFormData] = useState<FormData>({
    serviceId: "",
    serviceName: "",
    serviceDuration: 0,
    servicePrice: 0,
    petId: "",
    petName: "",
    isNewPet: false,
    petSpecies: "",
    petBreed: "",
    petAge: "",
    petWeight: "",
    date: "",
    time: "",
    vetId: "",
    vetName: "",
    notes: "",
    availableTimeSlots: [],
    availableVets: [],
    availableVetsMap: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    if (Object.keys(data).some((key) => key in errors)) {
      const newErrors = { ...errors };
      Object.keys(data).forEach((key) => delete newErrors[key]);
      setErrors(newErrors);
    }
  };

  const fetchAvailableTimeSlots = async (date: string, serviceId: string) => {
    if (!date || !serviceId) return { timeSlots: [], availableVetsMap: {} };

    try {
      const response = await axios.get(
        "http://localhost:3000/api/appointments/veterinarians/available",
        {
          withCredentials: true,
          params: { date, serviceId },
        }
      );

      const { availableSlots } = response.data;

      const allTimeSlots: string[] = [];
      const availableVetsMap: Record<
        string,
        Array<{ id: string; name: string }>
      > = {};

      availableSlots.forEach((vet: any) => {
        vet.availableSlots.forEach((slot: string) => {
          if (!allTimeSlots.includes(slot)) {
            allTimeSlots.push(slot);
          }

          if (!availableVetsMap[slot]) {
            availableVetsMap[slot] = [];
          }

          availableVetsMap[slot].push({
            id: vet.vetId,
            name: vet.vetName,
          });
        });
      });

      return {
        timeSlots: allTimeSlots.sort(),
        availableVetsMap,
      };
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      return { timeSlots: [], availableVetsMap: {} };
    }
  };

  const handleServiceSelect = async (service: Service) => {
    const newServiceData = {
      serviceId: service.id,
      serviceName: service.name,
      serviceDuration: service.duration,
      servicePrice: service.price,
      date: formData.date,
      time: "",
      vetId: "",
      vetName: "",
      availableTimeSlots: [],
      availableVets: [],
      availableVetsMap: {},
    };
    updateFormData(newServiceData);
    setErrors((prev) => ({ ...prev, serviceId: "" }));

    if (formData.date) {
      const { timeSlots, availableVetsMap } = await fetchAvailableTimeSlots(
        formData.date,
        service.id
      );
      updateFormData({
        availableTimeSlots: timeSlots,
        availableVetsMap,
      });
    }
  };

  const handleDateSelect = async (date: string) => {
    const newDateData = {
      date,
      time: "",
      vetId: "",
      vetName: "",
      availableTimeSlots: [],
      availableVets: [],
      availableVetsMap: {},
    };
    updateFormData(newDateData);
    setErrors((prev) => ({ ...prev, date: "", time: "" }));

    if (formData.serviceId) {
      const { timeSlots, availableVetsMap } = await fetchAvailableTimeSlots(
        date,
        formData.serviceId
      );
      updateFormData({
        availableTimeSlots: timeSlots,
        availableVetsMap,
      });
    }
  };

  const handleTimeSelect = (time: string) => {
    const availableVetsForTime = formData.availableVetsMap[time] || [];
    updateFormData({
      time,
      availableVets: availableVetsForTime,
      vetId: "",
      vetName: "",
    });
    setErrors((prev) => ({ ...prev, time: "" }));
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.serviceId) {
          newErrors.serviceId = "Please select a service.";
        }
        break;
      case 2:
        if (!formData.isNewPet && !formData.petId) {
          newErrors.petId = "Please select an existing pet.";
        }
        if (formData.isNewPet) {
          if (!formData.petName.trim())
            newErrors.petName = "Pet name is required.";
          if (!formData.petSpecies)
            newErrors.petSpecies = "Pet species is required.";
          if (
            formData.petAge &&
            (isNaN(parseFloat(formData.petAge)) ||
              parseFloat(formData.petAge) < 0)
          ) {
            newErrors.petAge = "Please enter a valid age.";
          }
          if (
            formData.petWeight &&
            (isNaN(parseFloat(formData.petWeight)) ||
              parseFloat(formData.petWeight) <= 0)
          ) {
            newErrors.petWeight = "Please enter a valid weight.";
          }
        }
        break;
      case 3:
        if (!formData.date) newErrors.date = "Please select a date.";
        if (!formData.time) newErrors.time = "Please select a time slot.";
        break;
      case 4:
        if (!formData.vetId) newErrors.vetId = "Please select a veterinarian.";
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
    window.scrollTo(0, 0);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePetSelect = (pet: Pet) => {
    updateFormData({
      petId: pet.id,
      petName: pet.name,
      petSpecies: pet.species,
      petBreed: pet.breed || "",
      isNewPet: false,
    });
    setErrors((prev) => ({ ...prev, petId: "" }));
  };

  const handleNewPetToggle = (isNew: boolean) => {
    updateFormData({
      isNewPet: isNew,
      petId: isNew ? "" : pets.length > 0 ? formData.petId : "",
      petName: isNew
        ? ""
        : pets.find((p) => p.id === formData.petId)?.name || "",
      petSpecies: isNew
        ? ""
        : pets.find((p) => p.id === formData.petId)?.species || "",
      petBreed: isNew
        ? ""
        : pets.find((p) => p.id === formData.petId)?.breed || "",
      petAge: isNew
        ? ""
        : pets.find((p) => p.id === formData.petId)?.age?.toString() || "",
      petWeight: isNew
        ? ""
        : pets.find((p) => p.id === formData.petId)?.weight?.toString() || "",
    });
    setErrors({}); // Clear pet-related errors on toggle
  };

  const handleVetSelect = (vet: { id: string; name: string }) => {
    updateFormData({
      vetId: vet.id,
      vetName: vet.name,
    });
    setErrors((prev) => ({ ...prev, vetId: "" }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            services={services.filter((s) => s.isActive)} // Show only active services
            selectedServiceId={formData.serviceId}
            onSelectService={handleServiceSelect}
            error={errors.serviceId}
          />
        );
      case 2:
        return (
          <PetSelection
            pets={pets}
            selectedPetId={formData.petId}
            isNewPet={formData.isNewPet}
            petName={formData.petName}
            petSpecies={formData.petSpecies}
            petBreed={formData.petBreed}
            petAge={formData.petAge}
            petWeight={formData.petWeight}
            onSelectPet={handlePetSelect}
            onToggleNewPet={handleNewPetToggle}
            updateFormData={updateFormData} // Pass the main updater
            errors={errors}
          />
        );
      case 3:
        return (
          <DateTimeSelection
            selectedDate={formData.date}
            selectedTime={formData.time}
            availableTimeSlots={formData.availableTimeSlots}
            onSelectDate={handleDateSelect}
            onSelectTime={handleTimeSelect}
            errors={errors}
          />
        );
      case 4:
        return (
          <VeterinarianSelection
            vets={formData.availableVets}
            selectedVetId={formData.vetId}
            onSelectVet={handleVetSelect}
            error={errors.vetId}
          />
        );
      case 5:
        return (
          <NoteSection notes={formData.notes} updateFormData={updateFormData} />
        );
      case 6:
        return <ReviewBooking formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <ProgressSteps steps={steps} currentStep={currentStep} />

      <div className="p-6 sm:p-8 md:p-10">
        {" "}
        <div className="min-h-[450px]">{renderStep()}</div>
        <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center px-6 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back
            </button>
          )}
          <div className="sm:flex-1"></div>
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto"
            >
              Next
              <ArrowRight size={18} className="ml-2" />
            </button>
          ) : (
            <form onSubmit={handleSubmitForm}>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors w-full sm:w-auto ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Booking Appointment...
                  </>
                ) : (
                  <>
                    <Check size={18} className="mr-2" />
                    Confirm & Book Appointment
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
