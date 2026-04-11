import React from "react";
import { Info, Clock, Edit, FileText, ShieldCheck } from "lucide-react";

interface NoteSectionProps {
  notes: string;
  updateFormData: (data: Record<string, any>) => void;
}

const NoteSection: React.FC<NoteSectionProps> = ({ notes, updateFormData }) => {
  const maxLength = 500;
  const charCount = notes.length;
  const charPercentage = Math.min((charCount / maxLength) * 100, 100);

  return (
    <div className="animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800">
          Additional Information
        </h2>
        <p className="text-slate-600 mt-2 text-lg">
          Share any details that might help us prepare for your visit.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200">
            <label
              htmlFor="appointmentNotes"
              className="block text-lg font-semibold text-slate-700 mb-1"
            >
              Notes for the Veterinarian{" "}
              <span className="text-sm text-slate-500">(Optional)</span>
            </label>
            <p className="text-sm text-slate-500 mb-4">
              E.g., specific symptoms, recent changes in behavior, diet, or any
              questions you have.
            </p>
            <div className="relative">
              <textarea
                id="appointmentNotes"
                value={notes}
                onChange={(e) => updateFormData({ notes: e.target.value })}
                maxLength={maxLength}
                rows={6}
                className="w-full p-4 border border-slate-300 rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-150 shadow-sm hover:border-slate-400"
                placeholder="Enter any relevant information here..."
              />
              <div className="absolute bottom-3 right-3 flex items-center text-xs text-slate-500">
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden mr-2">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      charPercentage > 85
                        ? charPercentage > 95
                          ? "bg-red-500"
                          : "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${charPercentage}%` }}
                  ></div>
                </div>
                <span>
                  {charCount}/{maxLength}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 h-full">
            <div className="flex items-center mb-4">
              <Info className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-blue-800">
                Important Reminders
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-blue-700">
              {[
                {
                  icon: <Clock className="h-5 w-5" />,
                  text: "Please arrive 10-15 minutes before your scheduled appointment time.",
                },
                {
                  icon: <FileText className="h-5 w-5" />,
                  text: "Bring any previous medical records, especially for new pets.",
                },
                {
                  icon: <Edit className="h-5 w-5" />,
                  text: "Note any specific concerns or questions you have for the vet.",
                },
                {
                  icon: <ShieldCheck className="h-5 w-5" />,
                  text: "Ensure your pet is safely restrained (leash/carrier).",
                },
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-0.5 flex-shrink-0">
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteSection;
