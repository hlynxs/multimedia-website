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
         initBlenderDownloads();
    }
});

// Function to initialize Blender file downloads
function initBlenderDownloads() {
    // List of Blender files with their display names
    const blenderFiles = [
        { name: "Sun", url: "blender_files/sun.blend" },
        { name: "Mercury", url: "blender_files/mercury (1).blend" },
        { name: "Venus", url: "blender_files/venus (1).blend" },
        { name: "Earth", url: "blender_files/earth (1).blend" },
        { name: "Mars", url: "blender_files/mars (1).blend" },
        { name: "Jupiter", url: "blender_files/jupiter (1).blend" },
        { name: "Saturn", url: "blender_files/saturn.blend" },
        { name: "Uranus", url: "blender_files/uranus.blend" },
        { name: "Neptune", url: "blender_files/neptune.blend" },
        { name: "Pluto", url: "blender_files/pluto.blend" },
        { name: "Solar System", url: "blender_files/PASTETEOSOLARSYSTEM.blend" }
    ];

    // Set up individual download buttons
    document.querySelectorAll('.individual-download-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const filename = this.getAttribute('data-file');
            const file = blenderFiles.find(f => f.url.includes(filename));
            if (file) {
                downloadBlenderFile(file.url, file.name);
            }
        });
    });

    // Set up "Download All" button
    const downloadAllBtn = document.getElementById('download-all-blender');
    if (downloadAllBtn) {
        downloadAllBtn.addEventListener('click', async function() {
            await downloadAllBlenderFiles(blenderFiles);
        });
    }
}

// Function to download a single Blender file
function downloadBlenderFile(url, name) {
    const a = document.createElement('a');
    a.href = url;
    a.download = name + '.blend';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to download all Blender files as a ZIP
async function downloadAllBlenderFiles(blenderFiles) {
    const downloadButton = document.getElementById('download-all-blender');
    if (!downloadButton) return;

    const originalText = downloadButton.innerHTML;
    downloadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PREPARING DOWNLOAD...';
    downloadButton.disabled = true;

    try {
        // Load JSZip library
        const JSZip = await loadJSZip();
        const zip = new JSZip();
        let downloadedCount = 0;

        // Add each file to the ZIP
        for (const file of blenderFiles) {
            try {
                const response = await fetchWithTimeout(file.url, {
                    timeout: 5000 // 5 second timeout per file
                });
                
                if (!response.ok) {
                    console.error(`Failed to fetch ${file.url}: ${response.status}`);
                    continue;
                }

                const blob = await response.blob();
                const filename = file.url.split('/').pop();
                zip.file(filename, blob);
                downloadedCount++;

                // Update progress
                downloadButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> DOWNLOADING (${downloadedCount}/${blenderFiles.length})...`;
            } catch (err) {
                console.error(`Error downloading ${file.url}:`, err);
            }
        }

        if (downloadedCount === 0) {
            throw new Error("No files were downloaded successfully");
        }

        // Generate ZIP
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        
        // Trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'solar-system-blender-files.zip';
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            downloadButton.innerHTML = '<i class="fas fa-check"></i> DOWNLOAD COMPLETE!';
            setTimeout(() => {
                downloadButton.innerHTML = originalText;
                downloadButton.disabled = false;
            }, 2000);
        }, 100);

    } catch (error) {
        console.error('Error creating zip file:', error);
        downloadButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> DOWNLOAD FAILED - TRY AGAIN';
        setTimeout(() => {
            downloadButton.innerHTML = originalText;
            downloadButton.disabled = false;
        }, 2000);
    }
}

// Helper function to load JSZip
function loadJSZip() {
    return new Promise((resolve, reject) => {
        if (window.JSZip) {
            resolve(window.JSZip);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = () => {
            if (window.JSZip) {
                resolve(window.JSZip);
            } else {
                reject(new Error('JSZip not loaded correctly'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load JSZip'));
        document.head.appendChild(script);
    });
}

// Helper function for fetch with timeout
function fetchWithTimeout(url, options = {}) {
    const { timeout = 8000 } = options;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    return fetch(url, {
        ...options,
        signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
}