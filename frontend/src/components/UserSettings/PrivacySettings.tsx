import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function PrivacySettings() {
  const [shareUsageData, setShareUsageData] = useState<boolean>(false);
  const [thirdPartyCookies, setThirdPartyCookies] = useState<boolean>(false);

  const PrivacyOption = ({
    id,
    title,
    description,
    checked,
    onCheckedChange,
  }: {
    id: string;
    title: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );

  const privacyOptions = [
    {
      id: "share-usage-data",
      title: "Share Usage Data",
      description:
        "Help us improve the product by sharing anonymous usage data.",
      checked: shareUsageData,
      onCheckedChange: setShareUsageData,
    },
    {
      id: "third-party-cookies",
      title: "Allow Third-Party Cookies",
      description: "Enable third-party cookies for personalized content.",
      checked: thirdPartyCookies,
      onCheckedChange: setThirdPartyCookies,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy</CardTitle>
        <CardDescription>Manage your privacy settings.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {privacyOptions.map((option) => (
          <PrivacyOption key={option.id} {...option} />
        ))}
      </CardContent>
    </Card>
  );
}
