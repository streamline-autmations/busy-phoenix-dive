import { Link } from "react-router-dom";
import { Package, Layers, BadgePercent, Boxes, ShoppingCart, MessageSquare, Star, Megaphone, BarChart3, Settings } from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/", icon: BarChart3 },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/catalog/products", icon: Package },
      { label: "Bundles", href: "/catalog/bundles", icon: Boxes },
      { label: "Specials", href: "/catalog/specials", icon: BadgePercent },
    ],
  },
  { label: "Inventory", items: [{ label: "Stock", href: "/inventory/stock", icon: Layers }] },
  { label: "Sales", items: [{ label: "Orders", href: "/sales/orders", icon: ShoppingCart }] },
  { label: "Engage", items: [
      { label: "Reviews", href: "/engage/reviews", icon: Star },
      { label: "Messages", href: "/engage/messages", icon: MessageSquare },
    ] },
  { label: "Marketing", items: [
      { label: "Contacts", href: "/marketing/contacts", icon: Megaphone },
      { label: "Campaigns", href: "/marketing/campaigns", icon: Megaphone },
      { label: "Discounts", href: "/marketing/discounts", icon: BadgePercent },
    ] },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="h-screen border-r bg-white p-4 space-y-4">
      <div className="font-semibold text-lg">BLOM Admin</div>
      <nav className="space-y-2">
        {nav.map((item, i) => (
          <div key={i} className="space-y-1">
            {item.href ? (
              <Link className="block rounded-lg px-3 py-2 hover:bg-neutral-100" to={item.href}>
                {item.label}
              </Link>
            ) : (
              <div className="text-xs uppercase text-neutral-500 px-3 pt-2">{item.label}</div>
            )}
            {item.items?.map((sub) => (
              <Link key={sub.href} className="block rounded-lg px-3 py-2 hover:bg-neutral-100" to={sub.href!}>
                {sub.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}