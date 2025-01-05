import { cn } from "@/lib/utils";

interface AmountDisplayProps {
  amount: number;
  vatAmount?: number;
  className?: string;
}

export function AmountDisplay({ amount, vatAmount, className }: AmountDisplayProps) {
  const formatAmount = (value: number) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-1">
        <span className="text-gray-900 font-medium" aria-label={`Amount: ${formatAmount(amount)} euros`}>
          €{formatAmount(amount)}
        </span>
      </div>
      {vatAmount != null && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500" aria-label={`VAT: ${formatAmount(vatAmount)} euros`}>
            VAT €{formatAmount(vatAmount)}
          </span>
        </div>
      )}
    </div>
  );
}
