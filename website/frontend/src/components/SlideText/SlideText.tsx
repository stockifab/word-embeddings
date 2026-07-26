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
        "text-center font-bold text-black leading-tight sm:leading-snug",
        "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
        "mx-auto max-w-[min(90vw,60rem)] text-balance",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
