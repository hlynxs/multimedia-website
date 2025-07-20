document.addEventListener('DOMContentLoaded', function() {
    // Create floating particles
    function createParticles() {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 8 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            
            particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            document.body.appendChild(particle);
        }
    }

    // Initialize particles on all pages
    createParticles();

    // New smooth navigation animation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        // Add new animation elements
        const highlight = document.createElement('div');
        highlight.className = 'link-highlight';
        link.appendChild(highlight);
        
        // New animation on hover
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.querySelector('.link-highlight').style.transform = 'scaleX(1)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.querySelector('.link-highlight').style.transform = 'scaleX(0)';
            }
        });
    });

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href');
        
        if (linkPage) {
            link.classList.remove('active');
            link.querySelector('.link-highlight').style.transform = 'scaleX(0)';
            
            // Check if this link matches current page
            if ((currentPage === 'index.html' && (linkPage === 'index.html' || linkPage === '#')) ||
                (currentPage === '' && linkPage === 'index.html') ||
                (linkPage.includes(currentPage.replace('.html', '')) && currentPage !== 'index.html')) {
                link.classList.add('active');
                link.querySelector('.link-highlight').style.transform = 'scaleX(1)';
            }
        }
    });

    // Solar System Calculator
    if (currentPage.includes('solar-system')) {
        const calculateBtn = document.getElementById('calculate');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const earthAge = parseFloat(document.getElementById('earth-age').value);
                
                if (isNaN(earthAge)) {
                    alert('Please enter a valid age');
                    return;
                }
                
                const planets = [
                    { name: 'Mercury', period: 87.97 },
                    { name: 'Venus', period: 224.70 },
                    { name: 'Earth', period: 365.25 },
                    { name: 'Mars', period: 686.98 },
                    { name: 'Jupiter', period: 4332.59 },
                    { name: 'Saturn', period: 10755.70 },
                    { name: 'Uranus', period: 30687.15 },
                    { name: 'Neptune', period: 60190.03 },
                    { name: 'Pluto', period: 90560.00 } // Added Pluto here

                ];
                
                const resultsContainer = document.getElementById('results');
                resultsContainer.innerHTML = '';
                
                planets.forEach(planet => {
                    const planetAge = (earthAge * 365.25) / planet.period;
                    
                    const resultCard = document.createElement('div');
                    resultCard.className = 'result-card';
                    resultCard.innerHTML = `
                        <div class="planet-name">${planet.name}</div>
                        <div class="planet-age">${planetAge.toFixed(2)} years</div>
                    `;
                    
                    resultsContainer.appendChild(resultCard);
                });
            });
        }
    }
});