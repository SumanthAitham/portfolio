import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ParticleBackground from "./particle-background";

const Font_weights = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 },
};

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={className}
            style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ));
};

const setupTextHover = (container, type) => {
    if (!container) return;

    const letters = container.querySelectorAll("span");
    const { min, max, default: base } = Font_weights[type];

    const animateLetter = (el, weight, duration = 0.25) => {
        gsap.to(el, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `'wght' ${weight}`,
        });
    };

    const handleMouseMove = (e) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = e.clientX - left;

        letters.forEach((el) => {
            const { left: l, width: w } = el.getBoundingClientRect();
            const center = l - left + w / 2;
            const distance = Math.abs(mouseX - center);
            const intensity = Math.exp(-(distance ** 2) / 20000);

            animateLetter(el, min + (max - min) * intensity);
        });
    };
    const handleMouseLeave = () =>
        letters.forEach((letter) => animateLetter(letter, base, 0.3))

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    };
};

function Welcome() {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const cleanupTitle = setupTextHover(titleRef.current, "title");
        const cleanupSubtitle = setupTextHover(subtitleRef.current, "subtitle");

        return () => {
            cleanupTitle();
            cleanupSubtitle();
        };
    });

    return (
        <section id="welcome">
            <p ref={subtitleRef}>
                {renderText("Hey, I'm Sumanth! Welcome to my", "text-3xl font-georama", 100)}
            </p>

            <h1 ref={titleRef} className="mt-7">
                {renderText("portfolio", "text-9xl italic font-georama", 400)}
            </h1>
            {/* <ParticleBackground className="absolute" /> */}
            <div className="small-screen">
                <p>This site is only designed for desktop and tablet screens.</p>
            </div>
        </section>
    );
}

export default Welcome;
