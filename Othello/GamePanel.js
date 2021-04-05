

gp = null;

function gp_start(value)
{
    gp = new GamePanel(value);

    gp.draw();
    mp.canvas.addEventListener("click", gp.mouseClick);
    // to not show the butoon of the home page
    document.getElementById('method').style.display = "none";
    document.getElementById('start').style.display = "none";
    document.getElementById('gameButtons').style.display='';
        if(gp.bw==gp.bwp){
       let ta = document.getElementById('ta');
       ta.value='Your turn (click to skip if you can\'t play)';
    }else{
       let ta = document.getElementById('ta');
       ta.value='Enemy turn';       
    }
}

function GamePanel(value)
{
    this.sz= 51;  // size of each cell
    this.gap =2;   // between cell
    this.bw = 1;   // black:1, white:-1
    this.bwp = value ;

    this.st = new Array(); //board structure
    this.st[0] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.st[1] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.st[2] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.st[3] = new Array(0, 0, 0, 1, -1, 0, 0, 0);
    this.st[4] = new Array(0, 0, 0, -1, 1, 0, 0, 0);
    this.st[5] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.st[6] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.st[7] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.n =new Array(); // to keep the pieces which can be reversed
    return this;
}

GamePanel.prototype.mouseClick = function(event)
{   
    if (gp.bwp != gp.bw){
        return
    }
    let x_base  = mp.canvas.offsetLeft;  // the x coordinate of top left canvas
    let y_base  = mp.canvas.offsetTop;   // the y coordinate of top left canvas
    let x       = event.pageX - x_base;  // the x coordinate of the clicked place
    let y       = event.pageY - y_base;  // the y coordinate of the clicked place

    // Identify the clicked square
    let k = new Array(-1, -1);
    for (let i1 = 0; i1 < 8; i1++) {
        if (y >= gp.gap+i1*(gp.gap+gp.sz) && y <= (i1+1)*(gp.gap+gp.sz)) {
            k[0] = i1;    // line index
            break;
        }
    }
    for (let i1 = 0; i1 < 8; i1++) {
        if (x >= gp.gap+i1*(gp.gap+gp.sz) && x <= (i1+1)*(gp.gap+gp.sz)) {
            k[1] = i1;     // column index
            break;
        }
    }
    // check SKIP
    let sw = false;
    let test = new Array(-1, -1);
    for (let i1 = 0; i1 < 8 && !sw; i1++) {
        for (let i2 = 0; i2 < 8 && !sw; i2++) {
            test[0] = i1;
            test[1] = i2;
            gp.r_check(test);
            if (gp.n[8] > 0) 
                sw = true;
        }
    }
    if(!sw){
        socket.emit("skip", "skip");
        gp.bw = - gp.bw;
            if(gp.bw==gp.bwp){
       let ta = document.getElementById('ta');
       ta.value='Your turn (click to skip if you can\'t play)';
    }else{
       let ta = document.getElementById('ta');
       ta.value='Enemy turn';       
    }
        return;
    }

    // to check if there is any pieces to reverse
    gp.r_check(k);
    // if there is
    if (gp.n[8] >0) {        
        gp.set(k);
        // we emit that coordinate to other player
        socket.emit("play",gp.st);
    let counter = gp.countBW();
    let black = document.getElementById('black');
    let white = document.getElementById('white');
    black.value=counter[0];
    white.value=counter[1];
            if(gp.bw==gp.bwp){
       let ta = document.getElementById('ta');
       ta.value='Your turn (click to skip if you can\'t play)';
    }else{
       let ta = document.getElementById('ta');
       ta.value='Enemy turn';       
    }
    }
}

GamePanel.prototype.r_check = function(k)
{   // 8 directions to be searched
    let dir = new Array();
    dir[0] = new Array(-1, 0);
    dir[1] = new Array(-1, 1);
    dir[2] = new Array(0, 1);
    dir[3] = new Array(1, 1);
    dir[4] = new Array(1, 0);
    dir[5] = new Array(1, -1);
    dir[6] = new Array(0, -1);
    dir[7] = new Array(-1, -1);
    gp.n[8] = 0;
    // x>0, y>o, if the clicked place has no pieces
    if (k[0] >= 0 && k[1] >= 0 && gp.st[k[0]][k[1]] == 0) {
        for (let i1 = 0; i1 < 8; i1++) {
            let mx   = k[0];
            let my   = k[1];
            gp.n[i1] = 0;
            // index -> 0: start, 1:count, 2:count end, 3: unable to reverse
            let index    = 0;  
            let count   = 0;
            while (index < 2) {
                mx += dir[i1][0];
                my += dir[i1][1];
                // inside the board
                if (mx >= 0 && mx < 8 && my >= 0 && my < 8) {
                    // if no piece
                    if (gp.st[mx][my] == 0)
                        index = 3;
                    // if you find your piece
                    else if (gp.st[mx][my] == gp.bw) {
                        if (index == 1)
                            index = 2;
                        else
                            index = 3;
                    }
                    // if there is opponent's piece
                    else {
                        index = 1;
                        count++;   // count number of reversible pieces
                    }
                }
                else 
                index = 3;
            }
            // how many reversible pieces
            if (index == 2){
                gp.n[8]  += count;
                gp.n[i1]  = count;
            }                    
        }
    }
}
// piece operation
GamePanel.prototype.set = function(k)
{   // call reverse function
    gp.reverse(k);
    gp.bw = -gp.bw;
    
}

// reverse pieces
GamePanel.prototype.reverse = function(k)
{    
    // 8 directions
    let dir = new Array();
    dir[0] = new Array(-1, 0);
    dir[1] = new Array(-1, 1);
    dir[2] = new Array(0, 1);
    dir[3] = new Array(1, 1);
    dir[4] = new Array(1, 0);
    dir[5] = new Array(1, -1);
    dir[6] = new Array(0, -1);
    dir[7] = new Array(-1, -1);
    for (let i1 = 0; i1 < 8; i1++) {
        let mx   = k[0];
        let my   = k[1];
        for (let i2 = 0; i2 < gp.n[i1]; i2++) {
            mx += dir[i1][0];
            my += dir[i1][1];
            gp.st[mx][my] = gp.bw;
        }
    }
    gp.st[k[0]][k[1]] = gp.bw;
    gp.draw();

    gp.checkwin(false);
}

GamePanel.prototype.draw = function()
{   // clear canvas 
    mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
    mp.ctx.beginPath();
    mp.ctx.fillStyle = 'black';
    mp.ctx.fillRect(0, 0, mp.canvas.width, mp.canvas.height);
    mp.ctx.fill();
    // draw cells and pieces
    for (let i1 = 0; i1 < 8; i1++) {
        for (let i2 = 0; i2 < 8; i2++) {
            let x = gp.gap + i2 * (gp.sz + gp.gap);
            let y = gp.gap + i1 * (gp.sz + gp.gap);
            mp.ctx.beginPath();
            mp.ctx.fillStyle = 'rgba(0, 128, 0, 1.0)';
            mp.ctx.fillRect(x, y, gp.sz, gp.sz);
            mp.ctx.fill();
            if (gp.st[i1][i2] != 0) {
                x += Math.floor(gp.sz / 2);
                y += Math.floor(gp.sz / 2);
                mp.ctx.beginPath();
                if (gp.st[i1][i2] < 0)
                    mp.ctx.fillStyle = 'white';
                else
                    mp.ctx.fillStyle = 'black';
                mp.ctx.arc(x, y, Math.floor(gp.sz/2)-2, 0, 2*Math.PI);
                mp.ctx.fill();
                mp.ctx.lineWidth = 3;
                mp.ctx.strokeStyle = 'black';
                mp.ctx.stroke();
            }
        }
    }
}

/*******************************************
***************** PROBLEM ICI ?? ************
***********************************************/
GamePanel.prototype.checkwin = function(flag)  // flag : si le tour a été sauté deux fois de suite -> TRUE
{let black = 0;  // compteur de black 
let white = 0;
let total = 0;
for (let i1 = 0; i1<8; i1++){
    for (let i2 = 0; i2<8; i2++){
        if (gp.st[i1][i2]!=0){   // gp.st = tableau des pions de plateau 
            total ++;
            if (gp.st[i1][i2]>0){ // black :1
                black++;}
            else{ 
                white++;}}    // black : -1
        }
    }
    
    if (total == white){
        socket.emit('Victory','White Win!')
        return
    }
    if (total == black){
        socket.emit('Victory','Black Win !')
        return
    }
    if (flag || total==64){ // si skip*2, ou plateau plein
        if (black == white){
            socket.emit('Victory', 'Draw')
        }

        else if (black > white){
            socket.emit('Victory','Black Win !')
        }

        else if (white > black){
            socket.emit('Victory','White Win !')
        }
    }
}

GamePanel.prototype.countBW = function()
{let black = 0;  // compteur de black 
let white = 0;
let total = 0;
for (let i1 = 0; i1<8; i1++){
    for (let i2 = 0; i2<8; i2++){
        if (gp.st[i1][i2]!=0){   // gp.st = tableau des pions de plateau 
            total ++;
            if (gp.st[i1][i2]>0){ // black :1
                black++;}
            else{ 
                white++;}}    // black : -1
        }
    }
 return([black,white,total]);
}
