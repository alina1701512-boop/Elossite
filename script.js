// 📝 Изменено: 2026-06-03 / FAQ: только один открытый вопрос одновременно
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Мобильное меню (гамбургер) ---
    const burgerMenu = document.getElementById('burgerMenu');
    const mainNav = document.getElementById('mainNav');

    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener('click', function() {
            const isOpen = mainNav.classList.toggle('active');
            burgerMenu.setAttribute('aria-expanded', isOpen);
        });
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                burgerMenu.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- 2. FAQ Аккордеон (закрывать предыдущий при открытии нового) ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Закрываем ВСЕ вопросы
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
            });
            
            // Если текущий вопрос был закрыт — открываем его
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
            }
            // Если был открыт — оставляем закрытым (пользователь кликнул, чтобы закрыть)
        });
    });

    // --- 3. Плавная анимация при скролле (IntersectionObserver) ---
    const fadeSections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
    fadeSections.forEach(section => observer.observe(section));

    // --- 4. Обработка формы записи ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            formMessage.textContent = 'Спасибо! Я свяжусь с вами в ближайшее время.';
            formMessage.style.color = 'green';
            formMessage.style.marginTop = '15px';
            contactForm.reset();
            setTimeout(() => { formMessage.textContent = ''; }, 5000);
        });
    }
});
