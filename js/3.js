window.onload = function () {
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
}