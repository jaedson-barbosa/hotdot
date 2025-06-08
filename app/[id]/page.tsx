import { dbReadPrint } from "@/drizzle";
import { Image, Printer, Save, Type } from "lucide-react";
import { SignIn } from "@/components/signin-button";
import { auth } from "@/auth";
import { SignOut } from "@/components/signout-button";
import { PropsWithChildren } from "react";
import { Text } from "@/components/design/text";
import { fontFamilies } from "@/utils/fonts";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const doc = await dbReadPrint(id);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-12 gap-12 font-[family-name:var(--font-geist-sans)]">
      <header className="flex w-full max-w-lg justify-between items-center">
        <p className="leading-tight">
          {session?.user?.name && (
            <>
              Hi,
              <br />
              {session.user.name}
            </>
          )}
        </p>
        {session ? <SignOut /> : <SignIn />}
      </header>
      <main className="row-start-2 w-full max-w-lg h-full">
        <div className="w-full h-full">
          <Text
            align="center"
            font={fontFamilies.values().next().value!}
            text="This is just a test, This is just a test"
            width={384}
          />
          <div className="flex gap-[24px] mt-8 justify-center">
            <BottomButton>
              <Type size={16} color="#666" />
              Add text
            </BottomButton>
            <BottomButton>
              <Image size={16} color="#666" />
              Add image
            </BottomButton>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <BottomButton>
          <Printer size={16} color="#666" />
          Select device
        </BottomButton>
        {session && (
          <BottomButton>
            <Save size={16} color="#666" />
            Save
          </BottomButton>
        )}
      </footer>
      <pre>{JSON.stringify(doc)}</pre>
    </div>
  );
}

const BottomButton = (props: PropsWithChildren<{ onClick?: () => void }>) => {
  return (
    <button
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      {...props}
    />
  );
};
