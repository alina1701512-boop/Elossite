// 📝 Изменено: 2026-06-06 / Соты: 3 отзыва перенесены вниз + уменьшена высота грида на мобильных
document.addEventListener('DOMContentLoaded', function() {
// --- 0. Новое меню (выдвижное справа) ---
    var burgerMenu = document.getElementById('burgerMenu');
    var slideMenu = document.getElementById('slideMenu');
    var slideMenuClose = document.getElementById('slideMenuClose');
    var slideMenuOverlay = slideMenu ? slideMenu.querySelector('.slide-menu__overlay') : null;

    if (burgerMenu && slideMenu) {
        burgerMenu.addEventListener('click', function() {
            slideMenu.classList.add('active');
        });

        if (slideMenuClose) {
            slideMenuClose.addEventListener('click', function() {
                slideMenu.classList.remove('active');
            });
        }

        if (slideMenuOverlay) {
            slideMenuOverlay.addEventListener('click', function() {
                slideMenu.classList.remove('active');
            });
        }

        // Закрытие по клику на ссылку
        slideMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                slideMenu.classList.remove('active');
            });
        });
    }
    
// --- 2. FAQ: Плавный ховер ---
    var faqItems = document.querySelectorAll('.faq-item');
    var hoverTimeout;
    var leaveTimeout;

    faqItems.forEach(function(item) {
        var question = item.querySelector('.faq-question');
        if (!question) return;

        item.addEventListener('mouseenter', function() {
            clearTimeout(leaveTimeout);
            hoverTimeout = setTimeout(function() {
                document.querySelectorAll('.faq-question').forEach(function(q) {
                    q.setAttribute('aria-expanded', 'false');
                });
                question.setAttribute('aria-expanded', 'true');
            }, 200);
        });

        item.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimeout);
            leaveTimeout = setTimeout(function() {
                question.setAttribute('aria-expanded', 'false');
            }, 300);
        });
    });

    // --- 3. FAQ: Клик ---
    var faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function(e) {
            clearTimeout(hoverTimeout);
            clearTimeout(leaveTimeout);
            var isExpanded = this.getAttribute('aria-expanded') === 'true';
            faqQuestions.forEach(function(q) {
                q.setAttribute('aria-expanded', 'false');
            });
            if (!isExpanded) {
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- 4. Кнопки "Смотреть все" и "Скрыть" ---
    var hiddenFaq = document.getElementById('hiddenFaq');
    var toggleAllFaq = document.getElementById('toggleAllFaq');
    var hideAllFaq = document.getElementById('hideAllFaq');
    var showAllButton = document.getElementById('showAllFaqButton');

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
    var toggleZones = document.getElementById('toggleZones');
    var otherZones = document.getElementById('otherZones');
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
    var fadeSections = document.querySelectorAll('.fade-in-section');
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
    fadeSections.forEach(function(section) {
        observer.observe(section);
    });

    // --- 7. Попап при уходе (С ТАЙМЕРОМ 30 СЕКУНД МЕЖДУ ПОПАПАМИ) ---
    var exitPopup1 = document.getElementById('exitPopup1');
    var exitPopup2 = document.getElementById('exitPopup2');
    var popup1Shown = false;
    var popup2Shown = false;
    var timerActive = false;
    var timerStartTime = null;
    var popup2Ready = false;

    function isTimerFinished() {
        if (!timerActive) return true;
        if (!timerStartTime) return true;
        var now = Date.now();
        var diffSeconds = (now - timerStartTime) / 1000;
        return diffSeconds >= 30;
    }

    function checkAndShowPopup() {
        if (!popup1Shown && exitPopup1) {
            exitPopup1.classList.add('visible');
            popup1Shown = true;
            timerActive = true;
            timerStartTime = Date.now();
            popup2Ready = false;
            setTimeout(function() {
                timerActive = false;
                popup2Ready = true;
            }, 30000);
            return true;
        }
        if (popup1Shown && !popup2Shown && exitPopup2) {
            if (timerActive) return false;
            if (popup2Ready || !timerActive) {
                exitPopup2.classList.add('visible');
                popup2Shown = true;
                return true;
            }
        }
        return false;
    }

    if (exitPopup1 && exitPopup2) {
        document.addEventListener('mouseout', function(e) {
            if (e.clientY < 10 && e.relatedTarget === null) {
                checkAndShowPopup();
            }
        });
    }

    document.querySelectorAll('.exit-popup-overlay').forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('visible');
            }
        });
    });

    document.querySelectorAll('.exit-popup-close').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var popup = this.closest('.exit-popup-overlay');
            if (popup) popup.classList.remove('visible');
        });
    });

    document.querySelectorAll('.close-popup-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var popup = this.closest('.exit-popup-overlay');
            if (popup) popup.classList.remove('visible');
        });
    });
    // --- 7.5. Сотовая сетка отзывов v3 ---
    var honeycombGrid = document.getElementById('honeycombGrid');
    var honeycombViewport = document.getElementById('honeycombViewport');
    
    if (honeycombGrid && honeycombViewport) {
        var reviews = [
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
            { stars: '⭐⭐⭐⭐⭐', text: '«Спасибо за тёплый приём! Сервис, уют, атмосфера — на высшем уровне!»', author: 'Регишка С.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Делала процедуру впервые и ужасно боялась. Но всё прошло замечательно!»', author: 'Екатерина П.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Прошла курс в этой студии, этим летом я как младенец без растительности»', author: 'Татьяна А.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Очень понравился персонал, все вежливые. Рада, что выбрала эту студию»', author: 'Мария Р.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Была у мастера Ирины. Очень понравилось, спасибо за внимательность!»', author: 'Аня С.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Девчата вы лучшие, за красотой только к вам! Рекомендую всем!»', author: 'Наталья Г.' },
            { stars: '⭐⭐⭐⭐⭐', text: '«Отличный салон, всегда приятная обстановка и лучший результат»', author: 'Иринка К.' }
        ];

        var isMobile = window.innerWidth < 768;
var cellW = isMobile ? 150 : 155;
var cellH = isMobile ? 150 : 155;
var cols = isMobile ? 5 : 11;
        var visibleRows = 3;
        var totalVisible = cols * visibleRows;
        var rowOffsetY = cellH * 0.85;

        honeycombGrid.innerHTML = '';

        for (var i = 0; i < Math.min(reviews.length, totalVisible); i++) {
            var row = Math.floor(i / cols);
            var col = i % cols;
            var offsetX = (row % 2 === 1) ? cellW / 2 : 0;
            var x = col * cellW + offsetX;
            var y = row * rowOffsetY;
            
            var rev = reviews[i];
            var cell = document.createElement('div');
            cell.className = 'honeycomb-cell';
            cell.addEventListener('click', function(e) {
                e.stopPropagation();
                var wasExpanded = this.classList.contains('expanded');
                document.querySelectorAll('.honeycomb-cell.expanded').forEach(function(c) {
                    c.classList.remove('expanded');
                });
                if (!wasExpanded) {
                    this.classList.add('expanded');
                }
            });
            cell.style.left = x + 'px';
            cell.style.top = y + 'px';
            cell.innerHTML = '<div class="cell-stars">' + rev.stars + '</div>' +
                             '<div class="cell-text">' + rev.text + '</div>' +
                             '<div class="cell-author">— ' + rev.author + '</div>';
            honeycombGrid.appendChild(cell);
        }

       // СТАЛО
var gridWidth = cols * cellW;
var gridHeight = visibleRows * rowOffsetY + cellH * 0.3;
honeycombGrid.style.width = gridWidth + 'px';
honeycombGrid.style.height = gridHeight + 'px';
honeycombGrid.style.transform = 'translate(-50%, -50%)';
honeycombGrid.style.left = '50%';
honeycombGrid.style.top = '50%';
var isDragging = false;
var startX, startY;
var currentGridX = isMobile ? 0 : 50, currentGridY = 0;
var maxX = isMobile ? cellW * 3 : cellW * 2;
var minX = -maxX;

function updateGridPosition() {
    var tx = Math.max(minX, Math.min(maxX, currentGridX));
    var ty = Math.max(-10, Math.min(10, currentGridY));
    honeycombGrid.style.transform = 'translate(calc(-50% + ' + tx + 'px), calc(-50% + ' + ty + 'px))';
}

        honeycombViewport.addEventListener('mousedown', function(e) {
            if (e.target.classList.contains('honeycomb-cell')) return;
            document.querySelectorAll('.honeycomb-cell.expanded').forEach(function(c) {
                c.classList.remove('expanded');
            });
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            honeycombViewport.style.cursor = 'grabbing';
            e.preventDefault();
        });

        window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            var dx = e.clientX - startX;
            var dy = e.clientY - startY;
            currentGridX = gridStartX + dx;
            currentGridY = gridStartY + dy;
            updateGridPosition();
        });

        window.addEventListener('mouseup', function() {
            isDragging = false;
            honeycombViewport.style.cursor = 'grab';
        });

        honeycombViewport.addEventListener('touchstart', function(e) {
            if (e.target.classList.contains('honeycomb-cell')) return;
            if (e.touches.length === 1) {
                isDragging = true;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }
        }, { passive: false });

        honeycombViewport.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            var dx = e.touches[0].clientX - startX;
            var dy = e.touches[0].clientY - startY;
            if (Math.abs(dx) > Math.abs(dy)) {
                e.preventDefault();
            }
            currentGridX = gridStartX + dx;
            currentGridY = gridStartY + dy;
            updateGridPosition();
        }, { passive: false });

        honeycombViewport.addEventListener('touchend', function() {
            isDragging = false;
        });
    }
    
// --- 8. Калькулятор (5 лет, 24 процедуры) ---
    var calcButton = document.getElementById('calcButton');
    var calcMethod = document.getElementById('calcMethod');
    var monthlyLabel = document.getElementById('monthlyLabel');
    var calcMonthly = document.getElementById('calcMonthly');

    // Меняем подпись поля при выборе эпилятора
    if (calcMethod) {
        calcMethod.addEventListener('change', function() {
            if (this.value === 'Эпилятор') {
                monthlyLabel.textContent = 'Сколько стоит эпилятор?';
                calcMonthly.placeholder = 'Например: 5000';
            } else {
                monthlyLabel.textContent = 'Сколько тратишь в месяц? (₽)';
                calcMonthly.placeholder = 'Например: 500';
            }
        });
    }

    if (calcButton) {
        calcButton.addEventListener('click', function() {
            var method = document.getElementById('calcMethod').value;
            var startAge = parseInt(document.getElementById('calcStartAge').value);
            var currentAge = parseInt(document.getElementById('calcCurrentAge').value);
            var zone = document.getElementById('calcZone').value;
            var monthly = parseInt(document.getElementById('calcMonthly').value);

            if (!method || !startAge || !currentAge || !zone || !monthly) {
                alert('Пожалуйста, заполните все поля!');
                return;
            }

            if (startAge >= currentAge) {
                alert('Возраст начала должен быть меньше текущего возраста');
                return;
            }

            var years = 5;
            var totalMoney, weeklyTime;

            if (method === 'Эпилятор') {
                totalMoney = monthly;
                weeklyTime = 68;
            } else if (method === 'Бритва (станок)') {
                totalMoney = years * 12 * monthly;
                if (zone === '1') {
                    weeklyTime = 22;
                } else if (zone === '2') {
                    weeklyTime = 54;
                } else {
                    weeklyTime = 58;
                }
            } else if (method === 'Воск / Шугаринг') {
                totalMoney = years * 12 * monthly;
                weeklyTime = 60;
            } else if (method === 'Крем для депиляции') {
                totalMoney = years * 12 * monthly;
                weeklyTime = 45;
            } else {
                totalMoney = years * 12 * monthly;
                weeklyTime = 30;
            }

            var totalMinutes = years * 52 * weeklyTime;
            var totalHours = Math.round(totalMinutes / 60);

            var fullPrice, laserMinutes, dikidiLink;
            if (zone === '1') {
                fullPrice = 2300;
                laserMinutes = 30;
                dikidiLink = 'https://dkd.su/714399/s/8690972';
            } else if (zone === '2') {
                fullPrice = 3500;
                laserMinutes = 60;
                dikidiLink = 'https://dkd.su/714399/s/8690938';
            } else if (zone === '3') {
                fullPrice = 4400;
                laserMinutes = 80;
                dikidiLink = 'https://dkd.su/714399/s/8690898';
            }

            var firstDiscounted = Math.round(fullPrice * 0.65);
            var totalLaserProcedures = 24;
            var totalLaserCost = firstDiscounted + (fullPrice * (totalLaserProcedures - 1));
            var totalLaserMinutes = laserMinutes * totalLaserProcedures;
            var totalLaserHours = Math.round(totalLaserMinutes / 60);

            var saveMoney = totalMoney - totalLaserCost;
            var saveText = '';
            var savedHours = totalHours - totalLaserHours;
            if (savedHours < 0) savedHours = 0;

            if (saveMoney > 5000) {
                saveText = 'Экономия: ' + saveMoney.toLocaleString() + ' ₽ и ' + savedHours + ' часов жизни!';
            } else if (saveMoney > 0) {
                saveText = 'Экономия: ' + saveMoney.toLocaleString() + ' ₽. Даже небольшая выгода — это приятно!';
            } else {
                var methodText = '';
                if (method === 'Бритва (станок)') {
                    methodText = 'с бритвой в руках';
                } else if (method === 'Воск / Шугаринг') {
                    methodText = 'в кабинете косметолога, терпя боль и отращивая волосы';
                } else if (method === 'Эпилятор') {
                    methodText = 'с эпилятором в руках, превозмогая боль и борясь с вросшими волосами';
                } else if (method === 'Крем для депиляции') {
                    methodText = 'на химическую депиляцию с её запахом и риском ожогов';
                }
                saveText = 'Да, лазер стоит своих денег. Но за 5 лет ты провела ' + totalHours + ' часов ' + methodText + '. Лазер — это всего ' + totalLaserHours + ' часов за 5 лет и свобода от щетины.';
            }

            // Обновляем текст на странице
            document.getElementById('calcYears').textContent = years;
            document.getElementById('calcMoney').textContent = totalMoney.toLocaleString() + ' ₽';
            document.getElementById('calcTime').textContent = totalHours.toLocaleString() + ' часов';
            document.getElementById('calcLaserCostTable').textContent = totalLaserCost.toLocaleString() + ' ₽';
document.getElementById('calcLaserTimeTable').textContent = totalLaserHours + ' часов';
            document.getElementById('calcSave').textContent = saveText;
            document.getElementById('calcResult').style.display = 'block';

            // Обновляем ссылку на запись
            var calcLink = document.getElementById('calcLink');
            if (calcLink && dikidiLink) {
                calcLink.href = dikidiLink;
            }

            document.getElementById('calcResult').scrollIntoView({ behavior: 'smooth' });
        });
    }

});
