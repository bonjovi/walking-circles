$(function() {

	$('.profileblock__maintitle a').on('click', function() {
		$(this).parent().next().slideToggle();
	});

	$('.header__user-info-form').on('submit', function(e) {
		$(this).find('input').blur();
		e.preventDefault();
		var userinfo = $(this).find('input').val();
		var username = $('.realname').text();
		$.ajax({
	        url: 'http://localhost:8124/?userinfo=' + userinfo + '&username=' + username,
	        dataType: "jsonp",
	        jsonpCallback: "_testcb",
	        cache: false,
	        timeout: 5000,
	        success: function(data) {
	            console.log(data);
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	            alert('error ' + textStatus + " " + errorThrown);
	        }
	    });	
	});

	$('.header__user-about-form').on('submit', function(e) {
		$(this).find('input').blur();
		e.preventDefault();
		var userabout = $(this).find('input').val();
		var username = $('.realname').text();
		$.ajax({
	        url: 'http://localhost:8124/?userabout=' + userabout + '&username=' + username,
	        dataType: "jsonp",
	        jsonpCallback: "_testcb",
	        cache: false,
	        timeout: 5000,
	        success: function(data) {
	            console.log(data);
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	            alert('error ' + textStatus + " " + errorThrown);
	        }
	    });	
	});
});