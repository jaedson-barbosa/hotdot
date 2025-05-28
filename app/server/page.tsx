import { auth } from "@/auth";
import UserAvatar from "../components/user-avatar";

export default async function Page() {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <UserAvatar />
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
