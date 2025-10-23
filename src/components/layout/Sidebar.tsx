import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Package,
  Boxes,
  BadgePercent,
  Layers,
  ShoppingCart,
  Star,
  MessageSquare,
  Megaphone,
  Settings,
} from "lucide-react";

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
  { label: "Sales", items: [
      { label: "Orders", href: "/sales/orders", icon: ShoppingCart },
      { label: "Payments", href: "/sales/payments", icon: ShoppingCart },
    ] },
  { label: "Engage", items: [
      { label: "Reviews", href: "/engage/reviews", icon: Star },
      { label: "Messages", href: "/engage/messages", icon: MessageSquare },
    ] },
  { label: "Marketing", items: [
      { label: "Contacts", href: "/marketing/contacts", icon: Megaphone },
      { label: "Campaigns", href: "/marketing/campaigns", icon: Megaphone },
      { label: "Discounts", href: "/marketing/discounts", icon: BadgePercent },
    ] },
  { label: "Settings", items: [
      { label: "General", href: "/settings/general", icon: Settings },
      { label: "Users", href: "/settings/users", icon: Settings },
      { label: "Taxes", href: "/settings/taxes", icon: Settings },
      { label: "Shipping", href: "/settings/shipping", icon: Settings },
    ] },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="h-screen border-r bg-white p-4 space-y-4 w-60">
      <div className="font-semibold text-lg mb-6">BLOM Admin</div>
      <nav className="space-y-2" aria-label="Main navigation">
        {nav.map((item, i) => (
          <div key={i} className="space-y-1">
            {item.href ? (
              <Link
                to={item.href}
                className={`block rounded-lg px-3 py-2 ${
                  location.pathname === item.href ? "bg-pink-400 text-white" : "hover:bg-pink-100"
                }`}
              >
                <item.icon className="inline-block mr-2 h-5 w-5 align-text-bottom" />
                {item.label}
              </Link>
            ) : (
              <>
                <div className="text-xs uppercase text-neutral-500 px-3 pt-2">{item.label}</div>
                {item.items?.map((sub) => (
                  <Link
                    key={sub.href}
                    to={sub.href!}
                    className={`block rounded-lg px-3 py-2 ml-4 ${
                      location.pathname === sub.href ? "bg-pink-400 text-white" : "hover:bg-pink-100"
                    }`}
                  >
                    <sub.icon className="inline-block mr-2 h-4 w-4 align-text-bottom" />
                    {sub.label}
                  </Link>
                ))}
              </>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}