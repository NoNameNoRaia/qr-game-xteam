/* ============================================
   OPEN DAY 2026 - Game Logic
   ============================================ */

// ---- QUESTION DATA ----
const QUESTIONS_DB = [
    {
        topic: "PTIT",
        icon: "ti-book",
        questions: [
            "PTIT là viết tắt của cụm từ gì?",
            "Màu áo truyền thống của PTIT là màu gì?",
            "PTIT trực thuộc Bộ nào?",
            "Kể tên một ngành đào tạo của PTIT.",
            "Sinh viên PTIT thường gọi trường bằng biệt danh gì?",
            "PTIT có mấy cơ sở chính?",
            "Logo PTIT có màu chủ đạo là gì?",
            "Một kỹ năng quan trọng nhất của sinh viên PTIT là gì?",
            "Kể tên một câu lạc bộ ở PTIT.",
            "PTIT nổi tiếng mạnh về lĩnh vực nào?",
            "Học đại học chỉ cần học trên lớp là đủ? (Đúng/Sai)",
            "Theo bạn, điều quan trọng nhất khi học đại học là gì?",
            "PTIT đào tạo theo định hướng gì?",
            "Bạn mong muốn đạt được điều gì sau 4 năm ở PTIT?",
            "Hãy kể tên một sự kiện lớn dành cho sinh viên PTIT."
        ]
    },
    {
        topic: "Rikkei",
        icon: "ti-briefcase",
        questions: [
            "Rikkei hoạt động chủ yếu trong lĩnh vực nào?",
            "Khách hàng lớn của Rikkei đến từ quốc gia nào?",
            "Rikkei nổi tiếng về mô hình gì?",
            "Kể tên một ngôn ngữ lập trình mà Rikkei tuyển dụng.",
            "Rikkei có chương trình dành cho sinh viên không?",
            "Theo bạn, lập trình viên cần kỹ năng mềm nào?",
            "Một giá trị quan trọng khi làm việc nhóm là gì?",
            "Theo bạn, đúng giờ có quan trọng khi đi làm không?",
            "Bạn biết gì về hệ liên kết doanh nghiệp?",
            "Theo bạn, thực tập từ sớm có lợi ích gì?",
            "Kỹ năng nào giúp dễ được tuyển dụng hơn?",
            "Theo bạn, AI có thay thế lập trình viên hoàn toàn không?",
            "Bạn muốn làm vị trí nào trong ngành CNTT?",
            "Điều gì khiến bạn muốn học cùng doanh nghiệp?",
            "Một phẩm chất của nhân viên công nghệ chuyên nghiệp là gì?"
        ]
    },
    {
        topic: "Công nghệ thông tin",
        icon: "ti-desktop",
        questions: [
            "CPU là viết tắt của gì?",
            "RAM dùng để làm gì?",
            "HTML là ngôn ngữ lập trình đúng hay sai?",
            "AI là viết tắt của cụm từ gì?",
            "Python là gì?",
            "Internet là gì?",
            "Cloud Computing là gì?",
            "Hacker luôn là người xấu? (Đúng/Sai)",
            "Mật khẩu mạnh nên có đặc điểm gì?",
            "Git dùng để làm gì?"
        ]
    },
    {
        topic: "Quản trị kinh doanh",
        icon: "ti-bar-chart",
        questions: [
            "Marketing là gì?",
            "Khách hàng là trung tâm đúng hay sai?",
            "Theo bạn, Startup là gì?",
            "Kỹ năng giao tiếp quan trọng vì sao?",
            "Làm việc nhóm cần điều gì nhất?",
            "Lãnh đạo và quản lý có giống nhau không?",
            "KPI dùng để làm gì?",
            "Theo bạn, thương hiệu là gì?",
            "Một doanh nghiệp muốn phát triển bền vững cần điều gì?",
            "Nếu được khởi nghiệp, bạn sẽ kinh doanh sản phẩm gì?"
        ]
    }
];

// ---- DOM ELEMENTS ----
const swipeScreen = document.getElementById('swipeScreen');
const loadingScreen = document.getElementById('loadingScreen');
const questionScreen = document.getElementById('questionScreen');
const topicBadge = document.getElementById('topicBadge');
const topicName = document.getElementById('topicName');
const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const loadingBarFill = document.querySelector('.loading-bar-fill');
const particleCanvas = document.getElementById('particleCanvas');

// ---- STATE ----
let startY = 0;
let currentY = 0;
let isDragging = false;
const SWIPE_THRESHOLD = 80;

// ---- LOCALSTORAGE ----
const STORAGE_KEY = 'xteam_challenge_question';

function saveQuestion(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSavedQuestion() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return null;
        }
    }
    return null;
}

function clearSavedQuestion() {
    localStorage.removeItem(STORAGE_KEY);
}

// ---- RANDOM QUESTION ----
function getRandomQuestion() {
    const topicIndex = Math.floor(Math.random() * QUESTIONS_DB.length);
    const topic = QUESTIONS_DB[topicIndex];
    const qIndex = Math.floor(Math.random() * topic.questions.length);

    return {
        topic: topic.topic,
        icon: topic.icon,
        question: topic.questions[qIndex],
        questionNum: qIndex + 1,
        timestamp: Date.now()
    };
}

// ---- DISPLAY QUESTION ----
function displayQuestion(data) {
    const topicIcon = document.querySelector('.topic-icon');
    topicIcon.className = `topic-icon ${data.icon}`;
    topicName.textContent = data.topic;
    questionNumber.textContent = `Q.${String(data.questionNum).padStart(2, '0')}`;
    questionText.textContent = data.question;
}

// ---- SCREEN TRANSITIONS ----
function showScreen(targetScreen) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
    });
    targetScreen.classList.add('active');
}

function transitionToLoading() {
    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'haptic-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 400);

    // Vibrate if supported
    if (navigator.vibrate) {
        navigator.vibrate([30, 50, 30]);
    }

    swipeScreen.classList.add('slide-out-up');

    setTimeout(() => {
        swipeScreen.classList.remove('active', 'slide-out-up');
        loadingScreen.classList.add('active');

        // Animate loading bar
        animateLoadingBar();
    }, 400);
}

function animateLoadingBar() {
    let progress = 0;
    const duration = 2000;
    const interval = 20;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
        progress += increment + Math.random() * 2;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            loadingBarFill.style.width = '100%';

            setTimeout(() => {
                transitionToQuestion();
            }, 300);
        }
        loadingBarFill.style.width = progress + '%';
    }, interval);
}

function transitionToQuestion() {
    const data = getRandomQuestion();
    saveQuestion(data);

    loadingScreen.classList.remove('active');

    displayQuestion(data);
    questionScreen.classList.add('active', 'slide-in-up');
}

// ---- SWIPE HANDLING ----
function handleSwipeStart(y) {
    startY = y;
    isDragging = true;
    swipeScreen.classList.add('dragging');
}

function handleSwipeMove(y) {
    if (!isDragging) return;
    currentY = y;
    const diff = startY - currentY;

    if (diff > 0) {
        const translateY = Math.min(diff * 0.4, 150);
        const scale = Math.max(1 - diff * 0.0005, 0.92);
        const contentEl = swipeScreen.querySelector('.swipe-content');
        contentEl.style.transform = `translateY(-${translateY}px) scale(${scale})`;

        const indicatorEl = swipeScreen.querySelector('.swipe-indicator');
        indicatorEl.style.opacity = Math.max(1 - diff / 150, 0);
    }
}

function handleSwipeEnd() {
    if (!isDragging) return;
    isDragging = false;
    swipeScreen.classList.remove('dragging');

    const diff = startY - currentY;

    const contentEl = swipeScreen.querySelector('.swipe-content');
    const indicatorEl = swipeScreen.querySelector('.swipe-indicator');
    contentEl.style.transform = '';
    indicatorEl.style.opacity = '';

    if (diff > SWIPE_THRESHOLD) {
        transitionToLoading();
    }
}

// Touch events
swipeScreen.addEventListener('touchstart', (e) => {
    handleSwipeStart(e.touches[0].clientY);
}, { passive: true });

swipeScreen.addEventListener('touchmove', (e) => {
    handleSwipeMove(e.touches[0].clientY);
}, { passive: true });

swipeScreen.addEventListener('touchend', () => {
    handleSwipeEnd();
}, { passive: true });

// Mouse events (for desktop testing)
swipeScreen.addEventListener('mousedown', (e) => {
    handleSwipeStart(e.clientY);
});

swipeScreen.addEventListener('mousemove', (e) => {
    handleSwipeMove(e.clientY);
});

swipeScreen.addEventListener('mouseup', () => {
    handleSwipeEnd();
});

swipeScreen.addEventListener('mouseleave', () => {
    if (isDragging) handleSwipeEnd();
});

// ---- PARTICLE SYSTEM (Blue theme) ----
function initParticles() {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
        w = particleCanvas.width = window.innerWidth;
        h = particleCanvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 1.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.25;
            this.speedY = (Math.random() - 0.5) * 0.25;
            this.opacity = Math.random() * 0.35 + 0.05;
            // Navy blue palette hues: 205-220
            this.hue = 200 + Math.random() * 20;
            this.lightness = 55 + Math.random() * 20;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > w) this.speedX *= -1;
            if (this.y < 0 || this.y > h) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, ${this.lightness}%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const count = Math.min(50, Math.floor((w * h) / 18000));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `hsla(210, 90%, 65%, ${0.05 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.4;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}

// ---- INIT ----
function init() {
    initParticles();

    // Check localStorage for saved question
    const saved = loadSavedQuestion();
    if (saved) {
        // Show saved question directly
        swipeScreen.classList.remove('active');
        displayQuestion(saved);
        questionScreen.classList.add('active');
    }
}

init();
