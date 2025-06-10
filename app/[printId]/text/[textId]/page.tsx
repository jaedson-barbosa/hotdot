import { saveText } from "@/actions";
import { getText } from "@/data/get-text";
import { fontNames } from "@/utils/font-names";

export default async function ({
  params,
}: {
  params: Promise<{ printId: string; textId: string }>;
}) {
  const { printId, textId } = await params;
  const text = await getText(+textId);

  return (
    <form action={saveText} className="flex flex-col gap-2 max-w-lg mx-auto">
      <input type="hidden" name="printId" value={printId} />
      <input type="hidden" name="textId" value={textId} />
      <label htmlFor="align">Align</label>
      <select name="align" id="align" required defaultValue={text?.align}>
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>
      <label htmlFor="font">Font</label>
      <select name="font" id="font" required defaultValue={text?.font}>
        {fontNames.map((v) => (
          <option key={v} className="dark:bg-zinc-900">{v}</option>
        ))}
      </select>
      <input
        type="text"
        name="text"
        id="text"
        minLength={10}
        required
        defaultValue={text?.text}
      />
      <button type="submit">Save changes</button>
    </form>
  );
}
