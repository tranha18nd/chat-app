    $('#loginForm').show()
    $('#chatForm').hide()

    



$(document).ready(function(){
	var socket = io("https://x-message.herokuapp.com")
	$('#btnRegister').click(function(){
		var	userName = $('#userName').val()	
		socket.emit("client send userName", userName)
	})

	socket.on("server send err", function(data){
		alert(data)
	})

	socket.on("server send success", function(data){
		alert("Đăng ký thành công")
		$("#currentUser").html(data)

		$('#loginForm').hide(2000)
    	$('#chatForm').show(1000)
	})
	
	socket.on("server send new user", function(data){
		$("#boxContent").html('')
		data.forEach(function(i){
			$("#boxContent").append("<div class = 'user'>"+i+"</div>")
		})
	})

	socket.on("server send message", function(data){
		$("#listMessages").append("<div class = 'message'><b>"+data.user +":</b>"+data.content+"</div>")
	})

	socket.on("server send notice", function(data){
		$("#notice").html("<img src = 'typing.gif' style = 'width:30px;'><span>"+data+" đang nhập tin nhắn....</span>")
	})

	socket.on("server send unotice", function(data){
		$("#notice").html("")
	})

	$('#btnLogout').click(function(){
		socket.emit("client logout")
		$('#loginForm').show(2000)
    	$('#chatForm').hide(1000)
	})

	$('#sendMessage').click(function(){
		var	txtMessage = $('#txtMessage').val()	
		socket.emit("client send message", txtMessage)
		$('#txtMessage').val('')
		$('#txtMessage').focus()
	})
	$("#txtMessage").keyup(function(event) {
    	if (event.keyCode === 13) {
			var	txtMessage = $('#txtMessage').val()	
			socket.emit("client send message", txtMessage)
			$('#txtMessage').val('')
			$('#txtMessage').focus()
		}
	})

	$('#txtMessage').focusin(function(){
		socket.emit("client input")
	})

	$('#txtMessage').focusout(function(){
		socket.emit("client output")
	})
})
