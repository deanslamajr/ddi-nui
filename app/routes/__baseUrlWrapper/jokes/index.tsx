import type { LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";

type LoaderData = { tacos: string[] };

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    tacos: ["one", "taco", "for", "all"],
  };

  console.log("child: about to await...");

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("child: finished awaiting!");
  return json(data);
};

export default function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <ul>
        {data.tacos.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
      <p>Here's a random joke:</p>
      <p>I was wondering why the frisbee was getting bigger, then it hit me.</p>
    </div>
  );
}
