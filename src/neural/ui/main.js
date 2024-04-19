document.addEventListener('DOMContentLoaded', function () {

    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');

    let croppedCanvas = document.getElementById('croppedCanvas');
    let croppedCtx = croppedCanvas.getContext('2d');


    // Функция для очистки холста
    const clearButton = document.getElementById('clear');
    clearButton.addEventListener('click', clearCanvas);
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        croppedCtx.clearRect(0, 0, croppedCanvas.width, croppedCanvas.height);
        let guessedDigitOutput = document.getElementById('guessedDigitOutput');
        guessedDigitOutput.innerText = null;
    }

    // Функция для рисования на холсте
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    const brushWidth = document.querySelector('input[type="range"]');
    let path = '';
    let isMouseDown = false;

    brushWidth.addEventListener('change', changeLineWidth);

    canvas.addEventListener('mousedown', beginPath);
    canvas.addEventListener('mousemove', extendPath);
    canvas.addEventListener('mouseup', endPath);
    canvas.addEventListener('mouseleave', endPath);

    function beginPath(e) {
        path = `M ${e.offsetX} ${e.offsetY} L `;
        isMouseDown = true;
    }

    function extendPath(e) {
        if (isMouseDown) {
            path += `${e.offsetX} ${e.offsetY} `;
            draw();
            path = `M ${e.offsetX} ${e.offsetY} L `;
        }
    }

    function endPath(e) {
        path += `${e.offsetX} ${e.offsetY} `;
        draw();
        path = '';
        isMouseDown = false;
        cropImage();
        performInference();
    }

    function draw() {
        ctx.stroke(new Path2D(path));
    }

    function changeLineWidth(event) {
        ctx.lineWidth = +event.target.value;
    }

    // Функция для изменения размеров изображения с холста до 50x50 пикселей (сама цифра должна быть ~35.7px)
    function cropImage() {
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let minX = canvas.width;
        let minY = canvas.height;
        let maxX = 0;
        let maxY = 0;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let alpha = imageData.data[(y * canvas.width + x) * 4 + 3];
                if (alpha > 0) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        // Обрезаем рисунок до 35.7x35.7 px и центрируем его на холсте 50x50 px
        let croppedWidth = maxX - minX + 1;
        let croppedHeight = maxY - minY + 1;
        let scaleFactor = Math.min(35.7 / croppedWidth, 35.7 / croppedHeight);
        let scaledWidth = croppedWidth * scaleFactor;
        let scaledHeight = croppedHeight * scaleFactor;
        let offsetX = (50 - scaledWidth) / 2;
        let offsetY = (50 - scaledHeight) / 2;

        croppedCtx.clearRect(0, 0, croppedCanvas.width, croppedCanvas.height);
        croppedCtx.drawImage(canvas, minX, minY, croppedWidth, croppedHeight, offsetX, offsetY, scaledWidth, scaledHeight);
    }

    // Преобразовываем изображение в одномерный массив
    function getImageDataAsArray() {
        const imageData = croppedCtx.getImageData(0, 0, croppedCanvas.width, croppedCanvas.height);
        const pixels = imageData.data;
        const pixelArray = [];

        for (let i = 3; i < pixels.length; i += 4) {
            pixelArray.push(pixels[i] / 255);
        }

        return pixelArray;
    }

    // Нейросеть
    function performInference() {
        let imageDataArray = getImageDataAsArray();

        // Загружаем параметры
        fetch('neural_params.json')
            .then(response => response.json())
            .then(data => {
                let W1 = data.W1;
                let b1 = data.b1;
                let W2 = data.W2;
                let b2 = data.b2;

                // Находим вероятности и выводим цифру с наибольшей вероятностью
                let A2 = forward_prop(W1, b1, W2, b2, imageDataArray);
                console.log(A2);
                let predictions = getPredictions(A2);
                displayPredictions(predictions);
            })

        // Для вывода цифры
        function displayPredictions(predictions) {
        let guessedDigitOutput = document.getElementById('guessedDigitOutput');
        guessedDigitOutput.innerText = predictions;
    }


    // Вспомогательные функции для прямого прохода
        function ReLU(Z) {
            return Z.map(function(x) {
                return Math.max(x, 0);
            });
        }

        function softmax(Z) {
            let expZ = Z.map(Math.exp);
            let sumExpZ = expZ.reduce((a, b) => a + b, 0);
            let A = expZ.map(z => z / sumExpZ);
            return A;
        }

        function matrixMultiplication(a, b) {
            let result = Array(a.length)
            for (let i = 0; i < a.length; i++) {
                let sum = 0;
                for (let j = 0; j < a[0].length; j++) {
                    sum += a[i][j] * b[j]
                }
                result[i] = sum;
            }
            return result;
        }

        function matrixAddition(a, b) {
            let result = Array(a.length);
            for (let i = 0; i < a.length; i++) {
                let sum = a[i] + b[i][0];
                result[i] = sum;
            }
            return result;
        }


        // Прямой проход
        function forward_prop(W1, b1, W2, b2, X) {
            let Z1 = matrixAddition(matrixMultiplication(W1, X), b1)
            let A1 = ReLU(Z1)
            let Z2 = matrixAddition(matrixMultiplication(W2, A1), b2)
            let A2 = softmax(Z2)
            console.log(A2);
            return A2;
        }

        // Функция для нахождения индекса с наибольшей вероятностью
        function getPredictions(A2) {
        let maxIndex = 0;
        let maxValue = A2[0];

        for (let i = 1; i < A2.length; i++) {
            if (A2[i] > maxValue) {
                maxIndex = i;
                maxValue = A2[i];
            }
        }
        return maxIndex;
        }
    }
});
