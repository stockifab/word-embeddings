import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ArrowRight } from "lucide-react";
import { SimilarWords } from "./slides/SimilarWords/SimilarWords";
import { Starter } from "./slides/Starter";
import { NoDefinitions } from "./slides/NoDefinitions";
import { WordArithmetic } from "./slides/WordArithmetic";
import { Closing } from "./slides/Closing";
import { Outro } from "./slides/Outro";

gsap.registerPlugin([useGSAP, SplitText]);

const slides = [
  Starter,
  Starter,
  SimilarWords,
  NoDefinitions,
  NoDefinitions,
  WordArithmetic,
  Closing,
  Outro,
];

export function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const button = buttonRef.current;
      if (!button) return;

      const scaleTo = (scale: number) =>
        gsap.to(button, {
          scale,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });

      button.addEventListener("mouseenter", () => scaleTo(1.1));
      button.addEventListener("mouseleave", () => scaleTo(1));
      button.addEventListener("mousedown", () => scaleTo(0.95));
      button.addEventListener("mouseup", () => scaleTo(1.1));
    },
    { scope: buttonRef },
  );

  const CurrentSlide = slides[slideIndex];
  const canGoBack = slideIndex > 0;
  const canContinue = slideIndex < slides.length - 1;

  return (
    <>
      <CurrentSlide slideIndex={slideIndex} />
      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 sm:bottom-10 sm:gap-5 md:bottom-16">
        {canGoBack && (
          <button
            className="cursor-pointer px-5 py-3 text-base text-gray-500 transition-colors hover:underline sm:px-8 sm:text-lg"
            onClick={() => setSlideIndex((curr) => curr - 1)}
          >
            Go back
          </button>
        )}
        {canContinue && (
          <button
            ref={buttonRef}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-accent-600 active:bg-accent-700 sm:px-8 sm:text-lg"
            onClick={() => setSlideIndex((curr) => curr + 1)}
          >
            Continue
            <ArrowRight className="size-5" />
          </button>
        )}
      </div>
    </>
  );
}
