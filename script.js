document.addEventListener('DOMContentLoaded', function() {

    // ========== 1. МЕНЮ (БУРГЕР) ==========
    const burgerMenu = document.getElementById('burgerMenu');
    const slideMenu = document.getElementById('slideMenu');
    const slideMenuOverlay = document.querySelector('.slide-menu__overlay');

    if (burgerMenu && slideMenu) {
        burgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            slideMenu.classList.toggle('active');
        });

        if (slideMenuOverlay) {
            slideMenuOverlay.addEventListener('click', function() {
                slideMenu.classList.remove('active');
            });
        }

        const menuLinks = slideMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                slideMenu.classList.remove('active');
            });
        });
    }

    // ========== 2. FAQ (АККОРДЕОН) ==========
    const faqItems = document.querySelectorAll('.faq-item');
    let currentlyOpen = null;

    function closeAllFaq() {
        faqItems.forEach(item => {
            const button = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (button) {
                button.classList.remove('active');
                button.setAttribute('aria-expanded', 'false');
            }
            if (answer) {
                answer.style.maxHeight = null;
            }
        });
        currentlyOpen = null;
    }

    function openFaq(item) {
        const button = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (button && answer) {
            button.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            currentlyOpen = item;
        }
    }

    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question');
        if (button) {
            button.classList.remove('active');
            button.setAttribute('aria-expanded', 'false');
            const answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.style.maxHeight = null;
            }

            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const isOpen = button.classList.contains('active');
                
                if (isOpen) {
                    button.classList.remove('active');
                    button.setAttribute('aria-expanded', 'false');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = null;
                    }
                    currentlyOpen = null;
                } else {
                    closeAllFaq();
                    openFaq(item);
                }
            });
        }
    });

    // ========== 3. FAQ КНОПКА «СМОТРЕТЬ ВСЕ» ==========
    const faqShowAllBtn = document.getElementById('faqShowAll');
    const hiddenFaqItems = document.querySelectorAll('.faq-hidden');

    if (faqShowAllBtn && hiddenFaqItems.length > 0) {
        faqShowAllBtn.addEventListener('click', function() {
            hiddenFaqItems.forEach(item => {
                item.style.display = 'block';
            });
            faqShowAllBtn.style.display = 'none';
        });
    }

    // ========== 4. АНИМАЦИЯ ПРИ СКРОЛЛЕ ==========
    const fadeElements = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    
    fadeElements.forEach(el => observer.observe(el));

        // ========== 5. ВЫХОДНОЙ ПОПАП (ТОЛЬКО ДЕСКТОП ≥768px) ==========
    let popupShown = false;

    function showExitPopup() {
        if (popupShown) return;
        if (window.innerWidth < 768) return;
        const popup = document.getElementById('exitPopup');
        if (popup) {
            popup.classList.add('visible');
            popupShown = true;
        }
    }

    window.addEventListener('scroll', function() {
        if (popupShown) return;
        if (window.innerWidth < 768) return;
        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
        if (scrollPercent > 0.5) {
            showExitPopup();
        }
    });

    // Закрытие попапов
    document.querySelectorAll('.exit-popup-close, .close-popup-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const popup = btn.closest('.exit-popup-overlay');
            if (popup) popup.classList.remove('visible');
        });
    });

    document.querySelectorAll('.exit-popup-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
            }
        });
    });

    // ========== 6. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                if (slideMenu && slideMenu.classList.contains('active')) {
                    slideMenu.classList.remove('active');
                }
            }
        });
    });

    // ========== 7. УМНЫЙ МАРШРУТ ==========
    function buildSmartRoute() {
        var destination = "55.792709,49.103627";
        var destinationAddress = "Казань, ул. Московская, 13а";
        
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    var from = position.coords.latitude + "," + position.coords.longitude;
                    window.open("https://yandex.ru/maps/?rtext=" + from + "~" + destination + "&rtt=auto", "_blank");
                },
                function() {
                    window.open("https://yandex.ru/maps/?text=" + encodeURIComponent(destinationAddress), "_blank");
                }
            );
        } else {
            window.open("https://yandex.ru/maps/?text=" + encodeURIComponent(destinationAddress), "_blank");
        }
    }

    window.buildSmartRoute = buildSmartRoute;
        // ========== 8. КНОПКА «ПОДРОБНЕЕ О МАСТЕРЕ» ==========
    const whyToggle = document.getElementById('whyToggle');
    const whyExtras = document.getElementById('whyExtras');

    if (whyToggle && whyExtras) {
        whyToggle.addEventListener('click', function() {
            if (whyExtras.style.display === 'none' || whyExtras.style.display === '') {
                whyExtras.style.display = 'block';
                whyToggle.textContent = 'Скрыть подробности';
            } else {
                whyExtras.style.display = 'none';
                whyToggle.textContent = 'Подробнее о мастере';
            }
        });
    }
    
        // ========== 9. ОТПРАВКА ФОРМЫ В TELEGRAM ==========
    window.submitToTelegram = function(event) {
        event.preventDefault();

        const name = document.getElementById('tgName').value.trim();
        const phone = document.getElementById('tgPhone').value.trim();
        const question = document.getElementById('tgQuestion').value.trim();

        if (!name || !phone) {
            alert('Пожалуйста, заполните имя и телефон');
            return false;
        }

        const BOT_TOKEN = '8964820654:AAE-3GAXfna2ZzYejSN90jmYmqcyHz2X1-M';
        const CHAT_ID = '342298611';

        let message = '🟢 Новая заявка с сайта Elos!\n\n';
        message += '👤 Имя: ' + name + '\n';
        message += '📞 Телефон: ' + phone + '\n';
        if (question) {
            message += '💬 Вопрос: ' + question + '\n';
        }
        message += '\n📅 ' + new Date().toLocaleString('ru-RU');

        const url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';
        const data = new URLSearchParams();
        data.append('chat_id', CHAT_ID);
        data.append('text', message);
        data.append('parse_mode', 'HTML');

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: data.toString()
        })
        .then(response => response.json())
        .then(result => {
            if (result.ok) {
                document.getElementById('tgSuccess').style.display = 'block';
                document.getElementById('tgError').style.display = 'none';
                document.getElementById('tgName').value = '';
                document.getElementById('tgPhone').value = '';
                document.getElementById('tgQuestion').value = '';
            } else {
                document.getElementById('tgError').style.display = 'block';
                document.getElementById('tgSuccess').style.display = 'none';
            }
        })
        .catch(error => {
            document.getElementById('tgError').style.display = 'block';
            document.getElementById('tgSuccess').style.display = 'none';
        });

        return false;
    };
});
