// Initial setup: Get elements
const countdownEl = document.getElementById("countdown");
const headingEl = document.getElementById("heading");
const fireworksContainer = document.getElementById("fireworks-container");
const celebrationMessage = document.getElementById("celebration-message");
const unwrapButton = document.getElementById("unwrap-present-button");
const imageContainer = document.getElementById("image-container");
const audio = document.getElementById("background-music");

// Add references to new question and buttons
const questionContainer = document.getElementById("question-container");
const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");

// Initially hide countdown, heading, question, and image container
headingEl.style.display = "none";
countdownEl.style.display = "none";
imageContainer.classList.add("hidden");
questionContainer.classList.add("hidden");

// Initially hide error message
let errorMessage = null;

// Start everything when the button is clicked
unwrapButton.addEventListener("click", () => {
    audio.play().catch(err => console.log("Autoplay failed:", err)); // Handle autoplay failure
    unwrapButton.style.display = "none"; // Hide the button

    // Show countdown and heading
    headingEl.style.display = "block";
    countdownEl.style.display = "block";

    startCountdown(); // Start the countdown
});

// Countdown Timer
let countdown = 10;

function startCountdown() {
    const countdownInterval = setInterval(() => {
        countdownEl.textContent = countdown;

        if (countdown === 0) {
            clearInterval(countdownInterval); // Stop the countdown
            countdownEl.style.display = "none"; // Hide the countdown
            headingEl.style.display = "none"; // Hide the heading
            animatePictures(); // Start picture animations
        }

        countdown--; // Decrement countdown only if it's greater than 0
    }, 1000);
}

// Animate pictures sequentially
function animatePictures() {
    const imagePaths = [
        "mc.jpg", "mc2.jpg", "mc3.jpg", "mc4.jpg", "mc5.jpg",
        "mc6.jpg", "mc7.jpg", "mc8.jpg", "mc9.jpg", "mc10.jpg",
        "mc11.jpg", "mc12.jpg", "mc13.jpg", "mc14.jpg", "mc15.jpg",
        "mc16.jpg", "mc17.jpg", "mc18.jpg", "mc19.jpg", "mc20.jpg",
        "mc21.jpg", "mc22.jpg", "mc23.jpg", "mc24.jpg", "mc25.jpg",
        "mc26.jpg", "mc27.jpg", "mc28.jpg", "mc29.jpg", "mc30.jpg"
    ];
    let index = 0;

    imageContainer.classList.remove("hidden"); // Show the image container

    function showNextImage() {
        if (index < imagePaths.length) {
            const img = document.createElement("img");
            img.src = `images/${imagePaths[index]}`;
            img.classList.add("image");

            img.addEventListener("animationend", () => {
                imageContainer.removeChild(img); // Remove the image after animation
                index++;
                showNextImage(); // Show the next image
            });

            imageContainer.appendChild(img);
        } else {
            // After last image, show the question
            questionContainer.classList.remove("hidden");
        }
    }

    showNextImage(); // Start the image sequence
}

// Handle button clicks
yesButton.addEventListener("click", () => {
    // Hide error message if it exists
    if (errorMessage) {
        document.body.removeChild(errorMessage);
        errorMessage = null;
    }

    questionContainer.classList.add("hidden"); // Hide the question
    startFireworks(); // Show fireworks and message
});

noButton.addEventListener("click", () => {
    // Show error message
    if (!errorMessage) {
        displayErrorMessage(); // Show the error message
    }
    
    // Keep the question container and buttons visible
    questionContainer.classList.remove("hidden");
});

// Fireworks Animation
function startFireworks() {
    celebrationMessage.classList.remove("hidden"); // Show the celebration message
    setInterval(() => {
        launchFirework();
    }, 1000);
}

// Launch a firework
function launchFirework() {
    const firework = document.createElement("div");
    firework.style.position = "absolute";
    firework.style.bottom = "0";
    firework.style.left = `${Math.random() * window.innerWidth}px`;
    firework.style.width = "10px";
    firework.style.height = "30px";
    firework.style.background = "white";
    firework.style.borderRadius = "50%";
    fireworksContainer.appendChild(firework);

    let position = 0;
    const fireworkInterval = setInterval(() => {
        position += 10;
        firework.style.bottom = `${position}px`;

        if (position > window.innerHeight * 0.7) {
            clearInterval(fireworkInterval);
            fireworksContainer.removeChild(firework);
            explodeFirework(parseInt(firework.style.left), position);
        }
    }, 16);
}

// Explode firework
function explodeFirework(x, y) {
    const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];
    const particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: x,
            y: y,
            speed: Math.random() * 6 + 2,
            angle: Math.random() * 2 * Math.PI,
            radius: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            decay: Math.random() * 0.05 + 0.01,
        });
    }

    function animateExplosion() {
        const canvas = document.createElement("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        fireworksContainer.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        const animation = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.alpha -= p.decay;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(${hexToRgb(p.color)}, ${p.alpha})`;
                ctx.fill();

                if (p.alpha <= 0) particles.splice(i, 1);
            }

            if (particles.length === 0) {
                clearInterval(animation);
                fireworksContainer.removeChild(canvas);
            }
        }, 16);
    }
    animateExplosion();
}

// Helper function: Convert color to RGB
function hexToRgb(hex) {
    const colors = {
        red: "255, 0, 0",
        blue: "0, 0, 255",
        green: "0, 255, 0",
        yellow: "255, 255, 0",
        purple: "128, 0, 128",
        orange: "255, 165, 0",
        pink: "255, 192, 203",
    };
    return colors[hex];
}

// Error message for pressing No
function displayErrorMessage() {
    errorMessage = document.createElement("div");
    errorMessage.textContent = "No is not an option, you have to press Yes...";
    errorMessage.style.color = "red";
    errorMessage.style.textAlign = "center";
    errorMessage.style.fontSize = "2rem";
    errorMessage.style.position = "absolute";
    errorMessage.style.top = "60%";
    errorMessage.style.left = "50%";
    errorMessage.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(errorMessage);
}
