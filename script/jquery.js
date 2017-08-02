$('img').on('dragstart', false);

var targetElement, targetParent, curElX, curElY, curWidth, curHeight, parentOffset, varMul, endX, endY,
    maxLength, finalX, finalY;
var viewX = $('#viewX');
var viewY = $('#viewY');
var customSection = $('.custom-section');

//GLOBAL
customSection.on('mousedown', '.slide-module', function(){
    targetElement = $(this);
    $('.slide-module').removeClass('active');
    $('.edit-parent').removeClass('active');
    $('.slide-module').attr('id', '');
    targetElement.addClass('active');
    targetElement.attr('id', 'curSync');
    $('.resize-handle').remove();
    $('.rotate-handle').remove();
    if (targetElement.hasClass('active')) {
        targetElement.append('<div class="resize-handle"></div><div class="rotate-handle"></div>');
    }
});

function syncFoo(){
    finalX = Math.round(targetElement.position().left);
    finalY = Math.round(targetElement.position().top);
    viewX.val(finalX);
    viewY.val(finalY);
}
function snapVert(){
    curWidth = $('#curSync').outerWidth()/2;
    $('#curSync').css({
      left: (customSection.width()/2)-curWidth+'px'
    });
    syncFoo();
}
function snapHor(){
    curHeight = $('#curSync').outerHeight()/2;
    $('#curSync').css({
      top: (customSection.height()/2)-curHeight+'px'
    });
    syncFoo();
}

$('.snapper').on('click', function(){
    if ($(this).attr('id')== 'alignLeft') {
        $('#curSync').css({
            'text-align': 'left'
        });
    }
    else if ($(this).attr('id')== 'alignCenter') {
        $('#curSync').css({
            'text-align': 'center'
        });
    }
    else if ($(this).attr('id')== 'alignRight') {
        $('#curSync').css({
            'text-align': 'right'
        });
    }
    else if ($(this).attr('id')== 'snapVert') {
        snapVert();
    }
    else if ($(this).attr('id')== 'snapHor') {
        snapHor();
    }
    else if ($(this).attr('id')== 'addText') {
        $('.slide-module').attr('id', '');
        customSection.append('<div class="slide-module text-module" id="curSync">new custom text</div>');

        textEditor.addClass('active');
        curSyncText.val(curText);
        curSyncFsize.val(curFsize);
        textEditor.css({
            left: (curElX + curWidth + 50) + 'px',
            top: (curElY - 50) + 'px'
        });
    }
});
var curText;

$('#textPopup > .fader').on('click', function(){
    $(this).parent().removeClass('active');
});

//GLOBAL


//text-editor-------------------------------------------------------\\
var textEditor = $('#textEditor');
var curSyncText = $('#curSyncText');
var curSyncFsize = $('#curSyncFsize');
var curSyncFfam = $('#curSyncFfam');
var curSyncFcolor = $('#curSyncFcolor');
var curSyncFweight = $('#curSyncFweight');
var curFsize, curFfam, curFcolor, curFweight;

customSection.on('dblclick', '.slide-module', function(){
    targetElement = $(this);
    curElX = targetElement.position().left;
    curElY = targetElement.position().top;
    curWidth = targetElement.outerWidth();
    curHeight = targetElement.outerHeight();

    curText = targetElement.text();
    // finalText = curText.replace(, '<br />');
    finalText = curText.replace('<br>', /\r?\n/g);

    curFsize = targetElement.css('font-size');
    curFfam = targetElement.css('font-family');


    if (targetElement.hasClass('text-module')) {
        $('#curSyncFfam option[value='+curFfam+']').prop('selected', true);
        textEditor.addClass('active');
        curSyncText.val(finalText);
        curSyncFsize.val(curFsize);

        if (curElX < (customSection.width()/2)) {
            textEditor.css({
                left: (curElX + curWidth + 50) + 'px',
                top: (curElY - 50) + 'px'
            });
        }
        else if (curElX > (customSection.width()/2)) {
            textEditor.css({
                left: (curElX  - 330) + 'px',
                top: (curElY - 50) + 'px'
            });
        }

    }
})
//onchanges...............\\
var tempText, finalText;
curSyncText.on('keyup', function(){
    tempText = $(this).val();
    finalText = tempText.replace(/\r?\n/g, '<br />');

    $('#curSync').html(finalText);
    curWidth = $('#curSync').outerWidth();
    if (curElX < (customSection.width()/2)) {
        textEditor.css({
            left: (curElX + curWidth + 50) + 'px',
            top: (curElY - 50) + 'px'
        });
    }
    else if (curElX > (customSection.width()/2)) {
        textEditor.css({
            left: (curElX  - 330) + 'px',
            top: (curElY - 50) + 'px'
        });
    }
});
curSyncFsize.on('change', function(){
    // $('#curSync').html($(this).val());
    $('#curSync').css({
        'font-size': curSyncFsize.val()
    })
    curWidth = $('#curSync').outerWidth();

    textEditor.css({
        left: (curElX + curWidth + 50) + 'px',
        top: (curElY - 50) + 'px'
    });
});
curSyncFfam.on('change', function(){
    curFfam = $(this).val();
    $('#curSync').css({
        'font-family': curFfam
    })
});
curSyncFcolor.on('change', function(){
    curFcolor = $(this).val();
    $('#curSync').css({
        'color': curFcolor
    })
});
curSyncFweight.on('change', function(){
    curFweight = $(this).val();
    console.log('asd');
    $('#curSync').css({
        'font-weight': curFweight
    })
})

//onchanges...............\\

//text-editor-------------------------------------------------------\\

//JO-DRAG-------------------------------------------------------------------------------\\
customSection.on('mousedown', '.slide-module', function(e){
    targetElement = $(this);
    maxLength = $('.slide-module').length;
    $('.slide-module').css({
        zIndex: maxLength
    });
    targetElement.css({
        zIndex: maxLength+1
    });
    parentOffset = targetElement.parent().offset();
    curElX = targetElement.position().left;
    curElY = targetElement.position().top;
    curWidth = targetElement.outerWidth();
    curHeight = targetElement.outerHeight();
    targetElement.addClass('jo-drag');
    var pos_y = targetElement.offset().top + curHeight - e.pageY,
        pos_x = targetElement.offset().left + curWidth - e.pageX;
    customSection.on('mousemove', function(e){
        if (targetElement.hasClass('jo-drag') && targetElement.hasClass('jo-resize') != true && targetElement.hasClass('jo-rotate') != true) {
            endX = e.pageX + pos_x - curWidth;
            endY = e.pageY + pos_y - curHeight;
            targetElement.offset({
                top: endY,
                left: endX
            });
        syncFoo();
        }
    });
    customSection.on('mouseup', function(){
        targetElement.removeClass('jo-drag');
    });
});
//JO-DRAG-------------------------------------------------------------------------------\\

//JO-RESIZE-----------------------------------------------------------------------------\\
var mouseStartX, mouseStartY, curMouseX, curMouseY;
customSection.on('mousedown', '.slide-module > .resize-handle', function(e){
    targetElement = $(this);
    targetParent = $(this).parent();
    targetParent.addClass('jo-resize');
    mouseStartX = e.pageX;
    mouseStartY = e.pageY;
    varMul = 0;
    customSection.on('mousemove', function(e){
        if (targetParent.hasClass('jo-resize') && targetParent.hasClass('img-module')) {
            curMouseX = e.pageX;
            curMouseY = e.pageY;
            varMul = curMouseX - mouseStartX;
            targetParent.css({
                width: curWidth+(varMul/1) +'px',
                left: (curElX-(varMul/2))+'px',
                top: (curElY-(varMul/2))+'px'
            });
            syncFoo();
        }
        else if (targetParent.hasClass('jo-resize')) {
            curMouseX = e.pageX;
            curMouseY = e.pageY;
            varMul = curMouseX - mouseStartX;
            targetParent.css({
                width: curWidth+(varMul/1) +'px',
                left: (curElX-(varMul/2))+'px',
            });
            syncFoo();
        }
    });
    customSection.on('mouseup', function(){
        targetParent.removeClass('jo-resize');
    })
});
//JO-RESIZE-----------------------------------------------------------------------------\\

//JO-ROTATE-----------------------------------------------------------------------------\\
customSection.on('mousedown', '.slide-module > .rotate-handle', function(e){
    targetElement = $(this);
    targetParent = $(this).parent();
    targetParent.addClass('jo-rotate');
    mouseStartX = e.pageX;
    mouseStartY = e.pageY;
    varMul = 0;
    customSection.on('mousemove', function(e){
        if (targetParent.hasClass('jo-rotate')) {
            curMouseX = e.pageX;
            curMouseY = e.pageY;
            varMul = curMouseX - mouseStartX;
            if (varMul == 0 || varMul % 90 === 0) {
                $('.aligned').remove();
                targetParent.append('<div class="aligned"></div>');
            }
            else {
                $('.aligned').remove();
                targetParent.append('<div class="aligned red"></div>');
            }
            targetParent.css({
                transform: 'rotateZ('+varMul/3+'deg)'
            });
        }
    });
    customSection.on('mouseup', function(){
        targetParent.removeClass('jo-rotate');
        $('.aligned').remove();
    })
});
//JO-ROTATE-----------------------------------------------------------------------------\\

//NORMALIZE-----------------------------------------------------------------------------\\
function clearAll(){
    $('.slide-module').removeClass('active');
    $('.edit-parent').removeClass('active');
    $('.slide-module').attr('id', '');
    $('.resize-handle').remove();
    $('.rotate-handle').remove();
    $('#layerSettings').removeClass('active');

}
customSection.on('mouseleave', function(){
    $(this).find('.slide-module').removeClass('jo-resize jo-drag jo-rotate')
});

customSection.on('click', '.spacer', function(){
    clearAll();
});

$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        clearAll();
    }
});
//NORMALIZE-----------------------------------------------------------------------------\\

var saveString;
customSection.on('mousedown', function(){
    saveString = customSection.html();
});

//SHORTCUTS-----------------------------------------------------\\
$('#shortcutHandle').on('click', function(){
    $('#shortCut').toggleClass('active');
});
$('#sectionHandle').on('click', function(){
    $('#layerSettings').toggleClass('active');
});
$('#shortCut').on('click', function(){
    $(this).removeClass('active');
});
// $('#layerSettings').on('click', function(){
//     $(this).removeClass('active');
// });
var temp = 0;
var copyTemp;

$(document).keydown(function(e){
    if( e.which === 83 && e.ctrlKey && e.shiftKey){
        $('#shortCut').toggleClass('active');
    }
    else if( e.which === 86 && e.ctrlKey && e.shiftKey){
        snapVert();
    }
    else if( e.which === 72 && e.ctrlKey && e.shiftKey){
        snapHor();
    }
    else if( e.which === 76){
        $('#layerSettings').toggleClass('active');
    }
    else if( e.which === 90 && e.ctrlKey ){
        customSection.empty();
        customSection.append(saveString);
    }
    else if( e.which === 67 && e.ctrlKey ){
        copyTemp = $('#curSync').clone();
    }
    else if( e.which === 86 && e.ctrlKey ){
        customSection.append(copyTemp);
    }
    else if( e.which === 46 ){
        $('#curSync').remove();
    }
    //   else if( e.which === 37 ){
    //       temp = $('#curSync').position().left
    //       $('#curSync').css({
    //           left: temp -1 +'px'
    //       });
    //       syncFoo();
    //   }
    //   else if( e.which === 38 ){
    //       temp = $('#curSync').position().top
    //       $('#curSync').css({
    //           top: temp -1 +'px'
    //       });
    //       syncFoo();
    //   }
    //   else if( e.which === 39 ){
    //       temp = $('#curSync').position().left
    //       $('#curSync').css({
    //           left: temp +1 +'px'
    //       });
    //       syncFoo();
    //   }
    //   else if( e.which === 40 ){
    //       temp = $('#curSync').position().top
    //       $('#curSync').css({
    //           top: temp +1 +'px'
    //       });
    //       syncFoo();
    //   }
});
//SHORTCUTS-----------------------------------------------------\\
var bgColor, sectionName, sectionWidth, sectionHeight, widthUnit, heightUnit;
$('#layerBackground').on('change', function(){
    bgColor = $(this).val();
    customSection.css({
        'background-color' : bgColor
    })
});

$('#sectionName').on('change', function(){
    sectionName = $(this).val();
    customSection.attr('id', sectionName);
});

$('#sectionWidth').on('change', function(){
    sectionWidth = $(this).val();
    widthUnit = $('#widthUnit').val();
    customSection.css({
        width: sectionWidth + widthUnit
    });
});

$('#widthUnit').on('change', function(){
    widthUnit = $(this).val();
    sectionWidth = $('#sectionWidth').val();
    customSection.css({
        width: sectionWidth + widthUnit
    });
});

$('#sectionHeight').on('change', function(){
    sectionHeight = $(this).val();
    heightUnit = $('#heightUnit').val();
    customSection.css({
        height: sectionHeight + heightUnit
    });
});

$('#heightUnit').on('change', function(){
    heightUnit = $(this).val();
    sectionHeight = $('#sectionHeight').val();
    customSection.css({
        height: sectionHeight + heightUnit
    });
});
