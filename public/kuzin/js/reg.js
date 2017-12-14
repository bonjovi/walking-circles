document.addEventListener("DOMContentLoaded", function (){
	
console.log('все элементы загружены');

window.addEventListener("resize", pageResize);

var pageWidth;
var pageHeight;

var debug_info = document.getElementById('panel-debug-info');
	console.log('debug isss:',debug_info);


window.onwheel = function() {
 // console.log("scroll is moving!!!");
}	

function getCoords(elem) { // кроме IE8- // функция получения координат элемента с учетом полосы прокрутки
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };

}

function pageResize() {
	var pageWidth = document.documentElement.clientWidth;
	var pageHeight = document.documentElement.clientHeight;
	var side_bar_Div = document.getElementById('side-bar');
	var debug_info = document.getElementById('panel-debug-info');
	//console.log("новая ширина = ", pageWidth, "px " );
	if (pageWidth >= 480 && side_bar_Div.classList.contains("hidden")) {
		side_bar_Div.classList.remove("hidden"); 
	}
	
	//if (pageHeight <= 441 ) // Если высота меньше 441, то увеличиваем ширину сайд бара в 2 раза
	//	side_bar_Div.classList.add("minimized");
	//}
	//else side_bar_Div.classList.remove("minimized");
	
	
	if (document.getElementsByClassName('left-panel active').length > 0) {
		var left_panel_active = document.getElementsByClassName('left-panel active')[0];
		
		document.getElementById('panel-debug-info').innerHTML = "<span>page_width: "+pageWidth+"px, "+"<br>page_height: "+pageHeight+"px <br><br> panel_width: "+left_panel_active.offsetWidth + "px</span>";
		resize_tab_content('left-panel');
		
	}
	
	if (document.getElementsByClassName('right-panel active').length > 0) {
		resize_tab_content('right-panel');
/* 		var right_panel_active = document.getElementsByClassName('right-panel active')[0];
		if (right_panel_active.getElementsByClassName("tab-content").length > 0){
			right_panel_active.getElementsByClassName("tab-content")[0].style.height = (pageHeight - 164) + "px";  //растягиваем высоту блока до нижнего края экрана и задаем её явно, что сработал вертикальный скролл
			right_panel_active.getElementsByClassName("tab-content")[0].style.width = right_panel_active.getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px"; //делаем одинаковой ширину tab-content и внешнего контейнера, чтобы скрыть правый вертикальный скролл
		} */
	}	
		
	
//	if (pageWidth < 768 && document.getElementsByClassName('left-panel active').length > 0) {  
//		document.getElementsByClassName('left-panel active')[0].classList.remove("expanded"); //если активна левая панель, то убираем расширенную панель
//	}
	
//	if (pageWidth < 480 && document.getElementsByClassName('left-panel active').length > 0) {  //если активна левая панель, то скрываем side-bar
//		side_bar_Div.classList.add("hidden"); 
//	}
	debug_info.innerHTML = "<span>width: "+pageWidth+"px, "+"height: "+pageHeight+"px </span>";	
}

function resize_tab_content(panel){ //заново задаем высоту и штрину активного tab-content чтобы заработал скрытый вертикальный скролл
	var pageWidth = document.documentElement.clientWidth;
	var pageHeight = document.documentElement.clientHeight;
	console.log("мы внутри!!!: ",panel,' active');
	if (document.getElementsByClassName(panel+' active').length > 0) {
		var panel_active = document.getElementsByClassName(panel+' active')[0];
		console.log(panel_active);
		HeaderHeight = 100;
		console.log("высота шапки:",HeaderHeight );
		panel_active.getElementsByClassName("outer-tab-content-container")[0].style.height = (pageHeight - HeaderHeight) + "px";
 		if (panel_active.getElementsByClassName("tab-content").length > 0){
			panel_active.getElementsByClassName("outer-tab-content-container")[0].style.height = (pageHeight - HeaderHeight) + "px";
			for (i = 0; i < panel_active.getElementsByClassName("tab-content").length; i++) {
				if(panel_active.getElementsByClassName("tab-content")[i].classList.contains("active")){
					panel_active.getElementsByClassName("tab-content")[i].style.height = (pageHeight - HeaderHeight) + "px"; //растягиваем высоту блока до нижнего края экрана и задаем её явно, что сработал вертикальный скролл
					panel_active.getElementsByClassName("tab-content")[i].style.width = panel_active.getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px"; //делаем одинаковой ширину tab-content и внешнего контейнера, чтобы скрыть правый вертикальный скролл
					console.log("сработало условие контейн");
				}
			}
		} 
	}
	//document.getElementById('panel-debug-info').innerHTML = "<span>page_width: "+pageWidth+"px, "+"<br>page_height: "+pageHeight+"px <br><br> panel_width: "+panel_active.offsetWidth + "px</span>";
}

function show_left_panel(panel_num) {
 //console.log(panel_num);
 var pageWidth = document.documentElement.clientWidth;
 var pageHeight = document.documentElement.clientHeight;
 var panel_list = document.getElementsByClassName('left-panel'); //получаем список всех элементов
 console.log("что вообще происходит: ",panel_list[panel_num-1]);
 if (panel_list[panel_num-1].classList.contains("active")){ //определяем активна ли уже выбираемая секция
	console.log("панель уже открыта:",panel_list[panel_num-1].className);
	panel_list[panel_num-1].classList.remove("active"); //если да, закрываем ее
	//panel_list[panel_num-1].className = panel_list[panel_num-1].className.replace("left-panel active", "left-panel"); //если да, закрываем ее
	//t = -(panel_list[panel_num-1].offsetWidth + document.getElementById('side-bar').offsetWidth) + "px";
	//console.log("t-",t);
	//panel_list[panel_num-1].style.left = -(panel_list[panel_num-1].offsetWidth + document.getElementById('side-bar').offsetWidth) + "px"; //выставляем для панели отрицательный отступ, чтобы полностью скрыть
 }
 else {
	//console.log("сработал else",panel_list[panel_num-1].className);
	var active_panel_list = document.getElementsByClassName('left-panel active'); // получаем список всех активных секций
	//console.log("active lenght: ",active_panel_list.length);
    if (active_panel_list.length > 0) {
		active_panel_list[0].className = active_panel_list[0].className.replace("left-panel active", "left-panel"); //делаем неактивным предыдущую секцию, если она открыта
	}
	panel_list = document.getElementsByClassName('left-panel');
	console.log("Активированная панель до: ",panel_list[panel_num-1]);
	panel_list[panel_num-1].classList.add("active"); // активируем выбранную секцию
	panel_list = document.getElementsByClassName('left-panel');
	console.log("Активированная панель после: ",panel_list[panel_num-1]);
	panel_list[panel_num-1].style.left = null; //при повторном открытии панели обнуляем ранее назначенную ширину и отступ
	panel_list[panel_num-1].style.width = null;
	if (panel_list[panel_num-1].classList.contains("w600")){
		panel_list[panel_num-1].classList.remove("w600"); // убираем все метки
	}
	if (panel_list[panel_num-1].classList.contains("w460")){
		panel_list[panel_num-1].classList.remove("w460"); // убираем все метки 
	}
	if (panel_list[panel_num-1].classList.contains("w320")){
		panel_list[panel_num-1].classList.remove("w320"); // убираем все метки 
	}
	console.log("Активированная панель: ",panel_list[panel_num-1]);
	if (!panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.contains("mn")){ // повторное открытие после закрытия панели с промежуточной шириной
		panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.add("mn");
	}
	
	if (panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.contains("mx")){ // повторное открытие после закрытия с максимальной шириной
		panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.remove("mx"); 
		panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.add("mn");
	}

	resize_tab_content('left-panel');

	if (panel_list[panel_num-1].offsetWidth >= 320){
		panel_list[panel_num-1].classList.add("w320");
	}
		
	
	document.getElementById('panel-debug-info').innerHTML = "<span>page_width: "+pageWidth+"px, "+"<br>page_height: "+pageHeight+"px <br><br> panel_width: "+panel_list[panel_num-1].offsetWidth + "px</span>";
	
	var left_panel_slider = panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0]; //находим кнопку слайдера на левой панели
	
	left_panel_slider.onmousedown = function(e) {

		var coords = getCoords(left_panel_slider);
		var shiftX = e.pageX - coords.left;
		var shiftY = e.pageY - coords.top;
		var delta = -6;
        console.log("e.pageX: ",e.pageX,"coords.left",coords.left);
		console.log("Состояние панели перед moveAt: ",panel_list[panel_num-1]);
		//moveAt(e);
		console.log("Состояние панели после moveAt: ",panel_list[panel_num-1]);
		function moveAt(e) {
			console.log("Состояние панели на входе в moveAt: ",panel_list[panel_num-1]);
			pnl_width = panel_list[panel_num-1].offsetWidth; // определяем текущую ширину панели
			if (left_panel_slider.classList.contains("mn")){ //обнуляем метки для кнопки
				left_panel_slider.classList.remove("mn");
			}
			if (left_panel_slider.classList.contains("mx")){
				left_panel_slider.classList.remove("mx");
			}
			
			console.log("pnl_width: ",pnl_width);
			if (pnl_width >= 259 && pnl_width <= 740 ){	

				var profile_header_Div = panel_list[panel_num-1].getElementsByClassName("profile-header")[0];
				if (pnl_width >= 259 && pnl_width < 320){
					panel_list[panel_num-1].className = "my-profile left-panel active"; // убираем все метки - кастыль убрать позже
					delta = -6; // ширина кнопки + правый отступ + ширина рамки справа - (ширина side-bar + ширина рамки справа)
				}
				else if (pnl_width >= 320 && pnl_width < 460){
					console.log("панел_лист_0: ",panel_list[panel_num-1]);
					panel_list[panel_num-1].className = "my-profile left-panel active"; // убираем все метки - кастыль убрать позже
					console.log("панел_лист: ",panel_list[panel_num-1]);
					panel_list[panel_num-1].classList.add("w320"); //добавляем класс w320 для (320 > w > 460)
					console.log("панел_лист_2: ",panel_list[panel_num-1]);
					console.log("сработала зараза: ",pnl_width);
					delta = 4;
				}
					
				else if (pnl_width >= 460 && pnl_width < 600){
					panel_list[panel_num-1].className = "my-profile left-panel active"; // убираем все метки - кастыль убрать позже
					panel_list[panel_num-1].classList.add("w460"); //добавляем класс w460 для (460 > w > 600)
					delta = 14;
				}
				else {
					panel_list[panel_num-1].className = "my-profile left-panel active"; // убираем все метки - кастыль убрать позже
					panel_list[panel_num-1].classList.add("w600"); //добавляем класс w600 для ( > 600)
					delta = 14;
				}
				new_pnl_width = e.pageX - shiftX + delta;
				
				//определяем минимальную ширину панели для текущего разрешения
				
				if (pageWidth < 381) {
					min_pnl_width = 259;
				}
				else {
					min_pnl_width = 320;
				}
				
				
				//определяем максимальную ширину панели для текущего разрешения
				max_pnl_width = get_max_panel_width (pageWidth);

				
				
				if (new_pnl_width < min_pnl_width) { //если вдруг проскочили предельные координаты
					new_pnl_width = min_pnl_width;
				}
										
				if (new_pnl_width > max_pnl_width) {
					new_pnl_width = max_pnl_width;
				}
				panel_list[panel_num-1].style.width = new_pnl_width + 'px';
				if (new_pnl_width == min_pnl_width && !left_panel_slider.classList.contains("mn")){
					left_panel_slider.classList.add("mn");
					console.log('new_pnl_width',new_pnl_width,'сработало mn');
				}
				
				if (new_pnl_width == max_pnl_width && !left_panel_slider.classList.contains("mx")){
					left_panel_slider.classList.add("mx");
					console.log('new_pnl_width',new_pnl_width,'сработало mx');
				}
				pageResize();
			}
			console.log("panel width: ",panel_list[panel_num-1].style.width, "pageX: ", e.pageX, "shift: ", shiftX,"min-pnl: ",min_pnl_width,"max-pnl: ",max_pnl_width );
		}

		document.onmousemove = function(e) {
			console.log("датчик движения сработал");
		moveAt(e);
		};
		
		document.onmouseup = function() {
			document.onmousemove = null;
			left_panel_slider.onmouseup = null;
		};
		left_panel_slider.ondragstart = function() {
			return false;
		};

	}
	
	
	//	panel_list[panel_num-1].getElementsByClassName("tab-content")[0].style.height = (pageHeight - 164) + "px";
	//t = panel_list[panel_num-1].getElementsByClassName("tab-content")[0].style.height;
	
	//panel_list[panel_num-1].addEventListener("mouseout", mouseOut);; // вешаем на секцию обработчик ухода мышки с секции

//	if (pageWidth < 480){ //при ширине странице меньше 480px скрываем side-bar
//		document.getElementById("side-bar").classList.add("hidden"); 
		//console.log("side-bar захлопнись");
//	}
/* 	var mc2 = new Hammer(panel_list[panel_num-1]);
    
    mc2.on("swipeleft", function(ev) {  //вешаем hammer на закрытие панели swipe-ом
    		console.log(ev.type, "It is work!!!" );
    		panel_list[panel_num-1].classList.remove("active", "expanded");
			
    		if (pageWidth < 480){
    		    document.getElementById("side-bar").classList.remove("hidden"); 
    		}
			if (panel_list[panel_num-1].getElementsByClassName("tab-content").length > 0){
				panel_list[panel_num-1].getElementsByClassName("tab-content")[0].style.height = (pageHeight - 164) + "px"; //растягиваем высоту блока до нижнего края экрана и задаем её явно, что сработал вертикальный скролл
				panel_list[panel_num-1].getElementsByClassName("tab-content")[0].style.width = panel_list[panel_num-1].getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px"; //делаем одинаковой ширину tab-content и внешнего контейнера, чтобы скрыть правый вертикальный скролл
			}
    });
    if (pageWidth > 768){
        mc2.on("swiperight", function(ev) {  //вешаем hammer на растягивание панели swipe-ом до середины экрана
    		console.log(ev.type, "It is work too!!!" );
    		panel_list[panel_num-1].classList.add("expanded");
			if (panel_list[panel_num-1].getElementsByClassName("tab-content").length > 0){
				panel_list[panel_num-1].getElementsByClassName("tab-content")[0].style.height = (pageHeight - 164) + "px"; //растягиваем высоту блока до нижнего края экрана и задаем её явно, что сработал вертикальный скролл
				panel_list[panel_num-1].getElementsByClassName("tab-content")[0].style.width = panel_list[panel_num-1].getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px"; //делаем одинаковой ширину tab-content и внешнего контейнера, чтобы скрыть правый вертикальный скролл
			}
    });
        
    } */
    
    
 }

 
 
 //console.log("active", active_panel_list.length, "--", panel_list.length);
// console.log("Upd", UpdClassName);
}

function show_right_panel(e) {
	var panel_num = 1;
	if (!e) var e = window.event; // останавливаем "всплытие" чтоб следом не сработал hide_right_panel()
	if (e.stopPropagation) {
		e.stopPropagation();   // W3C model
	} else {
		e.cancelBubble = true; // IE model
	}
 
 var panel_list = document.getElementsByClassName('right-panel'); //получаем список всех элементов
 if ((~panel_list[panel_num-1].className.indexOf("active"))){ //определяем активна ли уже выбираемая секция
	//console.log("сработал if",panel_list[panel_num-1].className);
	panel_list[panel_num-1].className = panel_list[panel_num-1].className.replace("right-panel active", "right-panel"); //если да, закрываем ее
 }
 else {
	 show_popup(); //закрываем поп-ап
	//console.log("сработал else",panel_list[panel_num-1].className);
	var active_panel_list = document.getElementsByClassName('right-panel active'); // получаем список всех активных секций
	//console.log("active lenght: ",active_panel_list.length);
    if (active_panel_list.length > 0) {
		active_panel_list[0].className = active_panel_list[0].className.replace("right-panel active", "right-panel"); //делаем неактивным предыдущую секцию, если она открыта
	}
	panel_list[panel_num-1].className = panel_list[panel_num-1].className.replace("right-panel", "right-panel active"); // активируем выбранную секцию
	panel_list[panel_num-1].style.left = null; //при повторном открытии панели обнуляем ранее назначенную ширину и отступ
	panel_list[panel_num-1].style.width = null;
	if (panel_list[panel_num-1].classList.contains("middle")){
		panel_list[panel_num-1].classList.remove("middle"); // убираем все метки
	}
	if (panel_list[panel_num-1].classList.contains("max")){
		panel_list[panel_num-1].classList.remove("max"); // убираем все метки 
	}
	
	if (!panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.contains("mn")){ // повторное открытие после закрытия с промежуточной шириной
		panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.add("mn");
	}
	if (panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.contains("mx")){ // повторное открытие после закрытия  с максимальной шириной
		panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.remove("mx"); 
		panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.add("mn");
	}
		
	
	if (panel_list[panel_num-1].getElementsByClassName("tab-content").length > 0) {
		panel_list[panel_num-1].getElementsByClassName("outer-tab-content-container")[0].style.height = (pageHeight - 164) + "px";
		panel_list[panel_num-1].getElementsByClassName("tab-content")[0].style.height = (pageHeight - 164) + "px";
		panel_list[panel_num-1].getElementsByClassName("tab-content")[0].style.width = panel_list[panel_num-1].getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px";
		console.log(panel_list[panel_num-1].getElementsByClassName("tab-content")[0].offsetWidth);
	}
	
	var right_panel_slider = panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0]; //находим кнопку слайдера на левой панели
	console.log("right: ",panel_list[panel_num-1].getElementsByClassName("change-width-pnl"));
	right_panel_slider.onmousedown = function(ee) {

		var coords = getCoords(right_panel_slider);
		var shiftX = ee.pageX - coords.left;
		var shiftY = ee.pageY - coords.top;
		console.log("ee.pageX: ",ee.pageX,"coords.left",coords.left);
		moveAt(ee);

		function moveAt(ee) {
			pnl_width = panel_list[panel_num-1].offsetWidth; // определяем текущую ширину панели
			if (right_panel_slider.classList.contains("mn")){ //обнуляем метки для кнопки
				right_panel_slider.classList.remove("mn");
			}
			if (right_panel_slider.classList.contains("mx")){
				right_panel_slider.classList.remove("mx");
			}
			
			
			console.log("pnl_width: ",pnl_width);
			if (pnl_width >= 259 && pnl_width <= 740 ){	
				
				var profile_header_Div = panel_list[panel_num-1].getElementsByClassName("profile-header")[0];
				if (pnl_width >= 320 && pnl_width < 460){
					panel_list[panel_num-1].className = "my-profile right-panel active"; // убираем все метки - кастыль убрать позже
					panel_list[panel_num-1].classList.add("w320"); //добавляем класс w320 для (320 > w > 460)
					
					delta = -20;
				}
				
				if (pnl_width >= 460 && pnl_width < 600){
					panel_list[panel_num-1].className = "my-profile right-panel active"; // убираем все метки - кастыль убрать позже
					panel_list[panel_num-1].classList.add("w460"); //добавляем класс w460 для (460 > w > 600)
					delta = -20;
				}
				else if (pnl_width >= 600){
					panel_list[panel_num-1].className = "my-profile right-panel active"; // убираем все метки - кастыль убрать позже
					panel_list[panel_num-1].classList.add("w600"); //добавляем класс w600 для ( > 600)
					delta = -30;
				}
				else {
					panel_list[panel_num-1].className = "my-profile right-panel active"; // убираем все метки - кастыль убрать позже
					delta= -10; //  -(правый отступ от кнопки change-width-pnl)
				}
				new_pnl_width = document.documentElement.clientWidth - (ee.pageX - shiftX + delta);
				if (new_pnl_width < 259) { //если вдруг проскочили предельные координаты
					new_pnl_width = 259;
				}
				else if (new_pnl_width > 740) {
					new_pnl_width = 740;
				}
				
				
				panel_list[panel_num-1].style.width = new_pnl_width + 'px';
				if (new_pnl_width == 259 && !right_panel_slider.classList.contains("mn")){
					right_panel_slider.classList.add("mn");
					console.log('new_pnl_width',new_pnl_width,'сработало');
				}
				if (new_pnl_width == 740 && !right_panel_slider.classList.contains("mx")){
					right_panel_slider.classList.add("mx");
					console.log('new_pnl_width',new_pnl_width,'сработало');
				}
				
				pageResize();
			}
			console.log("page width", document.documentElement.clientWidth ,"panel width: ",panel_list[panel_num-1].style.width, "pageX: ", e.pageX, "shift: ", shiftX);
		}

		document.onmousemove = function(ee) {
			moveAt(ee);
		};
		
		document.onmouseup = function() {
			document.onmousemove = null;
			right_panel_slider.onmouseup = null;
		};
		right_panel_slider.ondragstart = function() {
			return false;
		};

	}
	
	
	
	
 }
 
 //console.log("active", active_panel_list.length, "--", panel_list.length);
// console.log("Upd", UpdClassName);
}

function show_popup(e) {
	var panel_num = 1;
	if (!e) var e = window.event; // останавливаем "всплытие" чтоб следом не сработал hide_right_panel()
	if (e.stopPropagation) {
		e.stopPropagation();   // W3C model
	} else {
		e.cancelBubble = true; // IE model
	}
	//if (document.getElementsByClassName('popup').length > 0) {
		console.log("кнопка сработала", document.getElementsByClassName('popup')[0]);
		document.getElementsByClassName('popup')[0].classList.toggle('active'); //делаем поп-ап видимым, если он не активен, и скрываем если он уже активен
	//}
}


function hide_right_panel() {
console.log("hide сработал");
	if (document.getElementsByClassName('popup')[0].classList.contains("active")) {
		document.getElementsByClassName('popup')[0].classList.remove("active"); //делаем неактивным предыдущую секцию, если она открыта
	}
}

ContentScrolled = false;

function show_tab(tab_id, panel) {
    // Declare all variables
    var i, tab_content_list, tab_links, active_panel;
	active_panel = document.getElementsByClassName(panel+" active");
	console.log('active_panel: ', active_panel);
    // Get all elements with class="tab-content" and hide them
    tab_content_list = active_panel[0].getElementsByClassName("tab-content");
    for (i = 0; i < tab_content_list.length; i++) {
		tab_content_list[i].classList.remove("active");
        tab_content_list[i].style.display = "none";
    }

    // Get all elements with class="tab-links" and remove the class "active"
    tab_links = active_panel[0].getElementsByClassName("tab-link");
	
    for (i = 0; i < tab_links.length; i++) {
		console.log(i);
        tab_links[i].className = tab_links[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
	tab_content_list[tab_id-1].style.display = "block";
	tab_content_list[tab_id-1].classList.add("active");
	tab_content_list[tab_id-1].classList.add("active");
    //document.getElementById(tab_id).style.display = "block";
    //console.log("target:",evt.currentTarget);
    //evt.currentTarget.className += " active";
	resize_tab_content(panel);
	
	addOnWheel(tab_content_list[tab_id-1], function(e) {
		contentCoords = getCoords (tab_content_list[tab_id-1]);
		contentScrollTop =  tab_content_list[tab_id-1].scrollTop;
		console.log("скролл контента:",contentCoords.top);//отслеживаем скролл на контенте
		if (contentCoords.top < 0){
			active_panel[0].getElementsByClassName("profile-buttons")[0].classList.remove("active");
			ContentScrolled = true;
			resize_tab_content(panel);
		}
		else if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active") && !active_panel[0].getElementsByClassName("profile-extra-buttons")[0].classList.contains("active")){
			active_panel[0].getElementsByClassName("profile-buttons")[0].classList.add("active");
			ContentScrolled = false;
			resize_tab_content(panel);
		};
	}, false);
	
}

var extra_buttons_timer1;
var extra_buttons_timer2;
var extra_buttons_clicked_flag = false;

function init_extra_buttons(panel){
	clearTimeout(extra_buttons_timer1);
	clearTimeout(extra_buttons_timer2);
	//extra_buttons_clicked_flag = true;
	show_extra_buttons(panel);
	console.log("первый запуск");
	
}

function show_extra_buttons(panel){
	active_panel = document.getElementsByClassName(panel+" active"); // находим активную панель
	//if (extra_buttons_clicked_flag){
	if (!active_panel[0].getElementsByClassName("extra-buttons-pnl")[0].classList.contains("active")){	
		active_panel[0].getElementsByClassName("extra-buttons-pnl")[0].classList.add("active"); //кнопка активна при показе экстра кнопок
		if (active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")){
			active_panel[0].getElementsByClassName("profile-buttons")[0].classList.remove("active"); //выключаем основную панель
		}
		if (!active_panel[0].getElementsByClassName("profile-extra-buttons")[0].classList.contains("active")){
			active_panel[0].getElementsByClassName("profile-extra-buttons")[0].classList.add("active"); //включаем панель основную панель с доп. кнопками
		}
		
		active_panel[0].getElementsByClassName("profile-extra-buttons")[0].onmouseleave = function() {
			extra_buttons_timer1 = setTimeout(function() {hide_extra_buttons(panel);},1000); //функцию show_extra_buttons нужно вызывать через безымянную функцию
		//	extra_buttons_clicked_flag = false;
			console.log("таймер 1 запущен",extra_buttons_clicked_flag);
		}
	 	active_panel[0].getElementsByClassName("extra-buttons-pnl")[0].onmouseleave = function() {
			extra_buttons_timer2 = setTimeout(function() {hide_extra_buttons(panel);},1000); //функцию show_extra_buttons нужно вызывать через безымянную функцию
		//	extra_buttons_clicked_flag = false;
			console.log("таймер 2 запущен",extra_buttons_clicked_flag);
		} 
		active_panel[0].getElementsByClassName("profile-extra-buttons")[0].onmouseenter = function() { //сбрасываем таймер если мышка успела вернуться в область с экстра-кнопками 
			clearTimeout(extra_buttons_timer1);
			clearTimeout(extra_buttons_timer2);
			console.log("таймеры сброшены",extra_buttons_clicked_flag);
		}
		active_panel[0].getElementsByClassName("extra-buttons-pnl")[0].onmouseenter = function() { //сбрасываем таймер если мышка успела вернуться в область с экстра-кнопками 
			clearTimeout(extra_buttons_timer1);
			clearTimeout(extra_buttons_timer2);
			console.log("таймеры сброшены через кнопку",extra_buttons_clicked_flag);
		}
	 
	}
	else {
		hide_extra_buttons(panel); //если кнопка доп. кнопок уже активна, то закрываем доп. панель
	}
 
}
function hide_extra_buttons(panel){
	clearTimeout(extra_buttons_timer1);
	clearTimeout(extra_buttons_timer2);
	active_panel = document.getElementsByClassName(panel+" active"); // находим активную панель
	if (active_panel[0].getElementsByClassName("extra-buttons-pnl")[0].classList.contains("active")){
		active_panel[0].getElementsByClassName("extra-buttons-pnl")[0].classList.remove("active"); //выключаем кнопку
	}
	if (active_panel[0].getElementsByClassName("profile-extra-buttons")[0].classList.contains("active")){
		active_panel[0].getElementsByClassName("profile-extra-buttons")[0].classList.remove("active"); //делаем неактивной доп. панель
	}
	if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active") && !ContentScrolled){
		active_panel[0].getElementsByClassName("profile-buttons")[0].classList.add("active"); //если основные кнопки выключены и контент не заскролен то показываем основные кнопки
	}
}



function show_side_bar(){
	document.getElementById("side-bar").classList.remove("hidden"); 
}

function addOnWheel(elem, handler) { // отслеживаем скрол мыши
if (elem.addEventListener) {
	if ('onwheel' in document) {
		// IE9+, FF17+
		elem.addEventListener("wheel", handler);
	} else if ('onmousewheel' in document) {
		// устаревший вариант события
		elem.addEventListener("mousewheel", handler);
	} else {
		// 3.5 <= Firefox < 17, более старое событие DOMMouseScroll пропустим
		elem.addEventListener("MozMousePixelScroll", handler);
	}
	} 
	else { // IE8-
	text.attachEvent("onmousewheel", handler);
	}
}




function init(){
	resize_tab_content('left-panel');
	console.log("Page is loaded");
	var side_bar_Div = document.getElementById('side-bar');
	var debug_info = document.getElementById('panel-debug-info');
	console.log('debug is:',debug_info);
	pageWidth = document.documentElement.clientWidth;
	pageHeight = document.documentElement.clientHeight;
	resize_tab_content('left-panel');
	debug_info.innerHTML = "<span>width: "+pageWidth+"px, "+"height: "+pageHeight+"px";
}

function width_label(panel){ // определяем какую метку ставить панели в зависимости от её ширины
	if (panel.offsetWidth < 320){
		return "";
	}
	else if (panel.offsetWidth >= 320 && panel.offsetWidth < 459){
		return "w320";
	}
	else if (panel.offsetWidth >= 460 && panel.offsetWidth < 599){
		return "w460";
	}
	else {
		return "w600";
	}
}

function get_max_panel_width(width){
	if (width <= 320) {
		return 320;
	}
	else if (width > 320 && width <= 381 ) {
		return (width-document.getElementById("side-bar").offsetWidth);
	}
	else if (width >= 382 && width < 420 ) {
		return 320;
	}
	else if (width >= 421 && width < 768 ) {
		return 339;
	}
	else if (width >= 768 && width < 960 ) {
		return 420;
	}
	else if (width >= 960 && width < 1200 ) {
		return 480;
	}
	else if (width >= 1200 && width <= 1920 ) {
		return 600;
	}
	else {
		return 740;
	}
}
	

function left_panel_expand(){
	var pageWidth = document.documentElement.clientWidth;
	var pageHeight = document.documentElement.clientHeight;
	var active_panel_list = document.getElementsByClassName('left-panel active'); // получаем список всех активных секций
	var side_bar_Div = document.getElementById('side-bar');
	var left_panel_slider = active_panel_list[0].getElementsByClassName("change-width-pnl")[0]; //находим кнопку слайдера на левой панели
	/* 	max_panel_width = 420;
	if (pageWidth > 768 && pageWidth <= 960){
		max_panel_width = 420;
	}
	else if (pageWidth > 960 && pageWidth <= 1200){
		max_panel_width = 480;
	} */
	max_panel_width = get_max_panel_width(pageWidth);
	console.log("функция выдала new_max = ", max_panel_width);
	
	if (left_panel_slider.classList.contains("mn")){ // определяем состояние панели по классам mn и mx
		left_panel_slider.classList.remove("mn");
		console.log("условие mn сработало");
		if ( pageWidth <= 320){
			active_panel_list[0].classList.add("full-screen"); //раздвигаем панель на всю ширину экрана
			side_bar_Div.classList.add("hidden"); // скрываем side-bar
			active_panel_list[0].style.width = pageWidth + "px"; //при маленьком разрешении панель расширяется до границ экрана, а не до 740px
		}
		else {
			active_panel_list[0].style.width = max_panel_width + "px";
			active_panel_list[0].classList.remove("w320");
			new_width_label=width_label(active_panel_list[0]);
			if (active_panel_list[0].offsetWidth >= 320){
				console.log("new_width_label = ", new_width_label);
				active_panel_list[0].classList.add(new_width_label);
			}
			console.log("new_max = ", get_max_panel_width(pageWidth));
			active_panel_list[0].style.width = get_max_panel_width(pageWidth) + "px";
		}
		console.log("панел_лист експанд: ",active_panel_list[0]);
		active_panel_list[0].getElementsByClassName("tab-content")[0].style.width = active_panel_list[0].getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px";
		left_panel_slider.classList.add("mx");	
	}
	else if (left_panel_slider.classList.contains("mx")){
				console.log("условие mx сработало");
				left_panel_slider.classList.remove("mx");
				min_width_panel = 259;
				if (pageWidth >= 320 && pageWidth <= 381){
					active_panel_list[0].classList.remove("full-screen"); //смещаем панель вправо на ширину side-bar
					side_bar_Div.classList.remove("hidden"); // возвращаем side-bar
					old_width_label = width_label(active_panel_list[0]);
					active_panel_list[0].classList.remove(old_width_label);

					console.log("сработал 1 вариант");
				}
				else {
					 // возвращаем side-bar
					old_width_label = width_label(active_panel_list[0]);
					active_panel_list[0].classList.remove(old_width_label);
					active_panel_list[0].classList.add("w320");
					min_width_panel = 320;
					console.log("сработал 2 вариант");
				}
				side_bar_Div.classList.remove("hidden");
				console.log('side-bar',side_bar_Div);
				
				active_panel_list[0].style.width = min_width_panel + "px"; //при маленьком разрешении ширина панели сужается до минимума - 259px
				new_width_label=width_label(active_panel_list[0]);
				active_panel_list[0].classList.add(new_width_label);
				console.log("новый лэйбл:",new_width_label);
				active_panel_list[0].getElementsByClassName("tab-content")[0].style.width = active_panel_list[0].getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px";
				left_panel_slider.classList.add("mn");	
	}
	else {
		console.log("сработал 3 вариант");
	}
	
	document.getElementById('panel-debug-info').innerHTML = "<span>page_width: "+pageWidth+"px, "+"<br>page_height: "+pageHeight+"px <br><br> panel_width: "+active_panel_list[0].offsetWidth + "px</span>";
	resize_tab_content('left-panel');
}

function right_panel_expand (){
	var active_panel_list = document.getElementsByClassName('right-panel active'); // получаем список всех активных секций
	var right_panel_slider = active_panel_list[0].getElementsByClassName("change-width-pnl")[0]; //находим кнопку слайдера на левой панели
	if (right_panel_slider.classList.contains("mn")){ // определяем состояние панели по классам mn и mx
				right_panel_slider.classList.remove("mn");
				active_panel_list[0].style.width = 740 + "px";
				active_panel_list[0].classList.add("w600");
				active_panel_list[0].getElementsByClassName("tab-content")[0].style.width = active_panel_list[0].getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px";
				right_panel_slider.classList.add("mx");	
	}
	else if (right_panel_slider.classList.contains("mx")){
				right_panel_slider.classList.remove("mx");
				active_panel_list[0].style.width = 259 + "px";
				active_panel_list[0].classList.remove("w600");
				active_panel_list[0].getElementsByClassName("tab-content")[0].style.width = active_panel_list[0].getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px";
				right_panel_slider.classList.add("mn");	
	}
	resize_tab_content('right-panel');
}
init();


}, false);