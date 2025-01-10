import { AnimatedPage } from "@/components/AnimatedPage";
import { CategorySections } from "@/components/dashboard/category-sections";
import { StatsSection } from "@/components/dashboard/stats-section";

export function Dashboard() {
  return (
    <AnimatedPage>
      <div className="space-y-6 mx-auto">
        <StatsSection />
        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2   gap-4">
          <CategorySections />
        </div>
      </div>
    </AnimatedPage>
  );
}
