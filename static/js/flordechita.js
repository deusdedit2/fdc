var element, bgColor, brightness, r, g, b, hsp;

function adjustTextColor() {

    element = document.getElementById('profile-bio');

    // Get the element's background color
    bgColor = window.getComputedStyle(element, null).getPropertyValue('background-color');

    // Call lightOrDark function to get the brightness (light or dark)
    brightness = lightOrDark(bgColor);

    // If the background color is dark, add the light-text class to it
    if (brightness == 'dark') {
        element.classList.add('light-text');
    }
    else {
        element.classList.add('dark-text');
    }
}

function lightOrDark(color) {

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

        r = color[1];
        g = color[2];
        b = color[3];
    }
    else {

        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace(
            color.length < 5 && /./g, '$&$&'
        )
        );

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }

    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp > 127.5) {

        return 'light';
    }
    else {

        return 'dark';
    }
}

function toggle_panel_visibility($lateral_panel, $background_layer, $body) {
    if ($lateral_panel.classList.contains('speed-in')){
        $lateral_panel.classList.remove('speed-in');
        $background_layer.classList.remove('is-visilbe');
        $body.classList.remove('overflow-hidden')
    } else {
        $lateral_panel.classList.add('speed-in');
        $background_layer.classList.add('is-visible');
        $body.classList.add('overflow-hidden')
    }
}



//if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
var $cart_trigger = document.querySelectorAll(".cart-trigger");
var $lateral_cart = document.querySelector("#cd-cart");
var $shadow_layer = document.querySelector("#cd-shadow-layer");
var $close_cart = document.querySelector("#cd-cart-close");

$cart_trigger.forEach(function(item){
    item.addEventListener('click',() => {
        event.preventDefault();
        toggle_panel_visibility($lateral_cart, $shadow_layer, document.body);
    })
})

document.addEventListener('keyup',function (e) {
    if (e.key === "Escape") {
        $lateral_cart.classList.remove('speed-in');
        $shadow_layer.classList.remove('is-visible');
        document.body.classList.remove('overflow-hidden')
    }
});

[$close_cart,$shadow_layer].forEach(function(item){

    item.addEventListener('click',function(){
        $lateral_cart.classList.remove('speed-in');
        $shadow_layer.classList.remove('is-visible');
        document.body.classList.remove('overflow-hidden')
    })
})

// var element,bgColor,brightness,r,g,b,hsp;function adjustTextColor(){element=document.getElementById("profile-bio"),bgColor=window.getComputedStyle(element,null).getPropertyValue("background-color"),"dark"==(brightness=lightOrDark(bgColor))?element.classList.add("light-text"):element.classList.add("dark-text")}function lightOrDark(e){return e.match(/^rgb/)?(e=e.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/),r=e[1],g=e[2],b=e[3]):(e=+("0x"+e.slice(1).replace(e.length<5&&/./g,"$&$&")),r=e>>16,g=e>>8&255,b=255&e),(hsp=Math.sqrt(r*r*.299+g*g*.587+b*b*.114))>127.5?"light":"dark"}function toggle_panel_visibility(e,l,s){e.hasClass("speed-in")?(e.removeClass("speed-in"),l.removeClass("is-visible"),s.removeClass("overflow-hidden")):(e.addClass("speed-in"),l.addClass("is-visible"),s.addClass("overflow-hidden"))}var $cart_trigger=$(".cart-trigger"),$lateral_cart=$("#cd-cart"),$shadow_layer=$("#cd-shadow-layer"),$close_cart=$("#cd-cart-close");$cart_trigger.on("click",function(e){e.preventDefault(),toggle_panel_visibility($lateral_cart,$shadow_layer,$("body"))}),$shadow_layer.on("click",function(){$lateral_cart.removeClass("speed-in"),$shadow_layer.removeClass("is-visible"),$("body").removeClass("overflow-hidden")}),$(document).keyup(function(e){"Escape"===e.key&&($lateral_cart.removeClass("speed-in"),$shadow_layer.removeClass("is-visible"),$("body").removeClass("overflow-hidden"))}),$close_cart.on("click",function(){$lateral_cart.removeClass("speed-in"),$shadow_layer.removeClass("is-visible"),$("body").removeClass("overflow-hidden")});

var lod = document.querySelector('.load');

function callLoad() {
    lod.classList.toggle("view")

    setTimeout(() => {
        lod.classList.remove("view")
    },80000)
}