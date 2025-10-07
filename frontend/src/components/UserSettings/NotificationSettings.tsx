import { AtSignIcon, BellIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

function NotificationOption({
  id,
  icon: Icon,
  title,
  description,
  isSelected,
  onClick,
}: (typeof notificationOptions)[number] & {
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      key={id}
      role="radio"
      aria-checked={isSelected}
      onClick={onClick}
      className={cn(
        "-mx-2 flex cursor-pointer items-start space-x-4 rounded-md p-2 transition-all",
        "hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-accent text-accent-foreground"
      )}
    >
      <Icon className="mt-px h-5 w-5" />
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

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
      <CardContent className="grid gap-4" role="radiogroup">
        {notificationOptions.map((option) => (
          <NotificationOption
            key={option.id}
            {...option}
            isSelected={notification === option.id}
            onClick={() => setNotification(option.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
