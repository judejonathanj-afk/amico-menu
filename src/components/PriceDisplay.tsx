import { formatPrice } from "@/lib/menu";

type Props = {
  price: number | null;
  priceSecondary?: number | null;
  priceSecondaryLabel?: string | null;
  glassLabel?: string;
  className?: string;
};

export function PriceDisplay({
  price,
  priceSecondary,
  priceSecondaryLabel,
  glassLabel = "verre",
  className = "",
}: Props) {
  const primary = formatPrice(price);
  const secondary = formatPrice(priceSecondary);

  if (!primary && !secondary) return null;

  if (primary && secondary) {
    return (
      <span className={`whitespace-nowrap font-medium ${className || "text-[#2563eb]"}`}>
        {primary} <span className="text-stone-400 font-normal">/</span> {secondary}
        <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-normal">
          {glassLabel} / {priceSecondaryLabel ?? "bouteille"}
        </span>
      </span>
    );
  }

  const single = primary ?? secondary;
  const label =
    !primary && secondary ? (priceSecondaryLabel ?? "bouteille") : null;

  return (
    <span className={`whitespace-nowrap font-medium ${className || "text-[#2563eb]"}`}>
      {single}
      {label && (
        <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-normal">
          {label}
        </span>
      )}
    </span>
  );
}
