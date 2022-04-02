import { Form, LinksFunction } from "remix";

import stylesUrl from "./show-more.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type Props = {
  offset: string | null;
};

export default function ShowMore({ offset }: Props) {
  console.log("offset", offset);
  return typeof offset === "string" ? (
    <div className="nav-button bottom-center">
      <Form method="get">
        <input
          type="checkbox"
          id="showmore"
          name="o"
          value={offset}
          defaultChecked
          hidden
        />
        <button type="submit">↓</button>
      </Form>
    </div>
  ) : null;
}
