import { Outlet } from "remix";

export default function BaseUrlWrapperRoute() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
