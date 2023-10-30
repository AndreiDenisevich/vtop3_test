$(document).ready(function(){

    $('.header__btn_lang').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('header__btn_lang_en')) {
            $(this).removeClass('header__btn_lang_en').addClass('header__btn_lang_ru').find('span').text('Ru');
        } else {
            $(this).removeClass('header__btn_lang_ru').addClass('header__btn_lang_en').find('span').text('En');
        }
    });

    $('.menu-mobile__toggler').on('click', function (e) {
        e.preventDefault();
        if ($('.menu-mobile').hasClass('menu-mobile_open')) {
            $('.menu-mobile').removeClass('menu-mobile_open').addClass('menu-mobile_close');
            $('body').removeClass('mobile-overflow-hidden');
        } else {
            $('.menu-mobile').removeClass('menu-mobile_close').addClass('menu-mobile_open');
            $('body').addClass('mobile-overflow-hidden');
        }
    });

    $('.scrollbar-external').scrollbar({
        "autoScrollSize": false,
        "scrollx": $('.external-scroll_x'),
        "scrolly": $('.external-scroll_y')
    });
});