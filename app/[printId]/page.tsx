import { dbReadPrint } from "@/drizzle";
import { Image, Printer, Save, Type } from "lucide-react";
import { SignIn } from "@/components/signin-button";
import { auth } from "@/auth";
import { SignOut } from "@/components/signout-button";
import { PropsWithChildren } from "react";
import { Text } from "@/components/design/text";
import { fontFamilies } from "@/utils/fonts";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ printId: string }>;
}) {
  const session = await auth();
  const { printId } = await params;
  const doc = await dbReadPrint(printId);

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
          {doc?.sections.map((section) => {
            const text = section.text;
            if (!text) return null;
            const font = fontFamilies.get(text.font);
            if (!font) return null;
            return (
              <Text
                key={text.id}
                align={text.align}
                font={font}
                text={text.text}
                width={doc.width}
              />
            );
          })}
          <div className="flex gap-[24px] mt-8 justify-center">
            <BottomButton href={`/${printId}/text/add`}>
              <Type size={16} color="#666" />
              Add text
            </BottomButton>
            <BottomButton href={`/${printId}/image/add`}>
              <Image size={16} color="#666" />
              Add image
            </BottomButton>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <BottomButton href="./">
          <Printer size={16} color="#666" />
          Select device
        </BottomButton>
        {session && (
          <BottomButton href="./">
            <Save size={16} color="#666" />
            Save
          </BottomButton>
        )}
      </footer>
    </div>
  );
}

const BottomButton = (
  props: PropsWithChildren<{ onClick?: () => void; href: string }>
) => {
  return (
    <Link
      className="flex items-center gap-2 hover:underline hover:underline-offset-4"
      {...props}
    />
  );
};
