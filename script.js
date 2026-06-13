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

    // ========== 3. АНИМАЦИЯ ПРИ СКРОЛЛЕ ==========
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

    // ========== 4. ПОПАПЫ ПРИ УХОДЕ ==========
    let popup1Shown = false;
    let popup2Shown = false;
    let timerActive = false;
    let timerStart = null;
    
    function showPopup(popup) {
        if (popup) popup.classList.add('visible');
    }
    
    function checkAndShowPopup() {
        const popup1 = document.getElementById('exitPopup1');
        const popup2 = document.getElementById('exitPopup2');
        
        if (!popup1Shown && popup1) {
            showPopup(popup1);
            popup1Shown = true;
            timerActive = true;
            timerStart = Date.now();
            setTimeout(() => {
                timerActive = false;
            }, 30000);
            return true;
        }
        
        if (popup1Shown && !popup2Shown && popup2 && !timerActive) {
            showPopup(popup2);
            popup2Shown = true;
            return true;
        }
        return false;
    }
    
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0) {
            checkAndShowPopup();
        }
    });
    
    document.querySelectorAll('.exit-popup-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
            }
        });
    });
    
    document.querySelectorAll('.exit-popup-close, .close-popup-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const popup = btn.closest('.exit-popup-overlay');
            if (popup) popup.classList.remove('visible');
        });
    });

// ========== ОТЗЫВЫ (реальные имена, возраст, город) ==========
const reviewsGrid = document.getElementById('reviewsGrid');

if (reviewsGrid) {
    const reviews = [
        { stars: '5.0', text: 'Минусов вообще нет! Комфортная обстановка и располагающий мастер!', author: 'Валерия, 31 год, Казань' },
        { stars: '5.0', text: 'Хожу уже год, очень нравится мастер Алина, и цена и качество', author: 'Анастасия, 29 лет, Казань' },
        { stars: '5.0', text: 'Отличное место, комфортный мастер. Приятные цены и интерьер', author: 'Полина, 34 года, Казань' },
        { stars: '5.0', text: 'Пришла по рекомендации подруги. Очень волновалась, но всё прошло отлично', author: 'Эльмира, 26 лет, Казань' },
        { stars: '5.0', text: 'Отличная студия, хороший мастер, знающий свою работу', author: 'Ирина, 42 года, Казань' },
        { stars: '5.0', text: 'Был на лазерной эпиляции, очень всё понравилось. Персонал классный', author: 'Максим, 35 лет, Казань' },
        { stars: '5.0', text: 'Хожу теперь только к вам! Приятная и уютная атмосфера', author: 'Алёна, 28 лет, Казань' },
        { stars: '5.0', text: 'Уютная и комфортная студия, мастера профессионалы своего дела', author: 'Татьяна, 37 лет, Казань' },
        { stars: '5.0', text: 'Корректировал бороду, результатом доволен. Парковка бесплатная', author: 'Искандер, 33 года, Казань' },
        { stars: '5.0', text: 'Мастер Алина просто супер! Встретила, всё рассказала, очень чисто', author: 'Михаил, 29 лет, Казань' },
        { stars: '5.0', text: 'Очень боялась, но с 1 процедуры волос попадало больше чем у подруг за 2', author: 'Анастасия, 25 лет, Казань' },
        { stars: '5.0', text: 'Благодарю мастера Алину за мужскую эпиляцию и непринуждённое общение', author: 'Рустам, 38 лет, Казань' },
        { stars: '5.0', text: '2 процедуры и ушло уже 30% волос, очень крутой результат', author: 'Алина, 27 лет, Казань' },
        { stars: '5.0', text: 'Спасибо за тёплый приём! Сервис, уют, атмосфера — на высшем уровне!', author: 'Регина, 30 лет, Казань' },
        { stars: '5.0', text: 'Делаю здесь подмышки и бикини. Результат отличный, буду ходить дальше', author: 'Екатерина, 32 года, Казань' }
    ];

    reviewsGrid.innerHTML = '';
    
    reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card fade-in-section';
        card.innerHTML = `
            <div class="review-stars">
                <i class="fas fa-star" style="color: #FFB800;"></i>
                <i class="fas fa-star" style="color: #FFB800;"></i>
                <i class="fas fa-star" style="color: #FFB800;"></i>
                <i class="fas fa-star" style="color: #FFB800;"></i>
                <i class="fas fa-star" style="color: #FFB800;"></i>
                <span style="margin-left: 8px; font-weight: 600;">${review.stars}</span>
            </div>
            <div class="review-text">“${review.text}”</div>
            <div class="review-author">— ${review.author}</div>
        `;
        reviewsGrid.appendChild(card);
    });
}

// ========== ОДИН EXIT-ПОПАП ==========
let popupShown = false;

function showExitPopup() {
    if (popupShown) return;
    const popup = document.getElementById('exitPopup');
    if (popup) {
        popup.classList.add('visible');
        popupShown = true;
    }
}

document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0) {
        showExitPopup();
    }
});

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
        
        // Повторно применяем анимацию к новым элементам
        const newFadeElements = reviewsGrid.querySelectorAll('.fade-in-section');
        newFadeElements.forEach(el => observer.observe(el));
    }

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
                
                // Закрываем меню, если оно открыто
                if (slideMenu && slideMenu.classList.contains('active')) {
                    slideMenu.classList.remove('active');
                }
            }
        });
    });

    // ========== 7. ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ НА ССЫЛКУ В ДЕСКТОПНОМ МЕНЮ ==========
    const desktopNavLinks = document.querySelectorAll('.main-nav a');
    desktopNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Для десктопного меню просто скроллим (бургера нет)
        });
    });
});
