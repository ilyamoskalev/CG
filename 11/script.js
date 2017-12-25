bezier = function (t, p0, p1, p2, p3) {
    let cX = 3 * (p1.x - p0.x),
        bX = 3 * (p2.x - p1.x) - cX,
        aX = p3.x - p0.x - cX - bX;

    let cY = 3 * (p1.y - p0.y),
        bY = 3 * (p2.y - p1.y) - cY,
        aY = p3.y - p0.y - cY - bY;

    let x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
    let y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

    return {x: x, y: y};
};

(function () {
    let accuracy = 0.01,
        p0 = {x: 10, y: 10},
        p1 = {x: 50, y: 100},
        p2 = {x: 150, y: 200},
        p3 = {x: 200, y: 75},
        ctx = document.createElement('canvas').getContext('2d');

    ctx.width = 500;
    ctx.height = 500;
    document.body.appendChild(ctx.canvas);

    ctx.moveTo(p0.x, p0.y);
    for (let i = 0; i < 1; i += accuracy) {
        let p = bezier(i, p0, p1, p2, p3);
        ctx.lineTo(p.x, p.y);
    }

    ctx.stroke()
})();