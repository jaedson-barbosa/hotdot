import Image from "next/image";
import { signIn } from "@/auth";
import { Button } from "./button";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <Button type="submit">
        <Image
          aria-hidden
          src="/google.svg"
          alt="Google logo"
          width={16}
          height={16}
        />
        Sign in
      </Button>
    </form>
  );
}
