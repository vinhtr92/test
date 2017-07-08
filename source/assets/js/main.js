(function ($) {
    'use strict';
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    function featureReview() {
        $('[data-init="featureReview"]').each(function() {
            var $el = $(this);
            var _position = $el.data('position');
            var $action = $el.find('[data-event-listener="action"]');

            $el.fadeIn();

            $el.css(_position);

            $action.on('click', function() {
                if ($(this).hasClass('in')) {
                    $(this).stop().toggleClass('in');
                } else {
                    $el.parent().find('.in').removeClass('in');
                    $(this).stop().toggleClass('in');
                }
            });
        });
    };

    function acSwiper() {
        $('[data-init="swiper"]').each(function() {
            var swiper = $(this);

            var swiperDefault = {
                direction: 'horizontal',
                speed: 300,
                autoHeight: false,
                spaceBetween: 0, // Distance between slides in px.
                autoplay: false,
                autoplayDisableOnInteraction: false,
                effect: 'slide', // Options: slide | fade | cube | coverflow | flip.
                slidesPerView: 1, // Options: number | auto.
                centeredSlides: false,
                slideToClickedSlide: true,
                simulateTouch: true,
                pagination: null,
                paginationType: 'bullets', // Options: bullets | fraction | progress | custom.
                paginationClickable: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                preloadImages: true,
                lazyLoading: false,
                loop: false,
                breakpoints: {
                    1200: {
                        slidesPerView: 1
                    },
                    992: {
                        slidesPerView: 1,
                        direction: 'horizontal'
                    },
                    768: {
                        slidesPerView: 1,
                        direction: 'horizontal'
                    },
                    576: {
                        slidesPerView: 1,
                        direction: 'horizontal'
                    }
                }
            };

            var dataXLItems = (swiper.data('xl-items') !== undefined) ? swiper.data('xl-items') : 1,
                dataLGItems = (swiper.data('lg-items') !== undefined) ? swiper.data('lg-items') : 1,
                dataMDItems = (swiper.data('md-items') !== undefined) ? swiper.data('md-items') : 1,
                dataSMItems = (swiper.data('sm-items') !== undefined) ? swiper.data('sm-items') : 1;

            // Merge settings.
            var settings = $.extend(swiperDefault, swiper.data());
            delete settings.init;

            if(settings.sync)
                delete settings.sync;

            // Build breakpoints.
            if(settings.breakpoints) {
                var _breakpoints = {
                    1200: {
                        slidesPerView: dataXLItems
                    },
                    992: {
                        slidesPerView: dataLGItems,
                        direction: 'horizontal'
                    },
                    768: {
                        slidesPerView: dataMDItems,
                        direction: 'horizontal'
                    },
                    576: {
                        slidesPerView: dataSMItems,
                        direction: 'horizontal'
                    }
                };

                settings.breakpoints = _breakpoints;
            };

            delete settings.xlItems;
            delete settings.lgItems;
            delete settings.mdItems;
            delete settings.smItems;

            var slider = new Swiper(swiper, settings);
            swiper.data('swiper', slider);
        });
    };

    function acSwiperSync() {
        $('[data-swiper-sync]').each(function() {
            var $el = $(this);

            var currentSwiper = $(this).data('swiper');
            if (typeof currentSwiper === 'undefined') {
                return;
            }

            // Get target swiper from data object.
            var $target = $($el.data('swiperSync'));
            if ($target.length && typeof $target.data('swiper') !== 'undefined') {
                var targetSwiper = $target.data('swiper');

                // Sync both swipers.
                currentSwiper.params.control = targetSwiper;
                targetSwiper.params.control  = currentSwiper;

                console.log(currentSwiper);
                console.log(targetSwiper);
            }
        });
    }

    function isotopeIzi() {
        $('.js-masonry').masonry({
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
        });

        $.fn.setWidth = function() {
            var $self = $(this);
            $self.on('setWidth', function() {
                $(this).css('width', '');
                var width = $(this).width();
                $(this).css('width', width + 'px');

            }).trigger('setWidth');
            $(window).on('resize', function() {
                $self.trigger('setWidth');
            });
        }

        $('.js-masonry > .grid-item').setWidth();
    }

    function magnificPopup() {
        $('.popup-gallery').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0,1] // Will preload 0 - before current, and 1 after the current image
        },
        image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
            titleSrc: function(item) {
                return item.el.attr('title') + '<small>by Marsel Van Oosten</small>';
            }
        }
        });
    }

    function jqueryUI() {
        var handle = $( ".pricing-12 #amount span" );
        var datamin = $(".pricing-12 #slider-range-min").data("min");
        var datamax = $(".pricing-12 #slider-range-min").data("max");

        $( ".pricing-12 #slider-range-min" ).slider({
            range: "min",
            value: 4000,
            min: datamin,
            max: datamax,

            create: function() {
                handle.text( $( this ).slider( "value" ) );
            },

            slide: function( event, ui ) {
                handle.text(ui.value );
                var width = $(this).find('.ui-slider-range').attr('style');
                var fixString = width.replace('width:', '');
                var fixString = fixString.replace(';', '');

                $('.pricing__measure .overlay').css({
                    'width': fixString
                });
            }
        });

        $( ".pricing-15 #slider-range-min" ).slider({
            range: "min",
            value: 37,
            min: 1,
            max: 700,
            slide: function( event, ui ) {
                $( "#amount" ).val( "$" + ui.value );
            }
        });

        $( "#amount" ).val( "$" + $( "#slider-range-min" ).slider( "value" ) );

        var spinner = $('input[type="number"]', '.choose-option--quantity').spinner({
            spin: function(event, ui) {
                if (ui.value < 0) {
                    $(this).spinner("value", 0);
                    return false;
                };
            }
        });
    }

    //=================FILTERS-POST==================//
    function selectPost() {
        if ( $('.nav-select').length ) {
            var $containerGallery = $('.post-select-container');
                $containerGallery.imagesLoaded( function() {
                    $containerGallery.isotope({
                    itemSelector: '.item-select',
                    transitionDuration: '.8s'
                });
            });
            $('.nav-select li:first-child').addClass('select-filter');
            $('.nav-select').on('click', 'a', function(e){
                $('.nav-select a').removeClass('filter-active');
                $(this).addClass('filter-active');
                e.preventDefault();
                $('.nav-select li').removeClass('select-filter')
                $(this).parent('li').addClass('select-filter');
                var selector = $(this).attr('data-filter');
                $containerGallery.isotope({ filter: selector });
            });
        }
    }

    //=================FILT PORTFOLIO==================//
    /**
     * isotope
     */
    function portfoliocontainer() {
        $('.portfolio-select-container').each(function() {
          var el = $(this);
          var filtering__container = el,
              filters = $('.nav-select-02');
              filters.on('click', 'a', function() {
                  var selector = $(this).attr('data-filter');
                  $('.current', filters).removeClass('current');
                  $(this).addClass('current');
                  filtering__container.isotope({
                      filter: selector
                  });
                  return false;
              });

        $(window).on('resize', function() {

            filtering__container.imagesLoaded(function() {
                filtering__container.isotope({
                    layoutMode: 'fitRows',
                    itemSelector: '.item-select',
                    transitionDuration: '0.5s',
                });
            });

          }).resize();

          filters.find('.current').trigger('click');
        });
    }

    function portfoliocontainer02() {
        $('.portfolio-select-container-02').each(function() {
          var el = $(this);
          var filtering__container = el,
              filters = $('.nav-select-02');
              filters.on('click', 'a', function() {
                  var selector = $(this).attr('data-filter');
                  $('.current', filters).removeClass('current');
                  $(this).addClass('current');
                  filtering__container.isotope({
                      filter: selector
                  });
                  return false;
              });

        $(window).on('resize', function() {

            filtering__container.imagesLoaded(function() {
                filtering__container.isotope({
                    layoutMode: 'masonry',
                    itemSelector: '.item-select',
                    transitionDuration: '0.5s',
                });
            });

          }).resize();

          filters.find('.current').trigger('click');
        });
    }

    function hoverdir(){
        // Hover Dir
        $('.grid-item__content .post-05.post-05--05').hoverdir({
          speed: 300, // Times in ms
          easing: 'ease',
          hoverDelay: 0, // Times in ms
          inverse: false,
          hoverElem: '.post__body'
        });
    }

    function initVideobox() {
        var btnPlay = $('.videobox__play');
        $.each(btnPlay, function(index) {
            var metabox = $(this).parent();
            var media = metabox.parent().find('.videobox__media');
            var video = media.find('iframe');

            $(this).on('click', function(ev) {
                metabox.addClass('videobox__transfront');
                media.addClass('videobox__transback');
                video[0].src += "?rel=0&autoplay=1";
                ev.preventDefault();
            });
        });
    }

    $(function () {
        // Init bootstrap plugins.
        // $('[data-toggle="popover"]').popover();
        // $('[data-toggle="tooltip"]').tooltip();

        // Call functions here.
        featureReview();
        acSwiper();
        acSwiperSync();
        isotopeIzi();
        magnificPopup();
        jqueryUI();
        hoverdir();
        initVideobox();

        // Back to top
        $(".back-to-top").click(function() {
            $("html, body").animate({ scrollTop: 0}, 1000)
        });

        $('[data-init="progressBar"]').progressBar();

        $('.portfolio-select-container').hide();
        $('.portfolio-select-container-02').hide();

    });

    $(window).load(function() {
        selectPost();
        portfoliocontainer();
        portfoliocontainer02();
        $('.portfolio-select-container').show();
        $('.portfolio-select-container-02').show();

    });

    $( function() {
        $( ".btn-toggle").click(function(){
            $(this).nextAll('.header__nav').toggleClass('active');
        });

        $( ".active-toggle").click(function(){
            $('body').addClass('active-ovhi');
            $(this).next().toggleClass('active');
        });

        $( ".dismiss-nav").click(function(){
            $(this).parents(".header__nav").toggleClass('active');
        });

        $( ".toggle-submenu").click(function(){
            $(this).find('ul').toggleClass('active');
            $(this).parents('.mega-menu').toggleClass('show');
        });

        $( ".toggle-active").click(function(){
            $(this).parent().toggleClass('active');
            $('body').removeClass('active-ovhi');
        });

        $( ".toggle-menu").click(function(){
            $(this).find('.mega-menu').toggleClass('show');
        });
    });

// get all map contact page
    $(function() {
        $('.getGmaps').each(function(){
            var id = $(this).attr('id');
            JFFUtils.gMapInit('#'+id);
            console.log('#'+id);
        })
    });

    $('.custom-control input[type="checkbox"]').on('click', function() {
        var self = $(this);
        if (this.checked) {
            self.closest('.awe-form-toggle').next('.payment-box1').stop().slideDown(600);
        } else {
            self.closest('.awe-form-toggle').next('.payment-box1').stop().slideUp(600);
        }
    });


})(jQuery);





// COUNTDOWN + COUNT UP TIMER
var countDownDate = new Date("Jan 5, 2018 15:37:25").getTime();
var countUpTimer = new Date("Jan 5, 2016 15:37:25").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now an the count down date
  var distance = countDownDate - now;
  var distanceUp = now - countUpTimer ;


  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  var daysUp = Math.floor(distanceUp / (1000 * 60 * 60 * 24));

  // Display the result in the element with id="demo"
  // document.getElementById("demo").innerHTML = days + "d " + hours + "h "
  // + minutes + "m " + seconds + "s ";

   document.getElementById("day").innerHTML = days;
   document.getElementById("hour").innerHTML = hours;
   document.getElementById("minute").innerHTML = minutes;
   document.getElementById("second").innerHTML = seconds;
   document.getElementById("count-up").innerHTML = daysUp;
}, 1000);
