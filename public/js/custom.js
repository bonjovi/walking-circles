$(function() {

	$('.login-page input[type=submit]').on('click', function(event) {
		$('.page__flash.page__flash_wrong').fadeOut().remove();
		$('<div class="page__flash page__flash_wrong"></div>').insertBefore('.section__wrapper');
		event.preventDefault();
		var username = $('input[name=username]').val();
		var password = $('input[name=password]').val();
		$.ajax({
			type: "GET",
			url: "http://notes.jside.ru/mongotest.php?callback=999&username="+ username + "&password=" + password,
			dataType: 'jsonp',
			success: function (data) {
				if(data.response != 'Ok') {
					$('div.page__flash.page__flash_wrong').html(data.response);
				} else {
					window.location.href = 'http://zaitsev.jside.ru:667/wt/';
				}				
	        }
		});
	});

	if($('.registration-page .page__flash_wrong').is(':contains("Введите email")') || $('.registration-page .page__flash_wrong').is(':contains("Email некорректный")')) {
		$('input[name=email]').css('border','2px solid #ff594d');
	}

	if($('.registration-page .page__flash_wrong').is(':contains("Придуймате пароль")')) {
		$('input[name=email]').css('border-bottom','none');
		$('input[name=password]').css('border','2px solid #ff594d');
		$('input[name=password2]').css('border-top','none');
	}

	if($('.registration-page .page__flash_wrong').is(':contains("Пароль не соответствует ранее введённому")')) {
		$('input[name=password2]').css('border','2px solid #ff594d');
	}

	if($('.login-page #messages .error li').is(':contains("Логин или пароль неверны")') || $('.login-page #messages .error li').is(':contains("Invalid username or password")')) {
		$('input[name=email]').css('border','2px solid #ff594d');
	}
});