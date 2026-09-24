const images = [
    "assets/management/management1.png",
    "assets/management/management2.png",
    "assets/management/management3.png",
    "assets/management/management4.png"
];

let currentSlide = 0;

const projectImage = document.getElementById("project-image");
const slideNumber = document.getElementById("slide-number");
const dots = document.querySelectorAll(".slide-controls button");


function showSlide(index) {

    if (index < 0) {
        index = images.length - 1;
    }

    if (index >= images.length) {
        index = 0;
    }

    currentSlide = index;

    projectImage.style.opacity = "0";

    setTimeout(() => {
        projectImage.src = images[currentSlide];
        projectImage.style.opacity = "1";
    }, 150);

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


function nextSlide() {
    showSlide(currentSlide + 1);
}


function previousSlide() {
    showSlide(currentSlide - 1);
}


document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowRight") {
        nextSlide();
    }

    if (event.key === "ArrowLeft") {
        previousSlide();
    }

});


showSlide(0);


let autoSlide = setInterval(() => {
    nextSlide();
}, 5000);


const slideshow = document.querySelector(".slideshow");

slideshow.addEventListener("mouseenter", () => {
    clearInterval(autoSlide);
});


slideshow.addEventListener("mouseleave", () => {

    autoSlide = setInterval(() => {
        nextSlide();
    }, 5000);

});