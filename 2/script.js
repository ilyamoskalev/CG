let canvas = document.getElementById('lab01');
const ctx = canvas.getContext('2d');

const PARAMS = {
    width: 200,
    height: 200,
    paintSize: 10
};

ctx.fillStyle = "#ba0019";

canvas.addEventListener('click', function (event) {
    ctx.fillStyle = "#3968ba";

    ctx.fillRect(event.offsetX, event.offsetY, PARAMS.paintSize, PARAMS.paintSize);
});

function saveTextAsFile() {

    const img = ctx.getImageData(10, 10, PARAMS.width, PARAMS.height).data;
    let text = '';

    for (let i = 3; i < img.length; i += 4) {
        console.log(img[i]);
        text += img[i] ? '1' : '0';
    }

    const textFile = new Blob([text], {type: 'text/plain'});
    const fileNameToSaveAs = "123";// document.getElementById("inputFileNameToSaveAs").value;

    const downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = 'Download File';

    if (window.webkitURL !== null) {
        downloadLink.href = window.webkitURL.createObjectURL(textFile);
    }
    else {
        downloadLink.href = window.URL.createObjectURL(textFile);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = 'none';

        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}


document.getElementById('loadbutton').addEventListener('click', function () {
    var fileToLoad = document.getElementById("fileToLoad").files[0];

    var fileReader = new FileReader();

    ctx.fillStyle = "#9eee00";

    fileReader.onload = function (fileLoadedEvent) {
        let x = 0, y = 0;
        var textFromFileLoaded = fileLoadedEvent.target.result;
        for (char in textFromFileLoaded) {
            if (textFromFileLoaded[char] == '1') {
                ctx.fillRect(10 + x, 10 + y, 10, 10);
            } else if (textFromFileLoaded[char] == '\n') {
                x = 0;
                y += 10;
                continue;
            } else {
                x += 10;
            }
        }
        document.getElementById("inputTextToSave").value = textFromFileLoaded;

    };
    fileReader.readAsText(fileToLoad, "UTF-8");
});