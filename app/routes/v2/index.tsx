import type { LinksFunction, LoaderFunction } from "remix";
import { json, Link, useLoaderData } from "remix";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type LoaderData = { tacos: string[] };

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    tacos: ["one", "taco", "for", "all"],
  };

  await new Promise((resolve) => setTimeout(resolve, 1000));
  return json(data);
};

export default function IndexRoute() {
  const data = useLoaderData<LoaderData>();

  console.log("process.env.BASE_URL", process.env.BASE_URL);

  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Jokes!</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="jokes">Read Jokes</Link>
            </li>
          </ul>
        </nav>
        <ul>
          {data.tacos.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
