const canvas = document.querySelector('.picture');
const ctx = canvas.getContext('2d');

ctx.globalCompositeOperation = 'source-over';

const stack = [];
const graph = [];

const ax = 200;
const ay = 200;
const bx = 600;
const by = 300;
const cx = 500;
const cy = 500;
const dx = 200;
const dy = 500;
const ex = 100;
const ey = 300;

function scalar(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

function getNormal(line, point) {
    let delX = line.first.x - line.second.x;
    let delY = line.first.y - line.second.y;

    let n = {
        x: delX,
        y: delY
    };

    let v = {
        x: point.x - line.first.x,
        y: point.y - line.first.y
    };

    let dot = scalar(v, n);
    if (dot === 0) {
        console.log('Error - 3 collinear points along polygon\n');
        return;
    }

    if (dot < 0) {
        n.x *= -1;
        n.y *= -1;
    }

    return n;
}

function cyrcusBeck(stack, line) {
    let delX = line.first.x - line.second.x;
    let delY = line.first.y - line.second.y;

    let pointDel = {
        x: delX,
        y: delY
    };

    let boundaryPoint = stack[2];

    let tEnter = 0;
    let tLeave = 1;

    for (let i = 0; i < stack.length; ++i) {
        if (i === stack.length - 2) {
            break;
        }

        let point = stack[i];
        let point2 = stack[i + 1];

        let line2 = {
            first: point,
            second: point2
        };

        let N = getNormal(line2, boundaryPoint);

        let w = {
            x: line.first.x - point.x,
            y: line.first.y - point.y
        };

        let num = scalar(w, N);
        let den = scalar(pointDel, N);

        if (den === 0) {
            if (num < 0) {
                return;
            }

            continue;
        }

        let t = -num / den;
        if (den > 0) {
            tEnter = Math.max(tEnter, t);
        } else {
            tLeave = Math.min(tLeave, t) || tLeave;
        }

        boundaryPoint = point;
    }

    if (tEnter > tLeave) {
        return;
    }

    return {
        first: {
            x: line.first.x + delX * tEnter,
            y: line.first.y + delY * tEnter
        },
        second: {
            x: line.first.x + delX * tLeave,
            y: line.first.y + delY * tLeave
        }
    };
}

const drawLine = (x0, y0, x1, y1) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
};

const drawTestLine = (x0, y0, x1, y1, color) => {
    let start = [x0, y0];
    let end = [x1, y1];

    stack.push([start, end]);

    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);

    ctx.strokeStyle = '#226600';
    ctx.lineWdith = 1;
    ctx.stroke();
}

function deleteLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);

    ctx.strokeStyle = '#4271ff';

    ctx.lineWidth = 2;
    ctx.stroke();
}

drawLine(ax, ay, bx, by);
drawLine(bx, by, cx, cy);
drawLine(cx, cy, dx, dy);
drawLine(dx, dy, ex, ey);
drawLine(ex, ey, ax, ay);

graph.push(ax, ay);
graph.push(bx, by);
graph.push(cx, cy);
graph.push(dx, dy);
graph.push(ex, ey);

drawTestLine(220, 100, 300, 150, 'ff0211');
drawTestLine(130, 100, 400, 400, 'ff0211');
drawTestLine(150, 300, 300, 280, 'ff0211');
drawTestLine(150, 250, 550, 400, 'ff0211');

document.addEventListener('keydown', event => {
    if (+event.keyCode === 13) {
    for (let i = 0; i < stack.length; ++i) {
        let line = cyrcusBeck(graph, {
            first: {
                x: stack[i][0][0],
                y: stack[i][0][1]
            },
            second: {
                x: stack[i][1][0],
                y: stack[i][1][1]
            },
        });

        deleteLine(line.first.x, line.first.y, line.second.x, line.second.y);
    }
}
});