import DeleteConfirmation from "./DeleteConfirmation"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"

const DeleteAccount = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Permanently delete your data and everything associated with your account.
        </p>
        <DeleteConfirmation />
      </CardContent>
    </Card>
  )
}
export default DeleteAccount
