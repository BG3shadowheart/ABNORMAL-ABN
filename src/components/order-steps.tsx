import { ORDER_STEPS } from '@/data/store';

/** The four ordering steps as a numbered list. */
export function OrderSteps({ className = '' }: { className?: string }) {
  return (
    <ol className={`panel space-y-5 p-5 sm:p-6 ${className}`}>
      {ORDER_STEPS.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <span className="step-number">{index + 1}</span>
          <div>
            <h3 className="text-[0.95rem] font-semibold text-bone-50">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-bone-400">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
