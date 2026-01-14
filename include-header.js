/**
 * Shared Header Include Script
 * Loads the header.html file and inserts it into the page
 * This ensures consistent header across all pages
 */

(function() {
    // Find the header placeholder or body start
    const headerPlaceholder = document.getElementById('header-placeholder');
    const targetElement = headerPlaceholder || document.body;
    
    // Load header.html
    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load header.html');
            }
            return response.text();
        })
        .then(html => {
            if (headerPlaceholder) {
                // Replace placeholder with header
                headerPlaceholder.outerHTML = html;
            } else {
                // Insert at the beginning of body
                targetElement.insertAdjacentHTML('afterbegin', html);
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
            // Fallback: show error message in development
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = '<p style="color: red; padding: 20px;">Error loading header. Please ensure header.html exists.</p>';
            }
        });
})();
