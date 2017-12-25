const canvas = document.querySelector('.picture');
const ctx = canvas.getContext('2d');

ctx.globalCompositeOperation = 'source-over';

const stack = [];

const ax = 200;
const ay = 200;
const bx = 500;
const by = 200;
const cx = 500;
const cy = 500;
const dx = 200;
const dy = 500;

const xmin = ax;
const xmax = cx;
const ymin = ay;
const ymax = cy;

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

    ctx.strokeStyle = '#aa4400';
    ctx.lineWdith = 1;
    ctx.stroke();
};


function setOutcode(point) {
    let outcode = '';

    const x = point[0];
    const y = point[1];

    if (y > ymax) {
        outcode = outcode + '1';
    } else {
        outcode = outcode + '0';
    }

    if (y < ymin) {
        outcode = outcode + '1';
    } else {
        outcode = outcode + '0';
    }

    if (x > xmax) {
        outcode = outcode + '1';
    } else {
        outcode = outcode + '0';
    }

    if (x < xmin) {
        outcode = outcode + '1';
    } else {
        outcode = outcode + '0';
    }

    return outcode;
}

function deleteLine(start, end) {
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);

    ctx.strokeStyle = '#ffffff';

    ctx.lineWidth = 2;
    ctx.stroke();
}

function findIntersection(outcode, end_points) {
    let start = end_points[0];
    let end = end_points[1];

    let x1 = start[0];
    let x2 = end[0];
    let y1 = start[1];
    let y2 = end[1];

    let intersections_list = [];
    let intersect = [0, 0];


    let m = (y2 - y1) / (x2 - x1);

    let c = y1 - m * x1;

    if (outcode.charAt(0) === '1') {
        intersect[0] = (ymax - c) / m;
        intersect[1] = ymax;

        intersections_list.push(intersect);
    }

    if (outcode.charAt(1) === '1') {
        intersect[0] = (ymin - c) / m;
        intersect[1] = ymin;

        intersections_list.push(intersect);
    }

    if (outcode.charAt(2) === '1') {
        intersect[0] = xmax;
        intersect[1] = (m * xmax + c);

        intersections_list.push(intersect);
    }

    if (outcode.charAt(3) === '1') {
        intersect[0] = xmin;
        intersect[1] = (m * xmin + c);

        intersections_list.push(intersect);
    }

    return intersections_list;
}

function clip(endPoints) {
    let start = endPoints[0];
    let end = endPoints[1];

    let o1 = setOutcode(start);
    let o2 = setOutcode(end);

    if (o1 === '0000' && o2 === '0000') {
    } else if ((o1 & o2) !== 0) {
        deleteLine(start, end);
    } else if ((o1 & o2) === 0 && o1 === '0000' || o2 === '0000') {
        let intersections = findIntersection(o1, endPoints);
        if (o1 !== '0000') {
            deleteLine(start, intersections[0]);
        } else if (o2 !== '0000') {
            deleteLine(end, intersections[0]);
        }
    } else if ((o1 & o2) === 0) {
        let intersections = findIntersection(o1, endPoints);
        deleteLine(start, intersections[0]);

        intersections = findIntersection(o2, endPoints);
        deleteLine(end, intersections[0]);
    }
}

drawLine(ax, ay, bx, by);
drawLine(bx, by, cx, cy);
drawLine(cx, cy, dx, dy);
drawLine(dx, dy, ax, ay);

drawTestLine(300, 300, 400, 400, 'ff0211');
drawTestLine(220, 100, 300, 150, 'ff0211');
drawTestLine(150, 300, 300, 280, 'ff0211');
drawTestLine(150, 250, 550, 400, 'ff0211');

document.addEventListener('keydown', event => {
    if (+event.keyCode === 39
    ) {
        let endPoints = [];
        if (stack.length > 0) {
            endPoints = stack.pop();
        }

        clip(endPoints);
    }
});
