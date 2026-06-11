const ICONS: Record<string, string> = {
  Entrées: "🍝",
  Starters: "🍝",
  Antipasti: "🍝",
  Spécialités: "⭐",
  Specialties: "⭐",
  Specialità: "⭐",
  Viandes: "🥩",
  Meats: "🥩",
  Carni: "🥩",
  Desserts: "🍰",
  Dolci: "🍰",
  "A partager": "🧀",
  "To share": "🧀",
  "Plats du jour": "✨",
  "Today's specials": "✨",
  "Vin rouge": "🍷",
  "Red wine": "🍷",
  "Vin blanc": "🥂",
  "White wine": "🥂",
  "Vin rosé": "🌸",
  "Rosé wine": "🌸",
  Prosecco: "🥂",
  Cocktails: "🍸",
  Alcools: "🥃",
  Spirits: "🥃",
  Digestifs: "☕",
  "Vins & boissons": "🍾",
  "Wines & drinks": "🍾",
};

export function CategoryIcon({ name }: { name: string }) {
  const icon = ICONS[name] ?? "•";
  return (
    <span className="text-xl leading-none shrink-0" aria-hidden>
      {icon}
    </span>
  );
}
