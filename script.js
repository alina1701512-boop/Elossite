document.addEventListener('DOMContentLoaded', function() {

    // ========== 0. ЗАГЛУШКА ДЛЯ YM (если Метрика заблокирована) ==========
    if (typeof ym === 'undefined') {
        window.ym = function() {};
    }

    // ========== 0.1. ОБРАБОТЧИК data-ym-goal ==========
    document.addEventListener('click', function(e) {
        var target = e.target.closest('[data-ym-goal]');
        if (target) {
            var goal = target.getAttribute('data-ym-goal');
            ym(109650228, 'reachGoal', goal);
        }
    });

    // ========== 1. МЕНЮ (БУРГЕР) ==========
    var burgerMenu = document.getElementById('burgerMenu');
    var slideMenu = document.getElementById('slideMenu');
    var slideMenuOverlay = document.querySelector('.slide-menu__overlay');

    if (burgerMenu && slideMenu) {
        burgerMenu.addEventListener('click', function(e) {
            // Не используем stopPropagation — вместо этого глобальный слушатель ниже
            slideMenu.classList.toggle('active');
        });

        // Закрытие по клику на оверлей
        if (slideMenuOverlay) {
            slideMenuOverlay.addEventListener('click', function() {
                slideMenu.classList.remove('active');
            });
        }

        // Закрытие по клику на ссылки внутри меню
        var menuLinks = slideMenu.querySelectorAll('a');
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                slideMenu.classList.remove('active');
            });
        });
    }

    // Глобальное закрытие меню по клику ВНЕ его
    document.addEventListener('click', function(e) {
        if (slideMenu && slideMenu.classList.contains('active')) {
            if (!slideMenu.contains(e.target) && e.target !== burgerMenu) {
                slideMenu.classList.remove('active');
            }
        }
    });

    // ========== 2. FAQ (АККОРДЕОН) ==========
    var faqItems = document.querySelectorAll('.faq-item');
    var currentlyOpen = null;

    function closeAllFaq() {
        faqItems.forEach(function(item) {
            var button = item.querySelector('.faq-question');
            var answer = item.querySelector('.faq-answer');
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
        var button = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');
        if (button && answer) {
            button.classList.add('active');
            button.setAttribute('aria-expanded', 'true');
            // Читаем scrollHeight и записываем
            var h = answer.scrollHeight;
            answer.style.maxHeight = h + 'px';
            currentlyOpen = item;
        }
    }

    faqItems.forEach(function(item) {
        var button = item.querySelector('.faq-question');
        if (button) {
            button.classList.remove('active');
            button.setAttribute('aria-expanded', 'false');
            // aria-controls уже задан в HTML (id у answer)
            var answer = item.querySelector('.faq-answer');
            if (answer) {
                answer.style.maxHeight = null;
            }

            button.addEventListener('click', function(e) {
                e.stopPropagation();
                var isOpen = button.classList.contains('active');
                
                if (isOpen) {
                    button.classList.remove('active');
                    button.setAttribute('aria-expanded', 'false');
                    var ans = item.querySelector('.faq-answer');
                    if (ans) {
                        ans.style.maxHeight = null;
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
    var faqShowAllBtn = document.getElementById('faqShowAll');
    var hiddenFaqItems = document.querySelectorAll('.faq-hidden');

    if (faqShowAllBtn && hiddenFaqItems.length > 0) {
        faqShowAllBtn.addEventListener('click', function() {
            hiddenFaqItems.forEach(function(item) {
                item.style.display = 'block';
            });
            faqShowAllBtn.style.display = 'none';
        });
    }

    // ========== 4. АНИМАЦИЯ ПРИ СКРОЛЛЕ ==========
    var fadeElements = document.querySelectorAll('.fade-in-section');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    
    fadeElements.forEach(function(el) { observer.observe(el); });

    // ========== 5. ВЫХОДНОЙ ПОПАП (ТОЛЬКО ДЕСКТОП >=768px, mouseleave) ==========
    var popupShown = false;
    var exitIntentListenerAdded = false;

    function showExitPopup() {
        if (popupShown) return;
        if (window.innerWidth < 768) return;
        var popup = document.getElementById('exitPopup');
        if (popup) {
            popup.classList.add('visible');
            popupShown = true;
        }
    }

    function initExitIntent() {
        if (exitIntentListenerAdded) return;
        if (window.innerWidth < 768) return;
        
        document.addEventListener('mouseleave', function(e) {
            if (e.clientY <= 0 && !popupShown) {
                showExitPopup();
            }
        });
        
        exitIntentListenerAdded = true;
    }

    initExitIntent();

    // debounce для resize
    var resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth >= 768 && !exitIntentListenerAdded) {
                initExitIntent();
            }
        }, 200);
    });

    // Закрытие попапов
    document.querySelectorAll('.exit-popup-close, .close-popup-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var popup = btn.closest('.exit-popup-overlay');
            if (popup) popup.classList.remove('visible');
        });
    });

    document.querySelectorAll('.exit-popup-overlay').forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
            }
        });
    });

    // ========== 6. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ ==========
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            var targetId = href.substring(1);
            var targetElement = document.getElementById(targetId);
            
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
        
        function openMap(url) {
            var newWindow = window.open(url, "_blank");
            if (newWindow) {
                newWindow.opener = null;
            }
        }
        
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    var from = position.coords.latitude + "," + position.coords.longitude;
                    openMap("https://yandex.ru/maps/?rtext=" + from + "~" + destination + "&rtt=auto");
                },
                function() {
                    openMap("https://yandex.ru/maps/?text=" + encodeURIComponent(destinationAddress));
                }
            );
        } else {
            openMap("https://yandex.ru/maps/?text=" + encodeURIComponent(destinationAddress));
        }
    }

    window.buildSmartRoute = buildSmartRoute;

    // Привязываем к кнопке "Как добраться"
    var smartRouteBtn = document.getElementById('smartRouteBtn');
    if (smartRouteBtn) {
        smartRouteBtn.addEventListener('click', buildSmartRoute);
    }
    
    // ========== 8. КНОПКА «ПОДРОБНЕЕ О МАСТЕРЕ» ==========
    var whyToggle = document.getElementById('whyToggle');
    var whyExtras = document.getElementById('whyExtras');

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

    // ========== 9. ОТСЛЕЖИВАНИЕ ПРОКРУТКИ ДО БЛОКОВ ДЛЯ ЯНДЕКС МЕТРИКИ ==========
    (function() {
        var scrollTargets = [
            { elementId: 'hero', goalId: 'scroll-hero' },
            { elementId: 'steps-section', goalId: 'scroll-steps' },
            { elementId: 'problem', goalId: 'scroll-problem' },
            { elementId: 'how-it-works', goalId: 'scroll-how' },
            { elementId: 'why-us', goalId: 'scroll-why' },
            { elementId: 'pricing', goalId: 'scroll-pricing' },
            { elementId: 'testimonials', goalId: 'scroll-testimonials' },
            { elementId: 'contact-form', goalId: 'scroll-contact-form' },
            { elementId: 'contacts', goalId: 'scroll-contacts' },
            { elementId: 'footer', goalId: 'scroll-footer' }
        ];

        var triggered = {};

        var scrollObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var target = scrollTargets.find(function(t) {
                        return t.elementId === entry.target.dataset.scrollTarget;
                    });
                    if (target && !triggered[target.goalId]) {
                        triggered[target.goalId] = true;
                        ym(109650228, 'reachGoal', target.goalId);
                        scrollObserver.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.7 });

        scrollTargets.forEach(function(target) {
            var element = null;
            if (target.elementId === 'footer') {
                element = document.querySelector('footer');
            } else {
                element = document.getElementById(target.elementId);
                if (!element) {
                    element = document.querySelector('.' + target.elementId);
                }
            }
            if (element) {
                element.dataset.scrollTarget = target.elementId;
                scrollObserver.observe(element);
            }
        });
    })();

});
