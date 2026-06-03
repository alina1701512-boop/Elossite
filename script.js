// 📝 Изменено: 2026-06-03 / FAQ: плавный ховер + клик + кнопки + другие зоны
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

    // --- 2. FAQ: Плавный ховер (наведение мыши) ---
    const faqItems = document.querySelectorAll('.faq-item');
    let hoverTimeout;
    let leaveTimeout;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        item.addEventListener('mouseenter', function() {
            clearTimeout(leaveTimeout);
            hoverTimeout = setTimeout(() => {
                document.querySelectorAll('.faq-question').forEach(q => q.setAttribute('aria-expanded', 'false'));
                question.setAttribute('aria-expanded', 'true');
            }, 200);
        });

        item.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimeout);
            leaveTimeout = setTimeout(() => {
                question.setAttribute('aria-expanded', 'false');
            }, 300);
        });
    });

    // --- 3. FAQ: Клик ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function(e) {
            clearTimeout(hoverTimeout);
            clearTimeout(leaveTimeout);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            faqQuestions.forEach(q => q.setAttribute('aria-expanded', 'false'));
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- 4. Кнопки "Смотреть все" и "Скрыть" ---
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

    // --- 5. Раскрывающийся список "Другие зоны" ---
    const toggleZones = document.getElementById('toggleZones');
    const otherZones = document.getElementById('otherZones');
    if (toggleZones && otherZones) {
        toggleZones.addEventListener('click', function() {
            if (otherZones.style.display === 'none') {
                otherZones.style.display = 'block';
                toggleZones.textContent = 'Скрыть другие зоны ↑';
            } else {
                otherZones.style.display = 'none';
                toggleZones.textContent = 'Смотреть другие зоны и цены ↓';
            }
        });
    }

    // --- 6. Анимация при скролле ---
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

    // --- 7. Форма ---
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
