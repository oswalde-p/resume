

var slideIndices= {
    "slideshow1": -1,
    "slideshow2": -1
};

window.onload = function (){
    slideShow1();
    slideShow2();
    detectswipe("slideshow1", function(e, d){
        if(d == "l"){
            nextSlide("slideshow1", 1);
        }else if (d == "r"){
            nextSlide("slideshow1", -1);

        }
    });
    detectswipe("slideshow2", function(e, d){
        if(d == "l"){
            nextSlide("slideshow2", 1);
        }else if (d == "r"){
            nextSlide("slideshow2", -1);

        }
    });
};

/////////////////////////////////////
// slideshow functions
// www.w3schools.com/howto/howto_js_slideshow.asp
function showSlides(id, n){
    var i;
    var gallery = document.getElementById(id);
    var slides = gallery.getElementsByClassName("slide");

    for (i = 0; i < slides.length; i++){
        slides[i].style.display = "none";
    }

    slideIndices[id] = n;
    if (slideIndices[id] >= slides.length){
        slideIndices[id] = 0;
    }else if(slideIndices[id] < 0){
        slideIndices[id] = slides.length-1;
    }

    for(i = 0; i<slides.length; i++){
        slides[i].style.display="none";
    }
    slides[slideIndices[id]].style.display = "block";
}

function slideShow1() {
    nextSlide("slideshow1", 1);
    setTimeout(slideShow1, 10000);
}

function slideShow2(){
    nextSlide("slideshow2", 1);
    setTimeout(slideShow2, 8000);
}

function nextSlide(id, n){
    var i = slideIndices[id] + n;
    showSlides(id, i);
}

/*
 * From EscapeNetscape's answer to https://stackoverflow.com/questions/15084675/how-to-implement-swipe-gestures-for-mobile-devices#27115070
 */
function detectswipe(el,func) {
    var swipe_det = new Object();
    swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
    var min_x = 30;  //min x swipe for horizontal swipe
    var max_x = 30;  //max x difference for vertical swipe
    var min_y = 50;  //min y swipe for vertical swipe
    var max_y = 60;  //max y difference for horizontal swipe
    var direc = "";
    var ele = document.getElementById(el);
    ele.addEventListener('touchstart',function(e){
        var t = e.touches[0];
        swipe_det.sX = t.screenX;
        swipe_det.sY = t.screenY;
    },false);
    ele.addEventListener('touchmove',function(e){
        e.preventDefault();
        var t = e.touches[0];
        swipe_det.eX = t.screenX;
        swipe_det.eY = t.screenY;
    },false);
    ele.addEventListener('touchend',function(e){
        //horizontal detection
        if ((((swipe_det.eX - min_x > swipe_det.sX) || (swipe_det.eX + min_x < swipe_det.sX)) && ((swipe_det.eY < swipe_det.sY + max_y) && (swipe_det.sY > swipe_det.eY - max_y) && (swipe_det.eX > 0)))) {
            if(swipe_det.eX > swipe_det.sX) direc = "r";
            else direc = "l";
        }
        //vertical detection
        else if ((((swipe_det.eY - min_y > swipe_det.sY) || (swipe_det.eY + min_y < swipe_det.sY)) && ((swipe_det.eX < swipe_det.sX + max_x) && (swipe_det.sX > swipe_det.eX - max_x) && (swipe_det.eY > 0)))) {
            if(swipe_det.eY > swipe_det.sY) direc = "d";
            else direc = "u";
        }

        if (direc != "") {
            if(typeof func == 'function') func(el,direc);
        }
        direc = "";
        swipe_det.sX = 0; swipe_det.sY = 0; swipe_det.eX = 0; swipe_det.eY = 0;
    },false);
}
