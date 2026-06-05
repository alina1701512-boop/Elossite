// 📝 Изменено: 2026-06-05 / Таймер 30 сек между попапами + 24 процедуры в калькуляторе
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Мобильное меню ---
    var burgerMenu = document.getElementById('burgerMenu');
    var mainNav = document.getElementById('mainNav');
    if (burgerMenu && mainNav) {
        burgerMenu.addEventListener('click', function() {
            var isOpen = mainNav.classList.toggle('active');
            burgerMenu.setAttribute('aria-expanded', isOpen);
        });
        mainNav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                burgerMenu.setAttribute('aria-expanded', 'false');
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
            if (timerActive) {
                return false;
            }

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
            if (popup) {
                popup.classList.remove('visible');
            }
        });
    });

    document.querySelectorAll('.close-popup-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var popup = this.closest('.exit-popup-overlay');
            if (popup) {
                popup.classList.remove('visible');
            }
        });
    });

    // --- 8. Калькулятор (5 лет, 24 процедуры) ---
    var calcButton = document.getElementById('calcButton');
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
            var totalMoney = years * 12 * monthly;
            var weeklyTime = 30;
            var totalMinutes = years * 52 * weeklyTime;
            var totalHours = Math.round(totalMinutes / 60);

            var fullPrice, laserMinutes;
            if (zone === '1') {
                fullPrice = 2300;
                laserMinutes = 30;
            } else if (zone === '2') {
                fullPrice = 3500;
                laserMinutes = 60;
            } else if (zone === '3') {
                fullPrice = 4400;
                laserMinutes = 80;
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
                saveText = '🎉 Экономия: ' + saveMoney.toLocaleString() + ' ₽ и ' + savedHours + ' часов жизни!';
            } else if (saveMoney > 0) {
                saveText = '👍 Экономия: ' + saveMoney.toLocaleString() + ' ₽. Даже небольшая выгода — это приятно!';
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
                saveText = '💡 Да, лазер стоит своих денег. Но за 5 лет ты провела ' + totalHours + ' часов ' + methodText + '. Лазер — это всего ' + totalLaserHours + ' часов за 5 лет и свобода от щетины.';
            }

            document.getElementById('calcYears').textContent = years;
            document.getElementById('calcMoney').textContent = totalMoney.toLocaleString() + ' ₽';
            document.getElementById('calcTime').textContent = totalHours.toLocaleString() + ' часов';
            document.getElementById('calcLaserCost').textContent = totalLaserCost.toLocaleString() + ' ₽';
            document.getElementById('calcLaserTime').textContent = 'займёт всего ' + totalLaserHours + ' часов (' + totalLaserProcedures + ' процедур за 5 лет)';
            document.getElementById('calcSave').textContent = saveText;
            document.getElementById('calcResult').style.display = 'block';

            document.getElementById('calcResult').scrollIntoView({ behavior: 'smooth' });
        });
    }

});
