"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import useSound from 'use-sound'
import {
    NextButton,
    PrevButton,
    usePrevNextButtons,
    DotButton,
    useDotButton 
} from './mapSliderNextPrev'
import './css/Slidermaps.css'

const TWEEN_FACTOR_BASE = 0.52

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max)

const MapSlider = (props) => {
  const { options, map, setMap, SLIDEIMAPS } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const tweenFactor = useRef(0)
  const tweenNodes = useRef([])

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__slide__number')
    })
  }, [])

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenScale = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = eventName === 'scroll'

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
        const scale = numberWithinRange(tweenValue, 0, 1).toString()
        const tweenNode = tweenNodes.current[slideIndex]
        tweenNode.style.transform = `scale(${scale})`
        tweenNode.style.opacity = scale.toString()
        tweenNode.style.border = `solid 3px rgba(0, 255, 255, ${Math.round(scale)})`
        tweenNode.style.boxShadow = `0 0 10px rgba(0, 255, 255, ${Math.round(scale)})`
        tweenNode.style.overflow  = 'hidden'
        setMap(SLIDEIMAPS[emblaApi.selectedScrollSnap()].mapName)
      })
    })
  }, [])

  const getIdByMapName = (mapName) => {
    const index = SLIDEIMAPS.findIndex((slide) => slide.mapName === mapName);
    return index !== -1 ? SLIDEIMAPS[index].id : null;
  };


  const [play] = useSound('/soundEffect/button.mp3', { volume: 0.5 })
  useEffect(() => {
    play()
  }, [map])

  useEffect(() => {
    if (!emblaApi) return

    const mapIndex = getIdByMapName(map);
    setTweenNodes(emblaApi)
    setTweenFactor(emblaApi)
    tweenScale(emblaApi)
    emblaApi
    .on('reInit', setTweenNodes)
    .on('reInit', setTweenFactor)
    .on('reInit', tweenScale)
    .on('scroll', tweenScale)
    .on('slideFocus', tweenScale)
    emblaApi.scrollTo(mapIndex, 0)
  }, [emblaApi, tweenScale])
  
    return (
      <div className="emblaMaps">
        <div className="embla__viewport_maps" ref={emblaRef}>
          <div className="embla__container">
            {SLIDEIMAPS.map((slide, index) => (
              <div className="embla__slide" key={index}>
                <div className="embla__slide__number">
                  <span className=' flex w-full justify-center items-center text-tex-grey sm:text-2xl text-xs '>{slide.mapName}</span>
                  <img src={slide.mapPath} alt="map" className="rounded-md w-full h-full object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <div className="embla__controls">
          <div className="embla__buttons">
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <div className="embla__dots">
              {scrollSnaps.map((snap, index) => (
                <DotButton
                  key={index}
                  onClick={() => onDotButtonClick(index)}
                  className={'embla__dot'.concat(
                    index === selectedIndex ? ' embla__dot--selected' : ''
                  )}
                />
              ))}
            </div>
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>
        </div>
      </div>
    )
}

export default MapSlider;