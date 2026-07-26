import { useState, type FormEvent } from "react";
import { api, ApiError } from "../lib/api";
import { Button, Card, Input, Label, PageHeader } from "../components/ui";

export function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to change password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-md">
      <PageHeader title="Change Password" />
      <Card className="p-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          </div>
          <div>
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} required />
          </div>
          <div>
            <Label>Confirm New Password</Label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} required />
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-600 dark:text-emerald-400">Password changed successfully.</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving…" : "Change Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
