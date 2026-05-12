// Initialize Feather icons
feather.replace();

// Reusable Swipe Carousel Function
window.initSwipeCarousel = function(options) {
    const {
        container,
        slidesContainer,
        slides,
        onSlideChange,
        loop = true,
        autoplay = false,
        autoplayDelay = 5000
    } = options;

    if (!container || !slidesContainer || !slides || slides.length < 2) return null;

    let currentIndex = 0;
    let autoplayInterval = null;
    const swipeThreshold = 50;

    // Touch state
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let isDragging = false;
    let isHorizontalSwipe = null;

    function showSlide(index) {
        slidesContainer.style.transform = 'translateX(-' + (index * (100 / slides.length)) + '%)';
        currentIndex = index;
        if (onSlideChange) onSlideChange(index);
    }

    function nextSlide() {
        if (loop) {
            showSlide((currentIndex + 1) % slides.length);
        } else if (currentIndex < slides.length - 1) {
            showSlide(currentIndex + 1);
        }
    }

    function prevSlide() {
        if (loop) {
            showSlide((currentIndex - 1 + slides.length) % slides.length);
        } else if (currentIndex > 0) {
            showSlide(currentIndex - 1);
        }
    }

    function startAutoplay() {
        if (autoplay && !autoplayInterval) {
            autoplayInterval = setInterval(nextSlide, autoplayDelay);
        }
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    // Touch events
    container.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchCurrentX = touchStartX;
        isDragging = true;
        isHorizontalSwipe = null;
        slidesContainer.style.transition = 'none';
        stopAutoplay();
    }, { passive: true });

    container.addEventListener('touchmove', function(e) {
        if (!isDragging) return;

        touchCurrentX = e.touches[0].clientX;
        const touchCurrentY = e.touches[0].clientY;
        const diffX = touchCurrentX - touchStartX;
        const diffY = touchCurrentY - touchStartY;

        if (isHorizontalSwipe === null && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
            isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
        }

        if (isHorizontalSwipe) {
            e.preventDefault();
            const baseTranslate = -(currentIndex * (100 / slides.length));
            const containerWidth = container.offsetWidth;
            const dragPercent = (diffX / containerWidth) * (100 / slides.length);
            let finalDragPercent = dragPercent;
            // Only apply resistance at edges when loop is disabled
            if (!loop && ((currentIndex === 0 && diffX > 0) ||
                (currentIndex === slides.length - 1 && diffX < 0))) {
                finalDragPercent = dragPercent * 0.3;
            }
            slidesContainer.style.transform = 'translateX(' + (baseTranslate + finalDragPercent) + '%)';
        }
    }, { passive: false });

    container.addEventListener('touchend', function(e) {
        if (!isDragging) return;
        isDragging = false;

        const diffX = touchCurrentX - touchStartX;
        slidesContainer.style.transition = 'transform 0.5s ease-out';

        if (isHorizontalSwipe && Math.abs(diffX) > swipeThreshold) {
            if (diffX < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        } else {
            slidesContainer.style.transform = 'translateX(-' + (currentIndex * (100 / slides.length)) + '%)';
        }
        startAutoplay();
    }, { passive: true });

    container.addEventListener('touchcancel', function() {
        isDragging = false;
        slidesContainer.style.transition = 'transform 0.5s ease-out';
        slidesContainer.style.transform = 'translateX(-' + (currentIndex * (100 / slides.length)) + '%)';
        startAutoplay();
    }, { passive: true });

    // Start autoplay if enabled
    startAutoplay();

    // Return control functions
    return {
        showSlide,
        nextSlide,
        prevSlide,
        startAutoplay,
        stopAutoplay,
        getCurrentIndex: () => currentIndex
    };
};

// Announcement Bar Slider
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.announcement-slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(function(slide, i) {
            slide.classList.remove('active');
        });
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto-rotate slides every 4 seconds
    if (slides.length > 0) {
        setInterval(nextSlide, 4000);
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuBtnDesktop = document.getElementById('mobile-menu-btn-desktop');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const desktopMenuDropdown = document.getElementById('desktop-menu-dropdown');

    function openMobileMenu() {
        // Show overlay
        mobileMenu.classList.remove('opacity-0', 'invisible');
        mobileMenu.classList.add('opacity-100', 'visible');

        // Slide in panel after a tiny delay for smooth animation
        setTimeout(function() {
            mobileMenuPanel.classList.remove('-translate-x-full');
            mobileMenuPanel.classList.add('translate-x-0');
        }, 10);

        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    function closeMobileMenu() {
        // Slide out panel
        mobileMenuPanel.classList.remove('translate-x-0');
        mobileMenuPanel.classList.add('-translate-x-full');

        // Hide overlay after animation completes
        setTimeout(function() {
            mobileMenu.classList.remove('opacity-100', 'visible');
            mobileMenu.classList.add('opacity-0', 'invisible');
        }, 300);

        document.body.style.overflow = ''; // Restore body scroll
    }

    // Desktop dropdown menu functions
    let desktopMenuOpen = false;

    function openDesktopMenu() {
        if (!desktopMenuDropdown) return;
        desktopMenuOpen = true;
        desktopMenuDropdown.classList.remove('opacity-0', 'invisible');
        desktopMenuDropdown.classList.add('opacity-100', 'visible');
    }

    function closeDesktopMenu() {
        if (!desktopMenuDropdown) return;
        desktopMenuOpen = false;
        desktopMenuDropdown.classList.remove('opacity-100', 'visible');
        desktopMenuDropdown.classList.add('opacity-0', 'invisible');
    }

    function toggleDesktopMenu() {
        if (desktopMenuOpen) {
            closeDesktopMenu();
        } else {
            openDesktopMenu();
        }
    }

    if (mobileMenuBtn && mobileMenu) {
        // Open mobile menu
        mobileMenuBtn.addEventListener('click', function() {
            openMobileMenu();
        });

        // Close mobile menu
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function() {
                closeMobileMenu();
            });
        }

        // Close when clicking overlay
        mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
                closeMobileMenu();
            }
        });
    }

    // Desktop hamburger toggles desktop dropdown menu
    if (mobileMenuBtnDesktop && desktopMenuDropdown) {
        mobileMenuBtnDesktop.addEventListener('click', function() {
            toggleDesktopMenu();
        });

        // Close desktop menu when clicking outside
        document.addEventListener('click', function(e) {
            if (desktopMenuOpen && !desktopMenuDropdown.contains(e.target) && !mobileMenuBtnDesktop.contains(e.target)) {
                closeDesktopMenu();
            }
        });
    }

    // Mobile Menu Level 1 Toggle (Shop)
    const mobileMenuToggles = document.querySelectorAll('.mobile-menu-toggle');
    mobileMenuToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            const submenu = this.nextElementSibling;
            const arrow = this.querySelector('svg');

            if (submenu) {
                submenu.classList.toggle('hidden');
                if (arrow) {
                    arrow.classList.toggle('rotate-180');
                }
            }
        });
    });

    // Mobile Menu Level 2 Toggle (Earrings, Necklaces)
    const mobileSubmenuToggles = document.querySelectorAll('.mobile-submenu-toggle');
    mobileSubmenuToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            const subSubmenu = this.nextElementSibling;
            const arrow = this.querySelector('svg');

            if (subSubmenu) {
                subSubmenu.classList.toggle('hidden');
                if (arrow) {
                    arrow.classList.toggle('rotate-180');
                }
            }
        });
    });

    // Search Modal Toggle
    const searchBtn = document.getElementById('search-btn');
    const searchBtnMobile = document.getElementById('search-btn-mobile');
    const searchModal = document.getElementById('search-modal');
    const searchModalPanel = document.getElementById('search-modal-panel');
    const searchModalClose = document.getElementById('search-modal-close');
    const searchInput = document.getElementById('search-input');
    const searchSubmit = document.getElementById('search-submit');

    function openSearchModal() {
        // Show overlay
        searchModal.classList.remove('opacity-0', 'invisible');
        searchModal.classList.add('opacity-100', 'visible');

        // Slide down panel
        setTimeout(function() {
            searchModalPanel.classList.remove('-translate-y-full');
            searchModalPanel.classList.add('translate-y-0');
        }, 10);

        // Focus on search input
        setTimeout(function() {
            searchInput.focus();
            feather.replace(); // Re-render feather icons
        }, 350);

        document.body.style.overflow = 'hidden';
    }

    function closeSearchModal() {
        // Slide up panel
        searchModalPanel.classList.remove('translate-y-0');
        searchModalPanel.classList.add('-translate-y-full');

        // Hide overlay after animation
        setTimeout(function() {
            searchModal.classList.remove('opacity-100', 'visible');
            searchModal.classList.add('opacity-0', 'invisible');
        }, 300);

        document.body.style.overflow = '';
    }

    if (searchModal) {
        // Open search modal (desktop)
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                openSearchModal();
            });
        }

        // Open search modal (mobile)
        if (searchBtnMobile) {
            searchBtnMobile.addEventListener('click', function() {
                openSearchModal();
            });
        }

        // Close search modal
        if (searchModalClose) {
            searchModalClose.addEventListener('click', function() {
                closeSearchModal();
            });
        }

        // Close when clicking overlay
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                closeSearchModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchModal.classList.contains('visible')) {
                closeSearchModal();
            }
        });

        // Handle search submit
        if (searchSubmit) {
            searchSubmit.addEventListener('click', function() {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = '/products?q=' + encodeURIComponent(query);
                }
            });
        }

        // Handle Enter key in search input
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        window.location.href = '/products?q=' + encodeURIComponent(query);
                    }
                }
            });
        }
    }

    // Cart Drawer Toggle
    const cartBtn = document.getElementById('cart-btn');
    const cartBtnMobile = document.getElementById('cart-btn-mobile');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartDrawerPanel = document.getElementById('cart-drawer-panel');
    const cartDrawerClose = document.getElementById('cart-drawer-close');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    const viewCartBtn = document.getElementById('view-cart');

    function openCartDrawer() {
        // Show overlay
        cartDrawer.classList.remove('opacity-0', 'invisible');
        cartDrawer.classList.add('opacity-100', 'visible');

        // Slide in panel after a tiny delay for smooth animation
        setTimeout(function() {
            cartDrawerPanel.classList.remove('translate-x-full');
            cartDrawerPanel.classList.add('translate-x-0');
        }, 10);

        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }

    function closeCartDrawer() {
        // Slide out panel
        cartDrawerPanel.classList.remove('translate-x-0');
        cartDrawerPanel.classList.add('translate-x-full');

        // Hide overlay after animation completes
        setTimeout(function() {
            cartDrawer.classList.remove('opacity-100', 'visible');
            cartDrawer.classList.add('opacity-0', 'invisible');
        }, 300);

        document.body.style.overflow = ''; // Restore body scroll
    }

    if (cartDrawer) {
        // Open cart drawer (desktop)
        if (cartBtn) {
            cartBtn.addEventListener('click', function() {
                openCartDrawer();
            });
        }

        // Open cart drawer (mobile)
        if (cartBtnMobile) {
            cartBtnMobile.addEventListener('click', function() {
                openCartDrawer();
            });
        }

        // Check if URL has ?cart=open parameter and open cart drawer
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('cart') === 'open') {
            openCartDrawer();
            // Clean up URL without reloading
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }

        // Close cart drawer
        if (cartDrawerClose) {
            cartDrawerClose.addEventListener('click', function() {
                closeCartDrawer();
            });
        }

        // Continue shopping button
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', function() {
                closeCartDrawer();
            });
        }

        // View cart button
        if (viewCartBtn) {
            viewCartBtn.addEventListener('click', function() {
                window.location.href = '/cart';
            });
        }

        // Close when clicking overlay
        cartDrawer.addEventListener('click', function(e) {
            if (e.target === cartDrawer) {
                closeCartDrawer();
            }
        });
    }

    // Cart drawer is now using dynamic Shopway data
    // No demo functions needed

    // Product Image Carousel
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const carouselThumbs = document.querySelectorAll('.carousel-thumb');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const youtubeVideo = document.getElementById('youtube-video');
    const slidesContainer = document.querySelector('.carousel-slides');
    const carouselMain = document.getElementById('carousel-main');
    window.currentCarouselSlide = 0;

    // Set carousel height based on first image to ensure consistent sizing
    if (carouselSlides.length > 0 && carouselMain) {
        const firstImage = carouselSlides[0].querySelector('img');
        if (firstImage) {
            const setCarouselHeight = function() {
                if (firstImage.naturalHeight > 0) {
                    carouselMain.style.height = firstImage.offsetHeight + 'px';
                }
            };
            if (firstImage.complete) {
                setCarouselHeight();
            } else {
                firstImage.addEventListener('load', setCarouselHeight);
            }
            // Also update on window resize
            window.addEventListener('resize', setCarouselHeight);
        }
    }

    window.showCarouselSlide = function(index) {
        // Update thumbnails (mobile only - desktop has no active state)
        var isMobile = window.innerWidth < 768;
        carouselThumbs.forEach(function(thumb) {
            thumb.classList.remove('active', 'border-secondary-border');
            if (isMobile) {
                thumb.classList.add('border-transparent');
            }
        });

        if (carouselThumbs[index] && isMobile) {
            carouselThumbs[index].classList.add('active', 'border-secondary-border');
            carouselThumbs[index].classList.remove('border-transparent');
        }

        // Slide to the current index using translateX
        if (slidesContainer) {
            slidesContainer.style.transform = 'translateX(-' + (index * 100) + '%)';
        }

        // Autoplay video when video slide is shown
        if (carouselSlides[index] && carouselSlides[index].querySelector('iframe') && youtubeVideo) {
            // Reload iframe with autoplay parameter
            const currentSrc = youtubeVideo.src;
            if (!currentSrc.includes('autoplay=1')) {
                youtubeVideo.src = currentSrc.replace('?', '?autoplay=1&');
            }
        } else if (youtubeVideo) {
            // Stop video when navigating away
            const currentSrc = youtubeVideo.src;
            if (currentSrc.includes('autoplay=1')) {
                youtubeVideo.src = currentSrc.replace('autoplay=1&', '');
            }
        }
    }

    function nextCarouselSlide() {
        window.currentCarouselSlide = (window.currentCarouselSlide + 1) % carouselSlides.length;
        window.showCarouselSlide(window.currentCarouselSlide);
    }

    function prevCarouselSlide() {
        window.currentCarouselSlide = (window.currentCarouselSlide - 1 + carouselSlides.length) % carouselSlides.length;
        window.showCarouselSlide(window.currentCarouselSlide);
    }

    // Navigation buttons
    if (carouselPrev) {
        carouselPrev.addEventListener('click', function() {
            prevCarouselSlide();
        });
    }

    if (carouselNext) {
        carouselNext.addEventListener('click', function() {
            nextCarouselSlide();
        });
    }

    // Thumbnail click
    carouselThumbs.forEach(function(thumb, index) {
        thumb.addEventListener('click', function() {
            window.currentCarouselSlide = index;
            window.showCarouselSlide(window.currentCarouselSlide);
        });
    });

    // Touch swipe functionality for mobile carousel
    if (carouselMain && slidesContainer && carouselSlides.length > 1) {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchCurrentX = 0;
        let isDragging = false;
        let isHorizontalSwipe = null;
        const swipeThreshold = 50;

        carouselMain.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchCurrentX = touchStartX;
            isDragging = true;
            isHorizontalSwipe = null;
            slidesContainer.style.transition = 'none';
        }, { passive: true });

        carouselMain.addEventListener('touchmove', function(e) {
            if (!isDragging) return;

            touchCurrentX = e.touches[0].clientX;
            const touchCurrentY = e.touches[0].clientY;
            const diffX = touchCurrentX - touchStartX;
            const diffY = touchCurrentY - touchStartY;

            if (isHorizontalSwipe === null && (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)) {
                isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
            }

            if (isHorizontalSwipe) {
                e.preventDefault();
                const baseTranslate = -(window.currentCarouselSlide * 100);
                const containerWidth = carouselMain.offsetWidth;
                const dragPercent = (diffX / containerWidth) * 100;
                let finalDragPercent = dragPercent;
                if ((window.currentCarouselSlide === 0 && diffX > 0) ||
                    (window.currentCarouselSlide === carouselSlides.length - 1 && diffX < 0)) {
                    finalDragPercent = dragPercent * 0.3;
                }
                slidesContainer.style.transform = 'translateX(' + (baseTranslate + finalDragPercent) + '%)';
            }
        }, { passive: false });

        carouselMain.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;

            const diffX = touchCurrentX - touchStartX;
            slidesContainer.style.transition = 'transform 0.3s ease-out';

            if (isHorizontalSwipe && Math.abs(diffX) > swipeThreshold) {
                if (diffX < 0 && window.currentCarouselSlide < carouselSlides.length - 1) {
                    nextCarouselSlide();
                } else if (diffX > 0 && window.currentCarouselSlide > 0) {
                    prevCarouselSlide();
                } else {
                    slidesContainer.style.transform = 'translateX(-' + (window.currentCarouselSlide * 100) + '%)';
                }
            } else {
                slidesContainer.style.transform = 'translateX(-' + (window.currentCarouselSlide * 100) + '%)';
            }
        }, { passive: true });

        carouselMain.addEventListener('touchcancel', function() {
            isDragging = false;
            slidesContainer.style.transition = 'transform 0.3s ease-out';
            slidesContainer.style.transform = 'translateX(-' + (window.currentCarouselSlide * 100) + '%)';
        }, { passive: true });
    }

    // Cart drawer uses server-side cart management
    // Quantity changes are handled on the cart page
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

function createProductImagePlaceholder() {
    var template = document.getElementById('broken-product-image-placeholder'),
        wrapper = document.createElement('span');

    wrapper.className = 'broken-product-image';

    if (template) {
        wrapper.innerHTML = template.innerHTML;
    }

    return wrapper;
}

function replaceBrokenProductImage(img) {
    var placeholder;

    if (!img || img.dataset.placeholderApplied === 'true') {
        return;
    }

    img.dataset.placeholderApplied = 'true';
    placeholder = createProductImagePlaceholder();

    if (img.id) {
        placeholder.id = img.id;
    }

    if (img.className) {
        placeholder.className += ' ' + img.className;
    }

    if (img.getAttribute('width')) {
        placeholder.style.width = img.getAttribute('width');
    }

    if (img.parentNode) {
        img.parentNode.replaceChild(placeholder, img);
    }
}

function getProductImageSelector(){
    return [
        '.product-images img',
        '.carousel-slide img',
        '.carousel-thumb img',
        '.product-image img',
        '.bundle-thumbnail img',
        '.cart-item img',
        '.grid .group img'
    ].join(', ');
}

function initProductImageFallbacks() {
    document.addEventListener('error', function(event) {
        var target = event.target;

        if (target && target.tagName === 'IMG' && target.matches(getProductImageSelector())) {
            replaceBrokenProductImage(target);
        }
    }, true);

    document.querySelectorAll(getProductImageSelector()).forEach(function(img) {
        if (img.complete && img.naturalWidth === 0) {
            replaceBrokenProductImage(img);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductImageFallbacks);
} else {
    initProductImageFallbacks();
}

$(document).ready(function() {

    // iOS Safari bfcache fix: Re-sync form state when page is restored from cache
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            // Page was restored from bfcache, re-sync option selection state
            var hasVariantOptions = $('#variants_options').length > 0;
            if (hasVariantOptions) {
                // Clear the main selected-option to force re-validation
                $('#selected-option').val('');

                // Re-sync from visually selected option buttons
                var selectedOptions = {};
                var hasSelection = false;

                $('#variants_options').find('.select-option-btn.border-primary').each(function() {
                    var btn = $(this);
                    var optionName = btn.data('option-name');
                    var optionValue = btn.data('option-value');
                    if (optionName && optionValue) {
                        // Update the hidden input for this option
                        btn.closest('.mb-4').find('.selected-option-value').val(optionValue);
                        selectedOptions[optionName] = optionValue;
                        hasSelection = true;
                    }
                });

                // If we found selections, process them to update the variant ID
                if (hasSelection && Object.keys(selectedOptions).length === $('#variants_options').find('.selected-option-value').length) {
                    processSelectOptions(selectedOptions);
                }
            }
        }
    });

    // Select box is the variant (legacy dropdown support)
    $('.single-option-selector__select.select-variant').on('change',function() {
        var variant_id = $(this).val(), selected_variant = $('#variant_' + variant_id);

        disabledButtons();
        resetInputQuantity(0);
        $('#max-product-quantity').text(0);
        $('#max-product-quantity').attr('value', 0);

        if(selected_variant.data('available')){
            updateSelectedOptionsVariant(selected_variant);// must update variant first
            enableButtons();
            resetInputQuantity(1);
            updatePriceText();
            updateQuantityText();
            showQuantityText();
        }
    });

    // Button click is the variant (new button style)
    $('.select-variant-btn').on('click', function() {
        var btn = $(this);

        // Block clicks on sold-out variants entirely
        if (btn.attr('data-sold-out') === 'true') {
            return;
        }

        var variant_id = btn.data('variant-id');
        var selected_variant = $('#variant_' + variant_id);

        // Update button active states — remove from ALL siblings so previously-active buttons
        // that turn sold-out also lose their border.
        $('.select-variant-btn').removeClass('border-primary').addClass('border-secondary-border');
        $('.select-variant-btn .variant-active-indicator').addClass('hidden');
        btn.removeClass('border-secondary-border').addClass('border-primary');
        btn.find('.variant-active-indicator').removeClass('hidden');

        // Navigate to variant image in carousel if available
        var slideIndex = btn.data('slide-index');
        if (typeof slideIndex !== 'undefined' && typeof window.showCarouselSlide === 'function') {
            window.showCarouselSlide(slideIndex);
            window.currentCarouselSlide = slideIndex;
        }

        disabledButtons();
        resetInputQuantity(0);
        $('#max-product-quantity').text(0);
        $('#max-product-quantity').attr('value', 0);

        if(selected_variant.data('available')){
            updateSelectedOptionsVariant(selected_variant);// must update variant first
            enableButtons();
            resetInputQuantity(1);
            updatePriceText();
            updateQuantityText();
            showQuantityText();
        } else {
            // Sold out variant - still update price but keep buttons disabled
            updateSelectedOptionsVariant(selected_variant);
            updatePriceText(variant_id);
            $('#stock-label').text('Out of stock');
            $('#variant_quantity_text').show();
            // Disable quantity selector
            $('#product_plus_quantity, #product_minus_quantity').attr('disabled', 'disabled').addClass('opacity-50 cursor-not-allowed');
            $('#product_input_quantity').attr('disabled', 'disabled').addClass('opacity-50');
            // Clear selected option so validation will trigger
            $('#selected-option').val('');
        }
    });

    // Select box is the option (legacy dropdown support)
    $('.single-option-selector__select.select-option').on('change', function(){
        var optionsLength = $($('#list-variants-options').find('div')[0]).children().length;
        var chooseOptions = $('#variants_options').find('option:selected').filter('[value!=""]').parent('select');
        var currentOption, optionKey, optionValue, chooseOptionsLength = chooseOptions.length, selectedOptions = {};

        // If same length, means that customer have choose each options
        if(optionsLength == chooseOptionsLength) {
            chooseOptions.each(function(){
                currentOption = $(this);

                optionKey = currentOption.attr('name');
                optionValue = currentOption.val();

                selectedOptions[optionKey] = optionValue;
            });

            processSelectOptions(selectedOptions);
        }
    });

    // Button click is the option (new button style)
    // Recompute which option buttons should appear sold-out based on the
    // currently-selected combination across all option groups.
    function refreshOptionAvailability() {
        var variants = document.querySelectorAll('#list-variants-options > div');
        if (variants.length === 0) return;

        // Snapshot current selections (only filled ones)
        var currentSelections = {};
        document.querySelectorAll('#variants_options .selected-option-value').forEach(function(input) {
            var key = input.getAttribute('data-option-key') || input.getAttribute('name');
            var val = input.value;
            if (val) currentSelections[key] = val;
        });

        document.querySelectorAll('.select-option-btn').forEach(function(btn) {
            var optionName = btn.getAttribute('data-option-name');
            var optionValue = btn.getAttribute('data-option-value');

            // Hypothetical: combine current selections with this button's value
            var hypothetical = Object.assign({}, currentSelections);
            hypothetical[optionName] = optionValue;

            var isAvailable = false;
            variants.forEach(function(v) {
                if (v.getAttribute('data-available') !== 'true') return;
                var matches = true;
                v.querySelectorAll('input[data-optionkey]').forEach(function(input) {
                    var key = input.getAttribute('data-optionkey');
                    if (hypothetical[key] && input.value !== hypothetical[key]) {
                        matches = false;
                    }
                });
                if (matches) isAvailable = true;
            });

            if (isAvailable) {
                btn.removeAttribute('data-sold-out');
                btn.classList.remove('opacity-30', 'cursor-not-allowed');
            } else {
                btn.setAttribute('data-sold-out', 'true');
                btn.classList.add('opacity-30', 'cursor-not-allowed');
            }
        });
    }

    // Initial pass on page load (covers cases the template missed)
    refreshOptionAvailability();

    $('.select-option-btn').on('click', function() {
        var btn = $(this);
        var optionValue = btn.data('option-value');
        var isSoldOut = btn.attr('data-sold-out') === 'true';

        // Block clicks on sold-out options entirely
        if (isSoldOut) {
            return;
        }

        // Update button active states within the same option group - remove active state from all, add to clicked
        // (including sold-out ones, otherwise a previously-active button that later goes sold-out keeps its border).
        btn.closest('.option-value-group').find('.select-option-btn').removeClass('border-primary').addClass('border-secondary-border');
        btn.closest('.option-value-group').find('.select-option-btn .option-active-indicator').addClass('hidden');
        btn.removeClass('border-secondary-border').addClass('border-primary');
        btn.find('.option-active-indicator').removeClass('hidden');

        // Navigate to variant image in carousel if available
        var slideIndex = btn.data('slide-index');
        if (typeof slideIndex !== 'undefined' && typeof window.showCarouselSlide === 'function') {
            window.showCarouselSlide(slideIndex);
            window.currentCarouselSlide = slideIndex;
        }

        // Update the hidden input for this option (even if sold out, so price updates)
        btn.closest('.mb-4').find('.selected-option-value').val(optionValue);

        // Recompute sold-out state for sibling option buttons based on the new selection
        refreshOptionAvailability();

        // Check if all options have been selected
        // Count total number of option groups (e.g., "Colour", "Size")
        var totalOptionGroups = $('#variants_options').find('.selected-option-value').length;
        var selectedInputs = $('#variants_options').find('.selected-option-value').filter(function() {
            return $(this).val() !== '';
        });
        var selectedOptionsLength = selectedInputs.length;
        var selectedOptions = {};

        // If all options selected, process them (this will update price even for sold out)
        if(totalOptionGroups == selectedOptionsLength) {
            selectedInputs.each(function(){
                var input = $(this);
                var key = input.data('option-key') || input.attr('name');
                var value = input.val();
                selectedOptions[key] = value;
            });

            processSelectOptions(selectedOptions);

            // Hide option alert if shown
            $('#option-alert').addClass('hidden');
        }

        // If sold out, disable buttons and quantity (after processing so price updates)
        if (isSoldOut) {
            $("#btn-buynow, #btn-add-to-cart").attr('disabled', 'disabled');
            // Disable quantity selector
            $('#product_plus_quantity, #product_minus_quantity').attr('disabled', 'disabled').addClass('opacity-50 cursor-not-allowed');
            $('#product_input_quantity').attr('disabled', 'disabled').addClass('opacity-50');
            resetInputQuantity(0);
            $('#max-product-quantity').text('');
            $('#max-product-quantity').attr('value', 0);
            $('#stock-label').text('Out of stock');
            $('#variant_quantity_text').show();
            // Clear the selected option so validation will trigger on buy/add to cart
            $('#selected-option').val('');
        }
    });

    // Plus quantity on click
    $('#product_plus_quantity').on('click', function(){
        plusQuantity();
    });

    // Minus quantity on click
    $('#product_minus_quantity').on('click', function(){
        minusQuantity();
    });

    // Quantity input box is on type in value
    $('#product_input_quantity').on('keyup', function(event){
        inputQuantity(event);
    });

    if($('#product-bundle-form').length){
        enableButtons();
    }

    window.addEventListener('pageshow', function(){
        if($('#product-bundle-form').length){
            enableButtons();
        }
    });

    // Bundle selection
    $('.single-bundle-selector__select.select-bundle').on('change', function(){
        var variantId = $(this).val(),
            productInput = $(this).siblings('input[name$="[product_id]"]'),
            productId = productInput.val(),
            loopId = productInput.data('loop'),
            selectedVariant = $('#variant_' + variantId + '_' + loopId);

        updateSelectedBundleVariant(productId, variantId, loopId);
        updateBundleAvailabilityText(productId, variantId, loopId);
        resetBundleInputQuantity(productId, 0, loopId);
        checkBundleSelect(productId, loopId);
        updateBundleThumbnailImage(productId, variantId, loopId);
        updateBundleFixQuantity(productId, variantId, loopId);
        updateBundlePriceText(productId, variantId, loopId);

        if(selectedVariant.data('available')){
            resetBundleInputQuantity(productId, 1, loopId);
            updateBundlePriceText(productId, variantId, loopId);
            if(validateBundleSelections($('#product-bundle-form'))){
                hideProductOptionAlert($('#product-bundle-form'));
            }
        }

        enableButtons();
        $(this).removeClass('border-red-500');
    });

    // Bundle plus quantity on click
    $('.bundle-quantity-button.bundle-plus').on('click', function(){
        var productId = $(this).data('product-id'),
            loopId = $(this).data('loop'),
            selectedProductVariant = $('#product_bundle_' + productId + '_variant_' + loopId).val(),
            selectedVariant = $('#variant_' + selectedProductVariant + '_' + loopId);

        if(!selectedProductVariant){
            showProductOptionAlert($('#product-bundle-form'), 'Please select product variation first');
            return;
        }

        updateBundleAvailabilityText(productId, selectedProductVariant, loopId);
        checkBundleSelect(productId, loopId);

        if(!selectedVariant.data('available')){
            return;
        }

        hideProductOptionAlert($('#product-bundle-form'));
        plusBundleQuantity(productId, loopId);
    });

    // Bundle minus quantity on click
    $('.bundle-quantity-button.bundle-minus').on('click', function(){
        var productId = $(this).data('product-id'),
            loopId = $(this).data('loop'),
            selectedProductVariant = $('#product_bundle_' + productId + '_variant_' + loopId).val(),
            selectedVariant = $('#variant_' + selectedProductVariant + '_' + loopId);

        if(!selectedProductVariant){
            showProductOptionAlert($('#product-bundle-form'), 'Please select product variation first');
            return;
        }

        updateBundleAvailabilityText(productId, selectedProductVariant, loopId);
        checkBundleSelect(productId, loopId);

        if(!selectedVariant.data('available')){
            return;
        }

        hideProductOptionAlert($('#product-bundle-form'));
        minusBundleQuantity(productId, loopId);
    });

    // Bundle quantity input box is on type in value
    $('.bundle-quantity-button.bundle-quantity-form').on('keyup', function(){
        var productId = $(this).data('product-id'),
            loopId = $(this).data('loop'),
            selectedProductVariant = $('#product_bundle_' + productId + '_variant_' + loopId).val(),
            selectedVariant = $('#variant_' + selectedProductVariant + '_' + loopId);

        updateBundleAvailabilityText(productId, selectedProductVariant, loopId);
        checkBundleSelect(productId, loopId);

        if(selectedVariant.data('available')){
            hideProductOptionAlert($('#product-bundle-form'));
            inputBundleQuantity(productId, loopId);
        }
    });

	// Populate search input with current search query and filter products
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has('q')) {
		const searchQuery = urlParams.get('q');
		const searchInputElement = document.getElementById('search-input');
		if (searchInputElement) {
			searchInputElement.value = searchQuery;
		}

		// Check if we're on the products page and filter products by search term
		if (window.location.pathname === '/products' || window.location.pathname.includes('/products')) {
			const searchTermLower = searchQuery.toLowerCase();
			const productElements = document.querySelectorAll('.grid .group');
			let matchCount = 0;

			productElements.forEach(function(productEl) {
				const productName = productEl.querySelector('h3');
				if (productName) {
					const productNameText = productName.textContent.toLowerCase();
					if (productNameText.includes(searchTermLower)) {
						productEl.style.display = '';
						matchCount++;
					} else {
						productEl.style.display = 'none';
					}
				}
			});

			// Show messages based on match count
			const searchResultMessage = document.getElementById('search-result-message');
			const searchTermSpan = document.getElementById('search-term');
			const searchCountSpan = document.getElementById('search-count');
			const productsHeader = document.getElementById('products-header');

			// Elements for found results message
			const searchFoundMessage = document.getElementById('search-found-message');
			const searchFoundCountSpan = document.getElementById('search-found-count');
			const searchFoundTermSpan = document.getElementById('search-found-term');
			const searchFoundPluralSpan = document.getElementById('search-found-plural');

			if (matchCount === 0) {
				// No results found - show Oops message, hide products header
				if (searchResultMessage && searchTermSpan && searchCountSpan) {
					searchTermSpan.textContent = searchQuery;
					searchCountSpan.textContent = matchCount;
					searchResultMessage.classList.remove('hidden');
				}
				if (productsHeader) {
					productsHeader.style.display = 'none';
				}
			} else {
				// Results found - show products header with found message
				if (searchResultMessage) {
					searchResultMessage.classList.add('hidden');
				}
				if (productsHeader) {
					productsHeader.style.display = '';
				}
				if (searchFoundMessage && searchFoundCountSpan && searchFoundTermSpan && searchFoundPluralSpan) {
					searchFoundCountSpan.textContent = matchCount;
					searchFoundTermSpan.textContent = searchQuery;
					// Handle singular/plural
					searchFoundPluralSpan.textContent = matchCount === 1 ? '' : 's';
					searchFoundMessage.classList.remove('hidden');
				}
			}
		}
	}
});

function processSelectOptions(selectedObject){
    var div, key, value, selected_variant, found = [];
    var list_variant = $('#list-variants-options');

    list_variant.find('div').each(function(index, element){
        div = $(element), found[div.data('variant')] = [];
        div.find('input').each(function(index, input){
            key = $(input).data('optionkey'),
            value = $(input).val();

            found[div.data('variant')].push((selectedObject[key] === value));
        });
    });

    for(var variant in found){
        disabledButtons();
        showQuantityText(false);
        resetInputQuantity(1);
        $('#max-product-quantity').text(1);
        $('#max-product-quantity').attr('value', 1);

        if(found[variant].includes(false) === false){
            selected_variant = $("#variant_" + variant);

            updateSelectedOptionsVariant(selected_variant); // update selected variant first
            if(selected_variant.data('available')){
                enableButtons();
                updatePriceText();
                updateQuantityText();
                showQuantityText();
            }
            else {
                updatePriceText(variant);
                disabledButtons();
            }

            break;
        } else { disabledButtons(); }
    }
    return;
}

function updateSelectedOptionsVariant(selectedVariant){
    var variantId = (typeof selectedVariant === 'object') ? selectedVariant.data('variant') : selectedVariant;
    $('input#selected-option[name="id"]').attr('value', variantId);
    $('input#selected-option[name="id"]').val(variantId);
}

function updateSelectedBundleVariant(productId, variantId, loopId){
    $('input#product_bundle_' + productId + '_variant_' + loopId).attr('value', variantId);
    $('input#product_bundle_' + productId + '_variant_' + loopId).val(variantId);
}

function parseMoneyValue(formattedPrice){
    if (!formattedPrice) return 0;
    return parseFloat(String(formattedPrice).replace(/^\D+/g, '').replace(/,/g, '')) || 0;
}

function getMoneyCurrency(formattedPrice, fallback){
    var match = formattedPrice ? String(formattedPrice).match(/^\D+/g) : null;
    return match ? match[0] : (fallback || '');
}

function formatMoneyValue(amount, currencyType, fixedSize){
    var formatted = Number(amount || 0).toFixed(fixedSize);
    if(parseFloat(amount || 0) >= 1000){
        formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return currencyType + formatted;
}

function updatePriceText(variantId = null){
    var selectedVariant = $('#variant_' + $('#selected-option').val()),
        currentQuantity = $('#product_input_quantity').val(),
        wholesaleInput = $('input[id^="wholesalePrice_"]'),
        formattedProductPrice, formattedDiscountPrice,
        formattedTotalPrice, formattedTotalDiscountPrice, productPrice, discountPrice,
        productPriceElement, discountPriceElement, currencyType, storeCurrency, fixedSize,
        totalPrice = 0, totalDiscountPrice = 0;

        // override if variantId not null
    if(variantId){
        selectedVariant = $('#variant_' + variantId);
    }

    formattedProductPrice = selectedVariant.data('price');
    formattedDiscountPrice = selectedVariant.data('discount-price');

    if(!formattedProductPrice){
        return;
    }

    // if input quantity box not exist, set default to 1
    currentQuantity = parseInt(currentQuantity, 10) || 1;

    currencyType = getMoneyCurrency(formattedProductPrice);

    if(wholesaleInput.length >= 1){
        wholesaleInput.each(function(){
            var minQuantity = parseInt($(this).data('min-quantity'), 10) || 0,
                maxQuantity = parseInt($(this).data('max-quantity'), 10),
                maxApplies = !maxQuantity || currentQuantity <= maxQuantity;

            if(currentQuantity >= minQuantity && maxApplies){
                formattedProductPrice = $(this).data('price');
                currencyType = $(this).data('currency') || getMoneyCurrency(formattedProductPrice, currencyType);
                return false;
            }
        });
    }

    currencyType = currencyType || getMoneyCurrency(formattedProductPrice);
    productPrice = parseMoneyValue(formattedProductPrice);

    // Only extract discount price if it exists and has valid format
    if (formattedDiscountPrice && formattedDiscountPrice.toString().match(/^\D+/g)) {
        discountPrice = parseMoneyValue(formattedDiscountPrice);
    } else {
        discountPrice = 0;
    }

    storeCurrency = $('#product-price').data('currency');
    fixedSize = (storeCurrency === 'IDR') ? 0 : 2;

    productPriceElement = $('#product-price');
    discountPriceElement = $('#discount-price-single');

    totalPrice = productPrice * currentQuantity;
    formattedTotalPrice = formatMoneyValue(totalPrice, currencyType, fixedSize);

    // Set the price
    productPriceElement.text(formattedTotalPrice);

    // If variant is available and have discount price, calculate and display it
    if(selectedVariant.data('available') && formattedDiscountPrice && discountPrice > 0){
        totalDiscountPrice = discountPrice * currentQuantity;
        formattedTotalDiscountPrice = formatMoneyValue(totalDiscountPrice, currencyType, fixedSize);
        discountPriceElement.text(formattedTotalDiscountPrice);
        discountPriceElement.removeClass('hidden').show();
    } else {
        discountPriceElement.text('');
        discountPriceElement.hide();
    }

    // Update Atome price (divide by 3)
    var atomePriceElement = $('#atome-price');
    if (atomePriceElement.length > 0) {
        atomePriceElement.text(formatMoneyValue(totalPrice / 3, currencyType, fixedSize));
    }
}

function enableButtons(){
    var btn, text;

    $("#btn-buynow, #btn-add-to-cart").each(function(){
        btn = $(this);
        text = (btn).is('#btn-buynow')? 'Buy now' : 'Add to cart';

        btn.removeAttr('disabled', 'disabled');

        {% if settings.options.btn_buy_now_text %}
        // override from settings
        text = (btn).is('#btn-buynow')?  '{{ settings.options.btn_buy_now_text }}' : text;
        {% endif %}

        if(btn.is('#btn-buynow') && btn.find('#buynow-text').length){
            btn.find('#buynow-spinner').addClass('hidden');
            btn.find('#buynow-text').text(text);
        }else{
            btn.html(text);
        }
    });

    // Re-enable quantity selector
    $('#product_plus_quantity, #product_minus_quantity').removeAttr('disabled').removeClass('opacity-50 cursor-not-allowed');
    $('#product_input_quantity').removeAttr('disabled').removeClass('opacity-50');
}

function disabledButtons(){
    var btn;

    $("#btn-buynow, #btn-add-to-cart").each(function(){
        btn = $(this);

        btn.attr('disabled', 'disabled');
        if(btn.is('#btn-buynow') && btn.find('#buynow-text').length){
            btn.find('#buynow-spinner').addClass('hidden');
            btn.find('#buynow-text').text('Sold out');
        }else{
            btn.text('Sold out');
        }
    });
}

function isUnlimitedVariant(){
    var isManageStock, isUnlimited,
        variantId = $('input#selected-option[name="id"]').attr('value'),
        selectedVariant = $('#variant_'+ variantId);

        // get current selected variant manage stock
    isManageStock = selectedVariant.data('manage-stock');

    // check manage stock boolean, if false, means it unlimited stock
    isUnlimited = (!isManageStock)? true : false;
    return isUnlimited;
}

function updateQuantityText(){
    var selectedVariant = selectedVariant = $('#variant_' + $('#selected-option').val()),
    quantity = parseInt(selectedVariant.attr('data-inventory-quantity')) || 0,
        max_product_text = $('#max-product-quantity'),
        stock_label = $('#stock-label');

    max_product_text.attr('value', quantity);

    // Update stock label based on quantity
    if (quantity <= 0) {
        max_product_text.text('');
        stock_label.text('Out of stock');
    } else if (quantity === 1) {
        max_product_text.text(quantity);
        stock_label.text('piece available');
    } else {
        max_product_text.text(quantity);
        stock_label.text('pieces available');
    }
}

function showQuantityText(show = true){
    var quantity_div_text = $('#variant_quantity_text');

    if(!show || isUnlimitedVariant()){
        quantity_div_text.hide();
    } else {
        quantity_div_text.show();
    }
}

function resetInputQuantity(value = 1){
    var input_quantity_box = $('#product_input_quantity');

    input_quantity_box.attr('value', value);
    input_quantity_box.val(value);
}

function plusQuantity(){
    var input_quantity_box = $('#product_input_quantity'),
        current_value = parseInt($('#product_input_quantity').attr('value')),
        max_value = parseInt($('#max-product-quantity').attr('value')),
        new_value = 1,
        isUnlimited = false;

        new_value = current_value + 1;
    isUnlimited = isUnlimitedVariant();

    // if new value is not less than maximum available stock and stock is unlimited
    if((new_value < max_value) || isUnlimited == true){
        input_quantity_box.attr('value', new_value);
        input_quantity_box.val(new_value);
    }else{
        input_quantity_box.attr('value', max_value);
        input_quantity_box.val(max_value);
    }

    // Update price text after quantity changed
    updatePriceText();
}

function minusQuantity(){
    var input_quantity_box = $('#product_input_quantity'),
        current_value = parseInt($('#product_input_quantity').attr('value')),
        min_value = 1,
        new_value = 1;

        new_value = current_value - 1;

    if(new_value >= min_value && new_value > 0){
        input_quantity_box.attr('value', new_value);
        input_quantity_box.val(new_value);
    }

    // Update price text after quantity changed
    updatePriceText();
}

function inputQuantity(event){
    var input_quantity_box = $('#product_input_quantity'),
        current_value = parseInt($('#product_input_quantity').attr('value')),
        max_value = parseInt($('#max-product-quantity').attr('value')),
        input_value = 1,
        isUnlimited = false;

        isUnlimited = isUnlimitedVariant();

    input_value = input_quantity_box.val();
    input_value = input_value.replace(/[^0-9\.]/g,''); // regex, which allow number only
    input_value = parseInt(input_value);

    if(input_quantity_box.val()){
        if((input_value < max_value) || isUnlimited){
            input_quantity_box.attr('value', input_value);
            input_quantity_box.val(input_value);
        } else {
            input_quantity_box.attr('value', max_value);
            input_quantity_box.val(max_value);
        }
    }

    // Update price text after quantity changed
    updatePriceText();
}

function disabledBundleButtons(){
    $("#btn-buynow, #btn-add-to-cart").attr('disabled', 'disabled');
}

function updateBundleAvailabilityText(productId, variantId, loopId){
    var row = $('#row_' + productId + '_' + loopId),
        span = row.find('#bundle_availability_' + variantId + '_' + loopId),
        selectedVariant = $('#variant_' + variantId + '_' + loopId),
        availability = selectedVariant.data('available');

    row.find('[id^="bundle_availability_"]').addClass('hidden');
    if(variantId && !availability){
        span.removeClass('hidden');
    }
}

function updateBundleFixQuantity(productId, variantId, loopId){
    var selectedBundleRow = $('#row_' + productId + '_' + loopId),
        selectedVariant = $('#variant_' + variantId + '_' + loopId),
        selectedFixQuantityElement = $('#fixed_quantity_' + loopId),
        bundleFixQuantity = selectedVariant.data('fixed-quantity');

    if(bundleFixQuantity === '' || bundleFixQuantity == null || typeof bundleFixQuantity === 'undefined'){
        selectedFixQuantityElement.addClass('hidden').text('');
        $('input[name="bundle_products[' + loopId + '][product_id]"]').parent('.bundle-variants').addClass('mb-3');

        if(!variantId){
            selectedBundleRow.find('.input-quantity').addClass('hidden');
        }else{
            selectedBundleRow.find('.input-quantity').removeClass('hidden');
        }
    }else{
        selectedFixQuantityElement.removeClass('hidden').text(bundleFixQuantity);
        $('input[name="bundle_products[' + loopId + '][product_id]"]').parent('.bundle-variants').removeClass('mb-3');
        selectedBundleRow.find('.input-quantity').addClass('hidden');
    }
}

function updateBundleThumbnailImage(productId, variantId, loopId){
    var selectedProductBundleImage = $('#img_bundle_' + productId + '_' + loopId),
        selectedVariantBundleImage = $('#img_bundle_' + variantId + '_' + loopId);

    if(!variantId){
        variantId = $('#product_bundle_' + productId + '_variant_' + loopId).val();
        selectedVariantBundleImage = $('#img_bundle_' + variantId + '_' + loopId);
    }

    var rowElement = $('#row_' + productId + '_' + loopId),
        bundleThumbnailElement = rowElement.find('.bundle-thumbnail').find('[id^="img_bundle_"]'),
        selectedVariant = $('#variant_' + variantId + '_' + loopId),
        image = selectedVariant.data('image');

    bundleThumbnailElement.addClass('hidden');
    rowElement.find('[id^="img_bundle_empty_"]').addClass('hidden');

    if(!image){
        var selectedEmptyImage = $('#img_bundle_empty_' + variantId + '_' + loopId);
        selectedProductBundleImage.removeClass('hidden');
        selectedEmptyImage.removeClass('hidden');
    }else{
        selectedVariantBundleImage.removeClass('hidden');
    }
}

function isUnlimitedBundleVariant(productId, loopId){
    var variantId = $('#product_bundle_' + productId + '_variant_' + loopId).val(),
        selectedVariant = $('#variant_' + variantId + '_' + loopId),
        isManageStock = selectedVariant.data('manage-stock');

    return !isManageStock;
}

function checkBundleSelect(productId, loopId){
    var inputQuantityBox = $('input[data-product-id="' + productId + '"][data-loop="' + loopId + '"]'),
        buttonPlus = $('.bundle-plus[data-product-id="' + productId + '"][data-loop="' + loopId + '"]'),
        buttonMinus = $('.bundle-minus[data-product-id="' + productId + '"][data-loop="' + loopId + '"]'),
        inputProductId = $('.bundle-variants').find('input[value="' + productId + '"][data-loop="' + loopId + '"]').val(),
        selectBundleVariants = $('.bundle-variants').find('input[value="' + productId + '"][data-loop="' + loopId + '"]').next('select').val(),
        selectedVariant = $('#variant_' + selectBundleVariants + '_' + loopId),
        available = false;

    if(typeof selectBundleVariants === 'undefined'){
        selectBundleVariants = $('#product_bundle_' + productId + '_variant_' + loopId).val();
        selectedVariant = $('#variant_' + selectBundleVariants + '_' + loopId);
    }

    if(selectBundleVariants !== ''){
        available = selectedVariant.data('available');
    }

    if((selectBundleVariants === '' && inputProductId === '') || available === false){
        buttonPlus.addClass('disabled opacity-50 cursor-not-allowed').attr('disabled', 'disabled');
        buttonMinus.addClass('disabled opacity-50 cursor-not-allowed').attr('disabled', 'disabled');
        inputQuantityBox.prop('readonly', true).prop('disabled', false);
    }else{
        buttonPlus.removeClass('disabled opacity-50 cursor-not-allowed').removeAttr('disabled');
        buttonMinus.removeClass('disabled opacity-50 cursor-not-allowed').removeAttr('disabled');
        inputQuantityBox.prop('readonly', false).prop('disabled', false);
    }
}

function resetBundleInputQuantity(productId, value = 1, loopId){
    var inputQuantityBox = $('input[data-product-id="' + productId + '"][data-loop="' + loopId + '"]');

    inputQuantityBox.attr('value', value);
    inputQuantityBox.val(value);
}

function plusBundleQuantity(productId, loopId){
    var inputQuantityBox = $('input[data-product-id="' + productId + '"][data-loop="' + loopId + '"]'),
        currentValue = parseInt(inputQuantityBox.attr('value'), 10) || 0,
        selectedProductVariant = $('#product_bundle_' + productId + '_variant_' + loopId).val(),
        selectedVariant = $('#variant_' + selectedProductVariant + '_' + loopId),
        maxValue = parseInt(selectedVariant.data('inventory-quantity'), 10) || 0,
        newValue = currentValue + 1,
        isUnlimited = isUnlimitedBundleVariant(productId, loopId);

    if(newValue <= maxValue || isUnlimited){
        inputQuantityBox.attr('value', newValue).val(newValue);
    }else{
        inputQuantityBox.attr('value', maxValue).val(maxValue);
    }

    updateBundlePriceText(productId, selectedProductVariant, loopId);
}

function minusBundleQuantity(productId, loopId){
    var inputQuantityBox = $('input[data-product-id="' + productId + '"][data-loop="' + loopId + '"]'),
        currentValue = parseInt(inputQuantityBox.attr('value'), 10) || 1,
        selectedProductVariant = $('#product_bundle_' + productId + '_variant_' + loopId).val(),
        newValue = currentValue - 1;

    if(newValue >= 1){
        inputQuantityBox.attr('value', newValue).val(newValue);
    }

    updateBundlePriceText(productId, selectedProductVariant, loopId);
}

function inputBundleQuantity(productId, loopId){
    var inputQuantityBox = $('input[data-product-id="' + productId + '"][data-loop="' + loopId + '"]'),
        selectedProductVariant = $('#product_bundle_' + productId + '_variant_' + loopId).val(),
        selectedVariant = $('#variant_' + selectedProductVariant + '_' + loopId),
        maxValue = parseInt(selectedVariant.data('inventory-quantity'), 10) || 0,
        inputValue = inputQuantityBox.val().replace(/[^0-9\.]/g, ''),
        isUnlimited = isUnlimitedBundleVariant(productId, loopId);

    inputValue = parseInt(inputValue, 10) || 1;

    if(inputValue <= maxValue || isUnlimited){
        inputQuantityBox.attr('value', inputValue).val(inputValue);
    }else{
        inputQuantityBox.attr('value', maxValue).val(maxValue);
    }

    updateBundlePriceText(productId, selectedProductVariant, loopId);
}

function calculateTotalVisibleComparePrice(){
    var bundlesComparePrice = 0;

    $('.single-bundle-selector__select.select-bundle').each(function(){
        var bundleVariant = $(this).val(),
            loopId = $(this).prev().data('loop'),
            selectedBundleVariant = $('#variant_' + bundleVariant + '_' + loopId),
            bundleVariantDiscPrice = selectedBundleVariant.data('discount-price');

        if(!bundleVariantDiscPrice){
            selectedBundleVariant = $('#variant_' + $(this).find('option:nth-child(2)').val() + '_' + loopId);
            bundleVariantDiscPrice = selectedBundleVariant.data('discount-price');
        }

        var currentBundleQuantity = $('input[data-product-id="' + selectedBundleVariant.parent().data('product-id') + '"][data-loop="' + loopId + '"].bundle-quantity-form').val() || 1;
        bundlesComparePrice += parseMoneyValue(bundleVariantDiscPrice) * currentBundleQuantity;
    });

    return bundlesComparePrice;
}

function calculateTotalVisiblePrice(){
    var bundlePriceTotal = 0;

    $('.single-bundle-selector__select.select-bundle').each(function(){
        var bundleVariant = $(this).val(),
            loopId = $(this).prev().data('loop'),
            selectedBundleVariant = $('#variant_' + bundleVariant + '_' + loopId),
            bundleVariantPrice = selectedBundleVariant.data('price');

        if(!bundleVariantPrice){
            selectedBundleVariant = $('#variant_' + $(this).find('option:nth-child(2)').val() + '_' + loopId);
            bundleVariantPrice = selectedBundleVariant.data('price');
        }

        var currentBundleQuantity = $('input[data-product-id="' + selectedBundleVariant.parent().data('product-id') + '"][data-loop="' + loopId + '"].bundle-quantity-form').val() || 1;
        bundlePriceTotal += parseMoneyValue(bundleVariantPrice) * currentBundleQuantity;
    });

    return bundlePriceTotal;
}

function calculateSavedPrice(){
    return calculateTotalVisibleComparePrice() - calculateTotalVisiblePrice();
}

function updateBundlePriceText(productId, bundleVariantId = null, loopId){
    var selectedVariantId = bundleVariantId || $('#product_bundle_' + productId + '_variant_' + loopId).val(),
        selectedVariant = $('#variant_' + selectedVariantId + '_' + loopId),
        selectedBundlePriceVariantElement = $(document.getElementById(selectedVariantId + '_' + loopId)),
        inputQuantityBox = $('input[data-product-id="' + productId + '"][data-loop="' + loopId + '"]'),
        currentQuantity = parseInt(inputQuantityBox.attr('value'), 10) || parseInt(inputQuantityBox.val(), 10) || 1,
        formattedBundlePrice = selectedVariant.data('price'),
        formattedBundleDiscountPrice = selectedVariant.data('discount-price'),
        currencyType = getMoneyCurrency(formattedBundlePrice),
        storeCurrency = $('#product-price').data('currency'),
        fixedSize = (storeCurrency === 'IDR') ? 0 : 2,
        bundlePrice = parseMoneyValue(formattedBundlePrice),
        bundleDiscountPrice = parseMoneyValue(formattedBundleDiscountPrice),
        totalBundlePrice = bundlePrice * currentQuantity,
        totalBundleDiscountPrice = bundleDiscountPrice * currentQuantity,
        totalBundlesPrice = calculateTotalVisiblePrice(),
        totalBundleComparePrice = calculateTotalVisibleComparePrice(),
        totalBundlesSavedPrice = totalBundleComparePrice - totalBundlesPrice,
        totalBundleSavedPrice = totalBundleDiscountPrice - totalBundlePrice,
        bundlePriceElement = $('#bundle-price_' + selectedVariantId + '_' + loopId),
        bundleDiscountPriceElement = $('#bundle-discount-price-single_' + selectedVariantId + '_' + loopId),
        bundlesSavedPriceElement = $('#bundle-saved-price'),
        bundleSavedPriceElement = $('#bundle-saved-price_' + selectedVariantId + '_' + loopId);

    if(!formattedBundlePrice){
        return;
    }

    $('.bundle-price-variants[data-loop="' + loopId + '"]').addClass('hidden').removeClass('block');
    $('.bundle-saved-price-variant[data-loop="' + loopId + '"]').addClass('hidden').removeClass('block');
    selectedBundlePriceVariantElement.removeClass('hidden').addClass('block');

    if(totalBundlesSavedPrice < 0){
        totalBundlesSavedPrice = 0;
    }

    if(totalBundleSavedPrice <= 0){
        bundleSavedPriceElement.addClass('hidden');
        bundleDiscountPriceElement.addClass('hidden');
    }else{
        bundleSavedPriceElement.removeClass('hidden').addClass('block').text('(Save ' + formatMoneyValue(totalBundleSavedPrice, currencyType, fixedSize) + ')');
        bundleDiscountPriceElement.removeClass('hidden');
    }

    if(totalBundlesSavedPrice <= 0){
        bundlesSavedPriceElement.text('Grab This Amazing Bundle Now!');
    }else{
        bundlesSavedPriceElement.html('<b>Save ' + formatMoneyValue(totalBundlesSavedPrice, currencyType, fixedSize) + '</b> With This Bundle!');
    }

    $('#product-price').text(formatMoneyValue(totalBundlesPrice, currencyType, fixedSize));
    if(totalBundleComparePrice > totalBundlesPrice){
        $('#discount-price-single').text(formatMoneyValue(totalBundleComparePrice, currencyType, fixedSize)).removeClass('hidden').show();
    }else{
        $('#discount-price-single').text('').hide();
    }

    if($('#atome-price').length > 0){
        $('#atome-price').text(formatMoneyValue(totalBundlesPrice / 3, currencyType, fixedSize));
    }

    bundlePriceElement.text(formatMoneyValue(totalBundlePrice, currencyType, fixedSize));

    if(formattedBundleDiscountPrice && totalBundleDiscountPrice > totalBundlePrice){
        bundleDiscountPriceElement.text(formatMoneyValue(totalBundleDiscountPrice, currencyType, fixedSize));
    }
}

// Handle Add to Cart button - intercept form submission and open cart drawer
$(document).on('click touchend', '#btn-add-to-cart', function(e) {
    // Prevent double-firing from both touch and click events
    if (e.type === 'touchend') {
        e.preventDefault();
        // Small delay to let any pending DOM updates complete on iOS Safari
        var self = this;
        setTimeout(function() { handleAddToCart.call(self, e); }, 10);
        return;
    }
    handleAddToCart.call(this, e);
});

function isBundleForm(form){
    var action = form.attr('action') || '';
    return form.is('#product-bundle-form') || action.indexOf('/bundle') !== -1 || action.indexOf('cart/add/bundle') !== -1;
}

function validateBundleSelections(form){
    var formScope = form && form.length ? form : $(document),
        bundleSelects = formScope.find('.single-bundle-selector__select.select-bundle'),
        invalidBundleNames = [],
        isValid = true;

    if(bundleSelects.length === 0){
        return true;
    }

    bundleSelects.removeClass('border-red-500');

    bundleSelects.each(function(){
        var select = $(this),
            variantId = select.val(),
            productInput = select.prev('input[name$="[product_id]"]'),
            loopId = productInput.data('loop'),
            selectedVariant = $('#variant_' + variantId + '_' + loopId),
            bundleName = select.data('bundle-name') || select.closest('[id^="row_"]').find('h3').first().text().trim() || 'bundle product';

        if(!variantId || !selectedVariant.data('available')){
            isValid = false;
            invalidBundleNames.push(bundleName);
            select.addClass('border-red-500');
            return false;
        }
    });

    if(!isValid){
        showProductOptionAlert(formScope, 'Please select product variation for ' + invalidBundleNames[0] + ' first');
    }else{
        formScope.find('#option-alert').addClass('hidden');
    }

    return isValid;
}

function serializeAddToCartForm(form, submitter){
    var formDataArray = form.serializeArray();

    if(submitter && submitter.name){
        formDataArray.push({
            name: submitter.name,
            value: submitter.value || ''
        });
    }

    return $.param(formDataArray);
}

function reloadWithCartDrawer(){
    window.location.href = window.location.pathname + '?cart=open';
}

function ensureBundleCartFrame(){
    var frame = document.getElementById('bundle-cart-frame');

    if(!frame){
        frame = document.createElement('iframe');
        frame.id = 'bundle-cart-frame';
        frame.name = 'bundle-cart-frame';
        frame.style.display = 'none';
        document.body.appendChild(frame);
    }

    return frame;
}

function submitBundleToCartDrawer(form, btn){
    var frame = ensureBundleCartFrame(),
        originalText = btn.text(),
        didLoad = false,
        hiddenAddInput = form.find('input[type="hidden"][name="add"]');

    btn.data('adding', true);
    btn.prop('disabled', true);
    btn.text('Adding...');

    if(!hiddenAddInput.length){
        hiddenAddInput = $('<input>', {
            type: 'hidden',
            name: 'add',
            value: '1'
        }).appendTo(form);
    }else{
        hiddenAddInput.val('1');
    }

    $(frame).off('load.bundleCart').on('load.bundleCart', function(){
        var frameUrl = '';

        try{
            frameUrl = frame.contentWindow.location.href;
        }catch(error){
            frameUrl = '';
        }

        if(!frameUrl || frameUrl === 'about:blank'){
            return;
        }

        if(!didLoad){
            didLoad = true;
            reloadWithCartDrawer();
        }
    });

    form.attr('target', frame.name);
    form.get(0).submit();

    setTimeout(function(){
        if(!didLoad){
            btn.data('adding', false);
            btn.prop('disabled', false);
            btn.text(originalText);
            showProductOptionAlert(form, 'The cart did not respond. Please try Add to cart again.');
        }
    }, 12000);
}

function showProductOptionAlert(form, message){
    var formScope = form && form.length ? form : $(document),
        optionAlert = formScope.find('#option-alert');

    if(!optionAlert.length){
        optionAlert = $('#option-alert');
    }

    optionAlert.text(message || 'Please select product variation first');
    optionAlert.removeClass('hidden');

    if(optionAlert.length){
        $('html, body').animate({
            scrollTop: optionAlert.offset().top - 100
        }, 300);
    }
}

function hideProductOptionAlert(form){
    var formScope = form && form.length ? form : $(document);

    formScope.find('#option-alert').addClass('hidden');
    formScope.find('.border-red-500').removeClass('border-red-500');
}

function getOptionFieldLabel(field){
    var labelText = field.closest('.mb-4').find('label').first().text();

    labelText = $.trim(labelText);

    return labelText || 'required option';
}

function validateRequiredCustomOptions(form){
    var isValid = true,
        missingLabel = '',
        requiredFields = form.find('input[required], select[required], textarea[required]').filter(function(){
            var field = $(this);

            return field.is(':visible') && !field.hasClass('selected-option-value');
        });

    requiredFields.removeClass('border-red-500');

    requiredFields.each(function(){
        var field = $(this),
            value = $.trim(field.val() || '');

        if(!value){
            isValid = false;
            missingLabel = getOptionFieldLabel(field);
            field.addClass('border-red-500');
            return false;
        }
    });

    if(!isValid){
        showProductOptionAlert(form, 'Please enter ' + missingLabel + ' first');
    }

    return isValid;
}

$(document).on('submit', 'form', function(e) {
    var form = $(this),
        nativeEvent = e.originalEvent || {},
        submitter = $(nativeEvent.submitter || document.activeElement);

    if(!isBundleForm(form) || submitter.is('#btn-buynow') || submitter.attr('name') === 'express'){
        return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();
    handleAddToCart.call(form.find('#btn-add-to-cart').get(0), e);
    return false;
});

function resyncSelectedVariantFromButtons(form){
    var selectedOptionInput = document.getElementById('selected-option'),
        selectedOptionValue = selectedOptionInput ? selectedOptionInput.value : '';

    if(selectedOptionValue){
        return selectedOptionValue;
    }

    var totalOptionGroups = form.find('#variants_options .selected-option-value').length,
        selectedButtons = form.find('#variants_options .select-option-btn.border-primary');

    if(selectedButtons.length === totalOptionGroups && totalOptionGroups > 0){
        var selectedOptions = {},
            allValid = true;

        selectedButtons.each(function(){
            var btn = $(this),
                optionName = btn.data('option-name'),
                optionValue = btn.data('option-value');

            if(optionName && optionValue){
                btn.closest('.mb-4').find('.selected-option-value').val(optionValue);
                selectedOptions[optionName] = optionValue;
            }else{
                allValid = false;
            }
        });

        if(allValid && Object.keys(selectedOptions).length === totalOptionGroups){
            processSelectOptions(selectedOptions);
            selectedOptionValue = document.getElementById('selected-option').value;
        }
    }

    return selectedOptionValue;
}

function handleAddToCart(e) {
    if(e){
        e.preventDefault();
    }

    var form = $(this).closest('form');

    if(!form.length){
        return;
    }

    var btn = $(this);

    if(btn.data('adding')){
        return;
    }

    if(isBundleForm(form) && !validateBundleSelections(form)){
        return;
    }

    if(!validateRequiredCustomOptions(form)){
        return;
    }

    var hasVariantOptions = form.find('#variants_options .selected-option-value').length > 0 || form.find('.select-variant-btn').length > 0,
        selectedOptionValue = isBundleForm(form) ? true : resyncSelectedVariantFromButtons(form);

    if(hasVariantOptions && !isBundleForm(form) && (!selectedOptionValue || selectedOptionValue === '')){
        showProductOptionAlert(form, 'Please select product variation first');
        return;
    }

    hideProductOptionAlert(form);

    if(isBundleForm(form)){
        submitBundleToCartDrawer(form, btn);
        return;
    }

    form.removeAttr('target');
    var formData = serializeAddToCartForm(form, this);

    // Disable button and show loading state
    var originalText = btn.text();
    btn.data('adding', true);
    btn.prop('disabled', true);
    btn.text('Adding...');

    $.ajax({
        url: form.attr('action'),
        method: 'POST',
        data: formData,
        success: function(response) {
            // Reload the page to update cart drawer content and count
            // Cart drawer will open automatically on page load
            reloadWithCartDrawer();
        },
        error: function(xhr, status, error) {
            // Re-enable button on error
            btn.data('adding', false);
            btn.prop('disabled', false);
            btn.text(originalText);

            // Show error message
            alert('Failed to add item to cart. Please try again.');
        }
    });
}

// Handle Buy Now button - validate option selection before form submission
$(document).on('click touchend', '#btn-buynow', function(e) {
    // Prevent double-firing from both touch and click events
    if (e.type === 'touchend') {
        e.preventDefault();
        var self = this;
        setTimeout(function() { handleBuyNow.call(self, e); }, 10);
        return;
    }
    return handleBuyNow.call(this, e);
});

function handleBuyNow(e) {
    if(e){
        e.preventDefault();
    }

    var form = $(this).closest('form');

    if(isBundleForm(form) && !validateBundleSelections(form)){
        if(e && e.stopImmediatePropagation) e.stopImmediatePropagation();
        return false;
    }

    if(!validateRequiredCustomOptions(form)){
        if(e && e.stopImmediatePropagation) e.stopImmediatePropagation();
        return false;
    }

    var hasVariantOptions = form.find('#variants_options .selected-option-value').length > 0 || form.find('.select-variant-btn').length > 0,
        selectedOptionValue = isBundleForm(form) ? true : resyncSelectedVariantFromButtons(form);

    if(hasVariantOptions && !isBundleForm(form) && (!selectedOptionValue || selectedOptionValue === '')){
        showProductOptionAlert(form, 'Please select product variation first');
        if(e && e.stopImmediatePropagation) e.stopImmediatePropagation();
        return false;
    }

    hideProductOptionAlert(form);

    // Add hidden input for express checkout (button value isn't sent with form.submit())
    if (!form.find('input[name="express"]').length) {
        form.append('<input type="hidden" name="express" value="1">');
    }

    form.removeAttr('target');
    form.get(0).submit();
    return true;
}

// ============================================
// SOCIAL PROOF NOTIFICATIONS
// ============================================
$(document).ready(function() {
    const container = document.querySelector('.social-proofs');
    if (!container) return;

    let currentPopup = null;
    let notificationQueue = [];
    let currentIndex = 0;
    let isShowing = false;
    let autoHideTimeout = null;

    // Convert country code to flag emoji
    function getFlagEmoji(countryCode) {
        if (!countryCode) return '🌏';

        const code = countryCode.trim().toUpperCase();

        // Validate it's a 2-letter country code
        if (code.length !== 2 || !/^[A-Z]{2}$/.test(code)) {
            return '🌏';
        }

        return code.replace(/./g, char =>
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    // Create popup HTML
    function createPopup(data) {
        const popup = document.createElement('div');
        popup.className = 'social-proof-popup fixed bottom-0 left-0 right-0 md:bottom-6 md:left-6 md:right-auto bg-card border-t md:border border-secondary-border/30 md:rounded-lg shadow-2xl w-full md:max-w-sm z-50 opacity-0 invisible transition-all duration-300';

        // Extract data from API response
        const customerName = data.customer?.name || 'Someone';
        const customerState = data.customer?.state || 'a state';
        const customerCountryCode = data.customer?.country_code || 'MY';
        const countryFlag = getFlagEmoji(customerCountryCode);
        const productName = data.product?.name || 'a product';
        const productImage = data.product?.featured_image || data.product?.image || null;
        const totalOrderPrice = data.total_order_price || '';

        // Build image HTML only if product has an image
        // Mobile: w-16 h-16 cropped square, Desktop: w-16 with auto height (aspect ratio maintained)
        const imageHtml = productImage ? `
                <div class="flex-shrink-0">
                    <div class="w-16 h-16 md:h-auto bg-secondary-border/20 rounded overflow-hidden">
                        <img src="${productImage}" alt="${productName}" class="w-full h-full md:h-auto object-cover md:object-contain">
                    </div>
                </div>
        ` : '';

        popup.innerHTML = `
            <div class="relative p-4 flex gap-4 items-center">
                <!-- Close Button -->
                <button class="close-popup absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-secondary hover:text-accent transition-colors z-10">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>

                ${imageHtml}

                <!-- Content Column -->
                <div class="flex-1 min-w-0 pr-6">
                    <p class="text-xs md:text-sm text-accent mb-1">
                        <span class="font-normal">${customerName}</span> from <span class="font-normal">${customerState}, ${countryFlag}</span> recently ordered <span class="font-medium">${productName}</span>${totalOrderPrice ? ` <span class="font-medium">${totalOrderPrice}</span>` : ''}
                    </p>
                    <div class="flex items-center gap-1 text-[10px] md:text-xs text-secondary">
                        <svg class="w-3 h-3 md:w-4 md:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span>Verified order by Shoppego</span>
                    </div>
                </div>
            </div>
        `;

        // Add close button handler
        const closeBtn = popup.querySelector('.close-popup');
        closeBtn.addEventListener('click', () => {
            if (autoHideTimeout) {
                clearTimeout(autoHideTimeout);
                autoHideTimeout = null;
            }
            hidePopup(popup);
            // Move to next notification and schedule it
            currentIndex = (currentIndex + 1) % notificationQueue.length;
            setTimeout(showNextNotification, 8000);
        });

        return popup;
    }

    // Show popup
    function showPopup(popup) {
        container.appendChild(popup);
        setTimeout(() => {
            popup.classList.remove('opacity-0', 'invisible');
            popup.classList.add('opacity-100', 'visible');
        }, 100);
    }

    // Hide popup
    function hidePopup(popup) {
        if (!popup) return;

        popup.classList.remove('opacity-100', 'visible');
        popup.classList.add('opacity-0', 'invisible');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
            currentPopup = null;
            isShowing = false;
        }, 300);
    }

    // Show next notification
    function showNextNotification() {
        // Prevent showing if already showing or queue is empty
        if (isShowing || notificationQueue.length === 0) return;

        isShowing = true;

        // Clear any existing timeout
        if (autoHideTimeout) {
            clearTimeout(autoHideTimeout);
            autoHideTimeout = null;
        }

        // Hide current popup if exists
        if (currentPopup) {
            hidePopup(currentPopup);
            // Wait for hide animation to complete before showing next
            setTimeout(() => {
                displayNextPopup();
            }, 400);
        } else {
            displayNextPopup();
        }
    }

    function displayNextPopup() {
        const data = notificationQueue[currentIndex];
        currentPopup = createPopup(data);
        showPopup(currentPopup);

        // Auto hide after 8 seconds
        autoHideTimeout = setTimeout(() => {
            if (currentPopup) {
                hidePopup(currentPopup);
                // Move to next notification and schedule it
                currentIndex = (currentIndex + 1) % notificationQueue.length;
                setTimeout(showNextNotification, 8000);
            }
        }, 8000);
    }

    // Fetch recent orders
    fetch('/recent.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                notificationQueue = data;
                // Show first notification after 3 seconds
                setTimeout(showNextNotification, 3000);
            }
        })
        .catch(() => {
            // Silently fail if social proof notifications not available
        });
});

// ============================================
// WHATSAPP WIDGET
// ============================================
$(document).ready(function() {
    const widget = document.getElementById('whatsapp-widget');
    if (!widget) return;

    const toggle = document.getElementById('whatsapp-toggle');
    const card = document.getElementById('whatsapp-card');
    const cta = document.getElementById('whatsapp-cta');
    const iconOpen = document.getElementById('whatsapp-icon-open');
    const iconClose = document.getElementById('whatsapp-icon-close');

    const phoneNumber = widget.dataset.whatsappNumber;
    const defaultMessage = widget.dataset.defaultMessage;

    let isCardOpen = false;
    let hasShown = false;

    // Build WhatsApp URL
    const whatsappUrl = 'https://wa.me/' + phoneNumber + '?text=' + encodeURIComponent(defaultMessage);

    // Show widget on scroll
    function handleScroll() {
        if (!hasShown && window.scrollY > 300) {
            hasShown = true;
            widget.classList.remove('opacity-0', 'pointer-events-none');
            widget.classList.add('opacity-100', 'pointer-events-auto');
        }
    }

    // Check if mobile viewport
    function isMobile() {
        return window.innerWidth < 768;
    }

    // Toggle card open/close
    function toggleCard() {
        isCardOpen = !isCardOpen;

        if (isCardOpen) {
            card.classList.remove('hidden');
            setTimeout(() => {
                card.classList.remove('translate-y-4', 'opacity-0');
                card.classList.add('translate-y-0', 'opacity-100');
            }, 10);
            iconOpen.classList.add('hidden');
            iconClose.classList.remove('hidden');
            // Center the toggle button on mobile when card is open
            if (isMobile()) {
                widget.classList.remove('items-end');
                widget.classList.add('items-center');
            }
        } else {
            card.classList.remove('translate-y-0', 'opacity-100');
            card.classList.add('translate-y-4', 'opacity-0');
            setTimeout(() => {
                card.classList.add('hidden');
            }, 300);
            iconOpen.classList.remove('hidden');
            iconClose.classList.add('hidden');
            // Return toggle button to right on mobile when card is closed
            if (isMobile()) {
                widget.classList.remove('items-center');
                widget.classList.add('items-end');
            }
        }
    }

    // Close card when clicking outside
    function handleClickOutside(e) {
        if (isCardOpen && !widget.contains(e.target)) {
            toggleCard();
        }
    }

    // Handle CTA click - open WhatsApp
    function handleCtaClick(e) {
        e.preventDefault();
        e.stopPropagation();
        window.open(whatsappUrl, '_blank');
    }

    // Event listeners
    window.addEventListener('scroll', handleScroll);
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCard();
    });
    cta.addEventListener('click', handleCtaClick);
    document.addEventListener('click', handleClickOutside);

    // Check initial scroll position
    handleScroll();
});

// Checkout button loading state
$(document).on('click', '#btn-checkout, #btn-checkout-drawer', function() {
    var $btn = $(this);
    var isDrawer = $btn.attr('id') === 'btn-checkout-drawer';
    var $spinner = isDrawer ? $('#checkout-drawer-spinner') : $('#checkout-spinner');
    var $text = isDrawer ? $('#checkout-drawer-text') : $('#checkout-text');

    // Show spinner and update text
    $spinner.removeClass('hidden');
    $text.text('Processing...');

    // Disable button after a short delay to allow form submission
    setTimeout(function() {
        $btn.attr('disabled', true);
    }, 100);
});

// Buy now button loading state
$(document).on('click', '#btn-buynow', function() {
    var $btn = $(this);
    var $spinner = $('#buynow-spinner');
    var $text = $('#buynow-text');

    // Show spinner and update text
    $spinner.removeClass('hidden');
    $text.text('Processing...');

    // Disable button after a short delay to allow form submission
    setTimeout(function() {
        $btn.attr('disabled', true);
    }, 100);
});

// Reset button states when page is loaded from browser back/forward cache
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        // Reset checkout buttons
        $('#btn-checkout, #btn-checkout-drawer').attr('disabled', false);
        $('#checkout-spinner, #checkout-drawer-spinner').addClass('hidden');
        $('#checkout-text').text('Checkout Now');
        $('#checkout-drawer-text').text('Checkout Now');

        // Reset buy now button
        $('#btn-buynow').attr('disabled', false);
        $('#buynow-spinner').addClass('hidden');
        $('#buynow-text').text('Buy now');
    }
});
