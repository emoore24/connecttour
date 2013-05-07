$(document).ready(function() {
	console.log('hey');
	window.mySwipe = Swipe(document.getElementById('slider'), {
		callback: function(index, elem) {
			$('.dot').removeClass('active-dot');
			$('#dot' + (index+1)).addClass('active-dot');
		}
	});

	$('.dot').click(function(e) {
		var dotID = parseInt($(this)[0].id.substring(3)) - 1;
		console.log(dotID);
		window.mySwipe.slide(dotID, 300);
	});
});