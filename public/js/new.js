$(function() {

	var startX = 35;
	var startY = -25;

	var name = $('.realname').text();
	var email = $('.header.profile__header > h3').text();

	// setTimeout(function() {
	// 	$('<circle r="20" cx="' + startX + '" cy="' + startY + '" />').appendTo('body');	
	// }, 500);
var socket = io('http://localhost:2001');




socket.on("chat message", function(movingEmail, movingX, movingY) {
	console.log(movingEmail + ' ' + movingX + ' ' + movingY);
	if(movingEmail != email) {
		$('g[email=' + movingEmail)
		.attr(
			{"transform":"translate(" + movingX + "," + movingY + ")"}
		).css(
			'transition','transform 10s ease-in-out'
		);
	}
});



	$('body').on('dblclick', function(e) {



	
	

		console.log(e.pageX + '!!!' + e.pageY);
		var elm = $('g[email=' + email +'] circle');
		
	    //var circleLocation = $('.newcircle circle').offset();
	    //alert(circleLocation.left + ' !!! ' + circleLocation.top);
	    var circleLocationLeft = $('g[email=' + email +']').attr('myx');
	    var circleLocationTop = $('g[email=' + email +']').attr('myy');
	    //alert(circleLocationLeft + ' !!! ' + circleLocationTop);





	    var xPos = e.pageX;
	    var yPos = e.pageY;

		$('g[email=' + email)
		.attr(
			{"transform":"translate(" + (xPos - startX) + ","+ (yPos - startY) +")"}
		).css(
			'transition','transform 10s ease-in-out'
		);
		
		socket.emit("chat message", email, xPos - startX, yPos - startY);





$.ajax({
        url: 'http://localhost:8124/?username=' + name + '&x=' + (xPos - startX) +'&y=' + (yPos - startY) + '&callback=?',
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

	    console.log(xPos, yPos);
	});
});



