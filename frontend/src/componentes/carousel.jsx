"use client";

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "../css/carousel.css";

const CarouselContext = createContext(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("useCarousel must be used within <Carousel />");
  return context;
}

export function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = useCallback(() => api?.scrollNext(), [api]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => api.off("select", onSelect);
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        opts,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={`carousel-container ${className || ""}`}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ className, ...props }) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div ref={carouselRef} className="carousel-viewport" data-slot="carousel-content">
      <div
        className={`carousel-track ${orientation === "horizontal" ? "horizontal" : "vertical"} ${className || ""}`}
        {...props}
      />
    </div>
  );
}

export function CarouselItem({ className, ...props }) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={`carousel-item ${orientation === "horizontal" ? "horizontal-item" : "vertical-item"} ${className || ""}`}
      {...props}
    />
  );
}

export function CarouselPrevious({ className, ...props }) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      data-slot="carousel-previous"
      className={`carousel-btn prev ${orientation} ${className || ""}`}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </button>
  );
}

export function CarouselNext({ className, ...props }) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      data-slot="carousel-next"
      className={`carousel-btn next ${orientation} ${className || ""}`}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </button>
  );
}
