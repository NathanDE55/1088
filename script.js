document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const lineWidthInput = document.getElementById('lineWidth');
    const lineWidthValue = document.getElementById('lineWidthValue');
    const eraserButton = document.getElementById('eraser');
    const pencilButton = document.getElementById('pencil');
    const clearButton = document.getElementById('clear');
    const saveButton = document.getElementById('save');

    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Drawing variables
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'pencil';
    let currentColor = colorPicker.value;
    let currentLineWidth = lineWidthInput.value;

    // Event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);

    // Tool settings event listeners
    colorPicker.addEventListener('input', updateColor);
    lineWidthInput.addEventListener('input', updateLineWidth);
    eraserButton.addEventListener('click', setEraser);
    pencilButton.addEventListener('click', setPencil);
    clearButton.addEventListener('click', clearCanvas);
    saveButton.addEventListener('click', saveDrawing);

    // Drawing functions
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = getPointerPosition(e);
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();

        const [x, y] = getPointerPosition(e);
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = currentTool === 'eraser' ? 'white' : currentColor;
        ctx.lineWidth = currentLineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function getPointerPosition(e) {
        if (e.type.includes('touch')) {
            const rect = canvas.getBoundingClientRect();
            return [
                e.touches[0].clientX - rect.left,
                e.touches[0].clientY - rect.top
            ];
        } else {
            return [e.offsetX, e.offsetY];
        }
    }

    function handleTouch(e) {
        e.preventDefault();
        startDrawing(e);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        draw(e);
    }

    // Tool functions
    function updateColor(e) {
        currentColor = e.target.value;
        if (currentTool === 'pencil') {
            setPencil();
        }
    }

    function updateLineWidth(e) {
        currentLineWidth = e.target.value;
        lineWidthValue.textContent = `${currentLineWidth}px`;
    }

    function setEraser() {
        currentTool = 'eraser';
        eraserButton.classList.add('active');
        pencilButton.classList.remove('active');
    }

    function setPencil() {
        currentTool = 'pencil';
        pencilButton.classList.add('active');
        eraserButton.classList.remove('active');
    }

    function clearCanvas() {
        if (confirm('Are you sure you want to clear the canvas?')) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    function saveDrawing() {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = dataURL;
        link.click();
    }
});
