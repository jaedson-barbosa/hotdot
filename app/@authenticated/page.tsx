import { SignOut } from "@/components/signout-button";
import { createPrintAndRedirect } from "../actions";

export default async function Page() {
  return (
    <>
      <p>I'm authenticated!</p>
      <SignOut />
      <button onClick={createPrintAndRedirect}>Criar print</button>
    </>
  );
}
