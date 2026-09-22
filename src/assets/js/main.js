document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const hero = document.querySelector(".hero");
    const nav = document.querySelector("nav");
    const header = document.querySelector(".header");
    const beaconContainer = document.querySelector(".beacon-container");
    const video = document.querySelector(".beacon-video");
    const signal = document.querySelector(".signal");
    const depth = document.querySelector(".depth");
    const scrollIndicator = document.querySelector(".scroll-indicator");
    const oceanGlow = document.querySelector(".ocean-glow");

    if (!hero || !video || !beaconContainer) {
        console.error("Required elements not found");
        return;
    }

    /* --------------------------------
       VIDEO — PLAY NATURALLY
    -------------------------------- */

    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    const startVideo = () => {
        video.play().catch(() => {
            console.log("Autoplay waiting for browser permission");
        });
    };

    if (video.readyState >= 2) {
        startVideo();
    } else {
        video.addEventListener("loadeddata", startVideo, {
            once: true,
        });
    }

    video.addEventListener("error", () => {
        console.error("VIDEO ERROR:", video.error);
    });

    /* --------------------------------
       INITIAL STATE
    -------------------------------- */

    gsap.set(beaconContainer, {
        xPercent: -50,
        yPercent: -50,
        z: 900,
        scale: 0.55,
        rotationX: 8,
        rotationY: -5,
        opacity: 0,
        transformOrigin: "50% 50%",
    });

    gsap.set(header, {
        y: 80,
        opacity: 0,
    });

    gsap.set(signal, {
        opacity: 0,
    });

    gsap.set(nav, {
        opacity: 0,
    });

    gsap.set(scrollIndicator, {
        opacity: 0,
    });

    /* --------------------------------
       INTRO
    -------------------------------- */

    const intro = gsap.timeline({
        defaults: {
            ease: "power3.out",
        },
    });

    intro
        .to(nav, {
            opacity: 1,
            duration: 1.5,
        })
        .to(
            header,
            {
                y: 0,
                opacity: 1,
                duration: 1.8,
            },
            "-=1",
        )
        .to(
            scrollIndicator,
            {
                opacity: 1,
                duration: 1.2,
            },
            "-=0.8",
        )
        .to(
            beaconContainer,
            {
                opacity: 0.2,
                duration: 2,
                ease: "power2.out",
            },
            "-=1.2",
        );

    /* --------------------------------
       OCEAN ATMOSPHERE
    -------------------------------- */

    gsap.to(oceanGlow, {
        scale: 1.15,
        opacity: 0.7,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });

    /* --------------------------------
       MAIN SCROLL
    -------------------------------- */

    ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: () => `+=${window.innerHeight * 6}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,

        onUpdate: (self) => {
            const progress = self.progress;

            /* ---------------------------
               NAV
            --------------------------- */

            const navProgress = gsap.utils.clamp(0, 1, progress / 0.08);

            gsap.set(nav, {
                opacity: 1 - navProgress,
            });

            /* ---------------------------
               HEADER
            --------------------------- */

            if (progress < 0.3) {
                const p = progress / 0.3;
                const eased = gsap.parseEase("power2.inOut")(p);

                gsap.set(header, {
                    y: -eased * 260,
                    opacity: 1 - eased,
                });
            } else {
                gsap.set(header, {
                    opacity: 0,
                });
            }

            /* ---------------------------
               BEACON DESCENT
            --------------------------- */

            if (progress < 0.08) {
                gsap.set(beaconContainer, {
                    xPercent: -50,
                    yPercent: -50,
                    z: 900,
                    scale: 0.55,
                    rotationX: 8,
                    rotationY: -5,
                    opacity: 0.05,
                });
            } else if (progress < 0.7) {
                const p = gsap.utils.clamp(0, 1, (progress - 0.08) / 0.62);

                const eased = gsap.parseEase("power3.out")(p);

                gsap.set(beaconContainer, {
                    xPercent: -50,
                    yPercent: -50,

                    z: 900 - eased * 900,

                    scale: 0.55 + eased * 0.45,

                    rotationX: 8 - eased * 8,

                    rotationY: -5 + eased * 5,

                    opacity: 0.05 + eased * 0.95,
                });
            } else {
                gsap.set(beaconContainer, {
                    xPercent: -50,
                    yPercent: -50,
                    z: 0,
                    scale: 1,
                    rotationX: 0,
                    rotationY: 0,
                    opacity: 1,
                });
            }

            /* ---------------------------
               SIGNAL
            --------------------------- */

            const signalProgress = gsap.utils.clamp(
                0,
                1,
                (progress - 0.48) / 0.18,
            );

            gsap.set(signal, {
                opacity: signalProgress,
            });

            /* ---------------------------
               DEPTH
            --------------------------- */

            const depthValue = Math.round(progress * 3800);

            const depthStrong = depth.querySelector("strong");

            if (depthStrong) {
                depthStrong.textContent = `— ${String(depthValue).padStart(5, "0")} M`;
            }

            /* ---------------------------
               SCROLL INDICATOR
            --------------------------- */

            gsap.set(scrollIndicator, {
                opacity: 1 - gsap.utils.clamp(0, 1, progress / 0.1),
            });
        },
    });

    /* --------------------------------
       SIGNAL PULSE
    -------------------------------- */

    gsap.to(".signal-dot", {
        scale: 1.8,
        opacity: 0.45,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
    });

    /* --------------------------------
       RESIZE
    -------------------------------- */

    window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
    });
});
