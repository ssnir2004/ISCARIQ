import { useState, type FormEvent } from "react";
import { useResource } from "../../lib/useResource";
import { api, ApiError } from "../../lib/api";
import type { Department, Team } from "../../lib/types";
import { Button, Card, Input, Label, PageHeader, Select } from "../../components/ui";

export function Teams() {
  const { data: departments, reload: reloadDepartments } = useResource<Department>("/departments");
  const { data: teams, reload: reloadTeams } = useResource<Team>("/teams");
  const [teamForm, setTeamForm] = useState({ code: "", description: "", departmentId: "", isManager: false });
  const [deptForm, setDeptForm] = useState({ code: "", name: "" });
  const [error, setError] = useState<string | null>(null);

  async function addDept(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/departments", deptForm);
      setDeptForm({ code: "", name: "" });
      reloadDepartments();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create department");
    }
  }

  async function addTeam(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/teams", { ...teamForm, departmentId: teamForm.departmentId || departments[0]?.id });
      setTeamForm({ code: "", description: "", departmentId: "", isManager: false });
      reloadTeams();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create team");
    }
  }

  async function removeTeam(id: string) {
    if (!confirm("Delete this team?")) return;
    setError(null);
    try {
      await api.delete(`/teams/${id}`);
      reloadTeams();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete team");
    }
  }

  const byDept = departments.map((d) => ({
    dept: d,
    teams: teams.filter((t) => t.departmentId === d.id),
  }));

  return (
    <div className="max-w-4xl">
      <PageHeader title="Teams & Departments" />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">New Department</h2>
          <form onSubmit={addDept} className="space-y-2">
            <div>
              <Label>Code</Label>
              <Input value={deptForm.code} onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })} required />
            </div>
            <div>
              <Label>Name</Label>
              <Input value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} required />
            </div>
            <Button type="submit">Add Department</Button>
          </form>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">New Team</h2>
          <form onSubmit={addTeam} className="space-y-2">
            <div>
              <Label>Department</Label>
              <Select value={teamForm.departmentId} onChange={(e) => setTeamForm({ ...teamForm, departmentId: e.target.value })} required>
                <option value="">Select…</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} — {d.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Code</Label>
              <Input value={teamForm.code} onChange={(e) => setTeamForm({ ...teamForm, code: e.target.value })} required />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={teamForm.description} onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })} required />
            </div>
            <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <input
                type="checkbox"
                checked={teamForm.isManager}
                onChange={(e) => setTeamForm({ ...teamForm, isManager: e.target.checked })}
              />
              Department manager
            </label>
            <Button type="submit">Add Team</Button>
          </form>
        </Card>
      </div>

      {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="space-y-4">
        {byDept.map(({ dept, teams: deptTeams }) => (
          <Card key={dept.id} className="p-4">
            <h3 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {dept.code} — {dept.name}
            </h3>
            <div className="space-y-1">
              {deptTeams.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded-lg px-2 py-1 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <div>
                    <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">{t.code}</span>
                    <span className="ml-2 text-neutral-900 dark:text-neutral-100">{t.description}</span>
                    {t.isManager && (
                      <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                        Manager
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" onClick={() => removeTeam(t.id)}>
                    Delete
                  </Button>
                </div>
              ))}
              {deptTeams.length === 0 && <p className="text-sm text-neutral-400">No teams yet</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
