import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import BookingForm from "./components/BookingForm";
import { Loader2 } from "lucide-react";

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

const AppointmentBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);

        const [servicesRes, vetsRes, petsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/appointments/services", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/appointments/veterinarians", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/appointments/user/pets", {
            withCredentials: true,
          }),
        ]);

        setServices(servicesRes.data.services);
        setVets(vetsRes.data.veterinarians);
        setPets(petsRes.data.pets);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load appointment data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);

      let petId = formData.petId;

      if (formData.isNewPet) {
        const newPetData = {
          name: formData.petName,
          species: formData.petSpecies,
          breed: formData.petBreed || undefined,
          age: formData.petAge ? parseInt(formData.petAge, 10) : undefined,
          weight: formData.petWeight
            ? parseFloat(formData.petWeight)
            : undefined,
        };

        const newPetResponse = await axios.post(
          "http://localhost:3000/api/appointments/pets",
          newPetData,
          {
            withCredentials: true,
          }
        );
        petId = newPetResponse.data.pet.id;

        setPets((prevPets) => [...prevPets, newPetResponse.data.pet]);
      }

      const appointmentData = {
        petId,
        serviceId: formData.serviceId,
        vetId: formData.vetId,
        date: formData.date,
        time: formData.time,
        notes: formData.notes || undefined,
      };

      await axios.post(
        "http://localhost:3000/api/appointments/book",
        appointmentData,
        {
          withCredentials: true,
        }
      );
      toast.success("Appointment booked successfully!", {
        duration: 3000,
      });
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      let errorMessage = "Failed to book appointment. Please try again.";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      toast.error(errorMessage, {
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 text-slate-700">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-lg font-medium">Loading Appointment Data...</p>
        <p className="text-sm text-slate-500">Please wait a moment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-800 text-center mb-4">
            Book Your Vet Appointment
          </h1>
          <p className="text-lg text-slate-600 text-center mb-10">
            Follow the steps below to easily schedule your pet's visit.
          </p>
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <BookingForm
              services={services}
              vets={vets}
              pets={pets}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

export default AppointmentBookingPage;
