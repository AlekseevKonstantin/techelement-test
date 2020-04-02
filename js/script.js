window.onload = function() {

  function findChildByClass(childs, className) {
    for (var i = 0; i < childs.length; i++) {
      if (childs[i].className.indexOf(className) > -1) {
        return childs[i];
      }
    }

    return null;
  }

  function getParent(el, parentClassName) {
    if (el === null || el === undefined) {
      return null;
    }

    const parent = el.parentNode;

    if (parent.parentNode === null || parent.parentNode === undefined) {
      return null;
    }

    if (parent.classList.contains(parentClassName)) {
      return parent;
    }
    return getParent(parent, parentClassName);
  }

  function getCoords(elem) {
    // (1)
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    // (2)
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    // (3)
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    // (4)
    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return {
      top: top,
      left: left
    };
  }

  /* 1 */

  var headerMenu = document.getElementsByClassName('header-menu')[0],
      menuBtn = document.getElementsByClassName('header-menu--show')[0],
      tableVeiw = document.getElementsByClassName('table-view--show')[0],
      mil1 = document.getElementsByClassName('header-menu__item layer-1'),
      content = document.getElementsByClassName('content')[0];

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
        isClose = false;

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

        el.style.opacity = 0
      }
    }

    function fadeIn (el, delay) {
      if (!isShow) {
        setTimeout(function(){
          el.style.removeProperty('transition')
          isShow = true
        }, delay)

        el.style.display = 'none';
        el.style.opacity = '0';
        el.style.transition = 'opacity '+ delay+'ms';
        el.style.display = 'block';

        setTimeout(function(){
          el.style.opacity = '1';
        }, 10)
        
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
        var leaveDelay = _show.delay === 0 ? 30: _show.delay;
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
        var miController = slideMenu(mil1[i], childs[j], true, {type: 'fade', delay: 0}, {type: 'fade', delay: 400});
        miController();
      }
    }
    
  }

  tableVeiw.onmouseenter = function() {
    content.classList.toggle('table')
  }

  /* 2 */

  var cardTitles = document.getElementsByClassName('card__title');

  for (var i = 0, len = cardTitles.length; i < len; i+=1) {
    
    cardTitles[i].onclick = function(e) {
      var form = document.createElement("form");
      form.className = 'card-form';

      var formcontainer = document.createElement('div');
      formcontainer.className = 'column';

      var textarea = document.createElement('textarea');
      textarea.className = 'card-form__input';
      textarea.innerText = e.target.innerText;
      textarea.autofocus = true;

      var row = document.createElement('div');
      row.className = 'row';

      var submit = document.createElement('button');
      submit.type = 'submit';
      submit.className = 'card-form--submit';
      submit.onclick = cardFormSubmit;
      submit.innerText = 'Изменить';

      var cancel = document.createElement('button');
      cancel.type = 'button';
      cancel.className = 'card-form--cancel'
      cancel.innerText = 'Отменить';
      cancel.onclick = cardFormRemove;

      row.append(submit);
      row.append(cancel);
      
      formcontainer.append(textarea);
      formcontainer.append(row);

      form.append(formcontainer);

      var card = getParent(e.target, 'card')
      card.append(form);  
    }
  }
  
  function cardFormSubmit (e) {
    e.preventDefault();

    var card = getParent(e.target, 'card'),
        form = getParent(e.target, 'card-form'),
        newText = form.childNodes[0].childNodes[0].value,
        textarea = card.childNodes[3].childNodes[1].childNodes[1];

    if (textarea.innerText !== newText) {
      textarea.innerText = newText;
    }

    //можно отправить данные по AJAX

    form.remove();
  }

  function cardFormRemove (e) {
    var form = getParent(e.target, 'card-form');
    form.remove();
  }

  /* 3 */

  var avatars = document.querySelectorAll('.card-wrapper');

  avatars.forEach(function (avatar) {
    avatar.onmousedown = function (event) {

      var mx = 0,
          my = 0;

      function nearestElement() {
        var left = mx,
            top = my,
            distance = 100000000000,
            el = null;
    
        for (var i = 0, len = avatars.length; i < len; i+=1) {
          
          var lleft = avatars[i].getBoundingClientRect().left,
              ltop = avatars[i].getBoundingClientRect().top;
              
          var ldistance =  Math.sqrt(Math.pow(lleft - left, 2) + Math.pow(ltop - top, 2));
    
          if (ldistance < distance && avatar != avatars[i]) {
            distance = ldistance;
            el = avatars[i];
          }
        }
    
        return el;
      }

      if (!event.currentTarget.classList.contains('card-wrapper')){
        return;
      }

      var notLeft = 0;
      var moveStart = 0;

      var droppable = null;

      var shiftX = event.clientX - avatar.getBoundingClientRect().left;
      var shiftY = event.clientY - avatar.getBoundingClientRect().top;

      document.onmouseup = function (e) {

        document.removeEventListener('mousemove', onMouseMove);
        document.onmouseup = null;
        moveStart = 0;
        avatar.removeAttribute('style');

        if (droppable) {

          var droppableBelow = droppable.closest('.card-group'),
              curEl = droppable.closest('.card-wrapper');
          if (droppableBelow) {
            insert(droppableBelow, curEl);
          } else {
            rollback();
          }

        } else {
          if (notLeft === 0) {
            rollback();
          }
        }
      };

      document.ondragstart = function () { return false; };

      document.body.onselectstart = function() { return false }

      var old = {
        parent: avatar.parentNode,
        nextSibling: avatar.nextSibling,
        position: avatar.position || '',
        left: avatar.left || '',
        top: avatar.top || '',
        zIndex: avatar.zIndex || ''
      };

      function rollback() {
        old.parent.insertBefore(avatar, old.nextSibling);
        avatar.style.position = old.position;
        avatar.style.left = old.left;
        avatar.style.top = old.top;
        avatar.style.zIndex = old.zIndex
      };

      function insert(container, curEl) {
        if (container.children.length > 0){
          if (!curEl) {
            var nearest = nearestElement(avatar, avatars);
            nearest.insertAdjacentElement('afterend', avatar);
          }else{
            curEl.insertAdjacentElement('beforebegin', avatar);
          }
        }else {
          container.append(avatar);
        }
      }

      function moveAt(pageX, pageY) {

        if(moveStart === 0){

          avatar.style.position = 'absolute';
          avatar.style.zIndex = 1000;
          document.body.append(avatar);
          moveStart = 1;
        }

        mx = pageX - shiftX,
        my = pageY - shiftY;

        avatar.style.left = mx + 'px';
        avatar.style.top = my + 'px';
      }

      function onMouseMove(event) {

        moveAt(event.pageX, event.pageY);

        avatar.hidden = true;
        droppable = document.elementFromPoint(event.clientX, event.clientY);
        avatar.hidden = false;
      }

      if (event.which != 1) {
        notLeft = 1;
        return;
      }

      document.addEventListener('mousemove', onMouseMove);
      return false

    };

  });

  /* 4 */

  var brackets = [
    {
      type: 'round',
      count: 1,
      inner: [
        {
          type: 'braces',
          count: 1
        }
      ]
    },
    {
      type: 'braces',
      count: 1
    },
    {
      type: 'round',
      count: 2
    }
  ]
  
  var brackets1 = [
    {
      type: 'round',
      count: 1
    },
    {
      type: 'round',
      count: 1
    },
    {
      type: 'round',
      count: 1
    }
  ]
  
  var brackets2 = [
    {
      type: 'round',
      count: 1
    },
    {
      type: 'braces',
      count: 1
    },
    {
      type: 'square',
      count: 1
    }
  ]
  
  var brackets3 = [
    {
      type: 'round',
      count: 1,
      inner: [
        {
          type: 'braces',
          count: 1,
          inner: [
            {
              type: 'round',
              count: 1
            },
            {
              type: 'square',
              count: 1 
            },
            {
              type: 'round',
              count: 1,
              inner: [
                {
                  type: 'braces',
                  count: 2
                },
                {
                  type: 'square',
                  count: 1
                }
              ]
            }  
          ]
        }
      ]
    },
    {
      type: 'braces',
      count: 1
    },
    {
      type: 'round',
      count: 2,
      inner: [
        {
          type: 'square',
          count: 1
        },
        {
          type: 'square',
          count: 1
        }
      ]
    }
  ]
  
  function getBracketsExpr (brackets) {
  
    var openBrackets = {
      round: '(',
      braces: '{',
      square: '['
    }
  
    var closeBrackets = {
      round: ')',
      braces: '}',
      square: ']'
    }
  
    var result = [];
  
    for (var j = 0, len = brackets.length; j < len; j+=1) {
      
      var count = 0,
          inner = null;
  
      if (openBrackets[brackets[j].type]) {
        count = brackets[j].count;
        inner = brackets[j].inner;
  
        for (var i = 0; i < count; i+=1) {
          result.push(openBrackets[brackets[j].type])
        }
  
        if (inner) {
          var innerBrackets = getBracketsExpr(inner);
          result = result.concat(innerBrackets);
        }
      }
  
      for (var i = 0; i < count; i+=1) {
        result.push(closeBrackets[brackets[j].type])
      }
  
    }
  
    return result;
  }
  
  function bracketsExprToStr (brackets) {
    return getBracketsExpr(brackets).join('');
  }
  
  /* test */
  
  console.log( bracketsExprToStr (brackets) );
  console.log( bracketsExprToStr (brackets1) );
  console.log( bracketsExprToStr (brackets2) );
  console.log( bracketsExprToStr (brackets3) );
  
  
  function checkPairsBrackets(str) {
    var openBrackets = ['(', '{', '['],
        closeBrackets = [')', '}', ']'],
        stack = [];
  
    for (var i = 0, len = str.length; i < len; i+=1) {
  
      var index = openBrackets.indexOf(str[i])
  
      if (index > -1) {
        stack.push(index)
      }else { 
        var closeIndex = closeBrackets.indexOf(str[i]); 
        if (closeIndex > -1) {
          if (stack.length === 0) return false;
          var stackIndex = stack.pop();
          if (stackIndex !== closeIndex) {
            return false;
          }
        }
      }
    }
  
    return stack.length === 0;
  }
  
  /* test */
  
  console.log(checkPairsBrackets('()([])([]})'));
  console.log(checkPairsBrackets('()([])({[]})'));
  console.log(checkPairsBrackets('(())'));
  console.log(checkPairsBrackets('(())({})'));
  console.log(checkPairsBrackets('())({})'));
  console.log(checkPairsBrackets('[(])')); 
}