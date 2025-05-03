"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "@/app/page.module.css"

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface MainSliderProps {
  slides: Slide[];
}

export default function MainSlider({ slides }: MainSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 컴포넌트가 마운트되면 로드됨 상태로 설정
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  // 로딩 중 표시
  if (!isLoaded) {
    return <div className="h-[80vh] bg-gray-100 animate-pulse" />
  }

  return (
    <section className={styles.carouselContainer + ' ' + styles.mainSliderArita}>
      {/* 슬라이더 */}
      <div className="relative h-full w-full" ref={sliderRef}>
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`${styles.carouselSlide} ${index === currentSlide ? styles.carouselSlideActive : ""}`}
          >
            <div className={styles.carouselImageContainer}>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: "cover" }}
                priority={slide.id === 1}
              />
              <div className="absolute inset-0 bg-black bg-opacity-30" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl">{slide.description}</p>
              <Link
                href={slide.buttonLink}
                className="inline-flex items-center justify-center py-3 px-6 rounded-md font-medium text-white bg-[#2dd4bf] hover:bg-[#28c0ae] transition-colors"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 네비게이션 버튼 */}
      <button
        onClick={goToPrevSlide}
        className={`${styles.carouselNavButton} ${styles.carouselNavPrev}`}
        aria-label="이전 슬라이드"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={goToNextSlide}
        className={`${styles.carouselNavButton} ${styles.carouselNavNext}`}
        aria-label="다음 슬라이드"
      >
        <ChevronRight size={24} />
      </button>

      {/* 인디케이터 */}
      <div className={styles.carouselIndicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.carouselIndicator} ${index === currentSlide ? styles.carouselIndicatorActive : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </section>
  )
} 