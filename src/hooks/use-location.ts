import { usePathname } from "next/navigation";
import { useMemo } from "react";

export function useLocation() {
  const pathname = usePathname();
  const userRole = useMemo(() => pathname.split("/")[1], [pathname]);
  const currentModule = useMemo(() => pathname.split("/")[2], [pathname]);
  const page = useMemo(() => pathname.split("/")[3], [pathname]);
  return {pathname, module: currentModule, page, userRole};
}