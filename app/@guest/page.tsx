import { SignIn } from "@/components/signin-button";
import { createPrintAndRedirect } from "../actions";

export default async function Page() {
  return (
    <>
      <p>I'm a guest!</p>
      <SignIn />
      <button onClick={createPrintAndRedirect}>Criar print</button>
    </>
  );
}
