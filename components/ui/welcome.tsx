import { SignIn } from "@/components/signin-button";
import { createPrintAndRedirect } from "@/actions";

export async function Welcome() {
  return (
    <>
      <p>I'm a guest!</p>
      <SignIn />
      <button onClick={createPrintAndRedirect}>Criar print</button>
    </>
  );
}
