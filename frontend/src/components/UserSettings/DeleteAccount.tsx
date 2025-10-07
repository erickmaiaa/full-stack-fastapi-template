import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmation from "./DeleteConfirmation";

const DeleteAccount = () => {
  return (
    <Card className="w-full border-destructive">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Permanently delete your data and everything associated with your
          account.
        </p>
        <DeleteConfirmation />
      </CardContent>
    </Card>
  );
};

export default DeleteAccount;
