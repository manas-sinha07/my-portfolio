// =================================
// CALIFORNIA WATCHES PROJECT SLIDESHOW
// =================================

const images = [
    "assets/california/california1.png",
    "assets/california/california2.png",
    "assets/california/california3.png",
    "assets/california/california4.png",
    "assets/california/california5.png",
    "assets/california/california6.png",
    "assets/california/california7.png",
    "assets/california/california8.png",
    "assets/california/california9.png",
    "assets/california/california10.png",
    "assets/california/california11.png",
    "assets/california/california12.png",
    "assets/california/california13.png",
    "assets/california/california14.png",
    "assets/california/california15.png"
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