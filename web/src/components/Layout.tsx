import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";

const NAV = [
  { to: "/", label: "Pipeline", end: true },
  { to: "/advisor", label: "Insert Advisor" },
  { to: "/catalog/inserts", label: "Inserts" },
  { to: "/catalog/cutting-conditions", label: "Cutting Conditions" },
  { to: "/catalog/shapes", label: "Shapes" },
  { to: "/catalog/chipbreakers", label: "Chipbreakers" },
  { to: "/catalog/grades", label: "Grades" },
  { to: "/catalog/coatings", label: "Coatings" },
  { to: "/catalog/materials", label: "Materials" },
  { to: "/catalog/problem-tags", label: "Problem Tags" },
  { to: "/catalog/teams", label: "Teams & Departments" },
];

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
          <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">ISCARIQ</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Schaeffler Account</div>
        </div>
        <nav className="flex-1 space-y-1 p-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-neutral-200 p-3 text-xs dark:border-neutral-800">
          <div className="mb-2 truncate text-neutral-500 dark:text-neutral-400">{user?.email}</div>
          <NavLink
            to="/change-password"
            className="block w-full rounded-lg px-3 py-1.5 text-left text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Change Password
          </NavLink>
          <button
            onClick={() => logout()}
            className="w-full rounded-lg px-3 py-1.5 text-left text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-auto bg-neutral-50 p-6 dark:bg-neutral-950">
        <Outlet />
      </main>
    </div>
  );
}
