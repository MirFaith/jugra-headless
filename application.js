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
        var variant_id = btn.data('variant-id');
        var selected_variant = $('#variant_' + variant_id);

        // Update button active states - remove active state from all, add to clicked
        $('.select-variant-btn:not([data-sold-out="true"])').removeClass('border-primary').addClass('border-secondary-border');
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
    $('.select-option-btn').on('click', function() {
        var btn = $(this);
        var optionValue = btn.data('option-value');
        var isSoldOut = btn.data('sold-out') === true;

        // Update button active states within the same option group - remove active state from all, add to clicked
        btn.closest('.grid').find('.select-option-btn:not([data-sold-out="true"])').removeClass('border-primary').addClass('border-secondary-border');
        btn.closest('.grid').find('.select-option-btn .option-active-indicator').addClass('hidden');
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
                var key = input.attr('name');
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
    $('input#selected-option[name="id"]').val(selectedVariant.data('variant'));
}

function updatePriceText(variantId = null){
    var selectedVariant = $('#variant_' + $('#selected-option').val()),
        currentQuantity = $('#product_input_quantity').val(),
        formattedProductPrice, formattedDiscountPrice,
        formattedTotalPrice, formattedTotalDiscountPrice, productPrice, discountPrice,
        productPriceElement, discountPriceElement, currencyType, totalPrice = 0, totalDiscountPrice = 0;

        // override if variantId not null
    if(variantId){
        selectedVariant = $('#variant_' + variantId);
    }

    formattedProductPrice = selectedVariant.data('price');
    formattedDiscountPrice = selectedVariant.data('discount-price');

    currencyType = formattedProductPrice.match(/^\D+/g)[0];
    productPrice = formattedProductPrice.replace(/[^0-9.]/g, '');

    // Only extract discount price if it exists and has valid format
    if (formattedDiscountPrice && formattedDiscountPrice.toString().match(/^\D+/g)) {
        discountPrice = formattedDiscountPrice.replace(/[^0-9.]/g, '');
    } else {
        discountPrice = '0.00';
    }

    // if input quantity box not exist, set default to 1
    currentQuantity = currentQuantity? currentQuantity : 1;

    productPriceElement = $('#product-price');
    discountPriceElement = $('#discount-price-single');

    totalPrice = productPrice * currentQuantity;
    formattedTotalPrice = currencyType + totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Set the price
    productPriceElement.text(formattedTotalPrice);

    // If variant is available and have discount price, calculate and display it
    if(selectedVariant.data('available') && formattedDiscountPrice && discountPrice !== '0.00'){
        totalDiscountPrice = discountPrice * currentQuantity;
        formattedTotalDiscountPrice = currencyType + totalDiscountPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        discountPriceElement.text(formattedTotalDiscountPrice);
        discountPriceElement.show();
    } else {
        discountPriceElement.text('');
        discountPriceElement.hide();
    }

    // Update Atome price (divide by 3)
    var atomePriceElement = $('#atome-price');
    if (atomePriceElement.length > 0) {
        var atomePrice = (totalPrice / 3).toFixed(2);
        var formattedAtomePrice = currencyType + parseFloat(atomePrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        atomePriceElement.text(formattedAtomePrice);
    }
}

function enableButtons(){
    var btn, text;

    $("#btn-buynow, #btn-add-to-cart").each(function(){
        btn = $(this);
        text = (btn).is('#btn-buynow')? 'Buy now' : 'Add to cart';

        btn.removeAttr('disabled', 'disabled');
        btn.text(''); // clear first

        {% if settings.options.btn_buy_now_text %}
        // override from settings
        text = (btn).is('#btn-buynow')?  '{{ settings.options.btn_buy_now_text }}' : text;
        {% endif %}

        btn.html(text);
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
        btn.text('Sold out');
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

function handleAddToCart(e) {
    e.preventDefault();

    // Check if option selection is required (product has variant options)
    var hasVariantOptions = $('#variants_options').length > 0;

    // Use native DOM for more reliable reads on iOS Safari
    var selectedOptionInput = document.getElementById('selected-option');
    var selectedOptionValue = selectedOptionInput ? selectedOptionInput.value : '';

    // iOS Safari bfcache fix: If variant should be selected but hidden input is empty,
    // try to re-sync from visually selected buttons (CSS classes survive bfcache)
    if (hasVariantOptions && (!selectedOptionValue || selectedOptionValue === '')) {
        var totalOptionGroups = $('#variants_options').find('.selected-option-value').length;
        var selectedButtons = $('#variants_options').find('.select-option-btn.border-primary');

        // Only attempt re-sync if ALL option groups have a visually selected button
        if (selectedButtons.length === totalOptionGroups && totalOptionGroups > 0) {
            var selectedOptions = {};
            var allValid = true;

            selectedButtons.each(function() {
                var btn = $(this);
                var optionName = btn.data('option-name');
                var optionValue = btn.data('option-value');
                if (optionName && optionValue) {
                    btn.closest('.mb-4').find('.selected-option-value').val(optionValue);
                    selectedOptions[optionName] = optionValue;
                } else {
                    allValid = false;
                }
            });

            // Re-process to update #selected-option with correct variant ID
            if (allValid && Object.keys(selectedOptions).length === totalOptionGroups) {
                processSelectOptions(selectedOptions);
                // Re-read the value after processing using native DOM
                selectedOptionValue = document.getElementById('selected-option').value;
            }
        }
    }

    if (hasVariantOptions && (!selectedOptionValue || selectedOptionValue === '')) {
        // Show alert
        var optionAlert = $('#option-alert');
        optionAlert.removeClass('hidden');
        // Scroll to alert
        $('html, body').animate({
            scrollTop: optionAlert.offset().top - 100
        }, 300);
        return;
    }

    // Hide alert if previously shown
    $('#option-alert').addClass('hidden');

    var form = $(this).closest('form');
    var formData = form.serialize();

    // Disable button and show loading state
    var btn = $(this);
    var originalText = btn.text();
    btn.prop('disabled', true);
    btn.text('Adding...');

    $.ajax({
        url: form.attr('action'),
        method: 'POST',
        data: formData,
        success: function(response) {
            // Reload the page to update cart drawer content and count
            // Cart drawer will open automatically on page load
            window.location.href = window.location.pathname + '?cart=open';
        },
        error: function(xhr, status, error) {
            // Re-enable button on error
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
    handleBuyNow.call(this, e);
});

function handleBuyNow(e) {
    e.preventDefault();

    // Check if option selection is required (product has variant options)
    var hasVariantOptions = $('#variants_options').length > 0;

    // Use native DOM for more reliable reads on iOS Safari
    var selectedOptionInput = document.getElementById('selected-option');
    var selectedOptionValue = selectedOptionInput ? selectedOptionInput.value : '';

    // iOS Safari bfcache fix: If variant should be selected but hidden input is empty,
    // try to re-sync from visually selected buttons
    if (hasVariantOptions && (!selectedOptionValue || selectedOptionValue === '')) {
        var totalOptionGroups = $('#variants_options').find('.selected-option-value').length;
        var selectedButtons = $('#variants_options').find('.select-option-btn.border-primary');

        if (selectedButtons.length === totalOptionGroups && totalOptionGroups > 0) {
            var selectedOptions = {};
            var allValid = true;

            selectedButtons.each(function() {
                var btn = $(this);
                var optionName = btn.data('option-name');
                var optionValue = btn.data('option-value');
                if (optionName && optionValue) {
                    btn.closest('.mb-4').find('.selected-option-value').val(optionValue);
                    selectedOptions[optionName] = optionValue;
                } else {
                    allValid = false;
                }
            });

            if (allValid && Object.keys(selectedOptions).length === totalOptionGroups) {
                processSelectOptions(selectedOptions);
                selectedOptionValue = document.getElementById('selected-option').value;
            }
        }
    }

    if (hasVariantOptions && (!selectedOptionValue || selectedOptionValue === '')) {
        // Show alert
        var optionAlert = $('#option-alert');
        optionAlert.removeClass('hidden');
        // Scroll to alert
        $('html, body').animate({
            scrollTop: optionAlert.offset().top - 100
        }, 300);
        return;
    }

    // Hide alert if previously shown
    $('#option-alert').addClass('hidden');

    // Explicitly submit the form with express parameter
    var form = $(this).closest('form');

    // Add hidden input for express checkout (button value isn't sent with form.submit())
    if (!form.find('input[name="express"]').length) {
        form.append('<input type="hidden" name="express" value="1">');
    }

    form.get(0).submit();
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