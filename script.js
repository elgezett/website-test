document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector("header");

    window.addEventListener("scroll", function () {
        const triggerPoint = window.innerHeight * 0.1; // Adjust threshold if needed
        if (window.scrollY > triggerPoint) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
});


window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};
