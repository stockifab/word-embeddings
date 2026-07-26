import { useGSAP } from "@gsap/react";
import { keepPreviousData } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { $api } from "../../api/api";
import { Slide } from "../../components/Slide";
import { SlideText } from "../../components/SlideText";
import { SlideTextHighlight } from "../../components/SlideTextHighlight";
import { cx } from "../../lib/cx";
import type { SlideProps } from "../slideProps";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { Pencil } from "lucide-react";

const tryItOutWords = ["Plane", "Cat", "PostgreSQL"];

export function SimilarWords(_: SlideProps) {
  const title = useRef<HTMLParagraphElement | null>(null);
  const subTitle = useRef<HTMLParagraphElement | null>(null);
  const titleContinaer = useRef<HTMLDivElement | null>(null);
  const interactiveContainer = useRef<HTMLDivElement | null>(null);
  const wordsContainer = useRef<HTMLDivElement | null>(null);
  const wordInput = useRef<HTMLInputElement | null>(null);

  const [word, setWord] = useState<string>("");

  const { data: closeWords, isError } = $api.useQuery(
    "post",
    "/closest-words",
    { body: { token: word.trim().toLowerCase() } },
    {
      enabled: !!word.trim(),
      retry: false,
      placeholderData: keepPreviousData,
    },
  );

  useGSAP(() => {
    if (
      !title.current ||
      !subTitle.current ||
      !titleContinaer ||
      !interactiveContainer
    )
      return;

    const titleSplit = SplitText.create(title.current, { type: "words" });
    const subTitleSplit = SplitText.create(subTitle.current, { type: "words" });

    gsap
      .timeline()
      .from(titleSplit.words, {
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
        interactiveContainer.current,
        {
          opacity: 0,
          duration: 0.7,
        },
        "<0.1",
      );

    gsap.from(titleContinaer.current, {
      y: "50vh",
      duration: 0.8,
      ease: "back.out(1.4)",
    });

    return () => titleSplit.revert();
  }, []);

  useGSAP(
    () => {
      if (!closeWords) return;
      gsap.fromTo(
        ".word-label",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.03,
          duration: 0.5,
          ease: "back.out(1.7)",
          overwrite: true,
        },
      );
    },
    { dependencies: [closeWords], scope: wordsContainer },
  );

  useGSAP(
    () => {
      gsap.fromTo(
        ".try-it-example",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.3,
        },
      );
    },
    { scope: interactiveContainer },
  );

  return (
    <Slide
      className="flex flex-col items-center gap-8 px-4 py-16 pb-28 sm:py-20"
      interactive
    >
      <div ref={titleContinaer} className="w-full max-w-4xl">
        <SlideText ref={title}>
          Similar words have similar embeddings
        </SlideText>
        <p
          ref={subTitle}
          className="mx-auto mt-4 max-w-2xl text-center text-base text-gray-500 sm:text-xl md:text-2xl"
        >
          Since embeddings are just numbers, we can{" "}
          <SlideTextHighlight>measure how related</SlideTextHighlight> two words
          are, by calculating the angle between the embedding vectors.
        </p>
      </div>

      <div
        className="flex w-full max-w-3xl flex-col items-center rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-2xl sm:p-10 lg:p-15"
        ref={interactiveContainer}
      >
        <input
          ref={wordInput}
          className={cx(
            "h-14 w-full max-w-xl rounded-full border-2 border-gray-200 px-6 text-lg outline-0 shadow-lg transition-all focus:border-accent focus:shadow-accent-200 sm:h-16 sm:px-8 sm:text-2xl md:h-20 md:text-3xl",
            isError && "text-red-600 underline",
          )}
          placeholder="Enter a word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <p>Try it:</p>
          {tryItOutWords.map((w) => (
            <button
              key={w}
              className="try-it-example bg-gray-100 border-2 border-gray-200 rounded-lg min-w-20 py-2 px-5 font-semibold cursor-pointer transition-colors hover:bg-accent-100 hover:border-accent-200 active:bg-accent-200 active:border-accent-300"
              onClick={() => setWord(w)}
            >
              {w}
            </button>
          ))}
          <button
            className="try-it-example bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg min-w-20 py-2 px-5 font-semibold cursor-pointer transition-colors hover:bg-accent-100 hover:border-accent-200 active:bg-accent-200 active:border-accent-300 inline-flex items-center gap-2"
            onClick={() => wordInput.current?.focus()}
          >
            <Pencil size={24} /> Try your own
          </button>
        </div>

        <div
          className="mt-10 flex w-full max-w-2xl flex-col gap-1"
          ref={wordsContainer}
        >
          {(() => {
            if (!closeWords) return;
            const sorted = (closeWords as [string, number][])?.toSorted(
              (a, b) => b[1] - a[1],
            );
            const maxProb = sorted?.[0]?.[1] ?? 0;
            const minProb = sorted?.[sorted.length - 1]?.[1] ?? 0;
            return (
              <>
                <div className="flex w-full items-center gap-3 sm:gap-5">
                  <SlideTextHighlight className="mb-4 ml-auto text-base sm:text-xl">
                    Similarity
                  </SlideTextHighlight>
                </div>

                {sorted?.map(([w, prob], i) => (
                  <div
                    className="flex w-full items-center gap-3 sm:gap-5"
                    key={i}
                  >
                    <p
                      className={cx(
                        "word-label text-base sm:text-xl",
                        isError && "text-gray-200",
                        "min-w-24 shrink-0 truncate sm:min-w-40",
                      )}
                    >
                      {w}
                    </p>
                    <div className="flex-1">
                      <div
                        className="bar h-3 rounded-full bg-accent transition-all sm:h-4"
                        style={{
                          width: `${((prob - minProb) / (maxProb - minProb)) * 90 + 10}%`,
                          filter: `saturate(${((prob - minProb) / (maxProb - minProb)) * 0.9 + 0.1})`,
                        }}
                      />
                    </div>
                    <p className="shrink-0 text-sm sm:text-base">
                      {(Math.round((prob as number) * 1000) / 10).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
        <p className="mt-10 text-center text-sm text-gray-400 sm:text-base">
          The higher the similarity, the more the word is related to the word
          you entered
        </p>
      </div>
    </Slide>
  );
}
