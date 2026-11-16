import { useEffect, useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import { useAuth, type Role } from "../lib/auth";
import { Button, Card, Input, Label, PageHeader, Select } from "../components/ui";

type User = { id: string; email: string; role: Role; createdAt: string };

const ROLE_TEXT: Record<Role, string> = {
  admin: "Admin: may change data and manage users",
  viewer: "Viewer: may only view",
};

function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        role === "admin" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
      }`}
    >
      {role === "admin" ? "Admin" : "Viewer"}
    </span>
  );
}

const message = (err: unknown) => (err instanceof ApiError ? err.message : "Something went wrong");

// Admins add users (a user name, a password and a role), change a user's role
// or password, and delete users.
export function Users() {
  const { user: me, canEdit } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [adding, setAdding] = useState(false);
  const [resetting, setResetting] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const load = () => api.get<User[]>("/users").then(setUsers).catch((err) => setError(message(err)));
  useEffect(() => {
    if (canEdit) load();
  }, [canEdit]);

  if (!canEdit) return <Navigate to="/" replace />;

  async function add(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setAdding(true);
    try {
      await api.post("/users", { email: email.trim(), password, role });
      setNotice(`Added ${email.trim()}. Give them the user name and password.`);
      setEmail("");
      setPassword("");
      setRole("viewer");
      await load();
    } catch (err) {
      setError(message(err));
    } finally {
      setAdding(false);
    }
  }

  async function changeRole(u: User, next: Role) {
    setError(null);
    setNotice(null);
    try {
      await api.patch(`/users/${u.id}`, { role: next });
      await load();
    } catch (err) {
      setError(message(err));
    }
  }

  async function savePassword(u: User) {
    setError(null);
    setNotice(null);
    try {
      await api.patch(`/users/${u.id}`, { password: newPassword });
      setNotice(`New password set for ${u.email}.`);
      setResetting(null);
      setNewPassword("");
    } catch (err) {
      setError(message(err));
    }
  }

  async function remove(u: User) {
    if (!window.confirm(`Delete the user ${u.email}? They will no longer be able to sign in.`)) return;
    setError(null);
    setNotice(null);
    try {
      await api.delete(`/users/${u.id}`);
      await load();
    } catch (err) {
      setError(message(err));
    }
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="Users" />
      <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
        Each person signs in with their own user name and password. <b>Admins</b> may change data and manage users; <b>viewers</b> may only view.
      </p>

      <Card className="mb-6 p-4">
        <h2 className="mb-3 font-semibold text-neutral-900 dark:text-neutral-100">Add a user</h2>
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
          <div>
            <Label>User name</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. dana or dana@iscar.co.il" autoComplete="off" required minLength={2} />
          </div>
          <div>
            <Label>Password (at least 8 characters)</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required minLength={8} />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={role} onChange={(e) => setRole(e.target.value as Role)} title={ROLE_TEXT[role]}>
              <option value="viewer">Viewer</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          <Button type="submit" disabled={adding}>
            {adding ? "Adding…" : "Add user"}
          </Button>
        </form>
      </Card>

      {error && <p className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {notice && <p className="mb-3 text-sm text-emerald-700 dark:text-emerald-400">{notice}</p>}

      <Card className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {users.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center gap-3 px-4 py-3" data-user={u.email}>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                {u.email} {u.id === me?.id && <span className="text-xs font-normal text-neutral-500">(you)</span>}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Added {new Date(u.createdAt).toLocaleDateString()}</div>
            </div>
            {u.id === me?.id && <RoleBadge role={u.role} />}
            {u.id !== me?.id && (
              <div className="w-28">
                <Select value={u.role} onChange={(e) => changeRole(u, e.target.value as Role)} aria-label={`Role of ${u.email}`}>
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </Select>
              </div>
            )}
            {resetting === u.id ? (
              <span className="flex items-center gap-2">
                <Input type="password" className="w-40" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" autoComplete="new-password" />
                <Button type="button" disabled={newPassword.length < 8} onClick={() => savePassword(u)}>
                  Set
                </Button>
                <Button type="button" variant="ghost" onClick={() => setResetting(null)}>
                  Cancel
                </Button>
              </span>
            ) : (
              <Button type="button" variant="secondary" onClick={() => { setResetting(u.id); setNewPassword(""); }}>
                Reset password
              </Button>
            )}
            {u.id !== me?.id && (
              <Button type="button" variant="danger" onClick={() => remove(u)}>
                Delete
              </Button>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
