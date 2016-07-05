var socket = io();
var user;
var colorPencil;
var listaUsers = new Array();
socket.on('connect', function(){
		bootbox.dialog({
		  message: "Escriba su nombre por favor: <input type='text' id='usuario'>",
		  title: "Bienvenido a la pizarra multiusuarios",
		  buttons: {
		    main: {
		      label: "Ingresar",
		      className: "btn-primary",
		      callback: function() {
		        user = $('#usuario').val();
		        socket.emit('nuevoUser', user);
		        socket.emit('noti', user);
		        random();
		      }
		    }
		  }
		});
});

function getColor(){
   hexadecimal = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");
   color = "#";
   for (var i=0;i<6;i++){

      posarray = parseInt(Math.random() * hexadecimal.length);
      color += hexadecimal[posarray];
   }
	 colors[n]=color;
	 n++;

}

function verificarColor(){
 getColor();

 if (colors[n]==colors[n-1]) {
  color=getColor();
 }

}

var colors=[];
var n=0;
var numero = 0;

var colorRandom;
var resColors = new Array();

socket.on('notificacion', function(user){
	$.notify({
	// options
	message: '<b>'+ user +'</b> se ha conectado'
	},{
		// settings
		type: 'info'
	});
	impUsers();
});

socket.on('welcome', function(user){
	$.notify({
	// options
	message: 'Bienvenido <b>'+ user +'</b>'
	},{
		// settings
		type: 'success'
	});
	impUsers();
});

function random(){

	getColor();
	verificarColor();

	socket.emit('colorCliente', colors[n-1]);
	console.log(colors[n-1] + "el color es!");
};

socket.on('nuevo', function(nombre, contN){
	var cN = contN - 1;
	listaUsers[cN] = nombre;
	//$('#user').append($('<li>').text(nombre));
	//impUsers();
	update(movimientos, colors);
});

var msg;

socket.on('chat msj', function(nombre, msg){
	$('#mensaje').append($('<li id="liMSJ">').text(nombre+": "+msg));
});

socket.on('cantUsers', function(contador){
	$('#cantUser').empty();
	$('#cantUser').append($('<li>').text(contador));
});

socket.on('menosU', function(u){
	$('#cantUser').empty();
	$('#cantUser').append($('<li>').text(u));
});

var movimientos = new Array();
var colores = new Array();
var pulsado;
var context;

   	function lienzo() {
		var canvasDiv = document.getElementById('pizarra');
		canvas = document.createElement('canvas');
		canvas.setAttribute('width','840');
		canvas.setAttribute('height','600');
		canvasDiv.appendChild(canvas);
		context = canvas.getContext("2d");

		$('canvas').mousedown(function(e){
			pulsado = true;
			socket.emit('dibuja', [e.pageX - this.offsetLeft,e.pageY - this.offsetTop,false]);
		});
		$('canvas').mousemove(function(e){
			if(pulsado){
				socket.emit('dibuja', [e.pageX - this.offsetLeft,e.pageY - this.offsetTop,true])
			}
		});
		$('canvas').mouseup(function(e){
			pulsado = false;
		});
		$('canvas').mouseleave(function(e){
			pulsado = false;
		});


	}; 

socket.on('update',function(mov, col){
	// drawing(movimientos, col);
	movimientos.push(mov);
	colores.push(col);
	context.lineJoin='round';
	context.lineWidth = 6;
	for(var i = 0;i<movimientos.length;i++){
		context.beginPath();
		if(movimientos[i][2] && i){
			context.moveTo(movimientos[i-1][0],movimientos[i-1][1]);
			context.strokeStyle = colores[i-1];
		} else {
			context.moveTo(movimientos[i][0],movimientos[i][1]);
			context.strokeStyle = colores[i];
		}
		context.lineTo(movimientos[i][0],movimientos[i][1]);
		context.closePath();
		context.stroke();
	}
});

	function impNUsers(){
		for(var n=0; n<listaUsers.length;n++){
			var ppArr = listaUsers[n];
			$('#user').append($('<li>').text(ppArr));
		}
	};

	function impUsers(){
		$('#user').empty();
		for(var s=0; s<listaUsers.length;s++){

			var nArray = listaUsers[s];
			$('#user').append($('<li>').text(nArray));
		}
	};

	socket.on('limpiarCanva', function(){
		context.clearRect(0, 0, lienzo.width, lienzo.height);

	});

socket.on('desconectado', function(ppuu){
	$.notify({
	// options
	message: '<b>'+ ppuu +'</b> se ha desconectado'
	},{
		// settings
		type: 'warning'
	});

	for(i=0;i<listaUsers.length;i++){
		var uDel = listaUsers[i];
		console.log(uDel);
		if (uDel == ppuu) {
			listaUsers.splice(i,1);
			i = listaUsers.length;
			impUsers();
		} 
	}
	
});
