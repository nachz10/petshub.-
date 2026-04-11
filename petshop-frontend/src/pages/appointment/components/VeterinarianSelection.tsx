import React from "react";
import { User, CheckCircle, Info, AlertTriangle } from "lucide-react"; // Added AlertTriangle

interface Vet {
  id: string;
  name: string;
}

interface VeterinarianSelectionProps {
  vets: Vet[];
  selectedVetId: string;
  onSelectVet: (vet: Vet) => void;
  error?: string;
}

const VeterinarianSelection: React.FC<VeterinarianSelectionProps> = ({
  vets,
  selectedVetId,
  onSelectVet,
  error,
}) => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800">
          Choose a Veterinarian
        </h2>
        <p className="text-slate-600 mt-2 text-lg">
          Select a preferred vet if available for your chosen time.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700">
          <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {vets.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vets.map((vet) => (
            <div
              key={vet.id}
              onClick={() => onSelectVet(vet)}
              className={`relative group p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer transform hover:scale-[1.02] hover:shadow-lg
                ${
                  selectedVetId === vet.id
                    ? "bg-blue-50 border-blue-500 shadow-blue-200 shadow-md"
                    : "bg-white border-slate-200 hover:border-blue-300"
                }`}
            >
              {selectedVetId === vet.id && (
                <CheckCircle className="absolute top-4 right-4 h-6 w-6 text-blue-600" />
              )}

              <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-4">
                <div
                  className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center
                    ${
                      selectedVetId === vet.id
                        ? "bg-blue-100"
                        : "bg-slate-100 group-hover:bg-blue-50"
                    }`}
                >
                  <User
                    className={`h-10 w-10 ${
                      selectedVetId === vet.id
                        ? "text-blue-600"
                        : "text-slate-500 group-hover:text-blue-500"
                    }`}
                  />
                </div>
                <div className="flex-grow">
                  <h3
                    className={`font-semibold text-xl mb-1 ${
                      selectedVetId === vet.id
                        ? "text-blue-700"
                        : "text-slate-800 group-hover:text-blue-600"
                    }`}
                  >
                    {vet.name}
                  </h3>
                  {/* Placeholder for specialization or other info */}
                  <p className="text-sm text-slate-500 group-hover:text-blue-500">
                    General Veterinarian
                  </p>
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 group-hover:bg-green-200">
                    Available
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
            No Veterinarians Available
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Unfortunately, no veterinarians match your current selection for the
            chosen date and time. You might try selecting a different time slot
            or date.
          </p>
        </div>
      )}
    </div>
  );
};

export default VeterinarianSelection;
