mp = null; // MainPanel

function mp_start()
{
    // information de canvas
    let canvas = document.getElementById('canvas_e'); // to get canvas element
    let ctx = canvas.getContext('2d');  // get context from canvas

    mp = new MainPanel(canvas, ctx); // Objet de MainPanel 

    // StartPanel
    st_start();
}

function MainPanel(canvas, ctx)
{
    this.canvas =canvas;
    this.ctx = ctx;
    return this;
}

MainPanel.prototype.finish = function()
{
    //clear canvas
    mp.ctx.clearRect(0,0,mp.canvas.width,mp.canvas.height);
    //no button
    document.getElementById('method').style.display = "none";
    document.getElementById('start').style.display = "none";


    mp.ctx.lineWidth = 2;
    mp.ctx.font = "60px Monotype Corsiva";

    mp.ctx.textBaseline = "middle"; //y
    mp.ctx.textAlign = "center";  //x

    mp.ctx.fillStyle = "#AAA";
    mp.ctx.fillText("Have a nice day !!", mp.canvas.width/2+4, mp.canvas.height/3);

    mp.ctx.fillStyle = "blue";
    mp.ctx.fillText("Have a nice day !!", mp.canvas.width/2, mp.canvas.height/3);

    mp.ctx.font = "40px Monotype Corsiva";
    
    mp.ctx.fillStyle = "blue";
    mp.ctx.fillText("~ Thank you for playing ! ~", mp.canvas.width/2, mp.canvas.height/2);

}