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
    No one taught it what words are similar. It just<br/>
    read <SlideTextHighlight>billions of words</SlideTextHighlight> and noticed the patterns.
  </>,
  <>
    Now: Since meaning is numbers,<br />
    you can do <SlideTextHighlight>math with meaning</SlideTextHighlight>.
  </>,
];

export function NoDefinitions({ slideIndex }: SlideProps) {
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
        {text[slideIndex - 3]}
      </SlideText>
    </Slide>
  );
}
