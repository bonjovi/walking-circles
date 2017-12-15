window.addEventListener("resize", pageResize);

full_post_flag = false;
left_panel_opened_once_flag = false;
last_active_tab_id = 1;
selected_post_id = 0; //id выбранного поста
prev_ScrollY_Pos = 0; //положение верт. скролла панели



window.onwheel = function() {
 // console.log("scroll is moving!!!");
}	

function getCoords(elem) { // кроме IE8- // функция получения координат элемента с учетом полосы прокрутки
	console.log("__getCoords");
	var box = elem.getBoundingClientRect();
	return {
		top: box.top + pageYOffset,
		left: box.left + pageXOffset
	};
}

function getCurrentWidthClassName(elem){
	if (elem.classList.contains("w258")){
		return "w258";
	}
	else if (elem.classList.contains("w320")){
		return "w320";
	}
	else if (elem.classList.contains("w460")){
		return "w460";
	}
	else if (elem.classList.contains("w600")){
		return "w600";
	}
	else return "w"; //чтобы не возвращать пустое значение
}

function formatStr(str) { //преобразуем число вида 2000000 в строку вида 2 000 000
		str = String(str);
		str = str.replace(/(\.(.*))/g, '');
		var arr = str.split('');
		var str_temp = '';
		if (str.length > 3) {
			for (var i = arr.length - 1, j = 1; i >= 0; i--, j++) {
				str_temp = arr[i] + str_temp;
				if (j % 3 == 0) {
					str_temp = ' ' + str_temp;
				}
			}
			return str_temp;
		} else {
			return str;
		}
}


function pageResize() {
	console.log("__pageResize");
	var pageWidth = document.documentElement.clientWidth;
	var pageHeight = document.documentElement.clientHeight;
	var side_bar_Div = document.getElementById('side-bar');
	var debug_info = document.getElementById('debug-info');
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
		tab_content_name = left_panel_active.getElementsByClassName('tab-content')[2]; 
		full_screen_btn = left_panel_active.getElementsByClassName("m_btn")[0];
		var left_panel_slider = left_panel_active.getElementsByClassName("change-width-pnl")[0];
		left_panel_active.getElementsByClassName("change-width-pnl")[0]
		document.getElementById('panel-debug-info').innerHTML = "<span>page_width: "+pageWidth+"px, "+"<br>page_height: "+pageHeight+"px <br><br> panel_width: "+left_panel_active.offsetWidth + "px</span>";
		current_width_label = getCurrentWidthClassName(left_panel_active);
		console.log("current_width_label",current_width_label);
		new_width_label=width_label(left_panel_active);
		console.log("new_width_label",new_width_label);
		if (current_width_label != new_width_label){ //если текущая метка неправильная, заменяем её
			left_panel_active.classList.remove(current_width_label);
			left_panel_active.classList.add(new_width_label);
		}
		
		
		
		//left_panel_active.className = "my-profile left-panel active"; // убираем все метки - костыль убрать позже
		//console.log("__костыль сработал");
		//new_width_label=width_label(left_panel_active);
		//left_panel_active.classList.add(new_width_label);

		
		if (pageWidth >= 321 && pageWidth < 382 ){
			console.log("сработало ура!!!");
			if ((left_panel_active.offsetWidth + side_bar_Div.offsetWidth) > pageWidth && !left_panel_slider.classList.contains("mx")){
				console.log("сработало новое условие");
				left_panel_slider.classList.add("mx");
			}
			if (left_panel_slider.classList.contains("mx")){
				console.log("сработало mmmx!!!",get_max_panel_width(pageWidth));
			left_panel_active.style.width = get_max_panel_width(pageWidth) + 'px';
			}
		}
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
	//console.log("__resize_tab_content>panel:",panel);
	var pageWidth = document.documentElement.clientWidth;
	var pageHeight = document.documentElement.clientHeight;
	var panel_active = document.getElementsByClassName(panel+' active')[0];
	console.log("__resize_tab_content>panel_active:",panel_active);
	if (document.getElementsByClassName(panel+' active').length > 0) {
		//console.log(panel_active);
		HeaderHeight = 64; //значение по умолчанию
		if (panel_active.getElementsByClassName("profile-buttons").length > 0){
			if (panel_active.getElementsByClassName("profile-buttons")[0].classList.contains("active")){
				HeaderHeight = 148;
				HeaderShift=0;
				console.log("панель profile-buttons активна, высота шапки: ",HeaderHeight,"px, смещение: ",HeaderShift,"px" );
			}
			else {
				HeaderHeight = 64;
				HeaderShift=-83;
				console.log("панель profile-buttons скрыта, высота шапки: ",HeaderHeight,"px, смещение: ",HeaderShift,"px" );
			}			
		}
		else HeaderShift=0;
		
		//console.log("высота шапки:",HeaderHeight );
		//console.log("смещение:",HeaderShift );
		if (panel_active.getElementsByClassName("tab-content").length > 0){
			panel_active.getElementsByClassName("outer-tab-content-container")[0].style.height = (pageHeight - HeaderHeight) + "px";
			for (i = 0; i < panel_active.getElementsByClassName("tab-content").length; i++) {
				if(panel_active.getElementsByClassName("tab-content")[i].classList.contains("active")){
					panel_active.getElementsByClassName("tab-content")[i].style.height = (pageHeight - HeaderHeight) + "px"; //растягиваем высоту блока до нижнего края экрана и задаем её явно, что сработал вертикальный скролл
					panel_active.getElementsByClassName("tab-content")[i].style.width = panel_active.getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px"; //делаем одинаковой ширину tab-content и внешнего контейнера, чтобы скрыть правый вертикальный скролл
					panel_active.getElementsByClassName("outer-tab-content-container")[0].style.top = HeaderShift + "px";
					console.log("обновили размеры активной панели");
				}
			}
		}
	}
	document.getElementById('panel-debug-info').innerHTML = "<span>page_width: "+pageWidth+"px, "+"<br>page_height: "+pageHeight+"px <br><br> panel_width: "+panel_active.offsetWidth + "px</span>";
}

function show_left_panel(panel_num) {
 console.log('__show_left_panel>');  
 //console.log(panel_num);
 var pageWidth = document.documentElement.clientWidth;
 var pageHeight = document.documentElement.clientHeight;
 var panel_list = document.getElementsByClassName('left-panel'); //получаем список всех элементов
 console.log("что вообще происходит: ",panel_list[panel_num-1]);
 console.log("что вообще происходит: ",panel_list[panel_num]);
	
 
 if (panel_list[panel_num-1].classList.contains("active")){ //определяем активна ли уже выбираемая секция
	console.log("панель уже открыта:",panel_list[panel_num-1].className);
	// if (panel_list[panel_num-1].classList.contains("full-screen")){
	//	 console.log("режим full-screen был включен");
	//	 panel_list[panel_num-1].classList.remove("full-screen"); 
	// }
	 if (panel_list[panel_num-1].classList.contains("separate")){ //если нам попалась отдельная панель
	     console.log("отдельная панель будет закрыта");
		  console.log("ID выбранного поста:",selected_post_id);
		 if (panel_list[panel_num-1].classList.contains("full-screen")){ //если включен полноэкранный режим, выключаем его
			 full_screen_expand('left');
		 }
	     active_preview_panel = document.querySelector('.left-panel.active');
		active_preview_post = active_preview_panel.querySelector('#post_'+selected_post_id);
	     console.log('объект:',panel_list[panel_num-1].querySelector('.post-wrapper'));
	     if (active_preview_post.querySelector('.post-header-link').classList.contains('hide')){ //возвращаем стандартный стиль ссылке
	        active_preview_post.querySelector('.post-header-link').classList.remove("hide");
	     }
	     if (active_preview_post.querySelector('.separate-pnl-btn').classList.contains('chk')){ //меняем значек обратно
	        active_preview_post.querySelector('.separate-pnl-btn').classList.remove("chk");
	     }
		 full_post_selector = '#full_sep_post_'+selected_post_id;
		 panel_list[panel_num-1].querySelector(full_post_selector).style.display = "none";
	 }
	 if (panel_list[panel_num].classList.contains("separate") && panel_list[panel_num].classList.contains("active")){ 
	     console.log("отдельная панель и здесь будет закрыта");
		 if (panel_list[panel_num].classList.contains("full-screen")){ //если включен полноэкранный режим, выключаем его
			 full_screen_expand('left');
		 }
	     if (panel_list[panel_num-1].querySelector('.post-header-link').classList.contains('hide')){ //возвращаем стандартный стиль ссылке
	        panel_list[panel_num-1].querySelector('.post-header-link').classList.remove("hide");
	     }
	     if (panel_list[panel_num-1].querySelector('.separate-pnl-btn').classList.contains('chk')){ //меняем значек обратно
	        panel_list[panel_num-1].querySelector('.separate-pnl-btn').classList.remove("chk");
	     }
	     panel_list[panel_num].classList.remove("active");
	 }
	 	prev_ScrollY_Pos = panel_list[panel_num-1].querySelector('.inner-tab-content-container').scrollTop; //сохраняем предыдущее положение верт. скролла панели
	console.log("prev_ScrollY_Pos:",prev_ScrollY_Pos);
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
	left_panel_opened_once_flag = true; //меняем флаг при первом открытии
	//panel_list = document.getElementsByClassName('left-panel');
	console.log("Активированная панель после: ",panel_list[panel_num-1]);
	panel_list[panel_num-1].style.left = null; //при повторном открытии панели обнуляем ранее назначенную ширину и отступ
	//panel_list[panel_num-1].style.width = null; // оставляем ширину панели при закрытии
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
	//if (!panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.contains("mn")){ // повторное открытие после закрытия панели с промежуточной шириной
	//	panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.add("mn");
	//}
	
	//if (panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.contains("mx")){ // повторное открытие после закрытия с максимальной шириной
	//	panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.remove("mx"); 
	//	panel_list[panel_num-1].getElementsByClassName("change-width-pnl")[0].classList.add("mn");
	//}

	resize_tab_content('left-panel');

	if (panel_list[panel_num-1].offsetWidth >= 320){
		panel_list[panel_num-1].classList.add("w320");
	}
	else {
		panel_list[panel_num-1].classList.add("w258");
	}
		
	show_tab(last_active_tab_id,'left-panel'); //показываем таб на котором была закрыта панель
	if (left_panel_opened_once_flag){
		console.log("флаг открытия левой панели: ",left_panel_opened_once_flag);
	panel_list[panel_num-1].querySelector('.inner-tab-content-container').scrollTop = prev_ScrollY_Pos; //сдвигаем скролл на сохраненное значение
	console.log("скролл левой панели: ",panel_list[panel_num-1].querySelector('.inner-tab-content-container').scrollTop);
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
		//console.log("Состояние панели после moveAt: ",panel_list[panel_num-1]);
		function moveAt(e) {
			console.log("Состояние панели на входе в moveAt: ",panel_list[panel_num-1]);
			pageWidth = document.documentElement.clientWidth; // определяем текущую ширину страницы
			pnl_width = panel_list[panel_num-1].offsetWidth; // определяем текущую ширину панели
			if (left_panel_slider.classList.contains("mn")){ //обнуляем метки для кнопки
				left_panel_slider.classList.remove("mn");
			}
			if (left_panel_slider.classList.contains("mx")){
				left_panel_slider.classList.remove("mx");
			}
			
			console.log("pnl_width: ",pnl_width);
			if (pnl_width >= 258 && pnl_width <= 741 ){	

				var profile_header_Div = panel_list[panel_num-1].getElementsByClassName("profile-header")[0];
				if (pnl_width >= 258 && pnl_width < 320){
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
					delta = 2;
				}
					
				else if (pnl_width >= 460 && pnl_width < 600){
					panel_list[panel_num-1].className = "my-profile left-panel active"; // убираем все метки - кастыль убрать позже
					panel_list[panel_num-1].classList.add("w460"); //добавляем класс w460 для (460 > w > 600)
					delta = 2;
				}
				else {
					panel_list[panel_num-1].className = "my-profile left-panel active"; // убираем все метки - кастыль убрать позже
					panel_list[panel_num-1].classList.add("w600"); //добавляем класс w600 для ( > 600)
					delta = 14;
				}
				new_pnl_width = e.pageX - shiftX + delta;
				console.log("___e.pageX:",e.pageX, "shiftX:", shiftX, "delta:", delta);
				console.log("new_pnl_width:",new_pnl_width);
				//определяем минимальную ширину панели для текущего разрешения
				
				if (pageWidth < 381) {
					min_pnl_width = 258;
				}
				else {
					min_pnl_width = 320;
				}
				console.log("предварительный MIN:",pageWidth,"-", min_pnl_width);
				
				//определяем максимальную ширину панели для текущего разрешения
				max_pnl_width = get_max_panel_width (pageWidth);
				console.log("предварительный MAX:",max_pnl_width);
				
				
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

function show_separate_panel(id, panel){
	console.log("__show_separate_panel");
	panel_selector = '.separate.'+panel+'-panel';
	console.log(panel_selector);
	full_post_selector = '#full_sep_post_'+id;
	preview_post_selector = '#post_'+id;
	
	console.log(full_post_selector);
	active_panel = document.querySelector(panel_selector); // отдельная панель
	active_preview_panel = document.querySelector('.'+panel+'-panel.active'); //основная панель
	active_preview_post = active_preview_panel.querySelector(preview_post_selector);
	console.log("active-panel:",active_panel);
	console.log("active-panel:",active_panel.querySelector(full_post_selector));
	console.log("full_post:",active_panel);
	//separate_panel_list = document.getElementsByClassName('separate'); // получаем список всех активных секций
	
	if (!active_panel.classList.contains("active")){ // открываем отдельную панель
		console.log("отдельная панель еще не активна");
		active_panel.classList.toggle("active");
		selected_post_id = id;
    	active_panel.querySelector(full_post_selector).style.display = "block";
		active_panel.querySelector('.fullscreen-pnl').setAttribute('onclick',"full_screen_expand('left')"); //
		active_panel.querySelector('.close-pnl').style.display = "block";
    	active_panel.classList.add("w320");
    	active_preview_post.querySelector('.post-header-link').classList.add("hide"); //скрываем стили ссылки
    	active_preview_post.querySelector('.separate-pnl-btn').classList.add("chk"); //меняем значек на зеркальный
		full_screen_btn = active_panel.querySelector(".m_btn");
		console.log("full_screen_btn:",full_screen_btn);
		full_screen_btn.style.display = "list-item"; //делаем видимой кнопку fullscreen
        counterElem = active_panel.querySelector('.counter');
		counterElem.addEventListener("click", counterClick); //вешаем обработчик на клики по счетчику
    	resize_tab_content('separate '+panel+'-panel');
    	//show_tab(1,'separate left-panel'); //показываем первый и единственный таб
    	tab_content_list = active_panel.getElementsByClassName("tab-content");
		
    	addOnWheel(tab_content_list[0], function(e) {
    		contentCoords = getCoords (tab_content_list[0]);
    		//contentScrollTop =  tab_content_list[tab_id-1].scrollTop;
    		//console.log("contentScrollTop:",contentScrollTop);
    		console.log("скролл контента:",contentCoords.top);//отслеживаем скролл на контенте
    		resize_tab_content('separate left-panel');
    	}, false);
		console.log("отдельная панель открыта");
	}
	else {//закрываем отдельную панель
		console.log("отдельная панель уже открыта:",active_panel.querySelector(full_post_selector));
		active_panel.querySelector(full_post_selector).style.display = "none";
		console.log("отдельная панель уже открыта:",active_panel.querySelector(full_post_selector));
		console.log("уже выбраный пост:",selected_post_id);
		console.log("выбираемый пост:",id);
		old_preview_post_selector = '#post_'+selected_post_id;
		old_active_preview_post = active_preview_panel.querySelector(old_preview_post_selector);
		console.log("active_preview_panel object:",active_preview_panel);
		if (id == selected_post_id){
			console.log("закрываем отделную панель");
			active_panel.classList.toggle("active");
		}
		else {
			console.log("открываем новый пост в выделную панель");
			old_full_post_selector = '#full_sep_post_'+selected_post_id;
			active_panel.querySelector(old_full_post_selector).style.display = "none";
			active_panel.querySelector(full_post_selector).style.display = "block";
			active_preview_post.querySelector('.post-header-link').classList.add("hide"); //скрываем стили ссылки
			active_preview_post.querySelector('.separate-pnl-btn').classList.add("chk"); //меняем значек на зеркальный	
			selected_post_id = id;
		}
		console.log("old_active_preview_post object:",old_active_preview_post);
		
		if (old_active_preview_post.querySelector('.post-header-link').classList.contains('hide')){ //возвращаем стандартный стиль ссылке
			old_active_preview_post.querySelector('.post-header-link').classList.remove("hide");
			console.log("сработало");
		}
		if (old_active_preview_post.querySelector('.separate-pnl-btn').classList.contains('chk')){ //меняем значек обратно
		   old_active_preview_post.querySelector('.separate-pnl-btn').classList.remove("chk");
		}   
		console.log("отдельная панель закрыта");
	}
	//active_panel.classList.toggle("active");
	//separate_panel_list[0].classList.toggle("w320");
	//document.getElementsByClassName('popup')[0].classList.toggle('active');
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
			if (pnl_width >= 258 && pnl_width <= 740 ){	
				
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
				if (new_pnl_width < 258) { //если вдруг проскочили предельные координаты
					new_pnl_width = 258;
				}
				else if (new_pnl_width > 740) {
					new_pnl_width = 740;
				}
				
				
				panel_list[panel_num-1].style.width = new_pnl_width + 'px';
				if (new_pnl_width == 258 && !right_panel_slider.classList.contains("mn")){
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
	console.log('__show_tab');
    // Declare all variables
    var i, tab_content_list, tab_links, active_panel;
	active_panel = document.getElementsByClassName(panel+" active");
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
	tab_links[tab_id-1].classList.add("active");
    // Show the current tab, and add an "active" class to the link that opened the tab
	tab_content_list[tab_id-1].style.display = "block";
	tab_content_list[tab_id-1].classList.add("active");
	
	//if (tab_id == 3 && pageWidth > 420){  //активируем кнопку full-screen для раздела публикаций
	//	full_screen_btn.style.display = "list-item"; 
	//}
	if (tab_id == 1){  //активируем скрипт SimpleBar для горизонтального скрола
		var el = new SimpleBar(document.querySelector('.user-image-feed-wrapper'), { autoHide: false, scrollbarMinSize: 2 });
		if (document.querySelector('.simplebar-content').addEventListener) {  //навешываем обработчик скрола
			// IE9, Chrome, Safari, Opera
			document.querySelector('.simplebar-content').addEventListener("mousewheel", scrollHorizontally, false);
			// Firefox
			document.querySelector('.simplebar-content').addEventListener("DOMMouseScroll", scrollHorizontally, false);
		} else {
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
	contentCoords = getCoords (tab_content_list[tab_id-1]);
	console.log("contentCoords.top_1:",contentCoords.top);
	console.log("объект:",tab_content_list[tab_id-1]);
	prev_ScrY = contentCoords.top;
	console.log("до скрола:",prev_ScrY);
	timer3_on_flag = false;
	console.log(">>обнуляем флаг:",timer3_on_flag);
	console.log("Шаг 0:",active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"));
	addOnWheel(tab_content_list[tab_id-1], function(e) {
		contentCoords = getCoords (tab_content_list[tab_id-1]);
		//contentScrollTop =  tab_content_list[tab_id-1].scrollTop;
		//console.log("contentScrollTop:",contentScrollTop);
		console.log("скролл на табе:",tab_content_list[tab_id-1]);
		if (active_panel[0].querySelector('.inner-tab-content-container').scrollTop == 0){
			console.log("scrollTop == 0");
			resize_tab_content(panel);
		}
		console.log('top_чик:',getCoords(tab_content_list[tab_id-1]).top);
		console.log("предыдущий contentCoords.top:",prev_ScrY, " текущий:",contentCoords.top, " scrollTop inner-container:",active_panel[0].querySelector('.inner-tab-content-container').scrollTop);
	//	console.log("contentCoords.top:",contentCoords.top);
	//	console.log("скролл контента:",contentCoords.top);//отслеживаем скролл на контенте
	//	console.log("scrollTop скролл контента2:",active_panel[0].querySelector('.inner-tab-content-container').scrollTop);
		var panel_timer1; // таймер на закрытие панели табов, если убрать мышь с profile-header (панель над панелью табов)
		var panel_timer2; // таймер на закрытие панели табов, если убрать мышь с панели табов
		var panel_timer3; // таймер на показ панели табов при скроле вверх
		var panel_timer4; // таймер на на закрытие панели табов, если скрол вверх прекратился 
		clearTimeout (panel_timer1);
		clearTimeout (panel_timer2);
		//clearTimeout (panel_timer3);
		//clearTimeout (panel_timer4);
		
		deltaScroll = contentCoords.top - prev_ScrY //определяем направление скролла: вверх >0, вниз < 0
		console.log("deltaScroll1:",deltaScroll);
		
		if (contentCoords.top < 0){
			console.log("_____________::____>>один такт скрола, флаг:",timer3_on_flag);
			console.log("Шаг 1:",active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"));
			console.log("contentCoords.top:",contentCoords.top );
			if (!timer3_on_flag){
				active_panel[0].getElementsByClassName("profile-buttons")[0].classList.remove("active");
				console.log("сработал первый if, убераем панель с кнопками");
			}
			ContentScrolled = true;
			resize_tab_content(panel);
			console.log("deltaScroll:",deltaScroll);
			if (deltaScroll > 0){
				console.log("!!!____скролим вверх!!!");
				console.log('Флаг timer3_on_flag:',timer3_on_flag);
				if (!timer3_on_flag){
					clearTimeout (panel_timer4);
					console.log("сброшен timer4");
					console.log("timer3_on_flag был false, а теперь:", timer3_on_flag);
					//panel_timer3 = setTimeout(function() {
						if (contentCoords.top < 0 && deltaScroll > 0 ) {
						if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")){
							console.log('Если панель еще не активна, открываем её, панель:',active_panel[0]);
							active_panel[0].getElementsByClassName("profile-buttons")[0].classList.add("active"); //показ панели табов
							if (active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
							timer3_on_flag = true;
							}
							console.log("timer3_on_flag был false, а теперь:", timer3_on_flag);
							console.log('Панель с кнопками открыта:',timer3_on_flag);
							console.log('Реально открыта:',active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"));
							console.log("Шаг 2.1:",active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"),'флаг:',timer3_on_flag);
						}
					}
					//},500);
				}
				if (timer3_on_flag){
					clearTimeout (panel_timer4); //если таймер уже был запущен обнуляем его
					console.log("сброшен timer4",'contentCoords.top:',contentCoords.top);
					panel_timer4 = setTimeout(function() {if (contentCoords.top < 0 && !profile_buttons_onmouse_flag && !profile_header_onmouse_flag) {
						console.log('одно условие прошел, второе:',timer3_on_flag);
					if (timer3_on_flag){
						console.log("запущен timer4, панель закроем через 3 сек.");
						if (active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")){
							active_panel[0].getElementsByClassName("profile-buttons")[0].classList.remove("active");
							console.log("Шаг 2.2:",active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"),'флаг:',timer3_on_flag);
							resize_tab_content(panel);
						}
					if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
						timer3_on_flag = false;
					}
						
						console.log('А флаг то теперь:',timer3_on_flag);
					}
					}},3000);
				}

				
			}
			else {
				//clearTimeout (panel_timer3);
				//console.log("сброшен timer3");
				console.log("!!!____скролим вниз!!!");
				clearTimeout (panel_timer4);
				console.log("сброшен timer4");
			//	console.log("!!!____скрываем панель сразу!!!");
				if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
					timer3_on_flag = false;
				}
			//	else {
			//		active_panel[0].getElementsByClassName("profile-buttons")[0].classList.remove("active");
			//		timer3_on_flag = false;
			//	}
				console.log("Шаг 3:",active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"),'флаг:',timer3_on_flag);
				
				
			}
			active_panel[0].querySelector('.profile-buttons').onmouseenter = function() { //мышка над панелью табов
				profile_buttons_onmouse_flag = true;
				clearTimeout (panel_timer1);
				console.log("сброшен timer1");
				clearTimeout (panel_timer4);
				console.log("сброшен timer4");
				if (active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
				timer3_on_flag = true;
				}
				console.log("Шаг x.1:",active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"),'флаг:',timer3_on_flag);
			}
			active_panel[0].querySelector('.profile-buttons').onmouseleave = function() { //мышка ушла с панели табов
				profile_buttons_onmouse_flag = false;
				panel_timer2 = setTimeout(function() {if (contentCoords.top < 0) {
					console.log("запущен timer2");
					active_panel[0].querySelector('.profile-buttons').classList.remove("active");
					if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
					timer3_on_flag = false;
					}
					console.log("Шаг x.2:",active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"),'флаг:',timer3_on_flag);
					}},500); 
			}
			
			active_panel[0].querySelector('.profile-header').onmouseenter = function() {
				profile_header_onmouse_flag = true;
				console.log("засекли мышку");
				clearTimeout (panel_timer2);
				console.log("сброшен timer2");
				clearTimeout (panel_timer4);
				console.log("сброшен timer4");
				active_panel[0].getElementsByClassName("profile-buttons")[0].classList.add("active");
				if (active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { //меняем флаг только после проверки
					timer3_on_flag = true;
					}
				console.log("Шаг 0.1:",active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"),'флаг:',timer3_on_flag);				
			}
			active_panel[0].querySelector('.profile-header').onmouseleave = function() { // если курсор убрали - прячем панель через 2 секунды
				profile_header_onmouse_flag = false;
				console.log("мышка нас покинула");
				panel_timer1 = setTimeout(function() { if (contentCoords.top < 0) {
					console.log("запущен timer1");
					active_panel[0].getElementsByClassName("profile-buttons")[0].classList.remove("active");
					if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active")) { 
					timer3_on_flag = false;
					}
					console.log("Шаг 0.2:",active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active"),'флаг:',timer3_on_flag);
					}},2000); 
			}
			
		}
		else if (!active_panel[0].getElementsByClassName("profile-buttons")[0].classList.contains("active") && !active_panel[0].getElementsByClassName("profile-extra-buttons")[0].classList.contains("active")){  //вернулись к верху панели
			active_panel[0].getElementsByClassName("profile-buttons")[0].classList.add("active");
			console.log("сработал второй if");
			ContentScrolled = false;
			resize_tab_content(panel);
			
		};
	contentCoords = getCoords (tab_content_list[tab_id-1]);	
	prev_ScrY = contentCoords.top;
	console.log("prev_ScrY обновили:", prev_ScrY);
	}, false);
	last_active_tab_id = tab_id; //запоминаем какой таб был открыт последним
	//prev_ScrollY_Pos = active_panel[0].querySelector('.inner-tab-content-container').scrollTop; //сохраняем предыдущее положение верт. скролла панели
	console.log("prev_ScrollY_Pos:",prev_ScrollY_Pos);
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

function scrollHorizontally(e) {
        e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        document.querySelector('.simplebar-content').scrollLeft -= (delta*40); // Multiplied by 40
        e.preventDefault();
}
	




function init(){
	console.log("Page is loaded");
	var side_bar_Div = document.getElementById('side-bar');
	var debug_info = document.getElementById('debug-info');
	pageWidth = document.documentElement.clientWidth;
	pageHeight = document.documentElement.clientHeight;
	debug_info.innerHTML = "<span>width: "+pageWidth+"px, "+"height: "+pageHeight+"px";
	//console.log("Ширина = ", pageWidth, "px " );
/* 	if (pageWidth < 480 && document.getElementsByClassName('left-panel active').length > 0) { //если активна левая панель, то скрываем side-bar
		document.getElementById("side-bar").classList.add("hidden"); 
	} */
/*     var mc = new Hammer(side_bar_Div);
    mc.on("swipeleft", function(ev) {
    		console.log(ev.type, "It is work!!!" );
    		side_bar_Div.classList.add("hidden"); 
    }); */
	console.log("debug:",debug_info);
	var d_map = document.getElementById('map-test');
	console.log("m_div:",d_map);





















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
    .call(zoom);

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
               .datum({x:220, y:120})
               .attr("transform", function(d) { return 'translate(' + d.x + ' '+ d.y + ')'; })
               .call(drag);

d3.tsv("dots.tsv", dottype, function(error, dots) {
  dot = dotContainer.append("g")
      .attr("class", "dot")
    .selectAll("circle")
      .data(dots)
    .enter().append("circle")
      .attr("r", 5)
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .call(drag);
});   

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
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}












































	
	docHeight = document.documentElement.offsetHeight;
	var mapwrapper = document.getElementsByClassName('central-button-wrapper')[0];
	var mapscale = 1;
	
	console.log(mapwrapper);
	//side_bar_Div.addEventListener("mouseover", mouseOver);
	//side_bar_Div.addEventListener("mouseout", mouseOut);
	/*
	addOnWheel(mapwrapper, function(e) { //масштабирование карты с помощью скрола мыши
		var delta = e.deltaY || e.detail || e.wheelDelta;
		console.log("shift: ", delta);
		if (delta > 0 && mapscale < 1.3 ){
			mapscale+= 0.1;
		}
		else if (delta < 0 && mapscale > 0.8){
			mapscale-= 0.1;
		}
			// normalize scroll position as percentage
		var scrolled = e.deltaY / ( docHeight - window.innerHeight ),
		transformValue = 'scale('+mapscale+')';
		console.log("scroll is moving!!!", scrolled, transformValue );
		mapwrapper.style.WebkitTransform = transformValue;
		mapwrapper.style.MozTransform = transformValue;
		mapwrapper.style.OTransform = transformValue;
		mapwrapper.style.transform = transformValue;
	}, false);
	*/
}

function width_label(panel){ // определяем какую метку ставить панели в зависимости от её ширины
	if (panel.offsetWidth < 320){
		return "w258";
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
		return 258;
	}
	else if (width > 320 && width <= 381 ) {
		console.log("холодец:", width-document.getElementById("side-bar").offsetWidth );
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
	
function show_full_post(id,panel){
	console.log("__show_full_post");
	panel_selector = '.'+panel+'-panel.active';
	full_post_selector = '#full_post_'+id;
	active_panel = document.querySelector(panel_selector);
	full_screen_btn = active_panel.querySelector('.m_btn');
	scroll_wrapper = active_panel.querySelector('.inner-tab-content-container');
	preview_post_list = active_panel.getElementsByClassName('post-preview-wrapper');
	console.log("active-panel:",active_panel);
	if (document.querySelector('.separate'+panel_selector)!=null){ //если открыта отдельная панель, закрываем её
		console.log("тадам!!!");
		return false;
		//document.querySelector('.separate'+panel_selector).classList.remove("active")
	}
	if (!full_post_flag){ //показываем пост в основной панели
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
		console.log('--',scroll_wrapper.scrollTop);
		scroll_wrapper.scrollTop = 0; //возвращаем вертикальный скролл в исходное положение - вверх
		console.log('scroll_wrapper.scrollTop:',scroll_wrapper.scrollTop,'prev_ScrollY_Pos:', prev_ScrollY_Pos);
		full_post_flag = true;
		selected_post_id = id; //обновляем глобальную переменную с id выбранного поста
		console.log('full_post_flag:',full_post_flag);
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
		console.log('scroll_wrapper.scrollTop:',scroll_wrapper.scrollTop,'prev_ScrollY_Pos:', prev_ScrollY_Pos);
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
    
    if (MaxRatingValue > PostRatingValue){
        console.log('-111'); 
        --MaxRatingValue;
        MinRatingValue = PostRatingValue;
    }
    else {
        console.log('-222'); 
        MaxRatingValue = PostRatingValue;
        --MinRatingValue;
    }    
    console.log(MinRatingValue,'-',MarkValue,'-',MaxRatingValue);
    console.log(parseInt(MarkValue, 10));
  }
  if (event.target.className == 'count_plus_btn') {
    console.log('plus');
    ++MarkValue;
    if (MinRatingValue < PostRatingValue){
        console.log('+111');
        ++MinRatingValue;
        MaxRatingValue = PostRatingValue;
        
    }
    else {
        console.log('+222');
        MinRatingValue = PostRatingValue;
        ++MaxRatingValue;
    }
    console.log(MinRatingValue,'-',MarkValue,'-',MaxRatingValue);
  }
  if (MarkValue > 0) {

    MarkSign = '+ ';
    this.querySelector('.counter_field').style.color = '#7dd3c6';
  }
  else if (MarkValue == 0) {
    MarkSign = '';
    this.querySelector('.counter_field').style.color = '#000';
  } else {
    MarkSign = '- ';
    this.querySelector('.counter_field').style.color = '#f76879';
  }
  this.querySelector('.counter_field').value = MarkSign + Math.abs(MarkValue); //используем модуль, чтобы не задваивать знак минуса
  this.querySelector('.count_min_range').innerHTML = formatStr(MinRatingValue);
  this.querySelector('.count_max_range').innerHTML = formatStr(MaxRatingValue);
}


function show_personal_info_spec_menu(panel, menu_item){
	console.log("__show_personal-info-spec-menu");
	active_panel = document.querySelector('.'+panel+'-panel.active');
	active_item_menu = active_panel.querySelector('.'+menu_item+'-header');
	console.log(active_item_menu);
	active_item_menu.classList.toggle('active');
	active_item_menu.nextElementSibling.classList.toggle('active');
	console.log(active_item_menu.nextElementSibling);
	console.log(active_item_menu.nextElementSibling.classList.contains('active'));
	var spec_panel_timer1;
	clearTimeout(spec_panel_timer1);
	if(active_item_menu.nextElementSibling.classList.contains('active')){
		console.log("условие сработало");
		active_item_menu.nextElementSibling.onmouseenter = function() { //мышка ушла с панели доп. функционала
			clearTimeout(spec_panel_timer1);
			console.log("сброшен таймер spec_panel_timer1");			
		}
		active_item_menu.nextElementSibling.onmouseleave = function() { //мышка ушла с панели доп. функционала
			spec_panel_timer1 = setTimeout(function() {
				console.log("запущен spec_panel_timer1");
				if(active_item_menu.nextElementSibling.classList.contains('active')){
					show_personal_info_spec_menu(panel, menu_item);
				}
			},500); 
		}
	}
	
}

function show_spec_menu(panel){
	console.log("__show_spec_menu");
	panel_selector = '.'+panel+'-panel.active';
	if (panel == 'separate left'){
		panel_selector = '.separate.left-panel.active';
	}
	console.log(panel_selector);
	active_panel = document.querySelector(panel_selector);
	active_panel.querySelector('.profile-header').classList.toggle('active');
	active_panel.querySelector('.spec-menu-block').classList.toggle('active');
	var spec_panel_timer2;
	clearTimeout(spec_panel_timer2);
	if(active_panel.querySelector('.spec-menu-block').classList.contains('active')){
		active_panel.querySelector('.spec-menu-block.active').onmouseenter = function(){
			clearTimeout(spec_panel_timer2);
			console.log("сброшен таймер spec_panel_timer2");		
		}
		
		active_panel.querySelector('.spec-menu-block.active').onmouseleave = function() { //мышка ушла с панели доп. функционала
			spec_panel_timer2 = setTimeout(function() {
			console.log("запущен spec_panel_timer2");
			if(active_panel.querySelector('.spec-menu-block').classList.contains('active')){
				show_spec_menu(panel);}
			},500); 
		}
	}
}

function show_post_header_spec_menu(panel, id){
	console.log("__show_post_header_spec_menu");
	panel_selector = '#post_'+id;
	console.log("panel_selector: ",panel_selector);
	active_panel = document.querySelector(panel_selector);
	active_panel.querySelector('.post-header-btns-block').classList.toggle('active');
	active_panel.querySelector('.post-header-spec-menu').classList.toggle('active');
	console.log(active_panel.querySelector('.post-header-spec-menu'));
	var spec_panel_timer3;
	clearTimeout(spec_panel_timer3);
	if(active_panel.querySelector('.post-header-spec-menu').classList.contains('active')){
		active_panel.querySelector('.post-header-spec-menu.active').onmouseenter = function(){
			clearTimeout(spec_panel_timer3);
			console.log("сброшен таймер spec_panel_timer3");		
		}
		
		active_panel.querySelector('.post-header-spec-menu.active').onmouseleave = function() { //мышка ушла с панели доп. функционала
			spec_panel_timer3 = setTimeout(function() {
			console.log("запущен spec_panel_timer3");
			if(active_panel.querySelector('.post-header-spec-menu').classList.contains('active')){
				show_post_header_spec_menu(panel, id);}
			},500); 
		}
	}
}


	
	
function left_panel_expand(param){
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
	console.log("act_panel obj:",active_panel);
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
	
	if (left_panel_slider.classList.contains("mn")){ // определяем состояние панели по классам mn и mx
		console.log("slider", left_panel_slider);
		left_panel_slider.classList.remove("mn");
		console.log("расширение, удаляем метку mn");
		if ( pageWidth <= 320){
			active_panel.classList.add("full-screen"); //раздвигаем панель на всю ширину экрана
			side_bar_Div.classList.add("hidden"); // скрываем side-bar
			active_panel.style.width = pageWidth + "px"; //при маленьком разрешении панель расширяется до границ экрана, а не до 740px
		}
		else {
			active_panel.style.width = max_panel_width + "px";
			active_panel.classList.remove("w320");
			new_width_label=width_label(active_panel);
			if (active_panel.offsetWidth >= 320){
				console.log("new_width_label = ", new_width_label);
				active_panel.classList.add(new_width_label);
			}
			console.log("new_max = ", get_max_panel_width(pageWidth));
			active_panel.style.width = get_max_panel_width(pageWidth) + "px";
		}
		console.log("панел_лист експанд: ",active_panel);
		active_panel.querySelector(".tab-content").style.width = active_panel.querySelector(".outer-tab-content-container").offsetWidth + "px";
		left_panel_slider.classList.add("mx");	
	}
	else if (left_panel_slider.classList.contains("mx")){
		console.log("slider", left_panel_slider);
				console.log("условие mx сработало");
				left_panel_slider.classList.remove("mx");
				min_width_panel = 258;
				if (pageWidth < 320){
					active_panel.classList.remove("full-screen"); //смещаем панель вправо на ширину side-bar
					
					side_bar_Div.classList.remove("hidden"); // возвращаем side-bar
					old_width_label = width_label(active_panel);
					console.log("old 0:",old_width_label);
					active_panel.classList.remove(old_width_label);
					console.log("сработал 0 вариант");
				}
				else if (pageWidth >= 320 && pageWidth <= 381){
					active_panel.classList.remove("full-screen"); //смещаем панель вправо на ширину side-bar
					side_bar_Div.classList.remove("hidden"); // возвращаем side-bar
					old_width_label = width_label(active_panel);
					console.log("old:",old_width_label);
					active_panel.classList.remove(old_width_label);

					console.log("сработал 1 вариант");
				}
				else {
					 // возвращаем side-bar
					old_width_label = width_label(active_panel);
					console.log("old 2:",old_width_label);
					active_panel.classList.remove(old_width_label);
					active_panel.classList.add("w320");
					min_width_panel = 320;
					console.log("сработал 2 вариант");
				}
				side_bar_Div.classList.remove("hidden");
				console.log('side-bar',side_bar_Div);
				
				active_panel.style.width = min_width_panel + "px"; //при маленьком разрешении ширина панели сужается до минимума - 258px
				new_width_label=width_label(active_panel);
				active_panel.classList.add(new_width_label);
				console.log("новый лэйбл:",new_width_label);
				active_panel.querySelector(".tab-content").style.width = active_panel.querySelector(".outer-tab-content-container").offsetWidth + "px";
				left_panel_slider.classList.add("mn");	
	}
	else {
		console.log("сработал 3 вариант");
	}
	
	document.getElementById('panel-debug-info').innerHTML = "<span>page_width: "+pageWidth+"px, "+"<br>page_height: "+pageHeight+"px <br><br> panel_width: "+active_panel.offsetWidth + "px</span>";
	resize_tab_content('left-panel');
}

function full_screen_expand(panel,mode){
	console.log("__full_screen_expand>",panel);
	//Режим 1 - запуск из дополнительной панели (значение по умолчанию)
	//Режим 2 - запуск из основной панели
	if (mode == null){
		mode = 1;
	}
	else {
		mode = mode;
	}
	console.log("__full_screen_expand>mode:",mode);
	if (mode == 2){
		show_separate_panel(selected_post_id,panel);	
	}
	active_separate_panel = document.querySelector('.separate.'+panel+'-panel.active'); // получаем список всех активных секций
	active_separate_panel.classList.toggle("full-screen");
	if (active_separate_panel.classList.contains("full-screen")){
		console.log("режим полного экрана включен");
		active_parent_panel = document.querySelector('.'+panel+'-panel.active');
		panel_container = document.querySelector('.'+panel+'-panel-container');
		if (mode == 2){
			//active_separate_panel.querySelector('.fullscreen-pnl').setAttribute('onclick',"alert('2')");
			active_separate_panel.querySelector('.fullscreen-pnl').setAttribute('onclick',"show_left_panel(3)");
			//onclick = function(){full_screen_expand('left',2)}
			console.log ('onclick:',active_separate_panel.querySelector('.fullscreen-pnl').onclick);
			active_separate_panel.querySelector('.close-pnl').style.display = "none"; //скрываем кнопку закрыть
		}
		else {
			active_separate_panel.querySelector('.fullscreen-pnl').setAttribute('onclick',"full_screen_expand('left')");
			console.log ('onclick:',active_separate_panel.querySelector('.fullscreen-pnl').onclick);
		}
		active_parent_panel.classList.remove('active'); //скрываем родительскую панель
		panel_container.style.display = "block"; //растягиваем div container на весь экран
		resize_tab_content('separate '+panel+'-panel');
	}
	else{
		console.log("режим полного экрана выключен");
		panel_container.style.display = "inline-block";
		if (panel == "left"){
			document.querySelector('.my-profile.'+panel+'-panel').classList.add('active'); //показываем родительскую панель
		}
		if (mode != 2){
		resize_tab_content('separate '+panel+'-panel');
		}
		if (mode == 2){
		show_separate_panel(selected_post_id,panel);	
		}
	}
	
	

	//определяем открыта ли основная левая панель
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
				active_panel_list[0].style.width = 258 + "px";
				active_panel_list[0].classList.remove("w600");
				active_panel_list[0].getElementsByClassName("tab-content")[0].style.width = active_panel_list[0].getElementsByClassName("outer-tab-content-container")[0].offsetWidth + "px";
				right_panel_slider.classList.add("mn");	
	}
	resize_tab_content('right-panel');
}
document.addEventListener("DOMContentLoaded", function(){ init(); }, false);