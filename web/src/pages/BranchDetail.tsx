import { Fragment, useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import { useResource } from "../lib/useResource";
import { BRANCH_REGIONS, COUNTRY_OPTIONS, countryName, plantCountry } from "../lib/countries";
import { Flag } from "../components/Flag";
import type { Branch, BranchContact, BranchNote, Plant } from "../lib/types";
import { Button, Card, Input, Label, Select, Textarea } from "../components/ui";

// One ISCAR branch: its details (country, address, manager, phone, email),
// contacts by role, the Schaeffler plants in its country, and general
// information notes.

const ROLE_SUGGESTIONS = ["Branch Manager", "Sales Manager", "Key Account Manager", "Product Manager", "Application Engineer", "Technical Support", "Customer Service"];

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

export function BranchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { data: plants } = useResource<Plant>("/plants");

  const load = useCallback(async () => {
    try {
      setBranch(await api.get<Branch>(`/branches/${id}`));
    } catch (err) {
      setError(err instanceof ApiError && err.status === 404 ? "This branch no longer exists." : "Failed to load the branch.");
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!branch) return <p className="text-sm text-neutral-500">{error ?? "Loading…"}</p>;

  const branchPlants = branch.country ? plants.filter((p) => plantCountry(p) === branch.country) : [];

  async function removeBranch() {
    if (!branch || !confirm(`Delete the branch ${branch.name} with its contacts and notes?`)) return;
    try {
      await api.delete(`/branches/${branch.id}`);
      navigate("/branches");
    } catch (err) {
      setError(err instanceof ApiError && err.status === 409 ? "This branch has RFQs, so it can't be deleted." : "Failed to delete the branch.");
    }
  }

  return (
    <div className="space-y-4" data-branch-detail={branch.name}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Link to="/branches" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
            ← ISCAR Branches
          </Link>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            <Flag code={branch.country} className="h-6 w-9" />
            {branch.name}
          </h1>
          {branch.region && <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">{branch.region}</p>}
        </div>
        <Button variant="ghost" onClick={removeBranch}>
          Delete branch
        </Button>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="grid gap-4 lg:grid-cols-2">
        <DetailsSection branch={branch} onSaved={setBranch} />
        <Section title={`Schaeffler plants${branch.country ? ` in ${countryName(branch.country)}` : ""}`}>
          {!branch.country ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Set the branch's country to see its Schaeffler plants.</p>
          ) : branchPlants.length === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">No Schaeffler plants in this country.</p>
          ) : (
            <ul className="space-y-1.5" data-branch-plants>
              {branchPlants.map((p) => (
                <li key={p.id} className="text-sm">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">{p.name}</span>
                  {p.specialties && (
                    <span className="ml-2 text-xs text-neutral-500 dark:text-neutral-400">{p.specialties.split("\n").filter(Boolean).join(" · ")}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
          <Link to="/plants" className="mt-3 inline-block text-xs text-blue-600 hover:underline dark:text-blue-400">
            Open the Schaeffler Plants map →
          </Link>
        </Section>
      </div>
      <ContactsSection branch={branch} onChanged={load} />
      <NotesSection branch={branch} onChanged={load} />
    </div>
  );
}

function DetailsSection({ branch, onSaved }: { branch: Branch; onSaved: (b: Branch) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", country: "", region: "", address: "", managerName: "", phone: "", email: "" });
  const [error, setError] = useState<string | null>(null);

  function start() {
    setForm({
      name: branch.name,
      country: branch.country ?? "",
      region: branch.region ?? "",
      address: branch.address ?? "",
      managerName: branch.managerName ?? "",
      phone: branch.phone ?? "",
      email: branch.email ?? "",
    });
    setError(null);
    setEditing(true);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const blank = (v: string) => v.trim() || null;
    try {
      const saved = await api.patch<Branch>(`/branches/${branch.id}`, {
        name: form.name.trim(),
        country: form.country || null,
        region: form.region || null,
        address: blank(form.address),
        managerName: blank(form.managerName),
        phone: blank(form.phone),
        email: blank(form.email),
      });
      onSaved(saved);
      setEditing(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    }
  }

  const row = (label: string, value: ReactNode) =>
    value ? (
      <>
        <dt className="text-neutral-500 dark:text-neutral-400">{label}</dt>
        <dd className="whitespace-pre-line text-neutral-900 dark:text-neutral-100">{value}</dd>
      </>
    ) : null;

  return (
    <Section title="Details" action={!editing && <Button variant="ghost" onClick={start}>Edit</Button>}>
      {editing ? (
        <form onSubmit={save} className="grid grid-cols-2 gap-3" data-branch-form>
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label>Country</Label>
            <Select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} aria-label="Country">
              <option value="">—</option>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Region</Label>
            <Select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} aria-label="Region">
              <option value="">—</option>
              {BRANCH_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Address</Label>
            <Textarea dir="auto" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} aria-label="Address" />
          </div>
          <div>
            <Label>Branch manager</Label>
            <Input value={form.managerName} onChange={(e) => setForm({ ...form, managerName: e.target.value })} aria-label="Branch manager" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-label="Phone" />
          </div>
          <div className="col-span-2">
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-label="Email" />
          </div>
          {error && <p className="col-span-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="col-span-2 flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <dl className="grid grid-cols-[8rem_1fr] gap-x-3 gap-y-2 text-sm" data-branch-details>
          {row("Country", branch.country ? countryName(branch.country) : null)}
          {row("Region", branch.region)}
          {row("Address", branch.address)}
          {row("Branch manager", branch.managerName)}
          {row("Phone", branch.phone)}
          {row(
            "Email",
            branch.email && (
              <a href={`mailto:${branch.email}`} className="text-blue-600 hover:underline dark:text-blue-400">
                {branch.email}
              </a>
            )
          )}
          {!branch.country && !branch.address && !branch.managerName && !branch.phone && !branch.email && (
            <p className="col-span-2 text-neutral-500 dark:text-neutral-400">No details yet. Click Edit to add them.</p>
          )}
        </dl>
      )}
    </Section>
  );
}

const EMPTY_CONTACT = { role: "", name: "", email: "", phone: "" };

function ContactsSection({ branch, onChanged }: { branch: Branch; onChanged: () => void }) {
  const contacts = branch.contacts ?? [];
  // null: not editing; "new": the add row; otherwise the contact's id.
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_CONTACT);
  const [error, setError] = useState<string | null>(null);

  function start(c?: BranchContact) {
    setForm(c ? { role: c.role, name: c.name, email: c.email ?? "", phone: c.phone ?? "" } : EMPTY_CONTACT);
    setEditing(c ? c.id : "new");
    setError(null);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const body = { role: form.role.trim(), name: form.name.trim(), email: form.email.trim() || null, phone: form.phone.trim() || null };
    try {
      if (editing === "new") await api.post("/branch-contacts", { branchId: branch.id, ...body });
      else await api.patch(`/branch-contacts/${editing}`, body);
      setEditing(null);
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the contact");
    }
  }

  async function remove(c: BranchContact) {
    if (!confirm(`Delete ${c.name} (${c.role})?`)) return;
    await api.delete(`/branch-contacts/${c.id}`);
    onChanged();
  }

  const roles = [...new Set([...ROLE_SUGGESTIONS, ...contacts.map((c) => c.role)])];
  const formRow = (
    <tr>
      <td colSpan={5} className="py-2">
        <form onSubmit={save} className="grid grid-cols-2 gap-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]" data-contact-form>
          <Input list="contact-roles" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" aria-label="Role" required />
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" aria-label="Name" required />
          <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" aria-label="Email" />
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" aria-label="Phone" />
          <div className="flex gap-1">
            <Button type="submit">Save</Button>
            <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
          </div>
        </form>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </td>
    </tr>
  );

  return (
    <Section title="Contacts" action={editing === null && <Button variant="ghost" onClick={() => start()}>+ Add contact</Button>}>
      <datalist id="contact-roles">
        {roles.map((r) => (
          <option key={r} value={r} />
        ))}
      </datalist>
      {contacts.length === 0 && editing !== "new" && <p className="text-sm text-neutral-500 dark:text-neutral-400">No contacts yet.</p>}
      <table className="w-full text-sm" data-contacts>
        {contacts.length > 0 && (
          <thead>
            <tr className="text-left text-xs text-neutral-500 dark:text-neutral-400">
              <th className="py-1 pr-3 font-medium">Role</th>
              <th className="py-1 pr-3 font-medium">Name</th>
              <th className="py-1 pr-3 font-medium">Email</th>
              <th className="py-1 pr-3 font-medium">Phone</th>
              <th />
            </tr>
          </thead>
        )}
        <tbody>
          {contacts.map((c) =>
            editing === c.id ? (
              <Fragment key={c.id}>{formRow}</Fragment>
            ) : (
              <tr key={c.id} className="group border-t border-neutral-100 dark:border-neutral-800" data-contact={c.name}>
                <td className="py-1.5 pr-3 font-medium text-neutral-900 dark:text-neutral-100">{c.role}</td>
                <td className="py-1.5 pr-3">{c.name}</td>
                <td className="py-1.5 pr-3">
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline dark:text-blue-400">
                      {c.email}
                    </a>
                  )}
                </td>
                <td className="py-1.5 pr-3 whitespace-nowrap">{c.phone}</td>
                <td className="py-1.5 text-right whitespace-nowrap">
                  <span className="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <button type="button" onClick={() => start(c)} className="px-1.5 text-xs text-blue-600 hover:underline dark:text-blue-400">
                      Edit
                    </button>
                    <button type="button" onClick={() => remove(c)} className="px-1.5 text-xs text-red-600 hover:underline dark:text-red-400">
                      Delete
                    </button>
                  </span>
                </td>
              </tr>
            )
          )}
          {editing === "new" && formRow}
        </tbody>
      </table>
    </Section>
  );
}

function NotesSection({ branch, onChanged }: { branch: Branch; onChanged: () => void }) {
  const notes = branch.notes ?? [];
  const [editing, setEditing] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  function start(n?: BranchNote) {
    setTitle(n?.title ?? "");
    // New information defaults to today.
    setDate(n ? (n.date ?? "").slice(0, 10) : new Date().toISOString().slice(0, 10));
    setText(n?.text ?? "");
    setEditing(n ? n.id : "new");
    setError(null);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const body = { title: title.trim(), text: text.trim(), date: date || null };
      if (editing === "new") await api.post("/branch-notes", { branchId: branch.id, ...body });
      else await api.patch(`/branch-notes/${editing}`, body);
      setEditing(null);
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save the note");
    }
  }

  async function remove(n: BranchNote) {
    if (!confirm(`Delete "${n.title}"?`)) return;
    await api.delete(`/branch-notes/${n.id}`);
    onChanged();
  }

  const form = (
    <form onSubmit={save} className="space-y-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700" data-note-form>
      <div className="flex gap-2">
        <Input dir="auto" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" aria-label="Note title" required autoFocus />
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Note date" className="w-44 shrink-0" />
      </div>
      <Textarea dir="auto" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Information about the branch…" aria-label="Note text" />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <Section title="General information" action={editing === null && <Button variant="ghost" onClick={() => start()}>+ Add information</Button>}>
      <div className="space-y-3" data-notes>
        {editing === "new" && form}
        {notes.length === 0 && editing !== "new" && <p className="text-sm text-neutral-500 dark:text-neutral-400">No information yet.</p>}
        {notes.map((n) =>
          editing === n.id ? (
            <div key={n.id}>{form}</div>
          ) : (
            <div key={n.id} className="group rounded-lg border border-neutral-200 p-3 dark:border-neutral-800" data-note={n.title}>
              <div className="flex items-start justify-between gap-2">
                <h3 dir="auto" className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {n.title}
                </h3>
                <span className="flex shrink-0 items-center gap-1 text-xs">
                  {n.date && (
                    <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" data-note-date>
                      {new Date(n.date).toLocaleDateString(undefined, { timeZone: "UTC" })}
                    </span>
                  )}
                  <span className="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <button type="button" onClick={() => start(n)} className="px-1.5 text-blue-600 hover:underline dark:text-blue-400">
                      Edit
                    </button>
                    <button type="button" onClick={() => remove(n)} className="px-1.5 text-red-600 hover:underline dark:text-red-400">
                      Delete
                    </button>
                  </span>
                </span>
              </div>
              {n.text && (
                <p dir="auto" className="mt-1 text-sm whitespace-pre-line text-neutral-700 dark:text-neutral-300">
                  {n.text}
                </p>
              )}
            </div>
          )
        )}
      </div>
    </Section>
  );
}
