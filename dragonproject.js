// =================================
// DRAGON REALM PROJECT SLIDESHOW
// =================================

const images = [
    "assets/dragon/dragon1.png",
    "assets/dragon/dragon2.png",
    "assets/dragon/dragon3.png",
    "assets/dragon/dragon4.png",
    "assets/dragon/dragon5.png"
];

let currentSlide = 0;

const projectImage = document.getElementById("project-image");
const slideNumber = document.getElementById("slide-number");
const dots = document.querySelectorAll(".slide-controls button");


// =================================
// SHOW SLIDE
// =================================

function showSlide(index) {

    if (index < 0) {
        index = images.length - 1;
    }

    if (index >= images.length) {
        index = 0;
    }

    currentSlide = index;

    projectImage.src = images[currentSlide];

    slideNumber.textContent =
        `${currentSlide + 1} / ${images.length}`;

    dots.forEach((dot, i) => {

        if (i === currentSlide) {
            dot.style.color = "white";
        } else {
            dot.style.color = "#555";
        }

    });
}


// =================================
// NEXT SLIDE
// =================================

function nextSlide() {
    showSlide(currentSlide + 1);
}


// =================================
// PREVIOUS SLIDE
// =================================

function previousSlide() {
    showSlide(currentSlide - 1);
}


// =================================
// KEYBOARD CONTROLS
// =================================

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowRight") {
        nextSlide();
    }

    if (event.key === "ArrowLeft") {
        previousSlide();
    }

});


// =================================
// IMAGE ERROR CHECK
// =================================

projectImage.addEventListener("error", function() {

    console.error(
        "Could not load image:",
        images[currentSlide]
    );

});


// =================================
// INITIALIZE
// =================================

showSlide(0);