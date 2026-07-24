import { useRef, type ComponentProps } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Slide({
  className = "",
  children,
  interactive,
  ...props
}: { interactive?: boolean } & ComponentProps<"div">) {
  const bgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!bgRef.current) return;

    gsap.from(".sphere", {
      opacity: 0,
      duration: 2,
    });
  });

  return (
    <div className={`h-screen w-screen ${className}`} {...props}>
      {interactive && (
        <div ref={bgRef} className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="sphere absolute inset-0"
            style={{
              opacity: 0.2,
              background:
                "radial-gradient(55% 55% at 0% 0%, var(--color-accent), transparent)",
            }}
          />
          <div
            className="sphere absolute inset-0"
            style={{
              opacity: 0.2,
              background:
                "radial-gradient(55% 55% at 100% 100%, var(--color-accent), transparent)",
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
}
