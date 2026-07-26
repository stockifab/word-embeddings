import { useGSAP } from "@gsap/react";
import { keepPreviousData } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { $api } from "../../api/api";
import { Slide } from "../../components/Slide";
import { SlideText } from "../../components/SlideText";
import { cx } from "../../lib/cx";
import type { SlideProps } from "../slideProps";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { Pencil } from "lucide-react";

const tryItOutExamples = [
  { word1: "Woman", word2: "Man", word3: "King" },
  { word1: "Dog", word2: "Bark", word3: "Meow" },
  { word1: "Red", word2: "Apple", word3: "Pumpkin" },
];

export function WordArithmetic(_: SlideProps) {
  const title = useRef<HTMLParagraphElement | null>(null);
  const subTitle = useRef<HTMLParagraphElement | null>(null);
  const titleContinaer = useRef<HTMLDivElement | null>(null);
  const interactiveContainer = useRef<HTMLDivElement | null>(null);
  const word1Input = useRef<HTMLInputElement | null>(null);
  const resultWord = useRef<HTMLSpanElement | null>(null);
  const resultScore = useRef<HTMLSpanElement | null>(null);
  const alternativesContainer = useRef<HTMLDivElement | null>(null);

  const [words, setWords] = useState<{
    word1: string;
    word2: string;
    word3: string;
  }>({
    word1: "",
    word2: "",
    word3: "",
  });

  const queryWords = {
    word1: words.word1.toLowerCase().trim(),
    word2: words.word2.toLowerCase().trim(),
    word3: words.word3.toLowerCase().trim(),
  };

  const { data: analogy, isError } = $api.useQuery(
    "post",
    "/analogy",
    {
      body: {
        ...queryWords,
      },
    },
    {
      enabled: Object.values(queryWords).every((v) => Boolean(v)),
      retry: false,
      placeholderData: keepPreviousData,
    },
  );

  const sortedAnalogy = (analogy as [string, number][] | undefined)?.toSorted(
    (a, b) => b[1] - a[1],
  );
  const bestAnalogy = sortedAnalogy?.[0]?.[0];
  const bestScore = sortedAnalogy?.[0]?.[1];
  const alternatives = sortedAnalogy?.slice(1, 6);

  const inputClass = cx(
    "h-14 w-full rounded-full border-2 border-gray-200 px-6 text-lg outline-0 shadow-lg transition-all focus:border-accent focus:shadow-accent-200 sm:h-16 sm:px-8 sm:text-2xl md:h-20 md:text-3xl md:w-auto md:min-w-0 md:flex-1",
    isError && "text-red-600 underline",
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

  useGSAP(() => {
    if (!bestAnalogy || !resultWord.current) return;

    gsap.fromTo(
      resultWord.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
    );

    if (resultScore.current) {
      gsap.fromTo(
        resultScore.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          delay: 0.05,
        },
      );
    }
  }, [bestAnalogy, bestScore]);

  useGSAP(() => {
    if (!alternativesContainer.current) return;
    const items = alternativesContainer.current.querySelectorAll(".alt-item");
    if (items.length === 0) return;

    gsap.fromTo(
      items,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: "back.out(1.7)",
      },
    );
  }, [alternatives?.map(([w]) => w).join(",")]);

  return (
    <Slide
      className="flex flex-col items-center gap-8 px-4 py-16 pb-28 sm:py-20"
      interactive
    >
      <div ref={titleContinaer} className="w-full max-w-4xl">
        <SlideText ref={title}>Word Arithmetic</SlideText>
        <p
          ref={subTitle}
          className="mt-4 text-center text-base text-gray-500 sm:text-xl md:text-2xl"
        >
          See how words relate to each other
        </p>
      </div>

      <div
        className="flex w-full max-w-4xl flex-col items-center justify-center gap-10 rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-2xl sm:gap-14 sm:p-10 lg:p-15"
        ref={interactiveContainer}
      >
        <p className="max-w-2xl text-center text-sm text-gray-400 sm:text-base">
          Word 1 relates to word 2 the same way the answer relates to word 3 —
          e.g. <span className="text-gray-600 font-medium">Woman</span> is to{" "}
          <span className="text-gray-600 font-medium">Man</span> as{" "}
          <span className="text-gray-600 font-medium">Queen</span> is to{" "}
          <span className="text-gray-600 font-medium">King</span>.
        </p>

        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:gap-4 lg:gap-6">
          <input
            ref={word1Input}
            className={inputClass}
            placeholder="Woman"
            value={words.word1}
            onChange={(e) => setWords({ ...words, word1: e.target.value })}
          />
          <p className="text-3xl sm:text-5xl">-</p>
          <input
            className={inputClass}
            placeholder="Man"
            value={words.word2}
            onChange={(e) => setWords({ ...words, word2: e.target.value })}
          />
          <p className="text-3xl sm:text-5xl">+</p>
          <input
            className={inputClass}
            placeholder="King"
            value={words.word3}
            onChange={(e) => setWords({ ...words, word3: e.target.value })}
          />
        </div>

        <div className="-mt-2 flex flex-wrap items-center justify-center gap-3 sm:-mt-6">
          <p>Try it:</p>
          {tryItOutExamples.map((example) => (
            <button
              key={example.word1}
              className="try-it-example bg-gray-100 border-2 border-gray-200 rounded-lg min-w-20 py-2 px-5 font-semibold cursor-pointer transition-colors hover:bg-accent-100 hover:border-accent-200 active:bg-accent-200 active:border-accent-300"
              onClick={() => setWords(example)}
            >
              {example.word1} - {example.word2} + {example.word3}
            </button>
          ))}
          <button
            className="try-it-example bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg min-w-20 py-2 px-5 font-semibold cursor-pointer transition-colors hover:bg-accent-100 hover:border-accent-200 active:bg-accent-200 active:border-accent-300 inline-flex items-center gap-2"
            onClick={() => word1Input.current?.focus()}
          >
            <Pencil size={24} /> Try your own
          </button>
        </div>

        <div className="mt-4 flex w-full flex-col items-center gap-4">
          <div className="flex w-full max-w-md items-center gap-3 sm:gap-4">
            <p className="shrink-0 text-3xl sm:text-5xl">=</p>
            <p
              className={cx(
                "flex h-14 flex-1 items-center justify-between gap-3 rounded-full border-2 border-accent-300 bg-accent-50 pl-6 pr-3 text-lg font-semibold text-accent-950 shadow-lg outline-0 transition-all sm:h-16 sm:pl-8 sm:text-2xl md:h-20 md:text-3xl",
              )}
            >
              <span ref={resultWord} className="inline-block truncate">
                {bestAnalogy}
              </span>
              {bestScore !== undefined && (
                <span
                  ref={resultScore}
                  className="inline-block shrink-0 rounded-full bg-accent-100 px-3 py-1.5 text-sm font-medium text-accent-700"
                >
                  {(Math.round(bestScore * 1000) / 10).toFixed(1)}%
                </span>
              )}
            </p>
          </div>
          {alternatives && alternatives.length > 0 && (
            <div
              ref={alternativesContainer}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              <p className="mr-1 text-xs text-gray-400">also close:</p>
              {alternatives.map(([w, prob]) => (
                <div
                  key={w}
                  className="alt-item rounded-full bg-accent-50/60 px-3 py-1 flex items-center gap-1.5"
                >
                  <span className="text-sm text-accent-800">{w}</span>
                  <span className="text-xs text-accent-500">
                    {(Math.round(prob * 1000) / 10).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="max-w-xl text-center text-sm text-gray-400 sm:text-lg">
          Other relationships to try: plurals (Cat → Cats), verb tense (Walk →
          Walked), comparatives (Good → Better), or country ↔ capital pairs
          (France → Paris).
        </p>
      </div>
    </Slide>
  );
}
