import { Suspense, lazy, useEffect, useState } from "react";
import type { ReactNode } from "react";

let LazyImportedEruda = lazy(
  () =>
    // @ts-ignore
    import("./Eruda")
);

// This is needed until Suspense works in SSR (e.g. react v18)
export function ClientOnly({ children }: { children: ReactNode }) {
  let [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <>{children}</> : null;
}

const Debugger: React.FC<{}> = ({}) => {
  return (
    <ClientOnly>
      <Suspense fallback="">
        <LazyImportedEruda />
      </Suspense>
    </ClientOnly>
  );
};

export default Debugger;
