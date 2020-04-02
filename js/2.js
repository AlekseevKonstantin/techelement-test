window.onload = function(){

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

}