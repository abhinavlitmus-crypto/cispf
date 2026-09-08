import OpportunityCard from "@/components/common/OpportunityCard/OpportunityCard";
import { opportunityItems } from "@/constants/opportunities";

export default function Opportunities() {
  return (
    <section aria-labelledby="opportunities-grid-heading" className="bg-neutral-900 text-white">
      <h2 id="opportunities-grid-heading" className="sr-only">Opportunities</h2>
      <div className="mx-auto grid max-w-[1920px] sm:grid-cols-2 lg:grid-cols-4">
        {opportunityItems.map((item) => <OpportunityCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}
