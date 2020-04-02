window.onload = function () {
  var headerMenu = document.getElementsByClassName('header-menu')[0],
      menuBtn = document.getElementsByClassName('header-menu--show')[0],
      tableVeiw = document.getElementsByClassName('table-view--show')[0],
      mil1 = document.getElementsByClassName('header-menu__item layer-1'),
      content = document.getElementsByClassName('content')[0];


  (function(){   

    var slideEndFlag = false;

    function slideToggle(el, delay) {

      if (parseInt(el.scrollHeight) === 0) {

        setTimeout(function(){
          el.style.removeProperty('overflow');
          el.style.removeProperty('transition')
          el.style.removeProperty('height');
          slideEndFlag = true
        }, delay)

        el.style.transition = 'height '+ delay+'ms';
        el.style.height = 0;
        el.style.overflow = 'hidden';
        el.style.display = 'block';
        el.style.height = el.scrollHeight + 'px';
      }else if (slideEndFlag){

        el.style.height = el.scrollHeight + 'px';
        el.style.transition = 'height '+ delay+'ms';
        el.style.overflow = 'hidden';

        setTimeout(function(){
          el.style.display = 'none'
          el.style.removeProperty('overflow');
          el.style.removeProperty('transition')
          el.style.removeProperty('height');
          slideEndFlag = false;
        }, delay)

        
        setTimeout(function(){
          el.style.height = '0px';
        }, 50)
        
      }
    } 
  }()) 


  /* 
    trigger - объект при наведении на который 
    menu - объект к которому применяются анимации
    isInner - флаг устанавливает является ли trigger родительским компонентом по отношеию к menu
    delay - задержка в милесекундах
  */

  function slideMenu(trigger, menu, isInner, hide, show) {

    var _show = show || {type: 'slide', delay: 400},
        _hide = hide || {type: 'fade', delay: 0};
       
    var isShow = false,
        isDeferred = false;

    var showActions = {
      'slide': slideDown,
      'fade': fadeIn
    }

    var hideActions = {
      'slide': slideUp,
      'fade': fadeOut
    }

    function getAction() {
      var actions = null,
          typeAction = null;

      if (isShow) {
        actions = hideActions;
        typeAction = _hide;
      }else{
        actions = showActions;
        typeAction = _show;
      }

      for (const key in actions) {
        if (actions.hasOwnProperty(key)) {
          if (key === typeAction.type) {
            var method = actions[key];
            method(menu, typeAction.delay);
            break; 
          }
        }
      }
    } 

    /* menu.ontransitionend = function() {
      if(isShow) {
        isShow = false;
        menu.style.display = 'none';
      }
    }  */

    function slideDown(el, delay) {
      if (!isShow) {
        setTimeout(function(){
          el.style.removeProperty('overflow');
          el.style.removeProperty('transition')
          el.style.removeProperty('height');
          isShow = true
        }, delay)

        el.style.transition = 'height '+ delay+'ms';
        el.style.height = 0;
        el.style.overflow = 'hidden';
        el.style.display = 'block';
        el.style.height = el.scrollHeight + 'px';

      }
    } 

    function slideUp(el, delay) {
      if (isShow){

        setTimeout(function(){
          isShow = false;
          el.style.display = 'none';
        }, delay)

        setTimeout(function(){
          el.style.height = 0;
        }, 10)

        el.style.transition = 'height '+ delay+'ms';
        el.style.height = el.offsetHeight + 'px';
        el.style.overflow = 'hidden';
        el.style.display = 'block';
        
      }
    }

    function fadeOut(el, delay) {
      if (isShow) {

        setTimeout(function(){
          el.style.display = 'none';
          el.style.removeProperty('transition')
          el.style.removeProperty('opacity')
          isShow = false
        }, delay)

        el.style.opacity = 1;
        el.style.transition = 'opacity '+ delay+'ms';

        // setTimeout(function(){
          el.style.opacity = 0
        // }, 0)
      }
    }

    function fadeIn (el, delay) {
      if (!isShow) {

      }
    }

    function relateInner(e) {

      var currentElem = e.currentTarget,
          relatedTarget = e.relatedTarget;

      while (relatedTarget) {
        if (relatedTarget == currentElem) return true;
        relatedTarget = relatedTarget.parentNode;
      }

      return false;
    }

    function realteOuter(e) {
      var relatedTarget = e.relatedTarget;

      while (relatedTarget && relatedTarget.classList) {
        if (relatedTarget == menu) return true;

        relatedTarget = relatedTarget.parentNode;
      }

      return false
    }

    return function () {
      trigger.onmouseenter = function() {
        if (!isShow) {
          getAction();
        }
      }
    
      trigger.onmouseleave = function(e) {
        var leaveDelay = _hide.delay === 0 ? 30: _hide.delay;
        setTimeout(function(){
          if (isShow) {
            
            if (isInner) {
              if (relateInner(e)) return;
            }else {
              if (realteOuter(e)) return;
            }

            getAction();
          }
        }, isShow ? 0 : leaveDelay)
      }
    
      menu.onmouseleave = function(e) {
        if (isShow) {
    
          if (trigger == e.relatedTarget){ 
            return;
          }
    
          getAction();
        }
      }
    }
  }
  

  var slideMenuController = slideMenu(menuBtn, headerMenu, false, {type: 'slide', delay: 400});
  slideMenuController();

  for(var i = 0, len = mil1.length; i < len; i+=1) {

    var childs = mil1[i].childNodes;

    for(var j = 0, childsLen = childs.length; j < childsLen; j+=1){

      if (childs[j].classList && childs[j].classList.contains('layer-sub')) {
        var miController = slideMenu(mil1[i], childs[j], true, {type: 'fade', delay: 0});
        miController();
      }
    }
    
  }

  tableVeiw.onmouseenter = function() {
    content.classList.add('table')
  }

  tableVeiw.onmouseleave = function() {
    content.classList.remove('table')
  }
}