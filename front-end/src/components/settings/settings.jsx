import { useState } from "react";
import { useDispatch } from "react-redux";
import { changePasswordThunk } from "../../rtk/thunks/registerThunk/registerThunk";
import { deactivateAccountThunk } from "../../rtk/thunks/deactivateThunk/deactivateThunk";

function IconShield() { /* same as your original */ }
function IconBell() { /* same */ }
function IconLock() { /* same */ }
function IconPalette() { /* same */ }

function SettingCard({ icon, title, description, children }) {
  return (
    <div
      className="rounded-[1.4rem] border p-4 sm:rounded-[1.6rem] sm:p-5"
      style={{
        borderColor: "var(--panel-border)",
        background: "rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(8,145,178,0.12)",
            color: "var(--accent)",
          }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold sm:text-base" style={{ color: "var(--app-text)" }}>
            {title}
          </h2>
          <p className="mt-1 text-xs leading-6 sm:text-sm" style={{ color: "var(--muted-text)" }}>
            {description}
          </p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ToggleRow({ label, hint, checked }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl px-3 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium" style={{ color: "var(--app-text)" }}>
          {label}
        </p>
        <p className="mt-0.5 text-xs" style={{ color: "var(--muted-text)" }}>
          {hint}
        </p>
      </div>
      <button
        type="button"
        className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border transition`}
        style={{
          borderColor: checked ? "rgba(8,145,178,0.18)" : "var(--panel-border)",
          background: checked ? "rgba(8,145,178,0.18)" : "rgba(255,255,255,0.08)",
        }}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full transition ${checked ? "left-6" : "left-1"}`}
          style={{
            background: checked ? "var(--accent)" : "rgba(255,255,255,0.82)",
          }}
        />
      </button>
    </div>
  );
}

function Settings() {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = () => {
    dispatch(changePasswordThunk({ currentPassword, newPassword }));
  };



    const handleDeactivateAccount = () => {
      alert("Are you sure you want to deactivate your account? This action cannot be undone.");
      if (window.confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
        dispatch(deactivateAccountThunk());
      }
  };

  return (
    <section
      className="rounded-[1.5rem] border p-4 shadow-2xl sm:rounded-[2rem] sm:p-5"
      style={{
        borderColor: "var(--panel-border)",
        background: "var(--panel-bg)",
        boxShadow: "0 22px 60px rgba(51,65,85,0.14)",
      }}
    >
      <div className="border-b pb-4" style={{ borderColor: "var(--panel-border)" }}>
        <h1 className="text-lg font-semibold sm:text-xl" style={{ color: "var(--app-text)" }}>
          Settings
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--muted-text)" }}>
          Manage your account, privacy, and app preferences.
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:mt-5 lg:grid-cols-2">
        <SettingCard
          icon={<IconLock />}
          title="Change Password"
          description="Keep your account secure with a strong password and recovery settings."
        >
          <div className="space-y-3">
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              placeholder="Current password"
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{
                borderColor: "var(--panel-border)",
                background: "rgba(255,255,255,0.08)",
                color: "var(--app-text)",
              }}
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{
                borderColor: "var(--panel-border)",
                background: "rgba(255,255,255,0.08)",
                color: "var(--app-text)",
              }}
            />
            <button
              onClick={handleChangePassword}
              type="button"
              className="rounded-full px-4 py-2.5 text-sm font-semibold text-white"
              style={{ background: "var(--bubble-outgoing)" }}
            >
              Update Password
            </button>
          </div>
        </SettingCard>

        <SettingCard
          icon={<IconBell />}
          title="Notifications"
          description="Choose how and when you want to be notified about new activity."
        >
          <div className="space-y-1">
            <ToggleRow label="Push Notifications" hint="Alerts for new chats and requests" checked={true} />
            <ToggleRow label="Message Preview" hint="Show quick message text in notifications" checked={true} />
            <ToggleRow label="Mute Sounds" hint="Disable app notification sounds" checked={false} />
          </div>
        </SettingCard>

        <SettingCard
          icon={<IconShield />}
          title="Privacy & Security"
          description="Control your visibility and protect your messaging profile."
        >
          <div className="space-y-3">
            <div className="rounded-2xl border px-4 py-3" style={{ borderColor: "var(--panel-border)", background: "rgba(255,255,255,0.06)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--app-text)" }}>Last Seen</p>
              <p className="mt-1 text-xs" style={{ color: "var(--muted-text)" }}>Everyone</p>
            </div>
            <div className="rounded-2xl border px-4 py-3" style={{ borderColor: "var(--panel-border)", background: "rgba(255,255,255,0.06)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--app-text)" }}>Profile Photo</p>
              <p className="mt-1 text-xs" style={{ color: "var(--muted-text)" }}>Contacts only</p>
            </div>
            <div className="rounded-2xl border px-4 py-3" style={{ borderColor: "var(--panel-border)", background: "rgba(255,255,255,0.06)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--app-text)" }}>Two-Step Verification</p>
              <p className="mt-1 text-xs" style={{ color: "var(--muted-text)" }}>Enabled</p>
            </div>
          </div>
        </SettingCard>

        <SettingCard
          icon={<IconPalette />}
          title="App Preferences"
          description="Tune your overall chat experience and app appearance."
        >
          <div className="space-y-1">
            <ToggleRow label="Compact Mode" hint="Show tighter spacing across the app" checked={false} />
            <ToggleRow label="Auto Download Media" hint="Photos, voice notes, and files" checked={true} />
            <ToggleRow label="Desktop-style Layout" hint="Keep broader layout on large screens" checked={true} />
            <div className="pt-2">
              <button
              onClick={handleDeactivateAccount}
                type="button"
                className="rounded-full border px-4 py-2.5 text-sm font-semibold"
                style={{
                  borderColor: "rgba(239,68,68,0.18)",
                  background: "rgba(239,68,68,0.1)",
                  color: "#dc2626",
                }}
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </SettingCard>
      </div>
    </section>
  );
}

export default Settings;