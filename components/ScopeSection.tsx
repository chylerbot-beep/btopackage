type PackageScope = {
  kitchen_top_cabinet_ft?: number | null;
  kitchen_bottom_cabinet_ft?: number | null;
  master_wardrobe_ft?: number | null;
  common_wardrobe_room2_ft?: number | null;
  common_wardrobe_room3_ft?: number | null;
  flooring_type?: string | null;
  countertop_material?: string | null;
  [key: string]: string | number | null | undefined;
};

type ScopeSectionProps = {
  package: PackageScope;
};

const tagClassName =
  'text-[13px] font-medium px-[10px] py-[4px] rounded-[4px] bg-[#F9F7F4] text-[#374151] border border-[#E5E0D8]';

export default function ScopeSection({ package: packageData }: ScopeSectionProps) {
  const allTags: string[] = [];

  if (
    (packageData.kitchen_top_cabinet_ft ?? 0) > 0 ||
    (packageData.kitchen_bottom_cabinet_ft ?? 0) > 0
  ) {
    allTags.push('Kitchen carpentry');
  }

  if ((packageData.master_wardrobe_ft ?? 0) > 0) {
    allTags.push('Master wardrobe');
  }

  if (
    (packageData.common_wardrobe_room2_ft ?? 0) > 0 ||
    (packageData.common_wardrobe_room3_ft ?? 0) > 0
  ) {
    allTags.push('Common wardrobes');
  }

  if (packageData.flooring_type) {
    allTags.push(`Flooring (${packageData.flooring_type})`);
  }

  if (packageData.countertop_material) {
    allTags.push(`Countertop (${packageData.countertop_material})`);
  }

  const visibleTags = allTags.slice(0, 5);
  const hiddenCount = Math.max(allTags.length - 5, 0);

  return (
    <section>
      <p className="text-[11px] font-semibold text-[#9CA3AF] tracking-wider">PACKAGE SCOPE</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {visibleTags.map((tag) => (
          <span key={tag} className={tagClassName}>
            {tag}
          </span>
        ))}
        {hiddenCount > 0 && (
          <span className="text-[13px] font-medium px-[10px] py-[4px] rounded-[4px] bg-[#F3F4F6] text-[#9CA3AF] border border-[#E5E7EB]">
            + {hiddenCount} more
          </span>
        )}
      </div>
    </section>
  );
}
