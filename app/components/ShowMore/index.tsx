import { Form, LinksFunction } from "remix";

import stylesUrl from "./show-more.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type Props = {
  offset: string | null;
  isNewer?: boolean;
};

export default function ShowMore({ isNewer, offset }: Props) {
  return typeof offset === "string" ? (
    <div className="nav-button bottom-center show-more">
      <Form replace>
        <input
          type="checkbox"
          id="showmore"
          name="o"
          value={offset}
          defaultChecked
          hidden
        />
        {isNewer && (
          <input
            type="checkbox"
            id="showmore"
            name="isNewer"
            value="true"
            defaultChecked
            hidden
          />
        )}
        <button type="submit">{isNewer ? "↑" : "↓"}</button>
      </Form>
    </div>
  ) : null;
}
