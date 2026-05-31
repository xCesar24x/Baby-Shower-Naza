function startApp() {

    /* ==========================================================================
       1. STATE & GLOBAL VARIABLES
       ========================================================================== */
    const WHATSAPP_NUMBER = '50662157329'; // Destinatario: Shahnon y David
    let isMusicPlaying = false;
    let selectedAttendance = 'si'; // Default is attending

    // Elements
    const audio = document.getElementById('bgAudio');
    const musicToggleBtn = document.getElementById('musicToggle');
    const glassContainer = document.getElementById('glassContainer');
    
    // Step Sections
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');

    // Interactive Buttons & Inputs
    const btnGoToForm = document.getElementById('btnGoToForm');
    const btnBackToWelcome = document.getElementById('btnBackToWelcome');
    const btnSubmitRSVP = document.getElementById('btnSubmitRSVP');
    const btnResendWhatsApp = document.getElementById('btnResendWhatsApp');
    const btnRestart = document.getElementById('btnRestart');
    
    const btnAttending = document.getElementById('btnAttending');
    const btnNotAttending = document.getElementById('btnNotAttending');
    const conditionalFields = document.getElementById('conditionalFields');
    
    const rsvpForm = document.getElementById('rsvpForm');
    const guestNameInput = document.getElementById('guestName');
    const adultCountSelect = document.getElementById('adultCount');
    const childCountSelect = document.getElementById('childCount');
    const guestMessageTextarea = document.getElementById('guestMessage');

    // Thank You Display Elements
    const thankYouName = document.getElementById('thankYouName');
    const thankYouMessage = document.getElementById('thankYouMessage');
    const summaryStatus = document.getElementById('summaryStatus');
    const summaryCompanions = document.getElementById('summaryCompanions');
    const summaryCompanionsRow = document.getElementById('summaryCompanionsRow');

    // Saved formatted WhatsApp URL to allow resending
    let formattedWhatsAppUrl = '';

    // Play/Pause icon toggling
    audio.volume = 0.35; // Soft premium background volume

    /* ==========================================================================
       2. AMBIENT MUSIC PLAYER LOGIC
       ========================================================================== */
    // Sync UI with actual audio playback state automatically
    audio.addEventListener('play', () => {
        musicToggleBtn.classList.add('playing');
        isMusicPlaying = true;
    });

    audio.addEventListener('pause', () => {
        musicToggleBtn.classList.remove('playing');
        isMusicPlaying = false;
    });

    function toggleMusic() {
        if (audio.paused) {
            audio.play().catch(err => {
                console.log("Error al reproducir audio: ", err);
            });
        } else {
            audio.pause();
        }
    }

    musicToggleBtn.addEventListener('click', toggleMusic);

    // Auto-play trigger on first click/touch anywhere on the page (browser safety policies)
    function autoPlayOnFirstInteraction() {
        if (audio.paused) {
            audio.play().catch(err => {
                console.log("Error al reproducir audio al interactuar: ", err);
            });
        }
        document.removeEventListener('click', autoPlayOnFirstInteraction);
        document.removeEventListener('touchstart', autoPlayOnFirstInteraction);
    }
    
    document.addEventListener('click', autoPlayOnFirstInteraction);
    document.addEventListener('touchstart', autoPlayOnFirstInteraction);

    /* ==========================================================================
       3. GSAP ADVANCED TRANSITION MECHANICS
       ========================================================================== */
    
    // Initial entrance animations for welcome page
    function initWelcomeAnimations() {
        gsap.killTweensOf([step1.children, step2.children, step3.children]);
        
        // Reset display states cleanly
        step1.style.display = 'block';
        step1.classList.add('active');
        step2.style.display = 'none';
        step2.classList.remove('active');
        step3.style.display = 'none';
        step3.classList.remove('active');

        // Clear any GSAP inline styles set on parent wrappers
        gsap.set([step1, step2, step3], { clearProps: 'all' });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo('.hero-image-wrapper', { scale: 0.5, opacity: 0, y: -20 }, { scale: 1, opacity: 1, y: 0, duration: 1.2, ease: 'elastic.out(1, 0.75)' })
          .fromTo('.event-title-badge', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, '-=0.8')
          .fromTo('.main-heading', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
          .fromTo('.lead-text', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
          .fromTo('.love-message-box', { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 }, '-=0.5')
          .fromTo('#btnGoToForm', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, '-=0.4');
    }

    // Dynamic Height transitions for a luxurious native app feel
    function transitionToStep(fromStep, toStep, onCompleteCallback) {
        // Record starting height of container
        const startHeight = glassContainer.offsetHeight;

        // Animate elements fading out in old step
        gsap.to(fromStep.children, {
            opacity: 0,
            y: -15,
            duration: 0.35,
            stagger: 0.05,
            ease: 'power2.in',
            onComplete: () => {
                fromStep.classList.remove('active');
                fromStep.style.display = 'none';

                // Setup the new step
                toStep.style.display = 'block';
                toStep.classList.add('active');
                
                // Animate elements internally in new step but set transparent first
                gsap.set(toStep.children, { opacity: 0, y: 15 });
                
                // Get target height of container
                const targetHeight = glassContainer.offsetHeight;

                // Animate container height using GSAP
                gsap.fromTo(glassContainer, 
                    { height: startHeight }, 
                    { 
                        height: targetHeight, 
                        duration: 0.6, 
                        ease: 'power3.inOut',
                        clearProps: 'height', // Clear inline height for responsiveness afterwards
                        onComplete: () => {
                            if (onCompleteCallback) onCompleteCallback();
                            
                            // Animate new elements fading in beautifully
                            gsap.to(toStep.children, {
                                opacity: 1,
                                y: 0,
                                duration: 0.65,
                                stagger: 0.08,
                                ease: 'power3.out'
                            });
                        }
                    }
                );
            }
        });
    }

    // Step 1 -> Step 2
    btnGoToForm.addEventListener('click', () => {
        transitionToStep(step1, step2, () => {
            // Animate dynamic elements inside Details Step
            gsap.from('.detail-card', {
                scale: 0.9,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'elastic.out(1, 0.75)'
            });
        });
    });

    // Step 2 -> Step 1
    btnBackToWelcome.addEventListener('click', () => {
        transitionToStep(step2, step1, () => {
            initWelcomeAnimations();
        });
    });

    /* ==========================================================================
       4. RSVP FORM INTERACTIVE LOGIC & CONDITIONAL FIELDS
       ========================================================================== */
    
    // Attending Button Click
    btnAttending.addEventListener('click', () => {
        selectedAttendance = 'si';
        btnAttending.classList.add('active');
        btnNotAttending.classList.remove('active');
        
        // Show conditional fields with GSAP
        conditionalFields.classList.add('show');
        gsap.to(conditionalFields, {
            maxHeight: 250,
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out'
        });
    });

    // Not Attending Button Click
    btnNotAttending.addEventListener('click', () => {
        selectedAttendance = 'no';
        btnNotAttending.classList.add('active');
        btnAttending.classList.remove('active');

        // Hide conditional fields with GSAP
        gsap.to(conditionalFields, {
            maxHeight: 0,
            opacity: 0,
            y: -10,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                conditionalFields.classList.remove('show');
            }
        });
    });

    /* ==========================================================================
       5. CELEBRATION EFFECTS (Canvas-Confetti)
       ========================================================================== */
    function launchCelebrationConfetti() {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 360, ticks: 60, zIndex: 1000 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // Premium Girly Palette: pink, deep rose, peach, gold, and white
            const customColors = ['#E094A8', '#D84F71', '#FDE6D9', '#B99863', '#FAF7F2'];

            // Burst left
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: customColors
            }));
            
            // Burst right
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: customColors
            }));
        }, 250);
    }

    /* ==========================================================================
       6. WHATSAPP INTEGRATION & FORM SUBMISSION
       ========================================================================== */
    
    // Formatting and redirecting logic
    function handleSubmit(e) {
        if (e) e.preventDefault();

        const guestName = guestNameInput.value.trim();
        if (!guestName) {
            // High level custom dynamic border error
            gsap.to(guestNameInput, {
                borderColor: '#D84F71',
                x: -5,
                duration: 0.1,
                repeat: 5,
                yoyo: true,
                onComplete: () => {
                    guestNameInput.style.borderColor = '';
                }
            });
            guestNameInput.focus();
            return false;
        }

        const adults = adultCountSelect.value;
        const children = childCountSelect.value;
        const message = guestMessageTextarea.value.trim();

        // Build WhatsApp Custom Message with Rich Styling
        let messageText = `¡Hola Shahnon y David! 🌸☕\n`;
        
        if (selectedAttendance === 'si') {
            messageText += `Confirmo con mucha alegría mi asistencia a la Tarde de Café de la pequeña *Nazareth* 🦋✨\n\n`;
            messageText += `*Detalles de Confirmación:*\n`;
            messageText += `👤 *Invitado:* ${guestName}\n`;
            messageText += `✅ *Asistencia:* ¡Sí, con amor estaré ahí! ☕🌸\n`;
            messageText += `👥 *Acompañantes Adultos:* ${adults}\n`;
            if (parseInt(children) > 0) {
                messageText += `👶 *Acompañantes Niños:* ${children}\n`;
            } else {
                messageText += `👶 *Niños:* Ninguno\n`;
            }
        } else {
            messageText += `Quería comentarles que no podré asistir a la Tarde de Café de *Nazareth*, pero les envío a ustedes y a la bebé todo mi amor y mejores deseos ✨🤍\n\n`;
            messageText += `*Detalles:*\n`;
            messageText += `👤 *De:* ${guestName}\n`;
            messageText += `❌ *Asistencia:* No podré asistir, pero les acompaño de corazón.\n`;
        }

        if (message) {
            messageText += `\n✍️ *Mensaje para ustedes y Nazareth:* "${message}"\n`;
        }

        messageText += `\n*¡Qué emoción acompañarles en esta dulce espera!* ☕🦋🌸`;

        // Encode URI
        const encodedText = encodeURIComponent(messageText);
        formattedWhatsAppUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;

        // Populate Thank you screen text dynamically
        thankYouName.textContent = guestName;
        
        if (selectedAttendance === 'si') {
            thankYouMessage.innerHTML = `Tu amor y buenos deseos ya están abrigando el corazón de Shahnon y David, y preparando una dulce bienvenida para la pequeña <strong>Nazareth</strong>. ¡Nos vemos en esta hermosa tarde de café!`;
            summaryStatus.textContent = '¡Confirmado con Amor! 🌸☕';
            summaryStatus.className = 'summary-value text-green font-title';
            summaryCompanionsRow.style.display = 'flex';
            
            let companionSummary = `${adults} Adulto${adults !== '1' ? 's' : ''}`;
            if (parseInt(children) > 0) {
                companionSummary += ` y ${children} Niño${children !== '1' ? 's' : ''}`;
            }
            summaryCompanions.textContent = companionSummary;
        } else {
            thankYouMessage.innerHTML = `Gracias por enviar tus hermosas palabras de cariño. Aunque no puedas asistir físicamente, tu amor ya abriga a Shahnon y David, y a la pequeña <strong>Nazareth</strong> en esta dulce espera. ✨`;
            summaryStatus.textContent = 'No podré asistir, pero envío amor ✨';
            summaryStatus.className = 'summary-value text-gold font-title';
            summaryCompanionsRow.style.display = 'none';
        }

        // 1. Trigger Confetti celebration if attending
        if (selectedAttendance === 'si') {
            launchCelebrationConfetti();
        }

        // 2. Perform GSAP Transition to Thank You Screen
        transitionToStep(step2, step3, () => {
            // 3. Open WhatsApp link in a new window/tab after step transition starts
            setTimeout(() => {
                window.open(formattedWhatsAppUrl, '_blank');
            }, 800);
        });
    }

    rsvpForm.addEventListener('submit', handleSubmit);

    // Resend button trigger
    btnResendWhatsApp.addEventListener('click', () => {
        if (formattedWhatsAppUrl) {
            window.open(formattedWhatsAppUrl, '_blank');
        }
    });

    // Reset Flow (Restart)
    btnRestart.addEventListener('click', () => {
        // Clear form
        rsvpForm.reset();
        selectedAttendance = 'si';
        btnAttending.classList.add('active');
        btnNotAttending.classList.remove('active');
        conditionalFields.classList.add('show');
        gsap.set(conditionalFields, { maxHeight: '', opacity: '', y: '' });

        transitionToStep(step3, step1, () => {
            initWelcomeAnimations();
        });
    });

    /* ==========================================================================
       7. DYNAMIC BUTTERFLY SWARM GENERATOR
       ========================================================================== */
    function createDynamicButterflies() {
        const container = document.querySelector('.background-decorations');
        if (!container) return;

        const butterflyCount = 14; // Dynamic butterfly count

        for (let i = 0; i < butterflyCount; i++) {
            // Outer wrapper for mouse parallax
            const outerWrapper = document.createElement('div');
            outerWrapper.className = 'dynamic-butterfly-outer';

            // Random initial placement properties
            const size = Math.random() * 32 + 18; // 18px to 50px
            const initialX = Math.random() * 92 + 4; // 4% to 96%
            const initialY = Math.random() * 90 + 5; // 5% to 95%
            const opacity = Math.random() * 0.28 + 0.12; // 0.12 to 0.40 depth opacity
            
            // Set styles
            outerWrapper.style.position = 'absolute';
            outerWrapper.style.left = `${initialX}%`;
            outerWrapper.style.top = `${initialY}%`;
            outerWrapper.style.width = `${size}px`;
            outerWrapper.style.height = `${size}px`;
            outerWrapper.style.opacity = opacity;
            outerWrapper.style.pointerEvents = 'none';
            // some fly in front of the card, some behind (depth of field!)
            outerWrapper.style.zIndex = Math.random() > 0.75 ? '15' : '2'; 

            // Middle wrapper for slow GSAP loop flight path
            const middleWrapper = document.createElement('div');
            middleWrapper.className = 'dynamic-butterfly-middle';
            middleWrapper.style.width = '100%';
            middleWrapper.style.height = '100%';

            // Inner image
            const img = document.createElement('img');
            img.src = 'Imagenes/Real-Pink-Butterfly-Transparent-Image.png';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.filter = 'drop-shadow(0 4px 10px rgba(224, 148, 168, 0.25))';
            img.style.transformOrigin = 'center';

            // Flutter wing flapping animation (fast CSS keyframe)
            const flutterDuration = Math.random() * 0.35 + 0.5; // 0.5s to 0.85s
            const flutterDelay = Math.random() * 2;
            img.style.animation = `flutter ${flutterDuration}s ease-in-out infinite alternate ${flutterDelay}s`;

            middleWrapper.appendChild(img);
            outerWrapper.appendChild(middleWrapper);
            container.appendChild(outerWrapper);

            // Animate travel path smoothly using GSAP loops
            const travelX = (Math.random() - 0.5) * 140; // up to 70px left/right
            const travelY = (Math.random() - 0.5) * 140; // up to 70px up/down
            const rotation = (Math.random() - 0.5) * 60; // rotate slightly
            const flightDuration = Math.random() * 14 + 10; // 10s to 24s
            const flightDelay = Math.random() * 3;

            gsap.to(middleWrapper, {
                x: travelX,
                y: travelY,
                rotation: rotation,
                duration: flightDuration,
                delay: flightDelay,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        }
    }

    /* ==========================================================================
       8. INITIALIZATION & PARALLAX EFFECT
       ========================================================================== */
    // Subtle Mouse Move Parallax for Background Decorations
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;

        // Animate floating icons slightly
        gsap.to('.floating-icon', {
            x: mouseX * 25,
            y: mouseY * 25,
            duration: 1.5,
            ease: 'power2.out',
            overwrite: 'auto'
        });

        // Animate background butterflies in opposition
        gsap.to('.bg-butterfly', {
            x: mouseX * -35,
            y: mouseY * -35,
            duration: 2,
            ease: 'power2.out',
            overwrite: 'auto'
        });

        // Animate dynamic butterflies with custom speed based on depth (opacity proxy)
        document.querySelectorAll('.dynamic-butterfly-outer').forEach(butterfly => {
            const zDepth = parseFloat(butterfly.style.opacity) * 90; // Depth factor
            gsap.to(butterfly, {
                x: mouseX * -zDepth * 0.35,
                y: mouseY * -zDepth * 0.35,
                duration: 2,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        });
    });

    createDynamicButterflies();
    initWelcomeAnimations();

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
