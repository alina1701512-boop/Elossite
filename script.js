document.addEventListener('DOMContentLoaded', function() {

    // ========== 1. МЕНЮ (БУРГЕР) ==========
    const burgerMenu = document.getElementById('burgerMenu');
    const slideMenu = document.getElementById('slideMenu');
    const slideMenuOverlay = document.querySelector('.slide-menu__overlay');

    if (burgerMenu && slideMenu) {
        // Открытие/закрытие по клику на бургер
        burgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            slideMenu.classList.toggle('active');
        });

        // Закрытие по клику на overlay
        if (slideMenuOverlay) {
            slideMenuOverlay.addEventListener('click', function() {
                slideMenu.classList.remove('active');
            });
        }

        // Закрытие по клику на ссылку в меню
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
            // Убедимся, что все закрыты по умолчанию
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
                    // Закрываем текущий
                    button.classList.remove('active');
                    button.setAttribute('aria-expanded', 'false');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = null;
                    }
                    currentlyOpen = null;
                } else {
                    // Закрываем все, потом открываем текущий
                    closeAllFaq();
                    openFaq(item);
                }
            });
        }
    });

    // При скролле закрываем все вопросы
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            closeAllFaq();
        }, 150);
    });

    // ========== 3. КНОПКА "ВСЕ ВОПРОСЫ" ==========
    const toggleAllFaq = document.getElementById('toggleAllFaq');
    const showAllButton = document.getElementById('showAllFaqButton');
    const hiddenFaq = document.getElementById('hiddenFaq');

    if (toggleAllFaq && hiddenFaq && showAllButton) {
        // Собираем дополнительные вопросы
        const additionalFaq = document.querySelectorAll('.additional-faq');
        
        toggleAllFaq.addEventListener('click', function() {
            if (hiddenFaq.children.length === 0) {
                // Переносим дополнительные вопросы в hiddenFaq
                additionalFaq.forEach(item => {
                    hiddenFaq.appendChild(item.cloneNode(true));
                    item.remove();
                });
                
                // Добавляем кнопку скрытия
                const hideBtn = document.createElement('div');
                hideBtn.className = 'text-center faq-toggle-wrapper';
                hideBtn.innerHTML = '<button class="btn btn-secondary" id="hideAllFaq"><i class="fas fa-chevron-up"></i> Скрыть вопросы ↑</button>';
                hiddenFaq.appendChild(hideBtn);
                
                // Инициализируем аккордеон для новых вопросов
                const newFaqItems = hiddenFaq.querySelectorAll('.faq-item');
                newFaqItems.forEach(item => {
                    const btn = item.querySelector('.faq-question');
                    if (btn) {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-expanded', 'false');
                        const ans = item.querySelector('.faq-answer');
                        if (ans) ans.style.maxHeight = null;
                        
                        btn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            const isOpen = btn.classList.contains('active');
                            if (isOpen) {
                                btn.classList.remove('active');
                                btn.setAttribute('aria-expanded', 'false');
                                if (ans) ans.style.maxHeight = null;
                            } else {
                                closeAllFaq();
                                btn.classList.add('active');
                                btn.setAttribute('aria-expanded', 'true');
                                if (ans) ans.style.maxHeight = ans.scrollHeight + 'px';
                            }
                        });
                    }
                });
                
                const hideAllFaq = document.getElementById('hideAllFaq');
                if (hideAllFaq) {
                    hideAllFaq.addEventListener('click', function() {
                        hiddenFaq.style.display = 'none';
                        showAllButton.style.display = 'block';
                    });
                }
            }
            hiddenFaq.style.display = 'block';
            showAllButton.style.display = 'none';
        });
    }

    // ========== 4. РАСКРЫВАЮЩИЙСЯ СПИСОК ЦЕН ==========
    const toggleZones = document.getElementById('toggleZones');
    const otherZones = document.getElementById('otherZones');
    if (toggleZones && otherZones) {
        toggleZones.addEventListener('click', function() {
            if (otherZones.style.display === 'none' || getComputedStyle(otherZones).display === 'none') {
                otherZones.style.display = 'block';
                toggleZones.innerHTML = '<i class="fas fa-list"></i> Скрыть другие зоны ↑';
            } else {
                otherZones.style.display = 'none';
                toggleZones.innerHTML = '<i class="fas fa-list"></i> Смотреть все зоны и цены ↓';
            }
        });
    }

    // ========== 5. АНИМАЦИЯ ПРИ СКРОЛЛЕ ==========
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

    // ========== 6. ПОПАПЫ ПРИ УХОДЕ ==========
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

    // ========== 7. СОТЫ (ОТЗЫВЫ) ==========
    const honeycombGrid = document.getElementById('honeycombGrid');
    const honeycombViewport = document.getElementById('honeycombViewport');
    
    if (honeycombGrid && honeycombViewport) {
        const reviews = [
            { stars: '⭐⭐⭐⭐⭐', text: '«Минусов вообще нет! Комфортная обстановка и располагающий мастер!»', author: 'Валерия Р.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Хожу уже год, очень нравится мастер Алина, и цена и качество»', author: 'Инкогнито 7258' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Отличное место, комфортный мастер. Приятные цены и интерьер»', author: 'Поля' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Пришла по рекомендации подруги. Очень волновалась, но всё прошло отлично»', author: 'Эльмира' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Отличная студия, хороший мастер, знающий свою работу»', author: 'Ирэн' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Был на лазерной эпиляции, очень всё понравилось. Персонал классный»', author: 'Максим К.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Хожу теперь только к вам! Приятная и уютная атмосфера»', author: 'Алёна С.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Уютная и комфортная студия, мастера профессионалы своего дела»', author: 'Татьяна Р.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Отличное место, уютная атмосфера, грамотные специалисты»', author: 'Анастасия' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Корректировал бороду, результатом доволен. Парковка бесплатная»', author: 'Искандер Х.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Мастер Алина просто супер! Встретила, всё рассказала, очень чисто»', author: 'Михаил Л.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Очень боялась, но с 1 процедуры волос попадало больше чем у подруг за 2»', author: 'Анастасия Ч.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Благодарю мастера Алину за мужскую эпиляцию и непринуждённое общение»', author: 'Рустам К.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«2 процедуры и ушло уже 30% волос, очень крутой результат»', author: 'Alina' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Спасибо за тёплый приём! Сервис, уют, атмосфера — на высшем уровне!»', author: 'Регишка С.' }
        ];

        const isMobile = window.innerWidth < 768;
        const cellW = isMobile ? 120 : 140;
        const cellH = isMobile ? 120 : 140;
        const cols = isMobile ? 5 : 11;
        const visibleRows = 3;
        const totalVisible = cols * visibleRows;
        const rowOffsetY = cellH * 0.85;

        honeycombGrid.innerHTML = '';

        for (let i = 0; i < Math.min(reviews.length, totalVisible); i++) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const offsetX = (row % 2 === 1) ? cellW / 2 : 0;
            const x = col * cellW + offsetX;
            const y = row * rowOffsetY;
            
            const rev = reviews[i];
            const cell = document.createElement('div');
            cell.className = 'honeycomb-cell';
            cell.addEventListener('click', (e) => {
                e.stopPropagation();
                const wasExpanded = cell.classList.contains('expanded');
                document.querySelectorAll('.honeycomb-cell.expanded').forEach(c => {
                    c.classList.remove('expanded');
                });
                if (!wasExpanded) {
                    cell.classList.add('expanded');
                }
            });
            cell.style.left = x + 'px';
            cell.style.top = y + 'px';
            cell.innerHTML = `<div class="cell-stars">${rev.stars}</div>
                             <div class="cell-text">${rev.text}</div>
                             <div class="cell-author">— ${rev.author}</div>`;
            honeycombGrid.appendChild(cell);
        }

        const gridWidth = cols * cellW;
        const gridHeight = visibleRows * rowOffsetY + cellH * 0.3;
        honeycombGrid.style.width = gridWidth + 'px';
        honeycombGrid.style.height = gridHeight + 'px';
        honeycombGrid.style.transform = 'translate(-50%, -50%)';
        honeycombGrid.style.left = '50%';
        honeycombGrid.style.top = '50%';
        
        let isDragging = false;
        let startX, startY, gridStartX = 0, gridStartY = 0;
        let currentGridX = 0, currentGridY = 0;
        const maxX = isMobile ? cellW * 2 : cellW * 2;
        const minX = -maxX;
        
        function updateGridPosition() {
            const tx = Math.max(minX, Math.min(maxX, currentGridX));
            const ty = Math.max(-20, Math.min(20, currentGridY));
            honeycombGrid.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
        }

        honeycombViewport.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('honeycomb-cell')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            gridStartX = currentGridX;
            gridStartY = currentGridY;
            honeycombViewport.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            currentGridX = gridStartX + dx;
            currentGridY = gridStartY + dy;
            updateGridPosition();
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
            honeycombViewport.style.cursor = 'grab';
        });
    }

    // ========== 8. КАЛЬКУЛЯТОР ==========
    const calcButton = document.getElementById('calcButton');
    const calcMethod = document.getElementById('calcMethod');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const calcMonthly = document.getElementById('calcMonthly');

    if (calcMethod) {
        calcMethod.addEventListener('change', function() {
            if (this.value === 'Эпилятор') {
                monthlyLabel.textContent = 'Сколько стоит эпилятор? (₽)';
                if (calcMonthly) calcMonthly.placeholder = 'Например: 5000';
            } else {
                monthlyLabel.textContent = 'Сколько тратишь в месяц? (₽)';
                if (calcMonthly) calcMonthly.placeholder = 'Например: 500';
            }
        });
    }

    if (calcButton) {
        calcButton.addEventListener('click', function() {
            const method = document.getElementById('calcMethod').value;
            const startAge = parseInt(document.getElementById('calcStartAge').value);
            const currentAge = parseInt(document.getElementById('calcCurrentAge').value);
            const zone = document.getElementById('calcZone').value;
            const monthly = parseInt(document.getElementById('calcMonthly').value);

            if (!method || !startAge || !currentAge || !zone || !monthly) {
                alert('Пожалуйста, заполните все поля!');
                return;
            }

            if (startAge >= currentAge) {
                alert('Возраст начала должен быть меньше текущего возраста');
                return;
            }

            const years = 5;
            let totalMoney, weeklyTime;

            if (method === 'Эпилятор') {
                totalMoney = monthly;
                weeklyTime = 68;
            } else if (method === 'Бритва (станок)') {
                totalMoney = years * 12 * monthly;
                if (zone === '1') weeklyTime = 22;
                else if (zone === '2') weeklyTime = 54;
                else weeklyTime = 58;
            } else if (method === 'Воск / Шугаринг') {
                totalMoney = years * 12 * monthly;
                weeklyTime = 60;
            } else {
                totalMoney = years * 12 * monthly;
                weeklyTime = 45;
            }

            const totalHours = Math.round((years * 52 * weeklyTime) / 60);

            let fullPrice, laserMinutes, dikidiLink;
            if (zone === '1') {
                fullPrice = 2300;
                laserMinutes = 30;
                dikidiLink = 'https://dkd.su/714399/s/8690972';
            } else if (zone === '2') {
                fullPrice = 3500;
                laserMinutes = 60;
                dikidiLink = 'https://dkd.su/714399/s/8690938';
            } else {
                fullPrice = 4400;
                laserMinutes = 80;
                dikidiLink = 'https://dkd.su/714399/s/8690898';
            }

            const firstDiscounted = Math.round(fullPrice * 0.65);
            const totalLaserCost = firstDiscounted + (fullPrice * 23);
            const totalLaserHours = Math.round((laserMinutes * 24) / 60);

            const saveMoney = totalMoney - totalLaserCost;
            let saveText = '';
            if (saveMoney > 0) {
                saveText = `💰 Экономия: ${saveMoney.toLocaleString()} ₽ и ${totalHours - totalLaserHours} часов жизни!`;
            } else {
                saveText = `✨ Лазер окупается комфортом и свободой! За 5 лет вы сэкономите ${Math.abs(saveMoney).toLocaleString()} ₽ и ${totalHours - totalLaserHours} часов.`;
            }

            document.getElementById('calcYears').textContent = years;
            document.getElementById('calcMoney').textContent = totalMoney.toLocaleString() + ' ₽';
            document.getElementById('calcTime').textContent = totalHours.toLocaleString() + ' часов';
            document.getElementById('calcLaserCostTable').textContent = totalLaserCost.toLocaleString() + ' ₽';
            document.getElementById('calcLaserTimeTable').textContent = totalLaserHours + ' часов';
            document.getElementById('calcSave').textContent = saveText;
            document.getElementById('calcResult').style.display = 'block';

            const calcLink = document.getElementById('calcLink');
            if (calcLink && dikidiLink) {
                calcLink.href = dikidiLink;
            }

            document.getElementById('calcResult').scrollIntoView({ behavior: 'smooth' });
        });
    }

});
