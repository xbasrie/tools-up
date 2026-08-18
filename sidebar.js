document.addEventListener("DOMContentLoaded", () => {
    fetch('sidebar.html')
        .then(response => response.text())
        .then(html => {
            const container = document.getElementById('sidebar-container');
            if (container) {
                container.innerHTML = html;
                
                // Set active class based on current URL
                const currentPath = window.location.pathname;
                const menuItems = document.querySelectorAll('.menu-item[href]');
                
                menuItems.forEach(item => {
                    // Remove active class from all items first
                    item.classList.remove('active');
                    
                    const href = item.getAttribute('href');
                    // Check if current path matches the href, or if it's the root path matching index.html
                    if (currentPath.endsWith(href) || (currentPath.endsWith('/') && href === 'index.html')) {
                        item.classList.add('active');
                        
                        // If it's inside a sub-menu, open the parent group
                        const parentGroup = item.closest('.menu-group');
                        if (parentGroup) {
                            parentGroup.classList.add('open');
                        }
                    }
                });
            }
        })
        .catch(err => console.error('Failed to load sidebar:', err));
});
