var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require("path");

// configurar archivos públicos
// app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res){
	// res.render('index');
	res.sendFile(__dirname + "/views" + "/index.html");
});

// socket escuchando
var contador = 0;
io.on('connection', function(socket){
	contador++;
	// io.sockets.emit('bienvenido',contador);
	console.log("alguien se ha conectado");

	io.sockets.emit('cantUsers', contador);

	socket.on('noti', function(user){
		var uuser = user;
		socket.broadcast.emit('notificacion', uuser);
		socket.emit('welcome', uuser);
	});

	socket.on('colorCliente', function(color){
		socket.color = color;
		console.log(socket.color);
	});

	socket.on('dibuja', function(movimientos){
		socket.movimientos = movimientos;
		io.sockets.emit('update', socket.movimientos, socket.color);
	});

	socket.on('chat mensaje', function(msg){
		console.log("mensaje chat");
		io.sockets.emit('chat msj', socket.nombre, msg);
	});
	// Agrega nuevo usuario////////////////////////////////////////
	socket.on('nuevoUser', function(person){
		socket.nombre = person;
		console.log(socket.nombre);
		io.sockets.emit('nuevo', socket.nombre, contador);
	});

	socket.on('eraseCanva', function(){
		io.sockets.emit('limpiarCanva');
	});

	socket.on('disconnect', function(){
		console.log("Un usuario se ha desconectado");
		io.sockets.emit('desconectado', socket.nombre);

		contador-=1;
		io.sockets.emit('menosU', contador);
	});

});

http.listen(3000, function(){
	console.log('pizarra corriendo en port 3000');
});
