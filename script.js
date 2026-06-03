// 📝 Изменено: 2026-06-03 / FAQ + попапы (исправлено)
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

    // --- 8. Попап при уходе (exit-intent) — два этапа ---
    const exitPopup1 = document.getElementById('exitPopup1');
    const exitPopup2 = document.getElementById('exitPopup2');
    const closePopup1 = document.getElementById('closePopup1');
    const closePopup2 = document.getElementById('closePopup2');
    let popup1Shown = false;
    let popup2Shown = false;

    // Функция показа первого попапа
    function showPopup1() {
        if (!popup1Shown && exitPopup1) {
            exitPopup1.classList.add('visible');
            popup1Shown = true;
        }
    }

    // Функция показа второго попапа
    function showPopup2() {
        if (!popup2Shown && exitPopup2) {
            exitPopup2.classList.add('visible');
            popup2Shown = true;
        }
    }

    // Отслеживаем уход курсора — сначала первый попап, потом второй
    if (exitPopup1 && exitPopup2) {
        document.addEventListener('mouseout', function(e) {
            if (e.clientY < 10 && e.relatedTarget === null) {
                if (!popup1Shown) {
                    showPopup1();
                } else if (!popup2Shown) {
                    showPopup2();
                }
            }
        });
    }

    // Закрытие попапов по крестику и кнопке "Нет, спасибо"
    function closePopup(popup) {
        if (popup) popup.classList.remove('visible');
    }

    if (closePopup1) closePopup1.addEventListener('click', () => closePopup(exitPopup1));
    if (closePopup2) closePopup2.addEventListener('click', () => closePopup(exitPopup2));

    // Все кнопки "Нет, спасибо" (ищем по классу)
    document.querySelectorAll('.close-popup-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const popup = this.closest('.exit-popup-overlay');
            if (popup) popup.classList.remove('visible');
        });
    });

    // Закрытие по клику на затемнённый фон
    document.querySelectorAll('.exit-popup-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
            }
        });
    });

});
