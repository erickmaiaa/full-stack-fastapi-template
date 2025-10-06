import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/theme-provider";
import { MonitorIcon, MoonIcon, SunIcon, TextIcon } from "lucide-react";

type Option = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type AppearanceOptionProps = {
  title: string;
  description: string;
  triggerIcon: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
};

function AppearanceOption({
  title,
  description,
  triggerIcon,
  value,
  onValueChange,
  options,
}: AppearanceOptionProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-28 flex items-center sm:justify-center"
          >
            {triggerIcon}
            <span className="ml-1">{selectedOption?.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-full sm:w-auto">
          <DropdownMenuRadioGroup value={value} onValueChange={onValueChange}>
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

  const themeOptions: Option[] = [
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

  const fontOptions: Option[] = [
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ];

  const ThemeIcon = themeOptions.find((o) => o.value === theme)?.icon || (
    <SunIcon className="h-4 w-4 mr-2" />
  );

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
          triggerIcon={ThemeIcon}
          value={theme}
          onValueChange={(val) => setTheme(val as "light" | "dark" | "system")}
          options={themeOptions}
        />
        <AppearanceOption
          title="Font Size"
          description="Adjust the font size to your preference."
          triggerIcon={<TextIcon className="h-4 w-4 mr-2" />}
          value={fontSize}
          onValueChange={(val) => setFontSize(val)}
          options={fontOptions}
        />
      </CardContent>
    </Card>
  );
}
