(() => {
    const consultationEndpoint = 'https://formsubmit.co/ajax/dkubani9@gmail.com';

    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const open = nav.classList.toggle('is-open');
            menuToggle.setAttribute('aria-expanded', String(open));
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = String(currentYear);
        footerYear.setAttribute('datetime', String(currentYear));
    }

    const slider = document.querySelector('[data-slider]');
    if (slider) {
        const track = slider.querySelector('.slider__track');
        const viewport = slider.querySelector('.slider__viewport');
        const prevBtn = slider.querySelector('[data-prev]');
        const nextBtn = slider.querySelector('[data-next]');
        let index = 0;
        let autoplayId = null;
        let touchStartX = 0;
        let touchStartY = 0;
        const swipeThreshold = 42;
        let slides = [];

        const syncSlides = () => {
            slides = track ? Array.from(track.querySelectorAll('[data-slide]')) : [];
            if (slides.length === 0) {
                index = 0;
                return;
            }
            index = Math.min(index, slides.length - 1);
        };

        const updateControls = () => {
            const disabled = slides.length < 2;
            if (prevBtn) prevBtn.disabled = disabled;
            if (nextBtn) nextBtn.disabled = disabled;
        };

        const render = () => {
            syncSlides();
            if (!track || slides.length === 0) {
                if (track) track.style.transform = 'translateX(0)';
                return;
            }
            track.style.transform = `translateX(-${index * 100}%)`;
            slides.forEach((slide, i) => {
                slide.classList.toggle('is-active', i === index);
            });
        };

        const goTo = (nextIndex) => {
            syncSlides();
            if (slides.length === 0) return;
            index = (nextIndex + slides.length) % slides.length;
            render();
        };

        const stopAutoplay = () => {
            if (autoplayId === null) return;
            clearInterval(autoplayId);
            autoplayId = null;
        };

        const startAutoplay = () => {
            syncSlides();
            if (slides.length < 2) return;
            stopAutoplay();
            autoplayId = setInterval(() => {
                goTo(index + 1);
            }, 5500);
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goTo(index - 1);
                startAutoplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goTo(index + 1);
                startAutoplay();
            });
        }

        const canHover = window.matchMedia('(hover: hover)').matches;
        if (canHover) {
            slider.addEventListener('mouseenter', stopAutoplay);
            slider.addEventListener('mouseleave', startAutoplay);
        }

        if (viewport) {
            viewport.addEventListener('touchstart', (event) => {
                const touch = event.touches[0];
                if (!touch) return;
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                stopAutoplay();
            }, { passive: true });

            viewport.addEventListener('touchend', (event) => {
                const touch = event.changedTouches[0];
                if (!touch) {
                    startAutoplay();
                    return;
                }

                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

                if (isHorizontalSwipe && Math.abs(deltaX) >= swipeThreshold) {
                    goTo(deltaX < 0 ? index + 1 : index - 1);
                }

                startAutoplay();
            }, { passive: true });
        }

        syncSlides();
        updateControls();

        if (track) {
            const observer = new MutationObserver(() => {
                syncSlides();
                if (slides.length < 2) {
                    stopAutoplay();
                } else {
                    startAutoplay();
                }
                updateControls();
                render();
            });
            observer.observe(track, { childList: true });
        }

        render();
        startAutoplay();
    }

    const form = document.getElementById('consultForm');
    if (!form) return;

    const statusNode = form.querySelector('.form__status');
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');

    const setStatus = (message, isError = false) => {
        if (!statusNode) return;
        statusNode.textContent = message;
        statusNode.classList.remove('form__status--ok', 'form__status--error');
        statusNode.classList.add(isError ? 'form__status--error' : 'form__status--ok');
    };

    const validate = (data) => {
        if (!data.name || data.name.trim().length < 2) {
            return 'Введите корректное имя (минимум 2 символа).';
        }

        if (/\d/.test(data.name) || !/^[A-Za-zА-Яа-яЁё\s'-]+$/.test(data.name)) {
            return 'Имя должно содержать только буквы.';
        }

        const digits = (data.phone || '').replace(/\D/g, '');
        if (digits.length !== 11 || !digits.startsWith('7')) {
            return 'Введите корректный номер телефона.';
        }

        if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            return 'Проверьте формат email.';
        }

        if (!data.privacyConsent) {
            return 'Подтвердите согласие с политикой конфиденциальности.';
        }

        return '';
    };

    if (nameInput) {
        nameInput.addEventListener('input', () => {
            nameInput.value = nameInput.value.replace(/[0-9]/g, '');
        });
    }

    const formatPhone = (value) => {
        let digits = String(value || '').replace(/\D/g, '');
        if (!digits) return '';

        if (digits.startsWith('8')) {
            digits = `7${digits.slice(1)}`;
        } else if (!digits.startsWith('7')) {
            digits = `7${digits}`;
        }

        digits = digits.slice(0, 11);

        const code = digits.slice(1, 4);
        const part1 = digits.slice(4, 7);
        const part2 = digits.slice(7, 9);
        const part3 = digits.slice(9, 11);

        let formatted = '+7';
        if (code.length) formatted += ` (${code}`;
        if (code.length === 3) formatted += ')';
        if (part1.length) formatted += ` ${part1}`;
        if (part2.length) formatted += `-${part2}`;
        if (part3.length) formatted += `-${part3}`;

        return formatted;
    };

    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            phoneInput.value = formatPhone(phoneInput.value);
        });

        phoneInput.addEventListener('focus', () => {
            if (!phoneInput.value.trim()) {
                phoneInput.value = '+7 (';
            }
        });

        phoneInput.addEventListener('blur', () => {
            const digits = phoneInput.value.replace(/\D/g, '');
            if (digits.length <= 1) {
                phoneInput.value = '';
            }
        });

        phoneInput.value = formatPhone(phoneInput.value);
    }

    form.addEventListener('submit', async(event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            name: String(formData.get('name') || '').trim(),
            phone: String(formData.get('phone') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            privacyConsent: formData.get('privacyConsent') === 'on'
        };

        const error = validate(data);
        if (error) {
            setStatus(error, true);
            return;
        }

        setStatus('Отправка...');

        try {
            const payload = {
                name: data.name,
                phone: data.phone,
                email: data.email,
                privacyConsent: data.privacyConsent ? 'Подтверждено' : 'Не подтверждено',
                _subject: 'Новая заявка с сайта ДарыКубани',
                _template: 'table',
                _captcha: 'false'
            };

            if (data.email) {
                payload._replyto = data.email;
            }

            const response = await fetch(consultationEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok || String(result.success) === 'false') {
                throw new Error(result.message || 'request_failed');
            }

            setStatus('Спасибо! Мы свяжемся с вами в ближайшее время.');
            form.reset();
        } catch (error) {
            const message = error instanceof Error ? error.message : '';
            if (message.toLowerCase().includes('web server')) {
                setStatus('Форму нужно открыть через сервер (например Live Server), а не как file://.', true);
                return;
            }

            setStatus('Не удалось отправить заявку. Попробуйте еще раз.', true);
        }
    });
})();