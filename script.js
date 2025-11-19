// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 0) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animar tarjetas de apps
document.querySelectorAll('.app-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Animar sección de contacto
const contactSection = document.querySelector('.contact-section');
if (contactSection) {
    contactSection.style.opacity = '0';
    contactSection.style.transform = 'translateY(20px)';
    contactSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(contactSection);
}

// Form submission handler
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Enviar a través de Formspree
            try {
                const response = await fetch('https://formspree.io/f/xyzzywyb', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        name: name,
                        email: email,
                        message: message,
                        _to: 'carnifis@gmail.com',
                    })
                });

                if (response.ok) {
                    const successMsg = window.i18n ? window.i18n.translate('contact.success') : 'Mensaje enviado correctamente!';
                    formStatus.textContent = successMsg;
                    formStatus.style.color = '#10b981';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        formStatus.textContent = '';
                    }, 5000);
                } else {
                    const errorMsg = window.i18n ? window.i18n.translate('contact.error') : 'Error al enviar el mensaje';
                    formStatus.textContent = errorMsg;
                    formStatus.style.color = '#ef4444';
                }
            } catch (error) {
                const errorMsg = window.i18n ? window.i18n.translate('contact.error') : 'Error al enviar el mensaje';
                formStatus.textContent = errorMsg;
                formStatus.style.color = '#ef4444';
            }
        });
    }
});

// Animación de entrada
window.addEventListener('load', () => {
    document.querySelectorAll('.app-card, .contact-section').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});
