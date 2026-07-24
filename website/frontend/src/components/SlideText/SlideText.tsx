import type { ComponentProps } from "react";
import { cx } from "../../lib/cx";

export function SlideText({
  className,
  children,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      className={cx(
        "text-center text-7xl font-bold text-black leading-snug",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
