// 📝 Изменено: 2026-05-31 / Логика меню, FAQ, анимаций и форм /

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Мобильное меню (гамбургер) ---
    const burgerMenu = document.getElementById('burgerMenu');
    const mainNav = document.getElementById('mainNav');

    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener('click', function() {
            const isOpen = mainNav.classList.toggle('active');
            // Меняем aria-expanded для доступности
            burgerMenu.setAttribute('aria-expanded', isOpen);
        });

        // Закрывать меню при клике на любую ссылку внутри него
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
            // Закрываем все остальные открытые вопросы (опционально, можно убрать, чтобы работало независимо)
            // faqQuestions.forEach(q => {
            //     if (q !== this) q.setAttribute('aria-expanded', 'false');
            // });
            
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // --- 3. Плавная анимация при скролле (IntersectionObserver) ---
    const fadeSections = document.querySelectorAll('.fade-in-section');
    
    // Настройки наблюдателя. 'rootMargin' означает "начать анимацию за 100px до появления элемента"
    const observerOptions = {
        root: null, // Смотрим относительно всего экрана
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Когда элемент появляется в зоне видимости
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Как только анимация запущена, перестаем следить за этим элементом, чтобы не повторять
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Запускаем слежку за всеми элементами с классом fade-in-section
    fadeSections.forEach(section => {
        observer.observe(section);
    });

    // --- 4. Обработка формы записи ---
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Стандартная отправка формы запрещена, мы всё делаем сами
            
            // Показываем сообщение пользователю
            formMessage.textContent = 'Спасибо! Я свяжусь с вами в ближайшее время.';
            formMessage.style.color = 'green';
            formMessage.style.marginTop = '15px';
            
            // Очищаем поля формы (опционально)
            contactForm.reset();
            
            // В реальном проекте здесь был бы код для отправки данных на сервер,
            // например, через fetch() или XMLHttpRequest.
            // Пока это просто демонстрация работы формы.
            // Пример реальной отправки:
            // fetch('https://your-server.com/send', { method: 'POST', body: new FormData(contactForm) });
            
            // Убираем сообщение через 5 секунд
            setTimeout(() => {
                formMessage.textContent = '';
            }, 5000);
        });
    }
});