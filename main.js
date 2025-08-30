class Reel {
    constructor(x, y, ctx) {
        this.symbols = ["◆", "●", "■", "▲", "✦"];
        //this.symbols = ["◆", "●"];
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.v = 0;
        this.drag = 0.02;
        this.symbolSize = 80;
        this.stoppedSymbol = null;
    }

    start() {
        this.v = 50 + Math.random() * 50;
        this.stoppedSymbol = null;
    }

    update() {
        if (this.v > 0) {
            this.angle += this.v;
            this.v *= (1 - this.drag);
            if (this.v < 0.5) {
                this.v = 0;
                let index = Math.round(this.angle / this.symbolSize) % this.symbols.length;
                if (index < 0) index += this.symbols.length;
                this.stoppedSymbol = this.symbols[index];
                this.angle = index * this.symbolSize;
            }
        }
    }

    draw() {
        this.ctx.save();
        this.ctx.font = "50px Helvetica";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillStyle = "#000000";

        for (let i = -1; i <= 1; i++) {
            let index = Math.floor((this.angle / this.symbolSize) + i) % this.symbols.length;
            if (index < 0) index += this.symbols.length;
            let symbol = this.symbols[index];
            this.ctx.fillText(symbol, this.x, this.y + i * this.symbolSize);
        }

        this.ctx.restore();
    }

    getResult() {
        return this.stoppedSymbol;
    }

    isStopped() {
        return this.v === 0;
    }
}

const c = document.getElementById("c");
const ctx = c.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const balanceDisplay = document.getElementById("balance");
const resultDisplay = document.getElementById("result");

let balance = 100;
const spinCost = 5;
const winAmount = 20;
let winChecked = false;

let reels = [
    new Reel(120, 170, ctx),
    new Reel(280, 170, ctx),
    new Reel(440, 170, ctx)
];

function updateBalance() {
    balanceDisplay.textContent = "Balance: $" + balance;
}

function checkResult() {
    const results = reels.map(r => r.getResult());
    if (results.every(r => r && r === results[0])) {
        balance += winAmount;
        resultDisplay.textContent = "Match! You have won $" + winAmount;
    } else {
        resultDisplay.textContent = "No match.";
    }
    updateBalance();
}

function spin() {
    winChecked = false;
    if (balance < spinCost) {
        resultDisplay.textContent = "Not enough balance!";
        return;
    }
    balance -= spinCost;
    updateBalance();
    resultDisplay.textContent = "";
    reels.forEach(r => r.start());
}

function loop() {
    ctx.clearRect(0, 0, c.width, c.height);

    ctx.beginPath();
    ctx.moveTo(50, 160);
    ctx.lineTo(50 + 20 * Math.sqrt(3), 10 + 160);
    ctx.lineTo(50, 20 + 160);
    ctx.lineTo(50, 160);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(510, 160);
    ctx.lineTo(510 - 20 * Math.sqrt(3), 10 + 160);
    ctx.lineTo(510, 20 + 160);
    ctx.lineTo(510, 160);
    ctx.fill();

    reels.forEach(r => {
        r.update();
        r.draw();
    });

    if (reels.every(r => r.isStopped()) && reels.some(r => r.stoppedSymbol !== null) && !winChecked) {
        winChecked = true;
        checkResult();
    }

    requestAnimationFrame(loop);
}

spinBtn.addEventListener("click", spin);

updateBalance();
loop();
