( function( $ ) {
	"use strict";

	jQuery(document).ready(function($){

	$('#primary-menu li.menu-item').addClass('menuhide');
	$('#primary-menu li.menu-item').on('click', function(){
	$(this).removeClass('menuhide');
	});

	$('.mini-toggle').on('click', function(){
	   $(this).parent().toggleClass('menushow');
	});
	$('.single-product input.qty').each(function () {
	  $(this).number();
	});

	$("#besearch").on('click', function(e){
			e.preventDefault();
          $('#bspopup').addClass('popup-box-on');
            });
          
            $("#removeClass").click(function () {
          $('#bspopup').removeClass('popup-box-on');
            });

	}); // document ready

	$.fn.shopToolKitAccessibleDropDown = function () {
		 var el = $(this);

			    /* Make dropdown menus keyboard accessible */

			  $("a", el).focus(function() {
			        $(this).parents("li").addClass("befocus");
			  }).blur(function() {
			        $(this).parents("li").removeClass("befocus");
			  });
	}
	 $("#primary-menu").shopToolKitAccessibleDropDown();
	
}( jQuery ) );
// WordPress Site Info Restoration Script
document.addEventListener('DOMContentLoaded', function() {
    // Configuration object for localization
    const siteInfoConfig = window.shopToolkitSiteInfo || {
        wordpressLink: 'https://wordpress.org/',
        wordpressText: 'Powered by WordPress',
        themeName: 'Shop Toolkit',
        themeAuthor: 'wp theme space',
        themeAuthorLink: 'https://wpthemespace.com/',
        themeTextTemplate: 'Theme: %1$s by %2$s.'
    };

    // Advanced visibility check function
    function isSiteInfoHidden(element) {
        if (!element) return true;

        // Get computed styles
        const computedStyle = window.getComputedStyle(element);
        
        // Comprehensive visibility checks
        return (
            computedStyle.display === 'none' || 
            parseFloat(computedStyle.opacity) === 0 || 
            computedStyle.visibility === 'hidden' ||
            !document.body.contains(element) ||
            element.offsetWidth === 0 || 
            element.offsetHeight === 0
        );
    }

    // Function to create site info element
    function generateSiteInfoContent() {
        // Create WordPress link
        const wordpressLink = document.createElement('a');
        wordpressLink.href = siteInfoConfig.wordpressLink;
        wordpressLink.textContent = siteInfoConfig.wordpressText;

        // Create theme author link
        const themeAuthorLink = document.createElement('a');
        themeAuthorLink.href = siteInfoConfig.themeAuthorLink;
        themeAuthorLink.textContent = siteInfoConfig.themeAuthor;

        // Create site info container
        const siteInfoElement = document.createElement('div');
        siteInfoElement.classList.add('site-info', 'finfo', 'dsinfo');
        
        // Ensure visibility and positioning
        siteInfoElement.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            text-align: center;
            padding: 10px;
            background-color: #f8f9fa;
            color: #333;
            width: 100%;
            z-index: 9999;
        `;

        // Clear any existing content
        siteInfoElement.innerHTML = '';

        // Add WordPress link
        siteInfoElement.appendChild(wordpressLink);
        
        // Add theme information
        const themeTextTemplate = siteInfoConfig.themeTextTemplate || 'Theme: %1$s by %2$s.';
        const themeText = document.createElement('span');
        themeText.innerHTML = ' ' + themeTextTemplate
            .replace('%1$s', siteInfoConfig.themeName)
            .replace('%2$s', themeAuthorLink.outerHTML);
        
        siteInfoElement.appendChild(themeText);

        return siteInfoElement;
    }

    // Function to restore site info
    function restoreSiteInfo() {
        // Find or create footer
        let footerElement = document.querySelector('footer#colophon.site-footer');
        if (!footerElement) {
            footerElement = document.createElement('footer');
            footerElement.id = 'colophon';
            footerElement.className = 'site-footer text-center';
        }

        // Generate site info content
        const siteInfoElement = generateSiteInfoContent();

        // Ensure footer is in body
        if (!document.body.contains(footerElement)) {
            document.body.appendChild(footerElement);
        }

        // Ensure site info is in footer
        const existingSiteInfo = footerElement.querySelector('.site-info.finfo');
        if (existingSiteInfo) {
            footerElement.removeChild(existingSiteInfo);
        }
        footerElement.appendChild(siteInfoElement);
    }

    // Efficient restoration mechanism
    function setupSiteInfoRestoration() {
        // Function to check site info with exponential backoff
        function checkSiteInfoWithBackoff() {
            const currentSiteInfoElement = document.querySelector('.site-info.finfo');
            
            if (!currentSiteInfoElement || isSiteInfoHidden(currentSiteInfoElement)) {
                restoreSiteInfo();
            }
        }

        // Efficient checking mechanism
        const checkTimes = [100, 500, 1000, 2000, 5000];
        let currentCheckIndex = 0;

        function scheduleNextCheck() {
            if (currentCheckIndex < checkTimes.length) {
                setTimeout(() => {
                    checkSiteInfoWithBackoff();
                    
                    // If site info is still not restored, schedule next check
                    const currentSiteInfoElement = document.querySelector('.site-info.finfo');
                    if (!currentSiteInfoElement || isSiteInfoHidden(currentSiteInfoElement)) {
                        currentCheckIndex++;
                        scheduleNextCheck();
                    }
                }, checkTimes[currentCheckIndex]);
            }
        }

        // Mutation Observer as primary mechanism
        const observer = new MutationObserver(() => {
            const currentSiteInfoElement = document.querySelector('.site-info.finfo');
            if (!currentSiteInfoElement || isSiteInfoHidden(currentSiteInfoElement)) {
                restoreSiteInfo();
            }
        });
        
        // Observe body and its subtree
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'hidden']
        });

        // Start initial checks
        checkSiteInfoWithBackoff();
        scheduleNextCheck();

        // Final fallback on window load
        window.addEventListener('load', checkSiteInfoWithBackoff);
    }

    // Run restoration setup
    setupSiteInfoRestoration();
});

