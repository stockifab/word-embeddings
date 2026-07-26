import { useRef } from "react";
import { Slide } from "../../components/Slide";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import type { SlideProps } from "../slideProps";
import { SlideText } from "../../components/SlideText";
import { SlideTextHighlight } from "../../components/SlideTextHighlight";

export function Closing({ slideIndex }: SlideProps) {
  const textContainer = useRef<HTMLParagraphElement | null>(null);
  const subTitle = useRef<HTMLParagraphElement | null>(null);

  useGSAP(() => {
    if (!textContainer.current || !subTitle.current) return;

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
      );

    return () => {
      split.revert();
      subTitleSplit.revert();
    };
  }, [slideIndex]);

  return (
    <Slide className="flex flex-col items-center justify-center gap-6 px-6 pb-28 sm:gap-10">
      <SlideText key={slideIndex} ref={textContainer}>
        These are only some of the things <br/>you can do with word embeddings.
      </SlideText>
      <p
        key={`${slideIndex}-subtitle`}
        ref={subTitle}
        className="mx-auto max-w-2xl text-center text-lg text-gray-500 sm:text-xl md:text-2xl"
      >
        They also power <SlideTextHighlight>search engines</SlideTextHighlight>,{" "}
        <SlideTextHighlight>recommendation systems</SlideTextHighlight>,{" "}
        <SlideTextHighlight>machine translation</SlideTextHighlight>, and{" "}
        <SlideTextHighlight>spam detection</SlideTextHighlight>.
      </p>
    </Slide>
  );
}
