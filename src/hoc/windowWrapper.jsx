import useWindowStore from "../store/window";
import { useRef } from "react";
import { useLayoutEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";


const WindowWrapper = (Component, windowKey) => {
    const Wrapped = (props) => {
        const { focusWindow, windows } = useWindowStore()
        const { isOpen, zIndex, isMinimized, isMaximized } = windows[windowKey]
        const ref = useRef(null)

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            if (isOpen && !isMinimized) {
                el.style.display = "block";
                gsap.fromTo(
                    el,
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.2)" }
                )
            } else if (isMinimized) {
                gsap.to(el, {
                    scale: 0,
                    opacity: 0,
                    y: 200,
                    duration: 0.3,
                    onComplete: () => { el.style.display = 'none' }
                })
            } else {
                gsap.to(el, {
                    scale: 0.8,
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => { el.style.display = 'none' }
                })
            }
        }, [isOpen, isMinimized])

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            if (isMaximized) {
                gsap.to(el, {
                    width: "100vw",
                    height: "100vh",
                    top: 0,
                    left: 0,
                    x: 0,
                    y: 0,
                    borderRadius: 0,
                    duration: 0.3
                })
            } else {
                gsap.to(el, {
                    width: "auto",
                    height: "auto",
                    borderRadius: "0.5rem",
                    duration: 0.3,
                    clearProps: "width,height,top,left,borderRadius"
                })
            }

        }, [isMaximized])

        useGSAP(() => {
            const el = ref.current;
            if (!el) return;

            const [instance] = Draggable.create(el, {
                onPress: () => focusWindow(windowKey),
                disabled: isMaximized
            })
            return () => instance.kill()

        }, [isMaximized])

        return (<section
            id={windowKey}
            ref={ref}
            style={{ zIndex, display: 'none' }} // Default hidden, GSAP will show it
            className="absolute shadow-2xl rounded-lg"
        >
            <Component {...props} />
        </section>
        )
    }

    Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`
    return Wrapped;
}
export default WindowWrapper;