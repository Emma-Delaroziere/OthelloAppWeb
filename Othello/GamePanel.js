gp = null;

function gp_start()
{
    gp = new GamePanel();

    gp.draw();
    mp.canvas.addEventListener("click", gp.mouseClick);

    document.getElementById('method').style.display = "none";
    document.getElementById('start').style.display = "none";
    document.getElementById('ta').style.display = "";
    document.getElementById('ta').style.color = "black";
    document.getElementById('ta').innerHTML = "Turn Black";
    document.getElementById('first').style.display = "";
    document.getElementById('finish').style.display = "";
}

function GamePanel()
{
    this.sz= 51;
    this.gap =2;
    this.bw = 1;   // black:1, white:-1
    this.st = new Array(); 
    this.st[0] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.st[1] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.st[2] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.st[3] = new Array(0, 0, 0, 1, -1, 0, 0, 0);
    this.st[4] = new Array(0, 0, 0, -1, 1, 0, 0, 0);
    this.st[5] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.st[6] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.st[7] = new Array(0, 0, 0, 0, 0, 0, 0, 0);
    this.n =new Array();
    return this;
}

GamePanel.prototype.mouseClick = function(event)
{
    let x_base  = mp.canvas.offsetLeft;
    let y_base  = mp.canvas.offsetTop;
    let x       = event.pageX - x_base;
    let y       = event.pageY - y_base;

    let k = new Array(-1, -1);
    for (let i1 = 0; i1 < 8; i1++) {
        if (y >= gp.gap+i1*(gp.gap+gp.sz) && y <= (i1+1)*(gp.gap+gp.sz)) {
            k[0] = i1;
            break;
        }
    }
    for (let i1 = 0; i1 < 8; i1++) {
        if (x >= gp.gap+i1*(gp.gap+gp.sz) && x <= (i1+1)*(gp.gap+gp.sz)) {
            k[1] = i1;
            break;
        }
    }
    gp.r_check(k);

    if (gp.n[8] <= 0) {
        document.getElementById('ta').style.color = "red";
        let str1 = "Turn ";
        let str2 = ", you cannot put your piece there. \n Please choose another place."
        if (gp.bw > 0)
            document.getElementById('ta').innerHTML = str1 + "Black" + str2;
        else 
            document.getElementById('ta').innerHTML = str1 + "White" + str2;
    }
    else
        gp.set(k);
}

GamePanel.prototype.r_check = function(k)
{
    let d = new Array();
    d[0] = new Array(-1, 0);
    d[1] = new Array(-1, 1);
    d[2] = new Array(0, 1);
    d[3] = new Array(1, 1);
    d[4] = new Array(1, 0);
    d[5] = new Array(1, -1);
    d[6] = new Array(0, -1);
    d[7] = new Array(-1, -1);
    gp.n[8] = 0;

    if (k[0] >= 0 && k[1] >= 0 && gp.st[k[0]][k[1]] == 0) {
        for (let i1 = 0; i1 < 8; i1++) {
            let m1   = k[0];
            let m2   = k[1];
            gp.n[i1] = 0;
            let s    = 0;
            let ct   = 0;
            while (s < 2) {
                m1 += d[i1][0];
                m2 += d[i1][1];
                if (m1 >= 0 && m1 < 8 && m2 >= 0 && m2 < 8) {
                    if (gp.st[m1][m2] == 0)
                        s = 3;
                    else if (gp.st[m1][m2] == gp.bw) {
                        if (s == 1)
                            s = 2;
                        else
                            s = 3;
                    }
                    else {
                        s = 1;
                        ct++;
                    }
                }
                else 
                s = 3;
            }
            if (s == 2){
                gp.n[8]  += ct;
                gp.n[i1]  = ct;

            }                    
        }
    }
}

GamePanel.prototype.set = function(k)
{
    gp.reverse(k);
    gp.bw = -gp.bw;
    document.getElementById('ta').style.color = "black";
    if (gp.bw > 0)
        document.getElementById('ta').innerHTML = "Turn Black";
    else 
        document.getElementById('ta').innerHTML = "Turn White";

}

GamePanel.prototype.reverse = function(k)
{
    let d = new Array();
    d[0] = new Array(-1, 0);
    d[1] = new Array(-1, 1);
    d[2] = new Array(0, 1);
    d[3] = new Array(1, 1);
    d[4] = new Array(1, 0);
    d[5] = new Array(1, -1);
    d[6] = new Array(0, -1);
    d[7] = new Array(-1, -1);
    for (let i1 = 0; i1 < 8; i1++) {
        let m1   = k[0];
        let m2   = k[1];
        for (let i2 = 0; i2 < gp.n[i1]; i2++) {
            m1 += d[i1][0];
            m2 += d[i1][1];
            gp.st[m1][m2] = gp.bw;
        }
    }
    gp.st[k[0]][k[1]] = gp.bw;
    gp.draw();
}

GamePanel.prototype.draw = function()
{
    mp.ctx.clearRect(0, 0, mp.canvas.width, mp.canvas.height);
    mp.ctx.beginPath();
    mp.ctx.fillStyle = 'black';
    mp.ctx.fillRect(0, 0, mp.canvas.width, mp.canvas.height);
    mp.ctx.fill();

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
