import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-creative";
import { EffectCreative, Autoplay } from "swiper";
import Hero from './Hero';
import Hero2 from './Hero2';

const HeroContainer = () => {
    return (
        <section className=''>
            <Swiper
                grabCursor={true}
                effect={"creative"}
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: ["-120%", 0, -500],
                    },
                    next: {
                        shadow: true,
                        translate: ["120%", 0, -500],
                    },
                }}
                modules={[EffectCreative, Autoplay]}
                className="mySwiper5"
                loop={true}
                autoplay={{
                    delay: 3000, // Time in milliseconds between slides (3 seconds)
                    disableOnInteraction: false, // Allow autoplay to continue even if user interacts with the Swiper
                }}
                speed={800} // Transition speed in milliseconds (adjust as needed)
                // Add easing function if needed
                // To use a custom easing function, you may need to apply custom CSS or use Swiper's transition configurations
            >
                <SwiperSlide>
                    <Hero />
                </SwiperSlide>
                <SwiperSlide>
                    <Hero2 />
                </SwiperSlide>
            </Swiper>
        </section>
    );
};

export default HeroContainer;
