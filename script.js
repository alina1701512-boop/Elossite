// 📝 Изменено: 2026-06-03 / Две кнопки: "Смотреть все" и "Скрыть" в конце
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Мобильное меню ---
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

    // --- 2. FAQ Аккордеон ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            faqQuestions.forEach(q => q.setAttribute('aria-expanded', 'false'));
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- 3. Кнопки "Смотреть все" и "Скрыть" ---
    const hiddenFaq = document.getElementById('hiddenFaq');
    const toggleAllFaq = document.getElementById('toggleAllFaq');
    const hideAllFaq = document.getElementById('hideAllFaq');
    const showAllButton = document.getElementById('showAllFaqButton');

    if (toggleAllFaq && hiddenFaq && showAllButton) {
        toggleAllFaq.addEventListener('click', function() {
            hiddenFaq.style.display = 'block';
            showAllButton.style.display = 'none';
        });
    }

    if (hideAllFaq && hiddenFaq && showAllButton) {
        hideAllFaq.addEventListener('click', function() {
            hiddenFaq.style.display = 'none';
            showAllButton.style.display = 'block';
        });
    }

    // --- 4. Анимация при скролле ---
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

    // --- 5. Форма ---
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
