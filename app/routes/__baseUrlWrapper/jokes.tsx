import type { LinksFunction, LoaderFunction } from "remix";
import { Outlet, Link, json, useLoaderData } from "remix";

import stylesUrl from "~/styles/jokes.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type LoaderData = { tacos: string[] };

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    tacos: ["one", "taco", "for", "all"],
  };

  console.log("parent: about to await...");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("parent: finished awaiting!");
  return json(data);
};

export default function JokesRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link to="/" title="Remix Jokes" aria-label="Remix Jokes">
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <ul>
          {data.tacos.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              <li>
                <Link to="some-joke-id">Hippo</Link>
              </li>
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
