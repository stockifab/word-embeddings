import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";

export function SlideTextHighlight({
  className,
  children,
  ...props
}: ComponentProps<"span">) {
  return (
    <span className={cx("text-gradient-accent", className)} {...props}>
      {children}
    </span>
  );
}
