import { auth } from "@/auth";
import { History } from "@/components/ui/history";
import { Welcome } from "@/components/ui/welcome";

export default async function Page() {
  const session = await auth();

  if (session) {
    return <History />
  } else {
    return <Welcome />
  }
}
