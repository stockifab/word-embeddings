import { useRef } from "react";
import { Slide } from "../../components/Slide";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import type { SlideProps } from "../slideProps";
import { SlideTextHighlight } from "../../components/SlideTextHighlight";
import { SlideText } from "../../components/SlideText";

const text = [
  <>
    Here&rsquo;s what a word actually is to AI:
    <br />a <SlideTextHighlight>looong list of numbers</SlideTextHighlight>.
  </>,
  <>
    This list of numbers, encodes the
    <br />
    <SlideTextHighlight>meaning</SlideTextHighlight> of a word and <br /> is
    called an <SlideTextHighlight>embedding</SlideTextHighlight>.
  </>,
];

export function Starter({ slideIndex }: SlideProps) {
  const textContainer = useRef<HTMLParagraphElement | null>(null);

  useGSAP(() => {
    if (!textContainer.current) return;

    const split = SplitText.create(textContainer.current, { type: "words" });

    gsap.from(split.words, {
      y: 50,
      opacity: 0,
      stagger: 0.03,
      duration: 0.6,
      ease: "back.out(1.7)",
    });

    return () => split.revert();
  }, [slideIndex]);

  return (
    <Slide className="flex flex-col items-center justify-center gap-10">
      <SlideText key={slideIndex} ref={textContainer}>
        {text[slideIndex]}
      </SlideText>
    </Slide>
  );
}
