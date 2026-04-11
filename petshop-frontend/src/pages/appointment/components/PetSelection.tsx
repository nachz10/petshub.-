import React from "react";
import {
  CheckCircle,
  Edit3,
  Info,
  PlusCircle,
  AlertTriangle,
} from "lucide-react";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed?: string;
  age?: number;
  weight?: number;
  imageUrl?: string;
}

interface PetSelectionProps {
  pets: Pet[];
  selectedPetId: string;
  isNewPet: boolean;
  petName: string;
  petSpecies: string;
  petBreed: string;
  petAge: string;
  petWeight: string;
  onSelectPet: (pet: Pet) => void;
  onToggleNewPet: (isNew: boolean) => void;
  updateFormData: (data: Record<string, any>) => void;
  errors: Record<string, string>;
}

const PetSelection: React.FC<PetSelectionProps> = ({
  pets,
  selectedPetId,
  isNewPet,
  petName,
  petSpecies,
  petBreed,
  petAge,
  petWeight,
  onSelectPet,
  onToggleNewPet,
  updateFormData,
  errors,
}) => {
  const speciesOptions = [
    "Dog",
    "Cat",
    "Bird",
    "Rabbit",
    "Hamster",
    "Guinea Pig",
    "Ferret",
    "Reptile",
    "Fish",
    "Other",
  ];

  const commonInputClass =
    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-150 shadow-sm";
  const errorInputClass =
    "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500";
  const normalInputClass = "border-slate-300 bg-white hover:border-slate-400";

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800">Select Your Pet</h2>
        <p className="text-slate-600 mt-2 text-lg">
          Choose an existing pet or add details for a new one.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-150
              ${
                !isNewPet
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-500 hover:text-blue-500 hover:border-b-2 hover:border-slate-300"
              }`}
            onClick={() => onToggleNewPet(false)}
          >
            <Edit3 className="inline-block h-5 w-5 mr-2" />
            Existing Pet
          </button>
          <button
            type="button"
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors duration-150
              ${
                isNewPet
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-slate-500 hover:text-blue-500 hover:border-b-2 hover:border-slate-300"
              }`}
            onClick={() => onToggleNewPet(true)}
          >
            <PlusCircle className="inline-block h-5 w-5 mr-2" />
            Add New Pet
          </button>
        </div>
      </div>

      {!isNewPet ? (
        <div>
          {errors.petId && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700">
              <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{errors.petId}</p>
            </div>
          )}

          {pets.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  onClick={() => onSelectPet(pet)}
                  className={`relative group p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg
                    ${
                      selectedPetId === pet.id
                        ? "bg-blue-50 border-blue-500 shadow-blue-200 shadow-md"
                        : "bg-white border-slate-200 hover:border-blue-300"
                    }`}
                >
                  {selectedPetId === pet.id && (
                    <CheckCircle className="absolute top-4 right-4 h-6 w-6 text-blue-600" />
                  )}
                  <div className="flex items-center">
                    {pet.imageUrl ? (
                      <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div
                        className={`w-16 h-16 rounded-full mr-4 flex items-center justify-center text-3xl shadow-sm
                        ${
                          selectedPetId === pet.id
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
                        }`}
                      >
                        🐾
                      </div>
                    )}
                    <div>
                      <h3
                        className={`font-semibold text-lg ${
                          selectedPetId === pet.id
                            ? "text-blue-700"
                            : "text-slate-800 group-hover:text-blue-600"
                        }`}
                      >
                        {pet.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {pet.species}
                        {pet.breed ? ` (${pet.breed})` : ""}
                      </p>
                    </div>
                  </div>
                  {(pet.age || pet.weight) && (
                    <div className="mt-3 pt-3 border-t border-slate-200 group-hover:border-blue-100 text-xs text-slate-500 flex flex-wrap gap-2">
                      {pet.age !== undefined && pet.age !== null && (
                        <span className="bg-slate-100 group-hover:bg-blue-100 px-2 py-1 rounded-full">
                          {pet.age} {pet.age === 1 ? "year" : "years"} old
                        </span>
                      )}
                      {pet.weight !== undefined && pet.weight !== null && (
                        <span className="bg-slate-100 group-hover:bg-blue-100 px-2 py-1 rounded-full">
                          {pet.weight} kg
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200">
              <Info className="mx-auto h-16 w-16 text-slate-400 mb-6" />
              <h3 className="text-slate-700 font-semibold text-xl mb-2">
                No Pets Found
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                You haven't registered any pets yet. Please add a new pet to
                proceed.
              </p>
              <button
                type="button"
                onClick={() => onToggleNewPet(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Pet
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="petName"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Pet Name<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="petName"
                type="text"
                value={petName}
                onChange={(e) => updateFormData({ petName: e.target.value })}
                className={`${commonInputClass} ${
                  errors.petName ? errorInputClass : normalInputClass
                }`}
                placeholder="e.g. Buddy"
              />
              {errors.petName && (
                <p className="text-red-600 text-xs mt-1">{errors.petName}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="petSpecies"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Species<span className="text-red-500 ml-1">*</span>
              </label>
              <select
                id="petSpecies"
                value={petSpecies}
                onChange={(e) => updateFormData({ petSpecies: e.target.value })}
                className={`${commonInputClass} ${
                  errors.petSpecies ? errorInputClass : normalInputClass
                } appearance-none bg-white`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.25em 1.25em",
                }}
              >
                <option value="">Select species</option>
                {speciesOptions.map((speciesItem) => (
                  <option key={speciesItem} value={speciesItem}>
                    {speciesItem}
                  </option>
                ))}
              </select>
              {errors.petSpecies && (
                <p className="text-red-600 text-xs mt-1">{errors.petSpecies}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="petBreed"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Breed <span className="text-slate-400">(optional)</span>
              </label>
              <input
                id="petBreed"
                type="text"
                value={petBreed}
                onChange={(e) => updateFormData({ petBreed: e.target.value })}
                className={`${commonInputClass} ${normalInputClass}`}
                placeholder="e.g. Golden Retriever"
              />
            </div>

            <div>
              <label
                htmlFor="petAge"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Age (years) <span className="text-slate-400">(optional)</span>
              </label>
              <input
                id="petAge"
                type="number"
                min="0"
                step="0.1"
                value={petAge}
                onChange={(e) => updateFormData({ petAge: e.target.value })}
                className={`${commonInputClass} ${
                  errors.petAge ? errorInputClass : normalInputClass
                }`}
                placeholder="e.g. 2.5"
              />
              {errors.petAge && (
                <p className="text-red-600 text-xs mt-1">{errors.petAge}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="petWeight"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Weight (kg) <span className="text-slate-400">(optional)</span>
              </label>
              <input
                id="petWeight"
                type="number"
                min="0"
                step="0.1"
                value={petWeight}
                onChange={(e) => updateFormData({ petWeight: e.target.value })}
                className={`${commonInputClass} ${
                  errors.petWeight ? errorInputClass : normalInputClass
                }`}
                placeholder="e.g. 15.3"
              />
              {errors.petWeight && (
                <p className="text-red-600 text-xs mt-1">{errors.petWeight}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetSelection;
