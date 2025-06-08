import { addText } from "@/actions";
import { fontNames } from "@/utils/font-names";

export default async function ({
  params,
}: {
  params: Promise<{ printId: string }>;
}) {
  const { printId } = await params;

  return (
    <form action={addText} className="flex flex-col gap-2 max-w-lg mx-auto">
      <input type="hidden" name="printId" value={printId} />
      <label htmlFor="align">Align</label>
      <select name="align" id="align" required>
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>
      <label htmlFor="font">Font</label>
      <select name="font" id="font" required>
        {fontNames.map((v) => (
          <option>{v}</option>
        ))}
      </select>
      <input type="text" name="text" id="text" minLength={10} required />
      <button type="submit">Add text</button>
    </form>
  );
}
