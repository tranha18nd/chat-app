var express = require("express")
var app = express()
app.use(express.static("public"))
app.set("view engine", "ejs")
app.set("views", "./views")

var server = require("http").Server(app)
var io = require("socket.io")(server)
server.listen(process.env.PORT || 3000)
var i = 0
var arrUsers = []
io.on("connection", function(socket){
	console.log("Hello! wellcome you connect to server", socket.id)
	i++
	console.log(i, "client connected")

	socket.on("client send userName", function(data){
		if(arrUsers.indexOf(data) >=0){
			socket.emit("server send err", "Đăng ký thất bại. Vui lòng kiểm tra lại")
		} else {
			arrUsers.push(data)
			socket.userName = data
			socket.emit("server send success", data)
			io.sockets.emit("server send new user", arrUsers)
		}
	})

	socket.on("client logout", function(){
		// console.log(socket.userName)
		arrUsers.splice(arrUsers.indexOf(socket.userName), 1)
		// console.log(arrUsers)
		socket.broadcast.emit("server send new user", arrUsers)
	})


	socket.on("client send message", function(data){
		io.sockets.emit("server send message", {user:socket.userName, content:data})
	})
	

	socket.on("client input", function(){
		io.sockets.emit("server send notice", socket.userName)
	})

	socket.on("client output", function(){
		io.sockets.emit("server send unotice", socket.userName)
	})
})

app.get("/", function(req, res){
    res.render("home")
})