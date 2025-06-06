import { signOut } from "@/auth";
import { Button } from "./button";
import { LogOut } from "lucide-react";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit">
        <LogOut />
        Sign Out
      </Button>
    </form>
  );
}
