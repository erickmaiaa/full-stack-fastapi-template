import { createFileRoute } from "@tanstack/react-router";
import ChangePassword from "@/components/UserSettings/ChangePassword";
import UserInformation from "@/components/UserSettings/UserInformation";
import DeleteAccount from "@/components/UserSettings/DeleteAccount";
import NotificationSettings from "@/components/UserSettings/NotificationSettings";
import AppearanceSettings from "@/components/UserSettings/Appearance";
import PrivacySettings from "@/components/UserSettings/PrivacySettings";

export const Route = createFileRoute("/_layout/settings")({
  component: Settings,
});

function Settings() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <NotificationSettings />
      <AppearanceSettings />
      <PrivacySettings />
      <UserInformation />
      <ChangePassword />
      <DeleteAccount />
    </div>
  );
}
