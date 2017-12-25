let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.strokeRect(100, 100, 100, 100);
let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
function fill(point) {
    if (imgData[4 * (point.y * canvas.width + point.x) + 3] === 0) {
        ctx.fillRect(point.x, point.y, 1, 1);
        imgData[4 * (point.y * canvas.width + point.x) + 3] = 255;
    }
    else
        return;
    fill(new Point(point.x, point.y - 1));
    fill(new Point(point.x + 1, point.y));
    fill(new Point(point.x, point.y + 1));
    fill(new Point(point.x - 1, point.y));
}
function begin(event) {
    let p = new Point(event.clientX, event.clientY);
    fill(p);
}
canvas.addEventListener('click', begin);