// StartPanel
var socket = io('http://localhost:8000');
/*<script src="/socket.io/socket.io.js"></script>
var socket = io('http://localhost:8000');
socket.emit('start')*/


function st_start()
{
    mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
    mp.ctx.lineWidth = 2;
    mp.ctx.font = "70px Monotype Corsiva";

    mp.ctx.textBaseline = "middle"; //y
    mp.ctx.textAlign = "center";  //x
    mp.ctx.fillStyle = "#AAA";
    mp.ctx.fillText("Welcome to", mp.canvas.width/2+4, mp.canvas.height/3);

    mp.ctx.fillStyle = "blue";
    mp.ctx.fillText("Welcome to", mp.canvas.width/2, mp.canvas.height/3);

    mp.ctx.fillStyle = "#AAA";
    mp.ctx.fillText("Othello !!",mp.canvas.width/2+4, mp.canvas.height/3+80);

    mp.ctx.fillStyle = "blue";
    mp.ctx.fillText("Othello !!",mp.canvas.width/2, mp.canvas.height/3+80);

    //button control
    document.getElementById('method').style.display = "";
    document.getElementById('start').style.display = "";
    document.getElementById('ta').style.display = "none";
    document.getElementById('first').style.display = "none";
    document.getElementById('finish').style.display = "none";
}
