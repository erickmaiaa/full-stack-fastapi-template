import { MonitorIcon, MoonIcon, SunIcon, TextIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ui/theme";

type Option<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type AppearanceOptionProps<T extends string> = {
  title: string;
  description: string;
  value: T;
  onValueChange: (value: T) => void;
  options: Option<T>[];
};

function AppearanceOption<T extends string>({
  title,
  description,
  value,
  onValueChange,
  options,
}: AppearanceOptionProps<T>) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-28 flex items-center sm:justify-center"
          >
            {selectedOption?.icon}
            <span className="ml-1">{selectedOption?.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-full sm:w-auto">
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={(val) => onValueChange(val as T)}
          >
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.icon}
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState("medium");

  const themeOptions: Option<"light" | "dark" | "system">[] = [
    {
      value: "light",
      label: "Light",
      icon: <SunIcon className="h-4 w-4 mr-2" />,
    },
    {
      value: "dark",
      label: "Dark",
      icon: <MoonIcon className="h-4 w-4 mr-2" />,
    },
    {
      value: "system",
      label: "System",
      icon: <MonitorIcon className="h-4 w-4 mr-2" />,
    },
  ];

  const fontOptions: Option<string>[] = [
    {
      value: "small",
      label: "Small",
      icon: <TextIcon className="h-4 w-4 mr-2" />,
    },
    {
      value: "medium",
      label: "Medium",
      icon: <TextIcon className="h-4 w-4 mr-2" />,
    },
    {
      value: "large",
      label: "Large",
      icon: <TextIcon className="h-4 w-4 mr-2" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Choose your preferred theme and font size.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <AppearanceOption
          title="Theme"
          description="Choose between light and dark mode."
          value={theme}
          onValueChange={setTheme}
          options={themeOptions}
        />
        <AppearanceOption
          title="Font Size"
          description="Adjust the font size to your preference."
          value={fontSize}
          onValueChange={setFontSize}
          options={fontOptions}
        />
      </CardContent>
    </Card>
  );
}
