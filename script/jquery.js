$('img').on('dragstart', false);

var targetElement, targetParent, curElX, curElY, curWidth, curHeight, parentOffset, varMul, endX, endY,
    maxLength, finalX, finalY;
var viewX = $('#viewX');
var viewY = $('#viewY');
var parentContainer = $('#parentContainer');

//GLOBAL
parentContainer.on('mousedown', '.slide-module', function(){
    targetElement = $(this);
    $('.slide-module').removeClass('active');
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
        curWidth = $('#curSync').outerWidth()/2;
        $('#curSync').css({
            left: (parentContainer.width()/2)-curWidth+'px'
        });
        syncFoo();
    }
    else if ($(this).attr('id')== 'snapHor') {
        curHeight = $('#curSync').outerHeight()/2;
        $('#curSync').css({
            top: (parentContainer.height()/2)-curHeight+'px'
        });
        syncFoo();
    }
    else if ($(this).attr('id')== 'addText') {
        $('#textPopup').addClass('active');
    }
});
var curText;
$('#submitTextInput').on('click', function(){
    $('#textPopup').removeClass('active');
    curText = $('#addTextInput').val();
    parentContainer.append('<div class="slide-module text-module">'+curText+'</div>');
    $('#addTextInput').val('')
})

//GLOBAL

//JO-DRAG-------------------------------------------------------------------------------\\
parentContainer.on('mousedown', '.slide-module', function(e){
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
    parentContainer.on('mousemove', function(e){
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
    parentContainer.on('mouseup', function(){
        targetElement.removeClass('jo-drag');
    });
});


//JO-DRAG-------------------------------------------------------------------------------\\


//JO-RESIZE-----------------------------------------------------------------------------\\
var mouseStartX, mouseStartY, curMouseX, curMouseY;
parentContainer.on('mousedown', '.slide-module > .resize-handle', function(e){
    targetElement = $(this);
    targetParent = $(this).parent();
    targetParent.addClass('jo-resize');
    mouseStartX = e.pageX;
    mouseStartY = e.pageY;
    varMul = 0;
    parentContainer.on('mousemove', function(e){
        if (targetParent.hasClass('jo-resize') && targetParent.hasClass('img-module')) {
            curMouseX = e.pageX;
            curMouseY = e.pageY;
            varMul = curMouseX - mouseStartX;
            targetParent.css({
                width: curWidth+(varMul/1) +'px',
                left: (curElX-(varMul/2))+'px',
                top: (curElY-(varMul/2))+'px'
            });
        }
        else if (targetParent.hasClass('jo-resize')) {
            curMouseX = e.pageX;
            curMouseY = e.pageY;
            varMul = curMouseX - mouseStartX;
            targetParent.css({
                width: curWidth+(varMul/1) +'px',
                left: (curElX-(varMul/2))+'px',
            });
        }
    });
    parentContainer.on('mouseup', function(){
        targetParent.removeClass('jo-resize');
    })
});
//JO-RESIZE-----------------------------------------------------------------------------\\


//JO-ROTATE-----------------------------------------------------------------------------\\
parentContainer.on('mousedown', '.slide-module > .rotate-handle', function(e){
    targetElement = $(this);
    targetParent = $(this).parent();
    targetParent.addClass('jo-rotate');
    mouseStartX = e.pageX;
    mouseStartY = e.pageY;
    varMul = 0;
    parentContainer.on('mousemove', function(e){
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
    parentContainer.on('mouseup', function(){
        targetParent.removeClass('jo-rotate');
        $('.aligned').remove();
    })
});
//JO-ROTATE-----------------------------------------------------------------------------\\


//NORMALIZE-----------------------------------------------------------------------------\\
parentContainer.on('mouseleave', function(){
    $(this).find('.slide-module').removeClass('jo-resize jo-drag jo-rotate')
});
parentContainer.on('click', '.spacer', function(){
    $('.slide-module').removeClass('active');
    $('.slide-module').attr('id', '');
    $('.resize-handle').remove();
    $('.rotate-handle').remove();
});
$(document).keyup(function(e) {
     if (e.keyCode == 27) {
         $('.slide-module').removeClass('active');
         $('.slide-module').attr('id', '');
         $('.resize-handle').remove();
         $('.rotate-handle').remove();
    }
});
//NORMALIZE-----------------------------------------------------------------------------\\

var saveString;
parentContainer.on('mousedown', function(){
    saveString = parentContainer.html();
});

$(document).keydown(function(e){
      if( e.which === 90 && e.ctrlKey && e.shiftKey ){
         console.log('control + shift + z');
      }
      else if( e.which === 90 && e.ctrlKey ){
         parentContainer.empty();
         parentContainer.append(saveString)
      }
});
