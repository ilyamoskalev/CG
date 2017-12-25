const canvasElem = document.createElement('canvas');
canvasElem.id = 'canvas';
canvasElem.width = 600;
canvasElem.height = 600;
canvasElem.style.margin = 'auto';
canvasElem.style.display = 'flex';

document.body.appendChild(canvasElem);

const canvas = canvasElem.getContext('2d');

const canvasX = canvasElem.width;
const canvasY = canvasElem.height;

canvasElem.strokeStyle = '#aa4400';

canvas.arc(100, 75, 50, 0, 2 * Math.PI);
canvas.stroke();

const plot = (x, y, c) => {
    if (isFinite(x) && isFinite(y)) {
        const color = {
            r: plot.color.r,
            g: plot.color.g,
            b: plot.color.b,
            a: plot.color.a * c
        };

        setPixel(x, y, color);
    }
};

function setPixel(x, y, c = 1) {
    const p = canvas.createImageData(1, 1);

    p.data[0] = c.r;
    p.data[1] = c.g;
    p.data[2] = c.b;
    p.data[3] = c.a;

    const data = canvas.getImageData(x, y, 1, 1).data;
    if (data[3] <= p.data[3]) {
        canvas.putImageData(p, x, y);
    }
}

function fill(x, y, color) {
    if (!(x >= 0 && y >= 0 &&
        x < canvasX && y < canvasY)) {
        return;
    }

    const startColor = canvas.getImageData(x, y, 1, 1).data;
    plot.color = color;
    const q = [[x, y]];
    for (let i = 0; i < q.length; ++i) {
        let x = q[i][0], y = q[i][1];
        const data = canvas.getImageData(x, y, 1, 1).data;

        if (data[0] === startColor[0] && data[1] === startColor[1] &&
            data[2] === startColor[2] && data[3] === startColor[3]) {

            plot(x, y, 1);

            const s = q.length;

            q[s] = [x + 1, y];
            q[s + 1] = [x - 1, y];
            q[s + 2] = [x, y + 1];
            q[s + 3] = [x, y - 1];
        }
    }
}

canvasElem.addEventListener('mousedown', event => {
    fill(event.pageX - canvasElem.offsetLeft, event.pageY - canvasElem.offsetTop, {r: 200, g: 100, b: 200, a: 255});
});
