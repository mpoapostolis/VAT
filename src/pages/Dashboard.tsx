import { AnimatedPage } from "@/components/AnimatedPage";
import { StatsSection } from "@/components/dashboard/stats-section";
import { TransactionsSection } from "@/components/dashboard/transactions-section";

export function Dashboard() {
  return (
    <AnimatedPage>
      <div className="space-y-6 mx-auto max-w-[1600px]">
        <StatsSection />

        <TransactionsSection />
      </div>
    </AnimatedPage>
  );
}
