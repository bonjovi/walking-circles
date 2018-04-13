window.addEventListener("resize", pageResize);
var side_bar;
var left_panel;
var right_panel;
var left_panel_slider;
var test;
var fullSideBarWidth = 60; //magic number - ширина сайдбара + отступ
//var full_post_flag = false;
var left_panel_opened_once_flag = false;
var right_panel_opened_once_flag = false;
var closed_left_panel_width = 0;
var closed_right_panel_width = 0;
//var last_active_tab_id = 1;
//var selected_post_id = 0; //id выбранного поста
//var prev_ScrollY_Pos = 0; //положение верт. скролла панели

//window.onwheel = function() {
// console.log("scroll is moving!!!");
//}

function getCoords(elem) { // кроме IE8- // функция получения координат элемента с учетом полосы прокрутки
  console.log("__getCoords");
  console.log("__getCoords: elem", elem);
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

function getCurrentWidthClassName(elem) { // функция определяет какая метка-класс ширины установлена на панели
  console.log("__getCurrentWidthClassName");
  if (elem.classList.contains("panel_width_260")) {
    return "panel_width_260";
  }
  else if (elem.classList.contains("panel_width_320")) {
    return "panel_width_320";
  }
  else if (elem.classList.contains("panel_width_480")) {
    return "panel_width_480";
  }
  else if (elem.classList.contains("panel_width_520")) {
    return "panel_width_520";
  }
  else return null; //чтобы не возвращать пустое значение
}

function getPanelSliderState(elem) { // функция определяет состояние кнопки-слайдера
  console.log("__getPanelSliderState");
  if (elem.classList.contains("button_change-width_max")) {
    return "button_change-width_max";
  }
  else if (elem.classList.contains("button_change-width_min")) {
    return "button_change-width_min";
  }
  else if (elem.classList.contains("button_change-width_middle")) {
    return "button_change-width_middle";
  }
  else return null;

}



function getDelta(elem, panel_type) { // функция определения смещения delta при изменении ширины панели мышкой
  console.log("__getDelta");
  pnl_width = elem.offsetWidth;
  if (panel_type == 'left') { //если панель левая
    if (pnl_width < 320) {
      return 44;
    }
    else if (pnl_width >= 320 && pnl_width < 480) {
      return 52;
    }
    else {
      return 68;
    }
  }
  else { //если панель правая
    if (pnl_width < 320) {
      return -6;
    }
    else if (pnl_width >= 320 && pnl_width < 480) {
      return -8;
    }
    else {
      return -16;
    }
  }
}

function checkWidthLabel(panel) { //функция проверки правильности класса-метки ширины панели
  console.log("__checkWidthLabel");
  console.log("panel: ", panel);
  if (getCurrentWidthClassName(panel) === null) { // проверяем установлена ли вообще метка ширины
    if (pageWidth > 379) {
      panel.classList.add('panel_width_320');
    }
    else {
      panel.classList.add('panel_width_260');
    }
  }
  else {
    if (getCurrentWidthClassName(panel) != width_label2(panel)) { //если текущая метка не совпадает с правильной, меняем её
      console.log("метка до изменения:", getCurrentWidthClassName(panel));
      panel.classList.toggle(getCurrentWidthClassName(panel)); //убираем текущую метку ширины
      panel.classList.add(width_label2(panel)); //ставим правильную
      console.log("метка после изменения:", width_label2(panel));
    }
  }
}

function changePanelFocus(e) {
  console.log("__changePanelFocus");
  console.log("нажатие на ", e.currentTarget, " панель зафиксировано!");
  clickedPanel = e.currentTarget;
  if (!clickedPanel.classList.contains('page__panel_focus')) {
    if (clickedPanel.classList.contains('page__panel_left')) {
      left_panel.classList.add('page__panel_focus');
      right_panel.classList.remove('page__panel_focus');
      console.log("левая панель активирована");
    }
    else {
      right_panel.classList.add('page__panel_focus');
      left_panel.classList.remove('page__panel_focus');
      console.log("правая панель активирована");
    }
  }
}

function formatStr(str) { //преобразуем число вида 2000000 в строку вида 2 000 000
  str = String(str);
  str = str.replace(/(\.(.*))/g, '');
  var arr = str.split('');
  var str_temp = '';
  if (str.length > 3) {
    for (var i = arr.length - 1, j = 1; i >= 0; i--, j++) {
      str_temp = arr[i] + str_temp;
      if (j % 3 === 0) {
        str_temp = ' ' + str_temp;
      }
    }
    return str_temp;
  }
  else {
    return str;
  }
}


function pageResize() { // функция переcчета размеров панелей при изменении ширины страницы
  console.log("__pageResize");
  pageWidth = document.documentElement.clientWidth; //обновляем значение ширины страницы
  pageHeight = document.documentElement.clientHeight; //обновляем значение высоты страницы
  var debug_info = document.getElementById('debug-info');
  // var left_panel = document.querySelector('.panel.panel_pos_left'); // находим левую панель
  //  НЕПРАВИЛЬНО left_panel_slider = left_panel.querySelector("[class*=button_change-width]"); //находим кнопку слайдера на левой панел
  console.log(left_panel);
  console.log("новая ширина = ", pageWidth, "px");
  left_panel_active = left_panel.querySelector(".panel_active");
  console.log("левая активная панель", left_panel_active);
  right_panel_active = right_panel.querySelector(".panel_active");
  console.log("правая активная панель", right_panel_active);
  if (left_panel_active) { //если активна левая панель
    left_panel_slider = left_panel.querySelector("[class*=button_change-width]");
    if (pageWidth <= 380) {
      left_panel_slider.style.display = "none";
      console.log("скрываем значок слайдера!");
    }
    else {
      left_panel_slider.style.display = "block";
      console.log("показываем значок слайдера!");
    }
    console.log('нашли активную левую панель');
    console.log(side_bar.offsetWidth);
    console.log("кнопка слайдера левой панели: ", left_panel_slider.className);
    if ((left_panel_active.offsetWidth + fullSideBarWidth) > pageWidth) {
      console.log("метка слайдера:", getPanelSliderState(left_panel_slider));
      if ((pageWidth >= 320) && (getPanelSliderState(left_panel_slider) != "button_change-width_min")) {
        left_panel_slider.classList.remove(getPanelSliderState(left_panel_slider));
        left_panel_slider.classList.add("button_change-width_max"); //меняем слайдер на max

        console.log("поменяли на max");
        console.log(left_panel_slider.className);
      }
    }
    if (left_panel_slider.classList.contains("button_change-width_max")) {
      console.log("сработало mmmx!!!", get_max_panel_width(pageWidth));
      //left_panel_active.style.width = get_max_panel_width(pageWidth) + 'px';
      if (pageWidth >= 960) {
        if (left_panel_active.offsetWidth < get_max_panel_width(pageWidth)) {
          left_panel_slider.classList.add("button_change-width_middle");
          left_panel_slider.classList.remove("button_change-width_max");
          console.log("max->middle", "Width:", left_panel_active.offsetWidth, " max:", get_max_panel_width(pageWidth));
        }
      }
      else {
        left_panel_active.style.width = get_max_panel_width(pageWidth) + 'px';
      }
    }
    else if (left_panel_slider.classList.contains("button_change-width_min")) {
      console.log("сработало minnn!!!", get_min_panel_width(pageWidth));
      left_panel_active.style.width = get_min_panel_width(pageWidth) + 'px';
    }
    else { //слайдер в промежуточном положении
      if ((left_panel_active.offsetWidth + fullSideBarWidth) > pageWidth) {
        left_panel_active.style.width = pageWidth - fullSideBarWidth + 'px';
        if (left_panel_active.offsetWidth <= get_min_panel_width(pageWidth)) {
          left_panel_slider.classList.add("button_change-width_min");
          left_panel_slider.classList.remove("button_change-width_middle");
          console.log('new_pnl_width', new_pnl_width, 'сработало min');
        }
      }
    }
    checkWidthLabel(left_panel_active); //обновляем метку-класс ширины панели.
    //left_panel_active.querySelector('.content').innerHTML = "<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + left_panel_active.offsetWidth + "px</span>";
  }

  if (right_panel_active) { //если активна правая панель
    right_panel_slider = right_panel.querySelector("[class*=button_change-width]");
    right_panel_fix_button = right_panel.querySelector(".button_fix-panel");
    if (pageWidth <= 380) { //скрываем значок слайдера при ширине страницы меньше 381 px
      right_panel_slider.style.display = "none";
      console.log("скрываем значок слайдера!");
    }
    else {
      right_panel_slider.style.display = "block";
      console.log("показываем значок слайдера!");
    }
    if (pageWidth <= 700) { //скрываем кнопку "закрепить панель при ширине страницы меньше 701 px
      right_panel_fix_button.style.display = "none";
      console.log("скрываем кнопку закрепить панель!");
    }
    else {
      right_panel_fix_button.style.display = "block";
      console.log("показываем кнопку закрепить панель!");
    }




    console.log('нашли активную правую панель');
    console.log("кнопка слайдера правой панели: ", right_panel_slider);

    if ((right_panel_active.offsetWidth + fullSideBarWidth) > pageWidth) {
      console.log("метка слайдера:", getPanelSliderState(right_panel_slider));
      if ((pageWidth >= 320) && (getPanelSliderState(right_panel_slider) != "button_change-width_min")) {
        right_panel_slider.classList.remove(getPanelSliderState(right_panel_slider));
        right_panel_slider.classList.add("button_change-width_max"); //меняем слайдер на max

        console.log("поменяли на max");
        console.log(right_panel_slider.className);
      }
    }


    if (right_panel_slider.classList.contains("button_change-width_max")) {
      console.log("сработало mmmx!!!", get_max_panel_width(pageWidth));
      //right_panel_active.style.width = get_max_panel_width(pageWidth) + 'px';
      if (pageWidth >= 960) {
        if (right_panel_active.offsetWidth < get_max_panel_width(pageWidth)) {
          right_panel_slider.classList.add("button_change-width_middle");
          right_panel_slider.classList.remove("button_change-width_max");
          console.log("max->middle", "Width:", right_panel_active.offsetWidth, " max:", get_max_panel_width(pageWidth));
        }
      }
      else {
        right_panel_active.style.width = get_max_panel_width(pageWidth) + 'px';
      }
    }
    else if (right_panel_slider.classList.contains("button_change-width_min")) {
      console.log("сработало minnn!!!", get_min_panel_width(pageWidth));
      right_panel_active.style.width = get_min_panel_width(pageWidth) + 'px';
    }
    else { //слайдер в промежуточном положении
      if ((right_panel_active.offsetWidth + fullSideBarWidth) > pageWidth) {
        right_panel_active.style.width = pageWidth - fullSideBarWidth + 'px';
        if (right_panel_active.offsetWidth <= get_min_panel_width(pageWidth)) {
          right_panel_slider.classList.add("button_change-width_min");
          right_panel_slider.classList.remove("button_change-width_middle");
          console.log('new_pnl_width', new_pnl_width, 'сработало min');
        }
      }
    }

    checkWidthLabel(right_panel_active);
    right_panel_active.querySelector('.content').innerHTML = "<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + right_panel_active.offsetWidth + "px</span>";
  }



  if (document.getElementsByClassName('left-panel active').length > 0) {
    var left_panel_active = document.getElementsByClassName('left-panel active')[0];
    tab_content_name = left_panel_active.getElementsByClassName('tab-content')[2];
    full_screen_btn = left_panel_active.getElementsByClassName("m_btn")[0];
    var left_panel_slider = left_panel_active.getElementsByClassName("change-width-pnl")[0];
    left_panel_active.getElementsByClassName("change-width-pnl")[0];
    //left_panel_active.querySelector('.content').innerHTML = "<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + left_panel_active.offsetWidth + "px</span>";
    current_width_label = getCurrentWidthClassName(left_panel_active);
    console.log("current_width_label", current_width_label);
    new_width_label = width_label(left_panel_active);
    console.log("new_width_label", new_width_label);
    if (current_width_label != new_width_label) { //если текущая метка неправильная, заменяем её
      left_panel_active.classList.remove(current_width_label);
      left_panel_active.classList.add(new_width_label);
    }
    //left_panel_active.className = "my-profile left-panel active"; // убираем все метки - костыль убрать позже
    //console.log("__костыль сработал");
    //new_width_label=width_label(left_panel_active);
    //left_panel_active.classList.add(new_width_label);


    if (pageWidth >= 321 && pageWidth < 382) {
      console.log("сработало ура!!!");
      if ((left_panel_active.offsetWidth + 60) > pageWidth && !left_panel_slider.classList.contains("button_change-width_max")) {
        console.log("сработало новое условие");
        left_panel_slider.classList.add("button_change-width_max");
      }
      if (left_panel_slider.classList.contains("button_change-width_max")) {
        console.log("сработало mmmx!!!", get_max_panel_width(pageWidth));
        left_panel_active.style.width = get_max_panel_width(pageWidth) + 'px';
      }
    }
    //resize_tab_content('left-panel');
  }
  console.log(left_panel, left_panel.querySelector('.panel_active'));

  if (left_panel.classList.contains('panel_active')) {
    console.log("обнаружена отрытая левая панель");
    current_width_label = getCurrentWidthClassName(left_panel);
    console.log("current_width_label", current_width_label);
    new_width_label = width_label2(left_panel);
    console.log("new_width_label", new_width_label);
    if (current_width_label != new_width_label) { //если текущая метка неправильная, заменяем её
      left_panel.classList.remove(current_width_label);
      left_panel.classList.add(new_width_label);
    }
    if (pageWidth >= 321 && pageWidth < 382) {
      console.log("сработало ура!!!");
      if ((left_panel.offsetWidth + fullSideBarWidth) > pageWidth && !left_panel_slider.classList.contains("button_change-width_max")) {
        console.log("сработало новое условие");
        left_panel_slider.classList.add("button_change-width_max");
      }
      if (left_panel_slider.classList.contains("button_change-width_max")) {
        console.log("сработало mmmx!!!", get_max_panel_width(pageWidth));
        left_panel.style.width = get_max_panel_width(pageWidth) + 'px';
      }
    }
    //left_panel.querySelector(".content").innerHTML = "<span>width: " + pageWidth + "px, " + "height: " + pageHeight + "px </span>";
    console.log("content in", left_panel.querySelector(".content"));
    //resize_tab_content('left-panel');

  }
  debug_info.innerHTML = "<span>width: " + pageWidth + "px, " + "height: " + pageHeight + "px </span>";
}

function panelResize(panel, panel_type) { // обработчик изменения ширины панели мышкой
  console.log("__panelResize");
  console.log(panel_type);
  panel_slider = panel.querySelector("[class*=button_change-width]"); //находим кнопку слайдера на панели
  console.log("panel_slider", panel_slider);
  console.log("panel_", panel);
  panel_slider.onmousedown = function(e) {
    console.log("__событие mouseDown");
    var coords = getCoords(e.target); //получаем координаты точки нажатия на кнопку изменения ширины
    var shiftX = e.pageX - coords.left;
    var shiftY = e.pageY - coords.top;
    var delta = getDelta(panel, panel_type);
    console.log("e.pageX: ", e.pageX, "coords.left", coords.left);
    panel_slider = panel.querySelector("[class*=button_change-width]"); //находим кнопку слайдера на панели (обновляем ссылку на объект)
    function moveAt(e) {
      console.log("__moveAt");
      console.log("панель", panel);
      console.log("объект", e.target);
      pageWidth = document.documentElement.clientWidth; // определяем текущую ширину страницы
      pnl_width = panel.offsetWidth; // определяем текущую ширину панели
      if (panel_slider.classList.contains("button_change-width_min")) { //обнуляем метки для кнопки
        console.log("поймали min");
        panel_slider.classList.remove("button_change-width_min");
        panel_slider.classList.add("button_change-width_middle");
      }
      if (panel_slider.classList.contains("button_change-width_max")) {
        console.log("поймали max");
        panel_slider.classList.remove("button_change-width_max");
        panel_slider.classList.add("button_change-width_middle");
      }
      console.log("pnl_width: ", pnl_width);
      if (getCurrentWidthClassName(panel) != width_label2(panel)) { //если текущая метка не совпадает с правильной, меняем её
        console.log("метка до изменения:", getCurrentWidthClassName(panel));
        panel.classList.toggle(getCurrentWidthClassName(panel)); //убираем текущую метку ширины
        panel.classList.add(width_label2(panel)); //ставим правильную
        console.log("метка после изменения:", width_label2(panel));
      }
      delta = getDelta(panel, panel_type); //определяем размер Delta для текущей ширины панели:  ширина кнопки + правый отступ + ширина рамки справа - (ширина side-bar + ширина рамки справа)

      if (panel_type == "left") { // если панель левая
        console.log("считаем для левой панели:");
        new_pnl_width = e.pageX - shiftX + delta; //рассчитываем новую ширину панели
      }
      else { // если панель правая
        console.log("считаем для правой панели:");
        new_pnl_width = document.documentElement.clientWidth - (e.pageX - shiftX + delta);
      }
      console.log("___e.pageX:", e.pageX, "shiftX:", shiftX, "delta:", delta);
      console.log("new_pnl_width:", new_pnl_width);
      //определяем минимальную ширину панели для текущего разрешения
      if (pageWidth < 380) {
        min_pnl_width = 260;
      }
      else {
        min_pnl_width = 320;
      }
      console.log("предварительный MIN:", pageWidth, "-", min_pnl_width);
      //определяем максимальную ширину панели для текущего разрешения
      max_pnl_width = get_max_panel_width(pageWidth);
      console.log("предварительный MAX:", max_pnl_width);
      if (new_pnl_width < min_pnl_width) { //если вдруг проскочили предельные координаты
        new_pnl_width = min_pnl_width;
      }
      if (new_pnl_width > max_pnl_width) {
        new_pnl_width = max_pnl_width;
      }
      panel.style.width = new_pnl_width + 'px'; //обновляем ширину панели
      if (new_pnl_width == min_pnl_width && !panel_slider.classList.contains("button_change-width_min")) {
        panel_slider.classList.add("button_change-width_min");
        panel_slider.classList.remove("button_change-width_middle");
        console.log('new_pnl_width', new_pnl_width, 'сработало min');
      }
      if (new_pnl_width == max_pnl_width && !panel_slider.classList.contains("button_change-width_max")) {
        panel_slider.classList.add("button_change-width_max");
        panel_slider.classList.remove("button_change-width_middle");
        console.log('new_pnl_width', new_pnl_width, 'сработало max');
      }
      //ze();

      console.log("panel width: ", panel.style.width, "pageX: ", e.pageX, "shift: ", shiftX, "min-pnl: ", min_pnl_width, "max-pnl: ", max_pnl_width);
      //panel.querySelector('.content').innerHTML = "<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + panel.offsetWidth + "px</span>";
    }
    document.onmousemove = function(e) {
      console.log("датчик движения сработал");
      moveAt(e);
    };
    document.onmouseup = function() {
      document.onmousemove = null;
      panel_slider.onmouseup = null;
    };
    panel_slider.ondragstart = function() {
      return false;
    };
  }
}



function resize_tab_content(panel) { //заново задаем высоту и штрину активного tab-content чтобы заработал скрытый вертикальный скролл
  //console.log("__resize_tab_content>panel:",panel);
  var pageWidth = document.documentElement.clientWidth;
  var pageHeight = document.documentElement.clientHeight;
  var panel_active = document.getElementsByClassName(panel + ' active')[0];
  console.log("__resize_tab_content>panel_active:", panel_active);
  if (document.getElementsByClassName(panel + ' active').length > 0) {
    //console.log(panel_active);
    HeaderHeight = 64; //значение по умолчанию
    if (panel_active.getElementsByClassName("profile-buttons").length > 0) {
      if (panel_active.getElementsByClassName("profile-buttons")[0].classList.contains("active")) {
        HeaderHeight = 148;
        HeaderShift = 0;
        console.log("панель profile-buttons активна, высота шапки: ", HeaderHeight, "px, смещение: ", HeaderShift, "px");
      }
      else {
        HeaderHeight = 64;
        HeaderShift = -83;
        console.log("панель profile-buttons скрыта, высота шапки: ", HeaderHeight, "px, смещение: ", HeaderShift, "px");
      }
    }
    else HeaderShift = 0;

    //console.log("высота шапки:",HeaderHeight );
    //console.log("смещение:",HeaderShift );
    if (panel_active.getElementsByClassName("tab-content").length > 0) {
      panel_active.getElementsByClassName("outer-tab-content-container")[0].style.height = (pageHeight - HeaderHeight) + "px";
      for (i = 0; i < panel_active.getElementsByClassName("tab-content").length; i++) {
        if (panel_active.getElementsByClassName("tab-content")[i].classList.contains("active")) {
          panel_active.getElementsByClassName("tab-content")[i].style.height = (pageHeight - HeaderHeight) + "px"; //растягиваем высоту блока до нижнего края экрана и задаем её явно, что сработал вертикальный скролл
          panel_active.getElementsByClassName("tab-content")[i].style.width = panel_active.getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px"; //делаем одинаковой ширину tab-content и внешнего контейнера, чтобы скрыть правый вертикальный скролл
          panel_active.getElementsByClassName("outer-tab-content-container")[0].style.top = HeaderShift + "px";
          console.log("обновили размеры активной панели");
        }
      }
    }
  }
  document.querySelector('.panel__debug-info').innerHTML = "<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + panel_active.offsetWidth + "px</span>";
}

function show_left_panel_new(panel_num) { // функция открытия левой панели
  console.log('__show_left_panel>');
  if (!panel_num) { //если номер панели не задан, отрываем вторую панель
    panel_num = 2;
  }
  console.log("номер панели: " + panel_num);
  console.log("левая панель" + left_panel);
  var panel_list = left_panel.querySelectorAll('.panel'); //получаем список всех элементов левой панели
  selected_panel = panel_list[panel_num - 1]; //находим выбранную панель
  if (panel_list[panel_num - 1].classList.contains("panel_active")) { //определяем активна ли уже выбираемая секция
    console.log("панель уже открыта:", panel_list[panel_num - 1].className);
    if (panel_list[panel_num - 1].classList.contains("separate")) { //если нам попалась отдельная панель
      console.log("отдельная панель будет закрыта");
      console.log("ID выбранного поста:", selected_post_id);
      if (panel_list[panel_num - 1].classList.contains("full-screen")) { //если включен полноэкранный режим, выключаем его
        full_screen_expand('left');
      }
      active_preview_panel = document.querySelector('.left-panel.active');
      active_preview_post = active_preview_panel.querySelector('#post_' + selected_post_id);
      console.log('объект:', panel_list[panel_num - 1].querySelector('.post-wrapper'));
      if (active_preview_post.querySelector('.post-header-link').classList.contains('hide')) { //возвращаем стандартный стиль ссылке
        active_preview_post.querySelector('.post-header-link').classList.remove("hide");
      }
      if (active_preview_post.querySelector('.separate-pnl-btn').classList.contains('chk')) { //меняем значек обратно
        active_preview_post.querySelector('.separate-pnl-btn').classList.remove("chk");
      }
      full_post_selector = '#full_sep_post_' + _post_id;
      panel_list[panel_num - 1].querySelector(full_post_selector).style.display = "none";
    }
    if (panel_list[panel_num].classList.contains("separate") && panel_list[panel_num].classList.contains("active")) {
      console.log("отдельная панель и здесь будет закрыта");
      if (panel_list[panel_num].classList.contains("full-screen")) { //если включен полноэкранный режим, выключаем его
        full_screen_expand('left');
      }
      if (panel_list[panel_num - 1].querySelector('.post-header-link').classList.contains('hide')) { //возвращаем стандартный стиль ссылке
        panel_list[panel_num - 1].querySelector('.post-header-link').classList.remove("hide");
      }
      if (panel_list[panel_num - 1].querySelector('.separate-pnl-btn').classList.contains('chk')) { //меняем значек обратно
        panel_list[panel_num - 1].querySelector('.separate-pnl-btn').classList.remove("chk");
      }
      panel_list[panel_num].classList.remove("active");
    }
    closed_left_panel_width = selected_panel.offsetWidth; //сохраняем ширину панели которую хотим закрыть
    selected_panel.classList.toggle("panel_active"); //если да, закрываем ее
    if (getCurrentWidthClassName(selected_panel)) { //если метка не равна null,
      selected_panel.classList.remove(getCurrentWidthClassName(selected_panel)); //убираем текущую метку ширины
    }
  }
  else {
    console.log("панель еще не открыта", left_panel);
    var active_panel_list = left_panel.querySelectorAll('.panel_active'); // получаем список всех активных секций
    console.log("active length: ", active_panel_list.length);
    if (active_panel_list.length > 0) {
      closed_left_panel_width = active_panel_list[0].offsetWidth; //сохраняем ширину панели которую хотим закрыть
      active_panel_list[0].classList.toggle("panel_active"); //делаем неактивным предыдущую секцию, если она открыта
      active_panel_list[0].classList.toggle(getCurrentWidthClassName(active_panel_list[0])); //убираем текущую метку ширины
    }
    if (left_panel_opened_once_flag) {
      console.log("восстанавливаем ширину панели", closed_left_panel_width);
      selected_panel.style.width = closed_left_panel_width + "px"; //задаем панели ширину, которая была при закрытии
    }

    left_panel_opened_once_flag = true; //меняем флаг при первом открытии

    console.log("className с дефолтоной меткой " + left_panel.className + " w: " + left_panel.offsetWidth);
    selected_panel.classList.toggle("panel_active"); //активируем выбранную панель
    selected_panel.click(); //переключаем фокус на открываемую панель
    checkWidthLabel(selected_panel); //проверяем правильная ли метка ширины стоит
    console.log("className с дефолтоной меткой 222" + left_panel.className + " w: " + left_panel.offsetWidth);

    if (pageWidth <= 380) {
      selected_panel.querySelector("[class*=button_change-width]").style.display = "none";
      console.log("скрываем значек слайдера!");
    }
    else {
      selected_panel.querySelector("[class*=button_change-width]").style.display = "block";
      console.log("показываем значек слайдера!");
    }

    console.log("Активированная панель: ", selected_panel);
    console.log("Ширина: ", selected_panel);
    //selected_panel.querySelector('.panel__debug-info').innerHTML = "<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + panel_list[panel_num - 1].offsetWidth + "px</span>";
    console.log("<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + selected_panel.offsetWidth + "px</span>");
    panelResize(selected_panel, 'left');
    //selected_panel.querySelector('.content').innerHTML = "<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + selected_panel.offsetWidth + "px</span>";
  }
}

function show_separate_panel(id, panel) {
  console.log("__show_separate_panel");
  panel_selector = '.separate.' + panel + '-panel';
  console.log(panel_selector);
  full_post_selector = '#full_sep_post_' + id;
  preview_post_selector = '#post_' + id;

  console.log(full_post_selector);
  active_panel = document.querySelector(panel_selector); // отдельная панель
  active_preview_panel = document.querySelector('.' + panel + '-panel.active'); //основная панель
  active_preview_post = active_preview_panel.querySelector(preview_post_selector);
  console.log("active-panel:", active_panel);
  console.log("active-panel:", active_panel.querySelector(full_post_selector));
  console.log("full_post:", active_panel);
  //separate_panel_list = document.getElementsByClassName('separate'); // получаем список всех активных секций

  if (!active_panel.classList.contains("active")) { // открываем отдельную панель
    console.log("отдельная панель еще не активна");
    active_panel.classList.toggle("active");
    selected_post_id = id;
    active_panel.querySelector(full_post_selector).style.display = "block";
    active_panel.querySelector('.fullscreen-pnl').setAttribute('onclick', "full_screen_expand('left')"); //
    active_panel.querySelector('.close-pnl').style.display = "block";
    active_panel.classList.add("w320");
    active_preview_post.querySelector('.post-header-link').classList.add("hide"); //скрываем стили ссылки
    active_preview_post.querySelector('.separate-pnl-btn').classList.add("chk"); //меняем значек на зеркальный
    full_screen_btn = active_panel.querySelector(".m_btn");
    console.log("full_screen_btn:", full_screen_btn);
    full_screen_btn.style.display = "list-item"; //делаем видимой кнопку fullscreen
    counterElem = active_panel.querySelector('.counter');
    counterElem.addEventListener("click", counterClick); //вешаем обработчик на клики по счетчику
    resize_tab_content('separate ' + panel + '-panel');
    //show_tab(1,'separate left-panel'); //показываем первый и единственный таб
    tab_content_list = active_panel.getElementsByClassName("tab-content");

    addOnWheel(tab_content_list[0], function(e) {
      contentCoords = getCoords(tab_content_list[0]);
      //contentScrollTop =  tab_content_list[tab_id-1].scrollTop;
      //console.log("contentScrollTop:",contentScrollTop);
      console.log("скролл контента:", contentCoords.top); //отслеживаем скролл на контенте
      resize_tab_content('separate left-panel');
    }, false);
    console.log("отдельная панель открыта");
  }
  else { //закрываем отдельную панель
    console.log("отдельная панель уже открыта:", active_panel.querySelector(full_post_selector));
    active_panel.querySelector(full_post_selector).style.display = "none";
    console.log("отдельная панель уже открыта:", active_panel.querySelector(full_post_selector));
    console.log("уже выбраный пост:", selected_post_id);
    console.log("выбираемый пост:", id);
    old_preview_post_selector = '#post_' + selected_post_id;
    old_active_preview_post = active_preview_panel.querySelector(old_preview_post_selector);
    console.log("active_preview_panel object:", active_preview_panel);
    if (id == selected_post_id) {
      console.log("закрываем отделную панель");
      active_panel.classList.toggle("active");
    }
    else {
      console.log("открываем новый пост в выделную панель");
      old_full_post_selector = '#full_sep_post_' + selected_post_id;
      active_panel.querySelector(old_full_post_selector).style.display = "none";
      active_panel.querySelector(full_post_selector).style.display = "block";
      active_preview_post.querySelector('.post-header-link').classList.add("hide"); //скрываем стили ссылки
      active_preview_post.querySelector('.separate-pnl-btn').classList.add("chk"); //меняем значек на зеркальный
      selected_post_id = id;
    }
    console.log("old_active_preview_post object:", old_active_preview_post);

    if (old_active_preview_post.querySelector('.post-header-link').classList.contains('hide')) { //возвращаем стандартный стиль ссылке
      old_active_preview_post.querySelector('.post-header-link').classList.remove("hide");
      console.log("сработало");
    }
    if (old_active_preview_post.querySelector('.separate-pnl-btn').classList.contains('chk')) { //меняем значек обратно
      old_active_preview_post.querySelector('.separate-pnl-btn').classList.remove("chk");
    }
    console.log("отдельная панель закрыта");
  }
  //active_panel.classList.toggle("active");
  //separate_panel_list[0].classList.toggle("w320");
  //document.getElementsByClassName('popup')[0].classList.toggle('active');
}

function show_right_panel(e) {

$(function () {
  var tempName = $('.popup-content').text();
  $('.popup-content').text('');
  $('.header__user-name').text('');
  $('.header__user-name').text(tempName);
});

  console.log("__show_right_panel");
  var panel_num = 1;
  if (!e) var e = window.event; // останавливаем "всплытие" чтоб следом не сработал hide_right_panel()
  if (e.stopPropagation) {
    e.stopPropagation(); // W3C model
  }
  else {
    e.cancelBubble = true; // IE model
  }
  selected_panel = right_panel.querySelector('.panel');
  console.log("selected_panel:" + selected_panel);
  //var panel_list = document.getElementsByClassName('right-panel'); //получаем список всех элементов
  var panel_list = right_panel.querySelectorAll('.panel'); //получаем список всех элементов правой панели
  var panel_list = right_panel.querySelector("[class*='panel.panel_pos_right'][class$='panel_active']") //получаем список всех открытых правых панелей
  console.log("ggg" + panel_list);
  if (panel_list) {
    for (var i = 0; i < panel_list.length; i++) {
      panel_list[i].classList.toggle("panel_active"); //закрываем все правые панели
    }
  }
  parentElm = e.target.parentNode;
  while ((!parentElm.classList.contains("popup")) && (parentElm.nodeName != 'BODY')) { //находим родительский элемент с классом popup
    parentElm = parentElm.parentNode;
  }
  if (parentElm.nodeName != 'BODY') { // если нашли нужного родителя
    panelId = parentElm.getAttribute('data-popup-id'); // находим id объекта к которому привязан попап
    //проверяем совпадает ли нужный id c id объектом загруженным в правую панель
    if (panelId == selected_panel.getAttribute('data-panel-id')) {
      console.log("данные объекта загружены");
      popupDataSelector = "[data-panel-id='" + panelId + "']";
      console.log("selector:" + popupDataSelector);
      console.log("right_panel:" + right_panel.offsetWidth);
      if (!right_panel.querySelector(popupDataSelector).classList.contains('panel_active')) { //проверяем активна ли правая панель
        if (pageWidth <= 380) {
          selected_panel.querySelector("[class*=button_change-width]").style.display = "none";
          console.log("скрываем значек слайдера!");
        }
        else {
          selected_panel.querySelector("[class*=button_change-width]").style.display = "block";
          console.log("показываем значек слайдера!");
        }
        if (pageWidth <= 700) { //скрываем кнопку "закрепить панель при ширине страницы меньше 701 px
          selected_panel.querySelector(".button_fix-panel").style.display = "none";
          console.log("скрываем кнопку закрепить панель!");
        }
        else {
          selected_panel.querySelector(".button_fix-panel").style.display = "block";
          console.log("показываем кнопку закрепить панель!");
        }
        right_panel.querySelector(popupDataSelector).classList.add('panel_active'); //активируем правую панель
        selected_panel.style.width = get_min_panel_width() + "px";
        panelResize(selected_panel, 'right');
        console.log("right_panel:" + right_panel.offsetWidth);
        checkWidthLabel(selected_panel); //проверяем правильная ли метка ширины стоит
        console.log("right_panel:" + right_panel.offsetWidth);
        selected_panel.click(); // переводим фокус на открываемую панель
      }
      parentElm.classList.toggle('popup_active'); //закрываем попап
      panelResize(selected_panel, 'right'); //вешаем обработчик изменения ширины панели с помощью мышки
      console.log("right_panel:" + right_panel.offsetWidth);
      selected_panel.querySelector('.content').innerHTML = "<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + selected_panel.offsetWidth + "px</span>";
    }
    else {
      console.log("нужно загружать данные объекта из базы");
    }
    //   right_panel.querySelector(popupDataSelector).classList.toggle('panel_active'); //активируем правую панель
    //   console.log("selector2:" + parentElm.classList);
    //   parentElm.classList.toggle('popup_active'); //закрываем попап
  }
}


function close_panel(e) {
  if (!e) var e = window.event; // останавливаем "всплытие" чтоб следом не сработал hide_right_panel()
  if (e.stopPropagation) {
    e.stopPropagation(); // W3C model
  }
  else {
    e.cancelBubble = true; // IE model
  }
  parentElm = e.target.parentNode;
  while ((!parentElm.classList.contains("panel")) && (parentElm.nodeName != 'BODY')) { //находим родительский элемент с классом popup
    parentElm = parentElm.parentNode;
  }
  if (parentElm.nodeName != 'BODY') { // если нашли нужного родителя
    if (parentElm.parentNode.classList.contains("page__panel_left")) {
      closed_left_panel_width = parentElm.offsetWidth;
      console.log("close left:", closed_left_panel_width);
    }
    else if (parentElm.parentNode.classList.contains("page__panel_right")) {
      closed_right_panel_width = parentElm.offsetWidth;
      console.log("close right:", closed_right_panel_width);
    }
    parentElm.classList.toggle('panel_active'); //закрываем панель
  }
}

function show_popup(e, username) {

$(function () {
  $('.popup-content').text('');
  $('.popup-content').text(username);
});

  var panel_num = 1;
  if (!e) var e = window.event; // останавливаем "всплытие" чтоб следом не сработал hide_right_panel()
  if (e.stopPropagation) {
    e.stopPropagation(); // W3C model
  }
  else {
    e.cancelBubble = true; // IE model
  }
  //if (document.getElementsByClassName('popup').length > 0) {
  console.log("кнопка сработала", document.getElementsByClassName('popup')[0], e.target.parentElement);
  objectId = e.target.parentElement.getAttribute('data-object-id');
  popupDataSelector = "[data-popup-id='" + objectId + "']";
  document.querySelectorAll("[data-popup-id='456']")[0].classList.toggle('popup_active');
  //this.classList.toggle('popup_active');
  //document.getElementsByClassName('popup')[0].classList.toggle('active'); //делаем поп-ап видимым, если он не активен, и скрываем если он уже активен
  //}
}


function hide_right_panel() {
  console.log("hide сработал");
  if (document.getElementsByClassName('popup')[0].classList.contains("active")) {
    document.getElementsByClassName('popup')[0].classList.remove("active"); //делаем неактивным предыдущую секцию, если она открыта
  }
}

function show_tab(tab_id, panel) {
  console.log('__show_tab');
  // Declare all variables
  var i, tab_content_list, tab_links, active_panel;
  active_panel = document.getElementsByClassName(panel + " active");
  console.log('active_panel: ', active_panel);
  // Get all elements with class="tab-content" and hide them
  tab_content_list = active_panel[0].getElementsByClassName("tab-content");
  //full_screen_btn = active_panel[0].getElementsByClassName("m_btn")[0];
  //full_screen_btn.style.display = "none";
  for (i = 0; i < tab_content_list.length; i++) {
    tab_content_list[i].classList.remove("active");
    tab_content_list[i].style.display = "none";
  }

  // Get all elements with class="tab-links" and remove the class "active"
  tab_links = active_panel[0].getElementsByClassName("tab-link");

  for (i = 0; i < tab_links.length; i++) {
    tab_links[i].className = tab_links[i].className.replace(" active", "");
  }
  tab_links[tab_id - 1].classList.add("active");
  // Show the current tab, and add an "active" class to the link that opened the tab
  tab_content_list[tab_id - 1].style.display = "block";
  tab_content_list[tab_id - 1].classList.add("active");

  //if (tab_id == 3 && pageWidth > 420){  //активируем кнопку full-screen для раздела публикаций
  //	full_screen_btn.style.display = "list-item";
  //}
  if (tab_id == 1) { //активируем скрипт SimpleBar для горизонтального скрола
    var el = new SimpleBar(document.querySelector('.user-image-feed-wrapper'), {
      autoHide: false,
      scrollbarMinSize: 2
    });
    if (document.querySelector('.simplebar-content').addEventListener) { //навешываем обработчик скрола
      // IE9, Chrome, Safari, Opera
      document.querySelector('.simplebar-content').addEventListener("mousewheel", scrollHorizontally, false);
      // Firefox
      document.querySelector('.simplebar-content').addEventListener("DOMMouseScroll", scrollHorizontally, false);
    }
    else {
      // IE 6/7/8
      document.querySelector('.simplebar-content').attachEvent("onmousewheel", scrollHorizontally);
    }
  }

  //	tab_content_list[tab_id-1].classList.add("active");
  //document.getElementById(tab_id).style.display = "block";
  //console.log("target:",evt.currentTarget);
  //evt.currentTarget.className += " active";
  resize_tab_content(panel);
  active_panel[0].querySelector('.inner-tab-content-container').scrollTop = 0; //при переключении табов переводим верт. скрол в вернхнее положение
  profile_buttons_onmouse_flag = false;
  profile_header_onmouse_flag = false;
  contentCoords = getCoords(tab_content_list[tab_id - 1]);
  console.log("contentCoords.top_1:", contentCoords.top);
  console.log("объект:", tab_content_list[tab_id - 1]);
  prev_ScrY = contentCoords.top;
  console.log("до скрола:", prev_ScrY);
  timer3_on_flag = false;
  console.log(">>обнуляем флаг:", timer3_on_flag);
  console.log("Шаг 0:", active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"));
  addOnWheel(tab_content_list[tab_id - 1], function(e) {
    contentCoords = getCoords(tab_content_list[tab_id - 1]);
    //contentScrollTop =  tab_content_list[tab_id-1].scrollTop;
    //console.log("contentScrollTop:",contentScrollTop);
    console.log("скролл на табе:", tab_content_list[tab_id - 1]);
    if (active_panel[0].querySelector('.inner-tab-content-container').scrollTop == 0) {
      console.log("scrollTop == 0");
      resize_tab_content(panel);
    }
    console.log('top_чик:', getCoords(tab_content_list[tab_id - 1]).top);
    console.log("предыдущий contentCoords.top:", prev_ScrY, " текущий:", contentCoords.top, " scrollTop inner-container:", active_panel[0].querySelector('.inner-tab-content-container').scrollTop);
    //	console.log("contentCoords.top:",contentCoords.top);
    //	console.log("скролл контента:",contentCoords.top);//отслеживаем скролл на контенте
    //	console.log("scrollTop скролл контента2:",active_panel[0].querySelector('.inner-tab-content-container').scrollTop);
    var panel_timer1; // таймер на закрытие панели табов, если убрать мышь с profile-header (панель над панелью табов)
    var panel_timer2; // таймер на закрытие панели табов, если убрать мышь с панели табов
    var panel_timer3; // таймер на показ панели табов при скроле вверх
    var panel_timer4; // таймер на на закрытие панели табов, если скрол вверх прекратился
    clearTimeout(panel_timer1);
    clearTimeout(panel_timer2);
    //clearTimeout (panel_timer3);
    //clearTimeout (panel_timer4);

    deltaScroll = contentCoords.top - prev_ScrY //определяем направление скролла: вверх >0, вниз < 0
    console.log("deltaScroll1:", deltaScroll);

    if (contentCoords.top < 0) {
      console.log("_____________::____>>один такт скрола, флаг:", timer3_on_flag);
      console.log("Шаг 1:", active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"));
      console.log("contentCoords.top:", contentCoords.top);
      if (!timer3_on_flag) {
        active_panel[0].getElementsByClassName("profile-buttons")[0].classList.remove("active");
        console.log("сработал первый if, убераем панель с кнопками");
      }
      ContentScrolled = true;
      resize_tab_content(panel);
      console.log("deltaScroll:", deltaScroll);
      if (deltaScroll > 0) {
        console.log("!!!____скролим вверх!!!");
        console.log('Флаг timer3_on_flag:', timer3_on_flag);
        if (!timer3_on_flag) {
          clearTimeout(panel_timer4);
          console.log("сброшен timer4");
          console.log("timer3_on_flag был false, а теперь:", timer3_on_flag);
          //panel_timer3 = setTimeout(function() {
          if (contentCoords.top < 0 && deltaScroll > 0) {
            if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) {
              console.log('Если панель еще не активна, открываем её, панель:', active_panel[0]);
              active_panel[0].getElementsByClassName("profile-buttons")[0].classList.add("active"); //показ панели табов
              if (active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
                timer3_on_flag = true;
              }
              console.log("timer3_on_flag был false, а теперь:", timer3_on_flag);
              console.log('Панель с кнопками открыта:', timer3_on_flag);
              console.log('Реально открыта:', active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"));
              console.log("Шаг 2.1:", active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"), 'флаг:', timer3_on_flag);
            }
          }
          //},500);
        }
        if (timer3_on_flag) {
          clearTimeout(panel_timer4); //если таймер уже был запущен обнуляем его
          console.log("сброшен timer4", 'contentCoords.top:', contentCoords.top);
          panel_timer4 = setTimeout(function() {
            if (contentCoords.top < 0 && !profile_buttons_onmouse_flag && !profile_header_onmouse_flag) {
              console.log('одно условие прошел, второе:', timer3_on_flag);
              if (timer3_on_flag) {
                console.log("запущен timer4, панель закроем через 3 сек.");
                if (active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) {
                  active_panel[0].getElementsByClassName("profile-buttons")[0].classList.remove("active");
                  console.log("Шаг 2.2:", active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"), 'флаг:', timer3_on_flag);
                  resize_tab_content(panel);
                }
                if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
                  timer3_on_flag = false;
                }

                console.log('А флаг то теперь:', timer3_on_flag);
              }
            }
          }, 3000);
        }


      }
      else {
        //clearTimeout (panel_timer3);
        //console.log("сброшен timer3");
        console.log("!!!____скролим вниз!!!");
        clearTimeout(panel_timer4);
        console.log("сброшен timer4");
        //	console.log("!!!____скрываем панель сразу!!!");
        if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
          timer3_on_flag = false;
        }
        //	else {
        //		active_panel[0].getElementsByClassName("profile-buttons")[0].classList.remove("active");
        //		timer3_on_flag = false;
        //	}
        console.log("Шаг 3:", active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"), 'флаг:', timer3_on_flag);


      }
      active_panel[0].querySelector('.profile-buttons').onmouseenter = function() { //мышка над панелью табов
        profile_buttons_onmouse_flag = true;
        clearTimeout(panel_timer1);
        console.log("сброшен timer1");
        clearTimeout(panel_timer4);
        console.log("сброшен timer4");
        if (active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
          timer3_on_flag = true;
        }
        console.log("Шаг x.1:", active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"), 'флаг:', timer3_on_flag);
      }
      active_panel[0].querySelector('.profile-buttons').onmouseleave = function() { //мышка ушла с панели табов
        profile_buttons_onmouse_flag = false;
        panel_timer2 = setTimeout(function() {
          if (contentCoords.top < 0) {
            console.log("запущен timer2");
            active_panel[0].querySelector('.profile-buttons').classList.remove("active");
            if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
              timer3_on_flag = false;
            }
            console.log("Шаг x.2:", active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"), 'флаг:', timer3_on_flag);
          }
        }, 500);
      }

      active_panel[0].querySelector('.profile-header').onmouseenter = function() {
        profile_header_onmouse_flag = true;
        console.log("засекли мышку");
        clearTimeout(panel_timer2);
        console.log("сброшен timer2");
        clearTimeout(panel_timer4);
        console.log("сброшен timer4");
        active_panel[0].getElementsByClassName("profile-buttons")[0].classList.add("active");
        if (active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
          timer3_on_flag = true;
        }
        console.log("Шаг 0.1:", active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"), 'флаг:', timer3_on_flag);
      }
      active_panel[0].querySelector('.profile-header').onmouseleave = function() { // если курсор убрали - прячем панель через 2 секунды
        profile_header_onmouse_flag = false;
        console.log("мышка нас покинула");
        panel_timer1 = setTimeout(function() {
          if (contentCoords.top < 0) {
            console.log("запущен timer1");
            active_panel[0].getElementsByClassName("profile-buttons")[0].classList.remove("active");
            if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) {
              timer3_on_flag = false;
            }
            console.log("Шаг 0.2:", active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"), 'флаг:', timer3_on_flag);
          }
        }, 2000);
      }

    }
    else if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active") && !active_panel[0].getElementsByClassName("profile-extra-buttons")[0].classList.contains("active")) { //вернулись к верху панели
      active_panel[0].getElementsByClassName("profile-buttons")[0].classList.add("active");
      console.log("сработал второй if");
      ContentScrolled = false;
      resize_tab_content(panel);

    };
    contentCoords = getCoords(tab_content_list[tab_id - 1]);
    prev_ScrY = contentCoords.top;
    console.log("prev_ScrY обновили:", prev_ScrY);
  }, false);
  last_active_tab_id = tab_id; //запоминаем какой таб был открыт последним
  //prev_ScrollY_Pos = active_panel[0].querySelector('.inner-tab-content-container').scrollTop; //сохраняем предыдущее положение верт. скролла панели
  console.log("prev_ScrollY_Pos:", prev_ScrollY_Pos);
}

var extra_buttons_timer1;
var extra_buttons_timer2;
var extra_buttons_clicked_flag = false;

function init_extra_buttons(panel) {
  clearTimeout(extra_buttons_timer1);
  clearTimeout(extra_buttons_timer2);
  //extra_buttons_clicked_flag = true;
  show_extra_buttons(panel);
  console.log("первый запуск");

}


function addOnWheel(elem, handler) { // отслеживаем скрол мыши
  if (elem.addEventListener) {
    if ('onwheel' in document) {
      // IE9+, FF17+
      elem.addEventListener("wheel", handler);
    }
    else if ('onmousewheel' in document) {
      // устаревший вариант события
      elem.addEventListener("mousewheel", handler);
    }
    else {
      // 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
      elem.addEventListener("MozMousePixelScroll", handler);
    }
  }
  else { // IE8-
    text.attachEvent("onmousewheel", handler);
  }
}

function scrollHorizontally(e) {
  e = window.event || e;
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  document.querySelector('.simplebar-content').scrollLeft -= (delta * 40); // Multiplied by 40
  e.preventDefault();
}





function init() {
  console.log("Page is loaded");
  side_bar = document.querySelector('.side-bar');
  left_panel = document.querySelector('.page__panel_left'); // находим левую панель
  right_panel = document.querySelector('.page__panel_right'); // находим правую панель
  console.log("левую панель нашли:", left_panel);
  left_panel.addEventListener("click", changePanelFocus);
  right_panel.addEventListener("click", changePanelFocus);
  var debug_info = document.getElementById('debug-info');
  pageWidth = document.documentElement.clientWidth; //получаем значение ширины страницы
  pageHeight = document.documentElement.clientHeight; //получаем значение высоты страницы
  debug_info.innerHTML = "<span>width: " + pageWidth + "px, " + "height: " + pageHeight + "px";
  //console.log("Ширина = ", pageWidth, "px " );
  /* 	if (pageWidth < 480 && document.getElementsByClassName('left-panel active').length > 0) { //если активна левая панель, то скрываем side-bar
  		document.getElementById("side-bar").classList.add("hidden");
  	} */
  /*     var mc = new Hammer(side_bar_Div);
      mc.on("swipeleft", function(ev) {
      		console.log(ev.type, "It is work!!!" );
      		side_bar_Div.classList.add("hidden");
      }); */
  console.log("debug:", debug_info);
  var d_map = document.getElementById('map-test');
  console.log("m_div:", d_map);






























var margin = {top: -5, right: -5, bottom: -5, left: -5},
    width = 1960 - margin.left - margin.right,
    height = 1500 - margin.top - margin.bottom;

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
    .call(zoom).on("dblclick.zoom", null);

var rect = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");




var container = svg.append("g");

container.append("g")
    .attr("class", "x axis")
  .selectAll("line")
    .data(d3.range(0, width, 10))
  .enter().append("line")
    .attr("x1", function(d) { return d; })
    .attr("y1", 0)
    .attr("x2", function(d) { return d; })
    .attr("y2", height);

container.append("g")
    .attr("class", "y axis")
  .selectAll("line")
    .data(d3.range(0, height, 10))
  .enter().append("line")
    .attr("x1", 0)
    .attr("y1", function(d) { return d; })
    .attr("x2", width)
    .attr("y2", function(d) { return d; });

dotContainer = container.append("g")
               .attr("class", "dotContainer")
               .datum({x:-20, y:-20})
               .attr("transform", function(d) { return 'translate(' + d.x + ' '+ d.y + ')'; })
               //.call(drag);


//var activeUsername = d3.select('.header.profile__header > h2').text();

d3.tsv("hello.tsv", dottype, function(error, dots) {



  dotContainer
    .attr("class", "dot")
    .selectAll("circle")
    .data(dots)
    .enter().append("g")
        .attr("class", "myelement")
        .attr("onclick",  function(d) { return "show_popup(event,'" + d.name + "')"; })
        .attr("email", function(d) { return d.email.replace('@', '').replace('_', '').replace('.', ''); })
        .attr("transform", function(d) { 

          return 'translate(' + d.x + ','+ d.y + ')'; 
          //socket.emit('moving', d.x, d.y);
          
        })
        .attr("myx", function(d) { return d.x; })
        .attr("myy", function(d) { return d.y; })
    .append("circle")
      .attr("r", 5);
      //.call(drag);

  dotContainer
    .selectAll(".myelement")
    .data(dots)
    .append("text")
    .attr("y", -12)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });
});   

  

// socket.on('message', function(data) {
//         console.log(data);
//     });

// socket.on('moving', function(cx, cy){
//      d3.select('g.myelement').attr("transform", 'translate(' + cx + ','+ cy + ')');
//      console.log(cx + ' ' + ' ' + cy);
//  });

// setTimeout(function() {
//  svg.select("[name]")
//  .call(drag);
// }, 2000);







// var newcircle = dotContainer.append("g")
//  .attr("class", "newcircle")
//  .attr("cx", "200")
//     .attr("cy", "200");

// newcircle.append("circle")
//     .attr("cx", "200")
//     .attr("cy", "200")
//     .attr("r", 15);

// newcircle.append("text")
//  .attr("x", "200")
//  .attr("y", 200 - 20)
//  .attr("dy", ".35em")
//  .text("Роман");





function dottype(d) {
  d.x = +d.x;
  d.y = +d.y;
  return d;
}            

/*dot = dotContainer.append("circle")
      .attr("class", "dot")
      .datum({x:220, y:120})
     .attr("cx", function(d) { return d.x; })
     .attr("cy", function(d) { return d.y; })
      .attr("r", 5);

text =  dotContainer.append("text")
.datum({x:220, y:120-10})
               .attr("x", function(d) { return d.x; })
               .attr("y", function(d) { return d.y; })
          .text($('.user-name h2').text());  

*/



function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

/*
function dragged(d) {
  d.x += d3.event.dx;
  d.y += d3.event.dy;

  d3.select(this).attr("transform", function(d,i){
    return "translate(" + [ d.x,d.y ] + ")"
  });
}
*/



function dragged(d) {

  d.x += d3.event.dx;
  d.y += d3.event.dy;

  d3.select(this).attr("transform", function(d,i){
    return "translate(" + [ d.x,d.y ] + ")"
  });

  //d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  

}





function dragended(d) {
  d3.select(this).classed("dragging", false);
}































  docHeight = document.documentElement.offsetHeight;
  var mapwrapper = document.getElementsByClassName('central-button-wrapper')[0];
  var mapscale = 1;

  console.log(mapwrapper);

}

function width_label(panel) { // функция определяет какую метку-класс ставить панели в зависимости от её ширины
  if (panel.offsetWidth < 320) {
    return "panel_width_260";
  }
  else if (panel.offsetWidth >= 320 && panel.offsetWidth < 479) {
    return "panel_width_320";
  }
  else if (panel.offsetWidth >= 480 && panel.offsetWidth < 519) {
    return "panel_width_480";
  }
  else {
    return "panel_width_520";
  }
}

function width_label2(panel) { // определяем какую метку ставить панели в зависимости от её ширины
  console.log('__width_label2');
  console.log(panel);
  if (panel.offsetWidth < 320) {
    return "panel_width_260";
  }
  else if (panel.offsetWidth >= 320 && panel.offsetWidth < 480) {
    console.log(pageWidth);
    if (pageWidth <= 380) {
      return "panel_width_260";
    }
    else {
      return "panel_width_320";
    }
  }
  else {
    return "panel_width_480";
  }
}




function get_max_panel_width(width) {
  if (width <= 320) {
    return 260;
  }
  else if (width > 320 && width <= 381) {
    console.log("max-width:", width - fullSideBarWidth);
    return (width - fullSideBarWidth);
  }
  else if (width >= 382 && width < 421) {
    return (width - fullSideBarWidth);
  }
  else if (width >= 421 && width < 481) {
    return (width - fullSideBarWidth);
  }
  else if (width >= 481 && width < 768) {
    return 420;
  }
  else if (width >= 768 && width < 960) {
    return 420;
  }
  else if (width >= 960 && width < 1200) {
    return 480;
  }
  else if (width >= 1200 && width <= 1920) {
    return 520;
  }
  else {
    return 520;
  }
}

function get_min_panel_width(width) {
  if (pageWidth < 380) {
    return pageWidth - fullSideBarWidth;
  }
  else {
    return 320;
  }
}

function show_full_post(id, panel) {
  console.log("__show_full_post");
  panel_selector = '.' + panel + '-panel.active';
  full_post_selector = '#full_post_' + id;
  active_panel = document.querySelector(panel_selector);
  full_screen_btn = active_panel.querySelector('.m_btn');
  scroll_wrapper = active_panel.querySelector('.inner-tab-content-container');
  preview_post_list = active_panel.getElementsByClassName('post-preview-wrapper');
  console.log("active-panel:", active_panel);
  if (document.querySelector('.separate' + panel_selector) != null) { //если открыта отдельная панель, закрываем её
    console.log("тадам!!!");
    return false;
    //document.querySelector('.separate'+panel_selector).classList.remove("active")
  }
  if (!full_post_flag) { //показываем пост в основной панели
    prev_ScrollY_Pos = scroll_wrapper.scrollTop; //сохраняем предыдущее положение верт. скролла панели
    active_panel.querySelector(full_post_selector).style.display = "block";
    active_panel.querySelector('.new-post').style.display = "none";
    active_panel.querySelector('.ads-block-wrapper').style.display = "none";
    for (i = 0; i < preview_post_list.length; i++) {
      console.log(i);
      preview_post_list[i].style.display = "none";
    }
    full_screen_btn.style.display = "block";
    counterElem = active_panel.querySelector('.counter');
    counterElem.addEventListener("click", counterClick); //вешаем обработчик на клики по счетчику
    console.log('--', scroll_wrapper.scrollTop);
    scroll_wrapper.scrollTop = 0; //возвращаем вертикальный скролл в исходное положение - вверх
    console.log('scroll_wrapper.scrollTop:', scroll_wrapper.scrollTop, 'prev_ScrollY_Pos:', prev_ScrollY_Pos);
    full_post_flag = true;
    selected_post_id = id; //обновляем глобальную переменную с id выбранного поста
    console.log('full_post_flag:', full_post_flag);
    //resize_tab_content(panel);
  }
  else {
    active_panel.querySelector(full_post_selector).style.display = "none";
    active_panel.querySelector('.new-post').style.display = "block";
    active_panel.querySelector('.ads-block-wrapper').style.display = "flex";
    for (i = 0; i < preview_post_list.length; i++) {
      console.log(i);
      preview_post_list[i].style.display = "block";
    }

    scroll_wrapper.scrollTop = prev_ScrollY_Pos; //возвращаем вертикальный скролл в положение в котором он был до выбора поста.
    console.log('scroll_wrapper.scrollTop:', scroll_wrapper.scrollTop, 'prev_ScrollY_Pos:', prev_ScrollY_Pos);
    full_screen_btn.style.display = "none";
    selected_post_id = 0;
    full_post_flag = false;
  }

}
PostRatingValue = 2000000; //рейтинг поста будет браться из базы данных

function counterClick(event) {
  InputElem = this.querySelector('.counter_field').value;
  MinRatingValue = this.querySelector('.count_min_range').innerHTML;
  MaxRatingValue = this.querySelector('.count_max_range').innerHTML;
  MarkValue = parseInt(InputElem.replace(/\s+/g, ''), 10); //получаем значение поля, попутно удаляя все пробелы и приобразуя в число
  MinRatingValue = parseInt(MinRatingValue.replace(/\s+/g, ''), 10);
  MaxRatingValue = parseInt(MaxRatingValue.replace(/\s+/g, ''), 10);
  MarkValue = MarkValue || 0;

  if (event.target.className == 'count_minus_btn') {
    console.log('minus');
    --MarkValue;

    if (MaxRatingValue > PostRatingValue) {
      console.log('-111');
      --MaxRatingValue;
      MinRatingValue = PostRatingValue;
    }
    else {
      console.log('-222');
      MaxRatingValue = PostRatingValue;
      --MinRatingValue;
    }
    console.log(MinRatingValue, '-', MarkValue, '-', MaxRatingValue);
    console.log(parseInt(MarkValue, 10));
  }
  if (event.target.className == 'count_plus_btn') {
    console.log('plus');
    ++MarkValue;
    if (MinRatingValue < PostRatingValue) {
      console.log('+111');
      ++MinRatingValue;
      MaxRatingValue = PostRatingValue;

    }
    else {
      console.log('+222');
      MinRatingValue = PostRatingValue;
      ++MaxRatingValue;
    }
    console.log(MinRatingValue, '-', MarkValue, '-', MaxRatingValue);
  }
  if (MarkValue > 0) {

    MarkSign = '+ ';
    this.querySelector('.counter_field').style.color = '#7dd3c6';
  }
  else if (MarkValue == 0) {
    MarkSign = '';
    this.querySelector('.counter_field').style.color = '#000';
  }
  else {
    MarkSign = '- ';
    this.querySelector('.counter_field').style.color = '#f76879';
  }
  this.querySelector('.counter_field').value = MarkSign + Math.abs(MarkValue); //используем модуль, чтобы не задваивать знак минуса
  this.querySelector('.count_min_range').innerHTML = formatStr(MinRatingValue);
  this.querySelector('.count_max_range').innerHTML = formatStr(MaxRatingValue);
}


function show_personal_info_spec_menu(panel, menu_item) {
  console.log("__show_personal-info-spec-menu");
  active_panel = document.querySelector('.' + panel + '-panel.active');
  active_item_menu = active_panel.querySelector('.' + menu_item + '-header');
  console.log(active_item_menu);
  active_item_menu.classList.toggle('active');
  active_item_menu.nextElementSibling.classList.toggle('active');
  console.log(active_item_menu.nextElementSibling);
  console.log(active_item_menu.nextElementSibling.classList.contains('active'));
  var spec_panel_timer1;
  clearTimeout(spec_panel_timer1);
  if (active_item_menu.nextElementSibling.classList.contains('active')) {
    console.log("условие сработало");
    active_item_menu.nextElementSibling.onmouseenter = function() { //мышка ушла с панели доп. функционала
      clearTimeout(spec_panel_timer1);
      console.log("сброшен таймер spec_panel_timer1");
    }
    active_item_menu.nextElementSibling.onmouseleave = function() { //мышка ушла с панели доп. функционала
      spec_panel_timer1 = setTimeout(function() {
        console.log("запущен spec_panel_timer1");
        if (active_item_menu.nextElementSibling.classList.contains('active')) {
          show_personal_info_spec_menu(panel, menu_item);
        }
      }, 500);
    }
  }

}

function show_spec_menu(panel) {
  console.log("__show_spec_menu");
  panel_selector = '.' + panel + '-panel.active';
  if (panel == 'separate left') {
    panel_selector = '.separate.left-panel.active';
  }
  console.log(panel_selector);
  active_panel = document.querySelector(panel_selector);
  active_panel.querySelector('.profile-header').classList.toggle('active');
  active_panel.querySelector('.spec-menu-block').classList.toggle('active');
  var spec_panel_timer2;
  clearTimeout(spec_panel_timer2);
  if (active_panel.querySelector('.spec-menu-block').classList.contains('active')) {
    active_panel.querySelector('.spec-menu-block.active').onmouseenter = function() {
      clearTimeout(spec_panel_timer2);
      console.log("сброшен таймер spec_panel_timer2");
    }

    active_panel.querySelector('.spec-menu-block.active').onmouseleave = function() { //мышка ушла с панели доп. функционала
      spec_panel_timer2 = setTimeout(function() {
        console.log("запущен spec_panel_timer2");
        if (active_panel.querySelector('.spec-menu-block').classList.contains('active')) {
          show_spec_menu(panel);
        }
      }, 500);
    }
  }
}

function show_post_header_spec_menu(panel, id) {
  console.log("__show_post_header_spec_menu");
  panel_selector = '#post_' + id;
  console.log("panel_selector: ", panel_selector);
  active_panel = document.querySelector(panel_selector);
  active_panel.querySelector('.post-header-btns-block').classList.toggle('active');
  active_panel.querySelector('.post-header-spec-menu').classList.toggle('active');
  console.log(active_panel.querySelector('.post-header-spec-menu'));
  var spec_panel_timer3;
  clearTimeout(spec_panel_timer3);
  if (active_panel.querySelector('.post-header-spec-menu').classList.contains('active')) {
    active_panel.querySelector('.post-header-spec-menu.active').onmouseenter = function() {
      clearTimeout(spec_panel_timer3);
      console.log("сброшен таймер spec_panel_timer3");
    }

    active_panel.querySelector('.post-header-spec-menu.active').onmouseleave = function() { //мышка ушла с панели доп. функционала
      spec_panel_timer3 = setTimeout(function() {
        console.log("запущен spec_panel_timer3");
        if (active_panel.querySelector('.post-header-spec-menu').classList.contains('active')) {
          show_post_header_spec_menu(panel, id);
        }
      }, 500);
    }
  }
}




function left_panel_expand(param) {
  console.log("__left_panel_expand");
  var pageWidth = document.documentElement.clientWidth;
  var pageHeight = document.documentElement.clientHeight;
  //var active_panel_list = document.getElementsByClassName('left-panel active'); // получаем список всех активных секций
  if (param == "separate") { // определяем на какой панели нажата кнопка (separate - отдельная панель для публикаций)
    var active_panel = document.querySelector('.separate.left-panel.active');
  }
  else {
    var active_panel = document.querySelector('.left-panel.active');
  }
  console.log("act_panel obj:", active_panel);
  var side_bar_Div = document.getElementById('side-bar');
  var left_panel_slider = active_panel.querySelector(".change-width-pnl"); //находим кнопку слайдера на левой панели
  /* 	max_panel_width = 420;
  if (pageWidth > 768 && pageWidth <= 960){
  	max_panel_width = 420;
  }
  else if (pageWidth > 960 && pageWidth <= 1200){
  	max_panel_width = 480;
  } */
  max_panel_width = get_max_panel_width(pageWidth);
  console.log("функция выдала new_max = ", max_panel_width);

  if (left_panel_slider.classList.contains("mn")) { // определяем состояние панели по классам mn и mx
    console.log("slider", left_panel_slider);
    left_panel_slider.classList.remove("mn");
    console.log("расширение, удаляем метку mn");
    if (pageWidth <= 320) {
      active_panel.classList.add("full-screen"); //раздвигаем панель на всю ширину экрана
      side_bar_Div.classList.add("hidden"); // скрываем side-bar
      active_panel.style.width = pageWidth + "px"; //при маленьком разрешении панель расширяется до границ экрана, а не до 740px
    }
    else {
      active_panel.style.width = max_panel_width + "px";
      active_panel.classList.remove("w320");
      new_width_label = width_label(active_panel);
      if (active_panel.offsetWidth >= 320) {
        console.log("new_width_label = ", new_width_label);
        active_panel.classList.add(new_width_label);
      }
      console.log("new_max = ", get_max_panel_width(pageWidth));
      active_panel.style.width = get_max_panel_width(pageWidth) + "px";
    }
    console.log("панел_лист експанд: ", active_panel);
    active_panel.querySelector(".tab-content").style.width = active_panel.querySelector(".outer-tab-content-container").offsetWidth + "px";
    left_panel_slider.classList.add("mx");
  }
  else if (left_panel_slider.classList.contains("mx")) {
    console.log("slider", left_panel_slider);
    console.log("условие mx сработало");
    left_panel_slider.classList.remove("mx");
    min_width_panel = 258;
    if (pageWidth < 320) {
      active_panel.classList.remove("full-screen"); //смещаем панель вправо на ширину side-bar

      side_bar_Div.classList.remove("hidden"); // возвращаем side-bar
      old_width_label = width_label(active_panel);
      console.log("old 0:", old_width_label);
      active_panel.classList.remove(old_width_label);
      console.log("сработал 0 вариант");
    }
    else if (pageWidth >= 320 && pageWidth <= 381) {
      active_panel.classList.remove("full-screen"); //смещаем панель вправо на ширину side-bar
      side_bar_Div.classList.remove("hidden"); // возвращаем side-bar
      old_width_label = width_label(active_panel);
      console.log("old:", old_width_label);
      active_panel.classList.remove(old_width_label);

      console.log("сработал 1 вариант");
    }
    else {
      // возвращаем side-bar
      old_width_label = width_label(active_panel);
      console.log("old 2:", old_width_label);
      active_panel.classList.remove(old_width_label);
      active_panel.classList.add("w320");
      min_width_panel = 320;
      console.log("сработал 2 вариант");
    }
    side_bar_Div.classList.remove("hidden");
    console.log('side-bar', side_bar_Div);

    active_panel.style.width = min_width_panel + "px"; //при маленьком разрешении ширина панели сужается до минимума - 258px
    new_width_label = width_label(active_panel);
    active_panel.classList.add(new_width_label);
    console.log("новый лэйбл:", new_width_label);
    active_panel.querySelector(".tab-content").style.width = active_panel.querySelector(".outer-tab-content-container").offsetWidth + "px";
    left_panel_slider.classList.add("mn");
  }
  else {
    console.log("сработал 3 вариант");
  }

  document.querySelector('.panel__debug-info').innerHTML = "<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + active_panel.offsetWidth + "px</span>";
  //resize_tab_content('left-panel');
}

function left_panel_expand_new(param) {
  console.log("__left_panel_expand");
  //var pageWidth = document.documentElement.clientWidth;
  //var pageHeight = document.documentElement.clientHeight;
  //var active_panel_list = document.getElementsByClassName('left-panel active'); // получаем список всех активных секций
  if (param == "separate") { // определяем на какой панели нажата кнопка (separate - отдельная панель для публикаций)
    var active_panel = document.querySelector('.separate.left-panel.active');
  }
  else {
    var active_panel = left_panel.querySelector('.panel_active');
  }
  console.log("act_panel obj:", active_panel);
  // var side_bar_Div = document.getElementById('side-bar');
  var left_panel_slider = active_panel.querySelector("[class*=button_change-width]"); //находим кнопку слайдера на левой панели
  /* 	max_panel_width = 420;
  if (pageWidth > 768 && pageWidth <= 960){
  	max_panel_width = 420;
  }
  else if (pageWidth > 960 && pageWidth <= 1200){
  	max_panel_width = 480;
  } */
  max_panel_width = get_max_panel_width(pageWidth);
  console.log("функция выдала new_max = ", max_panel_width);

  if (left_panel_slider.classList.contains("button_change-width_min")) { // определяем состояние панели по классам min и max
    console.log("slider", left_panel_slider);
    left_panel_slider.classList.remove("button_change-width_min");
    console.log("расширение, удаляем метку min");
    if (pageWidth <= 320) {
      //active_panel.classList.add("full-screen"); //раздвигаем панель на всю ширину экрана
      //side_bar_Div.classList.add("hidden"); // скрываем side-bar
      active_panel.style.width = pageWidth + "px"; //при маленьком разрешении панель расширяется до границ экрана, а не до 740px
    }
    else {
      active_panel.style.width = max_panel_width + "px";
      active_panel.classList.remove("panel_width_320");
      new_width_label = width_label2(active_panel);
      if (active_panel.offsetWidth >= 320) {
        console.log("new_width_label = ", new_width_label);
        active_panel.classList.add(new_width_label);
      }
      console.log("new_max = ", get_max_panel_width(pageWidth));
      active_panel.style.width = get_max_panel_width(pageWidth) + "px";
    }
    console.log("панел_лист експанд: ", active_panel);
    //active_panel.querySelector(".tab-content").style.width = active_panel.querySelector(".outer-tab-content-container").offsetWidth + "px";
    left_panel_slider.classList.add("button_change-width_max");
  }
  else if (left_panel_slider.classList.contains("button_change-width_max")) {
    console.log("slider", left_panel_slider);
    console.log("условие max сработало");
    left_panel_slider.classList.remove("button_change-width_max");
    min_width_panel = 260;
    if (pageWidth < 320) {
      //      active_panel.classList.remove("full-screen"); //смещаем панель вправо на ширину side-bar
      //side_bar_Div.classList.remove("hidden"); // возвращаем side-bar
      old_width_label = width_label2(active_panel);
      console.log("old 0:", old_width_label);
      active_panel.classList.remove(old_width_label);
      console.log("сработал 0 вариант");
    }
    else if (pageWidth >= 320 && pageWidth <= 381) {
      //      active_panel.classList.remove("full-screen"); //смещаем панель вправо на ширину side-bar
      //     side_bar_Div.classList.remove("hidden"); // возвращаем side-bar
      old_width_label = width_label2(active_panel);
      console.log("old:", old_width_label);
      active_panel.classList.remove(old_width_label);

      console.log("сработал 1 вариант");
    }
    else {
      // возвращаем side-bar
      old_width_label = width_label2(active_panel);
      console.log("old 2:", old_width_label);
      active_panel.classList.remove(old_width_label);
      active_panel.classList.add("panel_width_320");
      min_width_panel = 320;
      console.log("сработал 2 вариант");
    }



    active_panel.style.width = min_width_panel + "px"; //при маленьком разрешении ширина панели сужается до минимума - 260px
    new_width_label = width_label2(active_panel);
    active_panel.classList.add(new_width_label);
    console.log("новый лэйбл:", new_width_label);
    //active_panel.querySelector(".tab-content").style.width = active_panel.querySelector(".outer-tab-content-container").offsetWidth + "px";
    left_panel_slider.classList.add("button_change-width_min");
  }
  else {
    console.log("сработал 3 вариант");
  }

  active_panel.querySelector('.content').innerHTML = "<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + active_panel.offsetWidth + "px</span>";
  //resize_tab_content('left-panel');
}

function right_panel_expand_new(param) {
  console.log("__right_panel_expand");
  //var pageWidth = document.documentElement.clientWidth;
  //var pageHeight = document.documentElement.clientHeight;
  //var active_panel_list = document.getElementsByClassName('left-panel active'); // получаем список всех активных секций
  if (param == "separate") { // определяем на какой панели нажата кнопка (separate - отдельная панель для публикаций)
    var active_panel = document.querySelector('.separate.right-panel.active');
  }
  else {
    var active_panel = right_panel.querySelector('.panel_active');
  }
  console.log("act_panel obj:", active_panel);
  var side_bar_Div = document.getElementById('side-bar');
  var right_panel_slider = active_panel.querySelector("[class*=button_change-width]"); //находим кнопку слайдера на левой панели
  /* 	max_panel_width = 420;
  if (pageWidth > 768 && pageWidth <= 960){
  	max_panel_width = 420;
  }
  else if (pageWidth > 960 && pageWidth <= 1200){
  	max_panel_width = 480;
  } */
  max_panel_width = get_max_panel_width(pageWidth);
  console.log("функция выдала new_max = ", max_panel_width);

  if (right_panel_slider.classList.contains("button_change-width_min")) { // определяем состояние панели по классам min и max
    console.log("slider", right_panel_slider);
    right_panel_slider.classList.remove("button_change-width_min");
    console.log("расширение, удаляем метку min");
    if (pageWidth <= 320) {
      //active_panel.classList.add("full-screen"); //раздвигаем панель на всю ширину экрана
      //side_bar_Div.classList.add("hidden"); // скрываем side-bar
      active_panel.style.width = pageWidth + "px"; //при маленьком разрешении панель расширяется до границ экрана, а не до 740px
    }
    else {
      active_panel.style.width = max_panel_width + "px";
      active_panel.classList.remove("panel_width_320");
      new_width_label = width_label2(active_panel);
      if (active_panel.offsetWidth >= 320) {
        console.log("new_width_label = ", new_width_label);
        active_panel.classList.add(new_width_label);
      }
      console.log("new_max = ", get_max_panel_width(pageWidth));
      active_panel.style.width = get_max_panel_width(pageWidth) + "px";
    }
    console.log("панел_лист експанд: ", active_panel);
    //active_panel.querySelector(".tab-content").style.width = active_panel.querySelector(".outer-tab-content-container").offsetWidth + "px";
    right_panel_slider.classList.add("button_change-width_max");
  }
  else if (right_panel_slider.classList.contains("button_change-width_max")) {
    console.log("slider", right_panel_slider);
    console.log("условие mx сработало");
    right_panel_slider.classList.remove("button_change-width_max");
    min_width_panel = 258;
    if (pageWidth < 320) {
      // active_panel.classList.remove("full-screen"); //смещаем панель вправо на ширину side-bar

      // side_bar_Div.classList.remove("hidden"); // возвращаем side-bar
      old_width_label = width_label2(active_panel);
      console.log("old 0:", old_width_label);
      active_panel.classList.remove(old_width_label);
      console.log("сработал 0 вариант");
    }
    else if (pageWidth >= 320 && pageWidth <= 381) {
      //active_panel.classList.remove("full-screen"); //смещаем панель вправо на ширину side-bar
      //side_bar_Div.classList.remove("hidden"); // возвращаем side-bar
      old_width_label = width_label2(active_panel);
      console.log("old:", old_width_label);
      active_panel.classList.remove(old_width_label);

      console.log("сработал 1 вариант");
    }
    else {
      // возвращаем side-bar
      old_width_label = width_label2(active_panel);
      console.log("old 2:", old_width_label);
      active_panel.classList.remove(old_width_label);
      active_panel.classList.add("panel_width_320");
      min_width_panel = 320;
      console.log("сработал 2 вариант");
    }
    //side_bar_Div.classList.remove("hidden");
    console.log('side-bar', side_bar_Div);

    active_panel.style.width = min_width_panel + "px"; //при маленьком разрешении ширина панели сужается до минимума - 258px
    new_width_label = width_label(active_panel);
    active_panel.classList.add(new_width_label);
    console.log("новый лэйбл:", new_width_label);
    //active_panel.querySelector(".tab-content").style.width = active_panel.querySelector(".outer-tab-content-container").offsetWidth + "px";
    right_panel_slider.classList.add("button_change-width_min");
  }
  else {
    console.log("сработал 3 вариант");
  }

  active_panel.querySelector('.content').innerHTML = "<span>page_width: " + pageWidth + "px, " + "<br>page_height: " + pageHeight + "px <br><br> panel_width: " + active_panel.offsetWidth + "px</span>";
  //resize_tab_content('left-panel');
}




function full_screen_expand(panel, mode) {
  console.log("__full_screen_expand>", panel);
  //Режим 1 - запуск из дополнительной панели (значение по умолчанию)
  //Режим 2 - запуск из основной панели
  if (mode == null) {
    mode = 1;
  }
  else {
    mode = mode;
  }
  console.log("__full_screen_expand>mode:", mode);
  if (mode == 2) {
    show_separate_panel(selected_post_id, panel);
  }
  active_separate_panel = document.querySelector('.separate.' + panel + '-panel.active'); // получаем список всех активных секций
  active_separate_panel.classList.toggle("full-screen");
  if (active_separate_panel.classList.contains("full-screen")) {
    console.log("режим полного экрана включен");
    active_parent_panel = document.querySelector('.' + panel + '-panel.active');
    panel_container = document.querySelector('.' + panel + '-panel-container');
    if (mode == 2) {
      //active_separate_panel.querySelector('.fullscreen-pnl').setAttribute('onclick',"alert('2')");
      active_separate_panel.querySelector('.fullscreen-pnl').setAttribute('onclick', "show_left_panel(3)");
      //onclick = function(){full_screen_expand('left',2)}
      console.log('onclick:', active_separate_panel.querySelector('.fullscreen-pnl').onclick);
      active_separate_panel.querySelector('.close-pnl').style.display = "none"; //скрываем кнопку закрыть
    }
    else {
      active_separate_panel.querySelector('.fullscreen-pnl').setAttribute('onclick', "full_screen_expand('left')");
      console.log('onclick:', active_separate_panel.querySelector('.fullscreen-pnl').onclick);
    }
    active_parent_panel.classList.remove('active'); //скрываем родительскую панель
    panel_container.style.display = "block"; //растягиваем div container на весь экран
    resize_tab_content('separate ' + panel + '-panel');
  }
  else {
    console.log("режим полного экрана выключен");
    panel_container.style.display = "inline-block";
    if (panel == "left") {
      document.querySelector('.my-profile.' + panel + '-panel').classList.add('active'); //показываем родительскую панель
    }
    if (mode != 2) {
      resize_tab_content('separate ' + panel + '-panel');
    }
    if (mode == 2) {
      show_separate_panel(selected_post_id, panel);
    }
  }



  //определяем открыта ли основная левая панель
}


function right_panel_expand() {
  var active_panel_list = document.getElementsByClassName('right-panel active'); // получаем список всех активных секций
  var right_panel_slider = active_panel_list[0].getElementsByClassName("change-width-pnl")[0]; //находим кнопку слайдера на левой панели
  if (right_panel_slider.classList.contains("mn")) { // определяем состояние панели по классам mn и mx
    right_panel_slider.classList.remove("mn");
    active_panel_list[0].style.width = 740 + "px";
    active_panel_list[0].classList.add("w600");
    active_panel_list[0].getElementsByClassName("tab-content")[0].style.width = active_panel_list[0].getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px";
    right_panel_slider.classList.add("mx");
  }
  else if (right_panel_slider.classList.contains("mx")) {
    right_panel_slider.classList.remove("mx");
    active_panel_list[0].style.width = 258 + "px";
    active_panel_list[0].classList.remove("w600");
    active_panel_list[0].getElementsByClassName("tab-content")[0].style.width = active_panel_list[0].getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px";
    right_panel_slider.classList.add("mn");
  }
  resize_tab_content('right-panel');
}


document.addEventListener("DOMContentLoaded", function() {
  init();
}, false);
