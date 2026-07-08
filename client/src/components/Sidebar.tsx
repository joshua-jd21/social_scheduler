import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  Users,
  Sparkles,
  LogOut,
  X,
} from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type NavItem = {
  title: string;
  path: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Accounts",
    path: "/accounts",
    icon: Users,
  },
  {
    title: "Scheduler",
    path: "/scheduler",
    icon: CalendarClock,
  },
  {
    title: "AI Composer",
    path: "/ai-composer",
    icon: Sparkles,
  },
];

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  // Temporary user data
  // Replace with authenticated user from context/JWT later
  const user = {
    name: "Joshua David",
    email: "joshua@example.com",
  };

  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleSignOut = () => {
    // TODO:
    // - Remove JWT token
    // - Clear auth context
    // - Redirect to login
    console.log("Sign Out");
  };

  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        flex h-screen w-72 flex-col
        border-r border-slate-200
        bg-white
        shadow-xl
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}
      <div className="flex h-20 items-center justify-between border-b border-slate-200 px-6">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="FlowPost AI"
            className="h-11 w-11 object-contain"
          />

          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              FlowPost AI
            </h2>

            <p className="text-xs text-slate-500">
              AI Social Automation
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="rounded-lg p-2 transition hover:bg-slate-100 md:hidden"
        >
          <X className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `
                  group flex items-center gap-3
                  rounded-xl px-4 py-3
                  text-sm font-medium
                  transition-all duration-200

                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                `
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />

              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* AI Card */}
      <div className="px-5 pb-5">
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 p-5 text-white shadow-lg">
          <p className="text-sm font-semibold">
            FlowPost AI
          </p>

          <p className="mt-2 text-xs leading-5 text-blue-100">
            Create AI captions, generate images, schedule posts, and
            automate publishing across all your social media platforms.
          </p>
        </div>
      </div>

      {/* User Section */}
      <div className="border-t border-slate-200 p-5">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 font-semibold text-white">
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user.name}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;