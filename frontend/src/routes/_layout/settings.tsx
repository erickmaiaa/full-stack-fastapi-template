import { createFileRoute } from "@tanstack/react-router";
import AppearanceSettings from "@/components/UserSettings/Appearance";
import ChangePassword from "@/components/UserSettings/ChangePassword";
import DeleteAccount from "@/components/UserSettings/DeleteAccount";
import NotificationSettings from "@/components/UserSettings/NotificationSettings";
import PrivacySettings from "@/components/UserSettings/PrivacySettings";
import UserInformation from "@/components/UserSettings/UserInformation";

export const Route = createFileRoute("/_layout/settings")({
  component: () => (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <UserInformation />
      <ChangePassword />
      <NotificationSettings />
      <AppearanceSettings />
      <PrivacySettings />
      <DeleteAccount />
    </div>
  ),
});
