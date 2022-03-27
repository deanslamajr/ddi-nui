import { Form, useSearchParams } from "remix";

type Props = {
  offset: string | null;
};
export default function ShowMore({ offset }: Props) {
  console.log("offset", offset);
  return typeof offset === "string" ? (
    <Form method="get">
      {/* <label htmlFor="showmore">ShowMore</label> */}
      <input
        type="checkbox"
        id="showmore"
        name="o"
        value={offset}
        defaultChecked
        hidden
      />
      <button type="submit">ShowMore</button>
    </Form>
  ) : null;
}
