import { NavLink as RouterLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LinkProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, activeClassName, pendingClassName, to, ...rest }, ref) => {
    return (
      <RouterLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...rest}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };