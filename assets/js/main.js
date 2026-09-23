document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    /* --------------------------------
       LENIS
    -------------------------------- */

    const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    /* --------------------------------
       ELEMENTS
    -------------------------------- */

    const hero = document.querySelector(".hero");
    const nav = document.querySelector("nav");
    const header = document.querySelector(".header");
    const beaconContainer = document.querySelector(".beacon-container");
    const video = document.querySelector(".beacon-video");
    const signal = document.querySelector(".signal");
    const depth = document.querySelector(".depth");
    const scrollIndicator = document.querySelector(".scroll-indicator");
    const oceanGlow = document.querySelector(".ocean-glow");

    const missionStatus = document.querySelector(".mission-status");
    const telemetry = document.querySelector(".telemetry");
    const sonarScale = document.querySelector(".sonar-scale");
    const sonarLine = document.querySelector(".sonar-line");
    const beaconReadout = document.querySelector(".beacon-readout");
    const floatingCoordinates = document.querySelector(".floating-coordinates");

    /* NEW DIVE LOGO */
    const diveLogo = document.querySelector(".dive-logo");
    const diveLogoMark = document.querySelector(".dive-logo-mark");
    const diveLogoText = document.querySelector(".dive-logo-text");

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
        y: 0,
    });

    /* --------------------------------
       DESCENT UI
    -------------------------------- */

    gsap.set(missionStatus, {
        opacity: 0,
        x: -20,
    });

    gsap.set(telemetry, {
        opacity: 0,
        x: 20,
    });

    gsap.set(sonarScale, {
        opacity: 0,
    });

    gsap.set(sonarLine, {
        opacity: 0,
    });

    gsap.set(beaconReadout, {
        opacity: 0,
        x: 20,
    });

    gsap.set(floatingCoordinates, {
        opacity: 0,
        xPercent: -50,
        y: 10,
    });

    gsap.set(scrollIndicator, {
        opacity: 0,
    });

    /* --------------------------------
       DIVE LOGO INITIAL STATE
    -------------------------------- */

    if (diveLogo) {
        gsap.set(diveLogo, {
            autoAlpha: 0,
            y: -35,
            scale: 0.92,
        });
    }

    if (diveLogoText) {
        gsap.set(diveLogoText, {
            "--line-width": "0%",
        });
    }

    if (diveLogoMark) {
        gsap.set(diveLogoMark, {
            scale: 0.7,
            rotation: -90,
            opacity: 0,
        });
    }

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
            duration: 1.4,
        })

        .to(
            header,
            {
                y: 0,
                opacity: 1,
                duration: 1.8,
            },
            "-=0.8",
        )

        .to(
            scrollIndicator,
            {
                opacity: 1,
                duration: 1,
            },
            "-=0.8",
        )

        .to(
            beaconContainer,
            {
                opacity: 0.18,
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
       DIVE LOGO — CONTINUOUS MOTION
    -------------------------------- */

    if (diveLogoMark) {
        gsap.to(diveLogoMark, {
            rotation: 360,
            duration: 10,
            repeat: -1,
            ease: "none",
        });
    }

    /* --------------------------------
       DIVE LOGO — PULSE DOTS
    -------------------------------- */

    gsap.to(".dive-logo-mark span", {
        scale: 1.7,
        opacity: 0.35,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        stagger: 0.22,
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

            /* ==================================================
               TOP NAV → DIVE LOGO
            ================================================== */

            /*
             * Original navigation disappears very quickly.
             */
            const navProgress = gsap.utils.clamp(0, 1, progress / 0.075);

            gsap.set(nav, {
                opacity: 1 - navProgress,
                y: -20 * navProgress,
            });

            /*
             * New dive logo begins appearing slightly
             * BEFORE the original navigation completely vanishes.
             *
             * This creates a handoff rather than an empty gap.
             */
            const diveProgress = gsap.utils.clamp(
                0,
                1,
                (progress - 0.045) / 0.12,
            );

            if (diveLogo) {
                const diveEase = gsap.parseEase("power3.out")(diveProgress);

                gsap.set(diveLogo, {
                    autoAlpha: diveProgress,
                    y: -35 + diveEase * 35,
                    scale: 0.92 + diveEase * 0.08,
                });
            }

            /*
             * Logo mark enters slightly faster.
             */
            if (diveLogoMark) {
                const markProgress = gsap.utils.clamp(
                    0,
                    1,
                    (progress - 0.055) / 0.08,
                );

                const markEase = gsap.parseEase("back.out(1.7)")(markProgress);

                gsap.set(diveLogoMark, {
                    scale: 0.7 + markEase * 0.3,
                    opacity: markProgress,
                });
            }

            /*
             * Technical line draws underneath the new logo.
             */
            if (diveLogoText) {
                const lineProgress = gsap.utils.clamp(
                    0,
                    1,
                    (progress - 0.09) / 0.13,
                );

                gsap.set(diveLogoText, {
                    "--line-width": `${lineProgress * 100}%`,
                });
            }

            /* ==================================================
               DESCENT UI
            ================================================== */

            /* Mission status */

            const missionProgress = gsap.utils.clamp(
                0,
                1,
                (progress - 0.1) / 0.12,
            );

            gsap.set(missionStatus, {
                opacity: missionProgress,
                x: -20 + missionProgress * 20,
            });

            /* Telemetry */

            const telemetryProgress = gsap.utils.clamp(
                0,
                1,
                (progress - 0.18) / 0.15,
            );

            gsap.set(telemetry, {
                opacity: telemetryProgress,
                x: 20 - telemetryProgress * 20,
            });

            /* Sonar */

            const sonarProgress = gsap.utils.clamp(
                0,
                1,
                (progress - 0.28) / 0.15,
            );

            gsap.set(sonarScale, {
                opacity: sonarProgress,
            });

            gsap.set(sonarLine, {
                opacity: sonarProgress,
            });

            /* Beacon readout */

            const readoutProgress = gsap.utils.clamp(
                0,
                1,
                (progress - 0.4) / 0.15,
            );

            gsap.set(beaconReadout, {
                opacity: readoutProgress,
                x: 20 - readoutProgress * 20,
            });

            /* Coordinates */

            const coordinateProgress = gsap.utils.clamp(
                0,
                1,
                (progress - 0.52) / 0.14,
            );

            gsap.set(floatingCoordinates, {
                opacity: coordinateProgress,
                y: 10 - coordinateProgress * 10,
            });

            /* ==================================================
               HEADER
            ================================================== */

            const headerProgress = gsap.utils.clamp(0, 1, progress / 0.28);

            gsap.set(header, {
                y: -120 * headerProgress,
                opacity: 1 - headerProgress,
            });

            /* ==================================================
               BEACON DESCENT
            ================================================== */

            if (progress < 0.06) {
                gsap.set(beaconContainer, {
                    xPercent: -50,
                    yPercent: -50,

                    z: 1100,
                    scale: 0.42,

                    rotationX: 10,
                    rotationY: -7,

                    y: 0,

                    opacity: 0.12,
                });
            } else if (progress < 0.72) {
                const p = gsap.utils.clamp(0, 1, (progress - 0.06) / 0.66);

                const eased = gsap.parseEase("power2.inOut")(p);

                gsap.set(beaconContainer, {
                    xPercent: -50,
                    yPercent: -50,

                    z: 1100 - eased * 1450,

                    scale: 0.42 + eased * 0.78,

                    rotationX: 10 - eased * 10,
                    rotationY: -7 + eased * 7,

                    y: eased * -30,

                    opacity: 0.12 + eased * 0.88,
                });
            } else {
                const p = gsap.utils.clamp(0, 1, (progress - 0.72) / 0.28);

                const eased = gsap.parseEase("power2.out")(p);

                gsap.set(beaconContainer, {
                    xPercent: -50,
                    yPercent: -50,

                    z: -350 - eased * 250,

                    scale: 1.2 + eased * 0.15,

                    rotationX: 0,
                    rotationY: 0,

                    y: -30 - eased * 20,

                    opacity: 1,
                });
            }

            /* ==================================================
               SIGNAL
            ================================================== */

            const signalProgress = gsap.utils.clamp(
                0,
                1,
                (progress - 0.48) / 0.18,
            );

            gsap.set(signal, {
                opacity: signalProgress,
            });

            /* ==================================================
               DEPTH
            ================================================== */

            const depthValue = Math.round(progress * 3800);

            const depthStrong = depth.querySelector("strong");

            if (depthStrong) {
                depthStrong.textContent = `— ${String(depthValue).padStart(5, "0")} M`;
            }

            /* ==================================================
               SCROLL INDICATOR
            ================================================== */

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
       PARTICLES
    -------------------------------- */

    gsap.utils.toArray(".particles span").forEach((particle, i) => {
        gsap.to(particle, {
            y: -120 - i * 35,
            x: (i % 2 === 0 ? 1 : -1) * (20 + i * 5),

            opacity: 0.5,

            duration: 4 + i * 0.7,

            repeat: -1,

            delay: i * 0.5,

            ease: "sine.inOut",

            yoyo: true,
        });
    });

    /* --------------------------------
       RESIZE
    -------------------------------- */

    window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
    });
});
