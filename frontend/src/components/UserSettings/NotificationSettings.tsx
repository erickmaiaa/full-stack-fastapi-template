import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AtSignIcon, BellIcon, EyeOffIcon } from "lucide-react";

type NotificationType = "everything" | "available" | "ignoring";

const notificationOptions = [
  {
    id: "everything" as NotificationType,
    icon: BellIcon,
    title: "Everything",
    description: "Email digest, mentions & all activity.",
  },
  {
    id: "available" as NotificationType,
    icon: AtSignIcon,
    title: "Available",
    description: "Only mentions and comments.",
  },
  {
    id: "ignoring" as NotificationType,
    icon: EyeOffIcon,
    title: "Ignoring",
    description: "Turn off all notifications.",
  },
];

export default function NotificationSettings() {
  const [notification, setNotification] =
    useState<NotificationType>("available");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose what you want to be notified about.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.id}
              role="button"
              onClick={() => setNotification(option.id)}
              className={`-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 ${
                notification === option.id
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  : ""
              }`}
              aria-pressed={notification === option.id}
            >
              <Icon className="mt-px h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {option.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
