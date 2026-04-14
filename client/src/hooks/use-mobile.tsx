import * as React from "react";

const BREAKPOINT = 768;

export function useIsMobile() {
  const [mobile, setMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const media = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);

    const check = () => {
      setMobile(window.innerWidth < BREAKPOINT);
    };

    media.addEventListener("change", check);
    check();

    return () => media.removeEventListener("change", check);
  }, []);

  return !!mobile;
}