import React, { useCallback, useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Fade from 'embla-carousel-fade'
import {
    NextButton,
    PrevButton,
    usePrevNextButtons,
    DotButton,
    useDotButton 
} from './mapSliderNextPrev'
import styles from './css/Slidemods.module.css'

const TWEEN_FACTOR_BASE = 0.52


const SlierMode = (props) => {
  const { Multiplayer, SetMultiplayer, SLIDEMODES, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Fade()])
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
          
        })
        SetMultiplayer(emblaApi.selectedScrollSnap());
      })
    }, [])

    useEffect(() => {
      if (!emblaApi) return
      setTweenNodes(emblaApi)
      setTweenFactor(emblaApi)
      tweenScale(emblaApi)
      emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('scroll', tweenScale)
      .on('slideFocus', tweenScale)
      emblaApi.scrollTo(Multiplayer);

    }
    , [emblaApi, Multiplayer]);

  return (
    <div className={styles.embla}>
      <div className={styles.embla__viewport} ref={emblaRef}>
        <div className={styles.embla__container}>
          {SLIDEMODES.map((slide, index) => (
            <div className={styles.embla__slide} key={index}>
              <span className='sm:m-2 text-tex-grey sm:text-2xl text-xs w-full  flex justify-center items-center'>{slide.mapName}</span>
              <img
                className={styles.embla__slide__img}
                src={`${slide.mapPath}`}
                alt="Your alt text"
              />
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

export default SlierMode