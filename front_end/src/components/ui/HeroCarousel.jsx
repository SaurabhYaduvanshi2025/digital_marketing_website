import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "../../lib/utils";

const ITEMS_COUNT = 5;

export default function HeroCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Main full-width slider
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true, duration: 40 }, [
    Autoplay({ delay: 4500, stopOnInteraction: false }),
  ]);

  // Bottom thumbnail track
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi.scrollTo(index);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;

    const syncState = () => {
      onSelect();
    };

    mainApi.on("select", syncState);
    mainApi.on("reInit", syncState);

    // Asynchronous queue microtask to avoid cascading render warning
    queueMicrotask(syncState);

    return () => {
      mainApi.off("select", syncState);
      mainApi.off("reInit", syncState);
    };
  }, [mainApi, onSelect]);

  return (
    <div className="relative w-full h-[100svh] min-h-[36rem] overflow-hidden bg-black">
      {/* 1. Main Full-Screen Slides */}
      <div className="overflow-hidden w-full h-full" ref={mainRef}>
        <div className="flex h-full">
          {Array.from({ length: ITEMS_COUNT }).map((_, index) => (
            <div className="min-w-0 flex-[0_0_100%] h-full relative" key={index}>
              <img
                alt={`Slide ${index + 1}`}
                className="h-full w-full object-cover object-center"
                src={`https://images.cnippet.dev/image/upload/v1770400411/h${index + 2}.jpg`}
              />
              {/* Subtle vignette layer for text readability */}
              <div className="absolute inset-0 bg-black/35" />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Bottom Glassmorphic Overlay Layer */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent pt-24 pb-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-6 pb-6">
          {/* Bottom Thumbnails */}
          <div className="relative w-full max-w-sm md:max-w-md">
            <div className="overflow-hidden" ref={thumbRef}>
              <div className="flex gap-3">
                {Array.from({ length: ITEMS_COUNT }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => onThumbClick(index)}
                    className="basis-1/4 sm:basis-1/5 shrink-0 text-left focus:outline-none transition-transform"
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden rounded-lg transition-all duration-300 border-2 shadow-lg",
                        index === selectedIndex
                          ? "h-16 md:h-18 border-indigo-500 opacity-100 scale-105"
                          : "h-14 md:h-16 border-transparent opacity-40 hover:opacity-80"
                      )}
                    >
                      <img
                        alt={`Thumb ${index + 2}`}
                        className="h-full w-full object-cover"
                        src={`https://images.cnippet.dev/image/upload/v1770400411/h${index + 2}.jpg`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Floating Content */}
          {/* <div className="flex max-w-sm flex-col items-end gap-3 text-right">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400 text-lg">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span className="text-zinc-600">★</span>
              </div>
              <span className="font-semibold text-sm text-white">4.8 / 5 Rating</span>
            </div>

            <p className="text-xs md:text-sm text-zinc-300 leading-relaxed">
              Crafting modern enterprise CMS architectures with performance, speed, and refined simplicity.
            </p>

            <a
              href="/services"
              className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
            >
              <span>Explore Architecture</span>
              <ArrowRight size={15} />
            </a>
          </div> */}
        </div>

        {/* Hero Title Stamp */}
        {/* <div className="max-w-7xl mx-auto border-t border-white/10 pt-4">
          <h1 className="text-center font-black text-4xl sm:text-7xl md:text-8xl tracking-widest text-white/90 select-none">
            FLOW + STUDIO
          </h1>
        </div> */}
      </div>
    </div>
  );
}
