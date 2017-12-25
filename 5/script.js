let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

function BrosenhamCircle(X1, Y1, R) {
    let x = 0;
    let y = R;
    let delta = 1 - 2 * R;
    let error = 0;

    while (y >= 0) {
        c.fillStyle="#00aa00";
        c.fillRect(X1 + x, Y1 + y, 1, 1);
        c.fillRect(X1 + x, Y1 - y, 1, 1);
        c.fillRect(X1 - x, Y1 + y, 1, 1);
        c.fillRect(X1 - x, Y1 - y, 1, 1);

        error = 2 * (delta + y) - 1;
        if ((delta < 0) && (error <= 0)) {
            delta += 2 * ++x + 1;
            continue;
        }

        error = 2 * (delta - x) - 1;
        if ((delta > 0) && (error > 0)) {
            delta += 1 - 2 * --y;
            continue;
        }
        x++;
        delta += 2 * (x - y);
        y--;
    }
}

function BrosenhamLine(x1, y1, x2, y2) {
    let deltaX = Math.abs(x2 - x1);
    let deltaY = Math.abs(y2 - y1);

    let signX;
    if (x1 < x2) {
        signX = 1;
    } else {
        signX = -1;
    }

    let signY;
    if (x1 < x2) {
        signY = 1;
    } else {
        signY = -1;
    }

    let error = deltaX - deltaY;
    c.fillRect(x2, y2, 1, 1);

    while(x1 != x2 || y1 != y2) {
        c.fillStyle="#00aa00";
        c.fillRect(x1, y1, 1, 1);
        let error2 = error * 2;

        if(error2 > -deltaY) {
            error -= deltaY;
            x1 += signX;
        }

        if(error2 < deltaX) {
            error += deltaX;
            y1 += signY;
        }
    }
}

let R = 30;
let X1 = 100;
let Y1 = 100;

let X2 = 200;
let Y2 = 200;
let X3 = 400;
let Y3 = 400;

BrosenhamCircle(X1, Y1, R);
BrosenhamLine(X3, Y3, X2, Y2);
