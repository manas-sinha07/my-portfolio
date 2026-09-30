/* =====================================================
   THEME SYSTEM
===================================================== */

const themeToggle =
    document.getElementById("theme-toggle");

const mobileThemeToggle =
    document.getElementById("mobile-theme-toggle");

const themeName =
    document.getElementById("theme-name");


function setTheme(theme) {

    document.body.classList.remove(
        "dark",
        "light"
    );

    document.body.classList.add(theme);

    localStorage.setItem(
        "manas-theme",
        theme
    );


    if (themeName) {

        themeName.textContent =
            theme === "dark"
                ? "DARK"
                : "LIGHT";

    }

}


function toggleTheme() {

    const currentTheme =
        document.body.classList.contains("dark")
            ? "dark"
            : "light";


    setTheme(
        currentTheme === "dark"
            ? "light"
            : "dark"
    );

}


const savedTheme =
    localStorage.getItem("manas-theme");


setTheme(
    savedTheme === "light"
        ? "light"
        : "dark"
);


if (themeToggle) {
    themeToggle.addEventListener(
        "click",
        toggleTheme
    );
}


if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener(
        "click",
        toggleTheme
    );
}


/* =====================================================
   MOBILE MENU
===================================================== */

const mobileToggle =
    document.getElementById("mobile-toggle");

const mobileMenu =
    document.getElementById("mobile-menu");


if (mobileToggle && mobileMenu) {

    mobileToggle.addEventListener(
        "click",
        () => {

            mobileMenu.classList.toggle(
                "open"
            );

        }
    );


    document
        .querySelectorAll(".mobile-menu a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mobileMenu.classList.remove(
                        "open"
                    );

                }
            );

        });

}


/* =====================================================
   SMOOTH CURSOR / TOUCH BACKGROUND
===================================================== */

const orbs =
    document.querySelectorAll(".orb");

const rings =
    document.querySelectorAll(".ring");

const symbols =
    document.querySelectorAll(".floating-symbol");

const hero =
    document.querySelector(".hero");


if (hero) {

    let mouseX = 0;
    let mouseY = 0;

    let currentX = 0;
    let currentY = 0;


    /*
     * Pointer Events work with:
     *
     * - Mouse on PC
     * - Finger on mobile
     * - Stylus / pen
     *
     * So we don't need separate
     * pointermove and touchmove code.
     */

    window.addEventListener(
        "pointermove",
        (event) => {

            mouseX =
                (event.clientX / window.innerWidth)
                - 0.5;

            mouseY =
                (event.clientY / window.innerHeight)
                - 0.5;

        },
        { passive: true }
    );


    function animateBackground() {

        /*
         * Smooth interpolation.
         *
         * Instead of instantly moving the objects,
         * we slowly move them toward the pointer.
         */

        currentX +=
            (mouseX - currentX) * 0.055;

        currentY +=
            (mouseY - currentY) * 0.055;


        /* ================= ORBS ================= */

        orbs.forEach((orb, index) => {

            const strength =
                30 + (index * 25);

            const x =
                currentX * strength;

            const y =
                currentY * strength;

            orb.style.transform =
                `translate3d(${x}px, ${y}px, 0)`;

        });


        /* ================= RINGS ================= */

        rings.forEach((ring, index) => {

            const strength =
                18 + (index * 20);

            const x =
                currentX * strength;

            const y =
                currentY * strength;

            const rotation =
                currentX * 12;

            ring.style.transform =
                `translate3d(${x}px, ${y}px, 0)
                 rotate(${rotation}deg)`;

        });


        /* ================= SYMBOLS ================= */

        symbols.forEach((symbol, index) => {

            const strength =
                15 + (index * 10);

            const x =
                currentX * strength;

            const y =
                currentY * strength;

            const rotation =
                currentX * (20 + index * 10);

            symbol.style.transform =
                `translate3d(${x}px, ${y}px, 0)
                 rotate(${rotation}deg)`;

        });


        requestAnimationFrame(
            animateBackground
        );

    }


    animateBackground();

}


/* =====================================================
   PROJECT IMAGE FOLLOW CURSOR
===================================================== */

const projectRows =
    document.querySelectorAll(
        ".project-row"
    );


/*
 * This effect stays desktop-only because
 * it specifically follows the mouse cursor
 * over project rows.
 */

if (
    window.matchMedia("(pointer: fine)").matches
) {

    projectRows.forEach(row => {

        const image =
            row.querySelector(
                ".project-preview"
            );


        if (!image) {
            return;
        }


        row.addEventListener(
            "pointermove",
            event => {

                /*
                 * Directly setting the CSS variables
                 * lets CSS handle the smooth transform.
                 */

                image.style.setProperty(
                    "--mouse-x",
                    `${event.clientX}px`
                );


                image.style.setProperty(
                    "--mouse-y",
                    `${event.clientY}px`
                );

            },
            { passive: true }
        );

    });

}


/* =====================================================
   SECTION REVEAL
===================================================== */

const sections =
    document.querySelectorAll(
        ".section"
    );


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (
                    entry.isIntersecting
                ) {

                    entry.target.classList.add(
                        "visible"
                    );

                }

            });

        },
        {
            threshold: 0.08
        }
    );


sections.forEach(section => {

    revealObserver.observe(section);

});


/* =====================================================
   NAVIGATION
===================================================== */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });