import React from 'react';
import { Check, ChefHat, Bike, CheckCircle2, Clock } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderStatusStepperProps {
  status: OrderStatus;
  onAdvanceStatus?: (newStatus: OrderStatus) => void;
  showSimulateControl?: boolean;
}

const STEPS: {
  key: OrderStatus;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    key: 'PLACED',
    label: 'Order Placed',
    shortLabel: 'Placed',
    icon: Check,
    description: 'Order confirmed and registered in kitchen queue.',
  },
  {
    key: 'PREPARING',
    label: 'Preparing Noodles',
    shortLabel: 'Preparing',
    icon: ChefHat,
    description: 'Chef is boiling craft noodles and simmering artisanal broth.',
  },
  {
    key: 'READY_FOR_PICKUP',
    label: 'Out for Delivery / Ready for Pickup',
    shortLabel: 'Ready',
    icon: Bike,
    description: 'Hot bowl packaged with minimal waste and ready at counter.',
  },
  {
    key: 'COMPLETED',
    label: 'Delivered / Completed',
    shortLabel: 'Completed',
    icon: CheckCircle2,
    description: 'Order handed over. Enjoy every warm slurp!',
  },
];

export const OrderStatusStepper: React.FC<OrderStatusStepperProps> = ({
  status,
  onAdvanceStatus,
  showSimulateControl = false,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.key === status);
  const currentStep = STEPS[currentIndex] || STEPS[0];

  const handleNextStatus = () => {
    if (!onAdvanceStatus) return;
    if (currentIndex < STEPS.length - 1) {
      onAdvanceStatus(STEPS[currentIndex + 1].key);
    } else {
      onAdvanceStatus('PLACED');
    }
  };

  return (
    <div className="bg-stone-50/80 rounded-2xl p-4 sm:p-5 border border-stone-200/80 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
            Live Order Tracking
          </span>
        </div>
        <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
          {currentStep.label}
        </span>
      </div>

      {/* Progress Bar & Stepper Points */}
      <div className="relative pt-2 pb-1">
        {/* Background line */}
        <div className="absolute top-6 left-5 right-5 h-1 bg-stone-200 -translate-y-1/2 z-0" />

        {/* Active progress fill line */}
        <div
          className="absolute top-6 left-5 h-1 bg-orange-600 -translate-y-1/2 z-0 transition-all duration-500 ease-out"
          style={{
            width: `calc(${currentIndex / (STEPS.length - 1)} * (100% - 2.5rem))`,
          }}
        />

        {/* Stepper circles */}
        <div className="relative z-10 flex items-center justify-between">
          {STEPS.map((step, idx) => {
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center group">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                    isCurrent
                      ? 'bg-orange-600 text-white ring-4 ring-orange-200 scale-110'
                      : isPassed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-stone-400 border-2 border-stone-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`mt-2 text-[11px] sm:text-xs font-bold text-center transition-colors max-w-[75px] sm:max-w-none leading-tight ${
                    isCurrent
                      ? 'text-orange-700 font-extrabold'
                      : isPassed
                      ? 'text-stone-800'
                      : 'text-stone-400'
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Description */}
      <div className="p-3 bg-white rounded-xl border border-stone-200/70 text-xs flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-orange-600 animate-ping shrink-0" />
          <p className="text-stone-700 font-medium leading-tight">
            <strong className="text-stone-900 font-bold mr-1">{currentStep.label}:</strong>
            {currentStep.description}
          </p>
        </div>

        {showSimulateControl && onAdvanceStatus && (
          <button
            onClick={handleNextStatus}
            title="Simulate advancing to next order status for competition demonstration"
            className="shrink-0 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-orange-100 hover:text-orange-800 text-stone-600 text-[11px] font-bold border border-stone-200 transition-colors"
          >
            Advance Step ⏭
          </button>
        )}
      </div>
    </div>
  );
};
