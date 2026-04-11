import React from "react";
import { Check } from "lucide-react";

interface Step {
  id: number;
  name: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <nav
      aria-label="Progress"
      className="bg-slate-50 py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-200"
    >
      <ol
        role="list"
        className="flex items-center justify-center space-x-2 sm:space-x-4"
      >
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <React.Fragment key={step.id}>
              <li className="relative flex flex-col items-center">
                <div className="flex items-center text-sm font-medium">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors
                      ${
                        isCompleted
                          ? "bg-blue-600 text-white group-hover:bg-blue-800"
                          : isCurrent
                          ? "border-2 border-blue-600 bg-blue-50 text-blue-600"
                          : "border-2 border-slate-300 bg-white text-slate-500 group-hover:border-slate-400"
                      }`}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </span>
                </div>
                <p
                  className={`mt-2 text-xs sm:text-sm text-center font-medium ${
                    isCurrent
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-slate-700"
                      : "text-slate-500"
                  }`}
                >
                  {step.name}
                </p>
              </li>

              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-8 sm:w-12 md:w-16 lg:w-20 rounded transition-colors mt-[-1.25rem] sm:mt-[-1rem]  ${
                    isCompleted ? "bg-blue-600" : "bg-slate-300"
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProgressSteps;
