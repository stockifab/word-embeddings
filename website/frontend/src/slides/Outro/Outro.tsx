import { useRef, type ComponentProps } from "react";
import { Slide } from "../../components/Slide";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import type { SlideProps } from "../slideProps";
import { SlideText } from "../../components/SlideText";
import { SlideTextHighlight } from "../../components/SlideTextHighlight";

function GithubIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12c0-6.27-5.23-11.5-11.5-11.5Z" />
    </svg>
  );
}

export function Outro({ slideIndex }: SlideProps) {
  const textContainer = useRef<HTMLParagraphElement | null>(null);
  const subTitle = useRef<HTMLParagraphElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  useGSAP(() => {
    if (!textContainer.current || !subTitle.current || !linkRef.current) return;

    const split = SplitText.create(textContainer.current, { type: "words" });
    const subTitleSplit = SplitText.create(subTitle.current, {
      type: "words",
    });

    gsap
      .timeline()
      .from(split.words, {
        y: 50,
        opacity: 0,
        stagger: 0.03,
        duration: 0.6,
        ease: "back.out(1.7)",
      })
      .from(
        subTitleSplit.words,
        {
          y: 50,
          opacity: 0,
          stagger: 0.03,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "<0.2",
      )
      .from(
        linkRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "<0.2",
      );

    return () => {
      split.revert();
      subTitleSplit.revert();
    };
  }, [slideIndex]);

  useGSAP(
    () => {
      const link = linkRef.current;
      if (!link) return;

      const scaleTo = (scale: number) =>
        gsap.to(link, {
          scale,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });

      link.addEventListener("mouseenter", () => scaleTo(1.05));
      link.addEventListener("mouseleave", () => scaleTo(1));
      link.addEventListener("mousedown", () => scaleTo(0.95));
      link.addEventListener("mouseup", () => scaleTo(1.05));
    },
    { scope: linkRef },
  );

  return (
    <Slide className="flex flex-col items-center justify-center gap-10">
      <SlideText key={slideIndex} ref={textContainer}>
        Curious how it all <br />
        works under the hood?
      </SlideText>
      <p
        key={`${slideIndex}-subtitle`}
        ref={subTitle}
        className="text-center text-2xl text-gray-500"
      >
        This entire project - from{" "}
        <SlideTextHighlight>training the embeddings</SlideTextHighlight> to{" "}
        <SlideTextHighlight>this website</SlideTextHighlight> - is open source.
      </p>
      <a
        ref={linkRef}
        href="https://github.com/stockifab/word-embeddings"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-accent px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-accent-600 active:bg-accent-700"
      >
        <GithubIcon className="h-6 w-6" />
        GitHub
      </a>
    </Slide>
  );
}
