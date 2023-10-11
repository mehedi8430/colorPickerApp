/**
 * Date: 01-10-2023
 * Author: Mehedi Hasan 
 * Description: Color picker application with huge dom functionalities
 */

// Globals
let toastContainer = null;

const defaultColor = {
    red: 221,
    green: 222,
    blue: 238,
};

const defaultPresetColors = [
    '#ffcdd2',
    '#f8bbd0',
    '#e1bee7',
    '#ff8a80',
    '#ff80ab',
    '#ea80fc',
    '#b39ddb',
    '#9fa8da',
    '#90caf9',
    '#b388ff',
    '#8c9eff',
    '#82b1ff',
    '#03a9f4',
    '#00bcd4',
    '#009688',
    '#80d8ff',
    '#84ffff',
    '#a7ffeb',
    '#c8e6c9',
    '#dcedc8',
    '#f0f4c3',
    '#b9f6ca',
    '#ccff90',
    '#ffcc80',
];

let customColors = new Array(24);

const copySound = new Audio('./copy-sound.wav');

let colorHistory = [];
let redoHistory = [];
let currentColor = defaultColor;

// onload handler
window.onload = () => {
    main();
    updateColorCodeToDom(defaultColor);

    // display preset colors

    displayColorBoxes(document.getElementById('preset-colors'), defaultPresetColors);

    const customColorsString = localStorage.getItem('custom-colors');
    if (customColorsString) {
        customColors = JSON.parse(customColorsString);
        console.log("Custom Colors:", customColors);
        displayColorBoxes(document.getElementById('custom-colors'), customColors);
    }
};

// main or boot function, this function will take care of getting all the DOM references
function main() {
    // dom references
    const generateRandomColorBtn = document.getElementById('generate-random-color');
    const colorModeHexInp = document.getElementById('input-hex');
    const colorSliderRed = document.getElementById('color-slider-red');
    const colorSliderGreen = document.getElementById('color-slider-green');
    const colorSliderBlue = document.getElementById('color-slider-blue');
    const copyToClipboardBtn = document.getElementById('copy-to-clipboard');

    const saveToCustomBtn = document.getElementById('save-to-custom');
    const presetColorsParent = document.getElementById('preset-colors');
    const customColorsParent = document.getElementById('custom-colors');

    const bgPreview = document.getElementById('bg-preview');
    const bgFileInput = document.getElementById('bg-file-input');
    const bgFileInputBtn = document.getElementById('bg-file-input-btn');
    const bgFileDeleteBtn = document.getElementById('bg-file-delete-btn');
    bgFileDeleteBtn.style.display = "none";
    const bgController = document.getElementById("bg-controller");
    bgController.style.display = "none";

    // event listeners
    generateRandomColorBtn.addEventListener('click', handleGenerateRandomColorBtn);

    colorModeHexInp.addEventListener('keyup', handleColorModeHexInp);

    colorSliderRed.addEventListener('change', handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));

    colorSliderGreen.addEventListener('change', handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));

    colorSliderBlue.addEventListener('change', handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue));

    copyToClipboardBtn.addEventListener('click', handleCopyToClipboard);

    presetColorsParent.addEventListener('click', handlePresetColorsParent);

    saveToCustomBtn.addEventListener('click', handleSaveToCustomBtn(customColorsParent, colorModeHexInp));

    bgFileInputBtn.addEventListener('click', function () {
        bgFileInput.click();
    });

    bgFileInput.addEventListener("change", handleBgFileInput(bgPreview, bgFileDeleteBtn, bgController));

    bgFileDeleteBtn.addEventListener("click", handleBgFileDeleteBtn(bgPreview, bgFileDeleteBtn, bgController, bgFileInput));

    document.getElementById("bg-size").addEventListener("change", changeBackgroundPreferences);

    document.getElementById("bg-repeat").addEventListener("change", changeBackgroundPreferences);

    document.getElementById("bg-position").addEventListener("change", changeBackgroundPreferences);

    document.getElementById("bg-attachment").addEventListener("change", changeBackgroundPreferences);

    document.getElementById('undo-button').addEventListener('click', handleUndo);

    document.getElementById('redo-button').addEventListener('click', handleRedo);
}

// event handlers
function handleGenerateRandomColorBtn() {
    const colorModeRGBInp = document.getElementById('input-rgb');
    const colorModeHexInp = document.getElementById('input-hex');

    const color = generateColorDecimal();
    updateColorCodeToDom(color);

    // adjust valid code
    colorModeHexInp.style.border = '1px solid #ff6733';
    colorModeRGBInp.style.border = '1px solid #ff6733';
}

function handleColorModeHexInp(e) {
    const hexColor = e.target.value;
    const colorModeRGBInp = document.getElementById('input-rgb');

    if (hexColor) {
        this.value = hexColor.toUpperCase();
        if (isValidHex(hexColor)) {
            const color = hexToDecimalColors(hexColor);
            updateColorCodeToDom(color);

            this.style.border = '0.5px solid #ff6733';
            colorModeRGBInp.style.border = '0.5px solid #ff6733';
        } else {
            // todo - show feedback for invalid input
            colorModeRGBInp.value = 'Please Input the Valid Color Code';
            colorModeRGBInp.style.border = '3px solid red';
            this.style.border = '3px solid red';
        }
    }
}

function handleColorSliders(colorSliderRed, colorSliderGreen, colorSliderBlue) {
    return function () {
        const color = {
            red: parseInt(colorSliderRed.value),
            green: parseInt(colorSliderGreen.value),
            blue: parseInt(colorSliderBlue.value),
        };

        updateColorCodeToDom(color);
    };
}

function handleCopyToClipboard() {
    const colorModeRadios = document.getElementsByName('color-mode');
    const mode = getCheckedValueFromRadios(colorModeRadios);

    if (mode === null) {
        throw new Error('Invalid Radio Input');
    }

    if (toastContainer !== null) {
        toastContainer.remove();
        toastContainer = null;
    }

    if (mode === 'hex') {
        const hexColor = document.getElementById('input-hex').value;
        if (hexColor && isValidHex(hexColor)) {
            navigator.clipboard.writeText(`#${hexColor}`);
            generateToastMessage(`#${hexColor} Copied`);
        } else {
            alert('Invalid Hex Code');
        }
    } else {
        const rgbColor = document.getElementById('input-rgb').value;
        if (rgbColor) {
            navigator.clipboard.writeText(rgbColor);
            generateToastMessage(`${rgbColor} Copied`);
        } else {
            alert('Invalid RGB Color');
        }
    }

    copySound.volume = 0.3;
    copySound.play();

    setTimeout(function () {
        toastContainer.remove();
    }, 4000);
}

function handlePresetColorsParent(event) {
    const child = event.target;

    if (child.className === 'color-box') {
        navigator.clipboard.writeText(child.getAttribute('data-color'));
        copySound.volume = 0.3;
        copySound.play();

        if (toastContainer !== null) {
            toastContainer.remove();
            toastContainer = null;
        }
        generateToastMessage(`${child.getAttribute('data-color')} copied`);

        setTimeout(function () {
            toastContainer.remove();
        }, 4000);
    }
}

function handleSaveToCustomBtn(customColorsParent, inputHex) {
    return function () {
        const color = `#${inputHex.value}`;

        if (customColors.includes(color)) {
            alert('Already Saved');
            return;
        }

        copySound.volume = 0.3;
        copySound.play();

        customColors.unshift(color);

        if (customColors.length > 24) {
            customColors = customColors.slice(0, 24);
        }

        localStorage.setItem('custom-colors', JSON.stringify(customColors));
        removeChildren(customColorsParent);
        displayColorBoxes(customColorsParent, customColors);
    };
}

function handleBgFileInput(bgPreview, bgFileDeleteBtn, bgController) {
    return function (event) {
        const file = event.target.files[0];
        const imgUrl = URL.createObjectURL(file);
        bgPreview.style.background = `url(${imgUrl})`;
        document.body.style.background = `url(${imgUrl})`;
        bgFileDeleteBtn.style.display = "inline";
        bgController.style.display = "block";
    };
}

function handleBgFileDeleteBtn(bgPreview, bgFileDeleteBtn, bgController, bgFileInput) {
    return function (event) {
        bgPreview.style.background = `none`;
        document.body.style.background = `none`;
        bgPreview.style.backgroundColor = `#DDDEEE`;
        document.body.style.backgroundColor = `#DDDEEE`;
        bgFileDeleteBtn.style.display = "none";
        bgFileInput.value = null;
        bgController.style.display = "none";
    };
}

function handleUndo() {
    if (colorHistory.length > 1) {
        // Remove the current color from history
        redoHistory.push(colorHistory.pop());
        const previousColor = colorHistory.pop();
        updateColorCodeToDom(previousColor);

        copySound.volume = 0.3;
        copySound.play();
    }
}

function handleRedo() {
    if (redoHistory.length > 0) {
        // Remove the current color from redo history
        const nextColor = redoHistory.pop();
        colorHistory.push(nextColor);
        updateColorCodeToDom(nextColor);

        copySound.volume = 0.3;
        copySound.play();
    }
}

// DOM functions
/**
 * Generate a dynamic DOM element to show a toast message
 * @param {string} msg
 */
function generateToastMessage(msg) {
    toastContainer = document.createElement('div');
    toastContainer.innerText = msg;
    toastContainer.className = 'toast-message toast-message-slide-in';

    toastContainer.addEventListener('click', function () {
        toastContainer.classList.remove('toast-message-slide-in');
        toastContainer.classList.add('toast-message-slide-out');

        toastContainer.addEventListener('animationend', function () {
            toastContainer.remove();
            toastContainer = null;
        });
    });

    document.body.appendChild(toastContainer);
}

/**
 * find the checked elements from a list of radio buttons
 * @param {Array} nodes
 * @returns {string | null}
 */
function getCheckedValueFromRadios(nodes) {
    let checkedValue = null;

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            checkedValue = nodes[i].value;
            break;
        }
    }
    return checkedValue;
}

/**
 * update dom elements with calculated color values
 * @param {object} color : ;
 */
function updateColorCodeToDom(color) {
    const hexColor = generateHexColor(color);
    const rgbColor = generateRGBColor(color);

    document.getElementById('color-display').style.backgroundColor = `#${hexColor}`;
    document.getElementById('input-hex').value = hexColor;
    document.getElementById('input-rgb').value = rgbColor;
    document.getElementById('color-slider-red').value = color.red;
    document.getElementById('color-slider-red-label').innerText = color.red;
    document.getElementById('color-slider-green').value = color.green;
    document.getElementById('color-slider-green-label').innerText = color.green;
    document.getElementById('color-slider-blue').value = color.blue;
    document.getElementById('color-slider-blue-label').innerText = color.blue;

    // update the current color and add it to the history
    currentColor = color;
    // Add the current color to color history
    colorHistory.push(color);
    updateButtonStates(); 
}

function addCurrentColorToColorHistory() {
    colorHistory.push(currentColor);
    updateButtonStates();
}

function updateButtonStates() {
    const undoButton = document.getElementById('undo-button');
    const redoButton = document.getElementById('redo-button');

    undoButton.disabled = colorHistory.length <= 1;
    redoButton.disabled = redoHistory.length === 0;
}

/**
 * create a div element with class name color-box and also create copy and delete button
 * @param {string} color : ;
 * @returns {object}
 */
function generateColorBox(color) {
    const div = document.createElement('div');
    div.className = 'color-box';
    div.style.backgroundColor = color;
    div.setAttribute('data-color', color);

    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerText = 'Copy';
    copyButton.addEventListener('click', function () {
        navigator.clipboard.writeText(color);

        if (toastContainer !== null) {
            toastContainer.remove();
            toastContainer = null;
        }
        generateToastMessage(`${color} Copied`);

        copySound.volume = 0.3;
        copySound.play();

        setTimeout(function () {
            toastContainer.remove();
        }, 4000);
    });

    // Create delete button
    const customColorsParent = document.getElementById('custom-colors');
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerText = 'Delete';

    deleteButton.addEventListener('click', function () {
        const index = customColors.indexOf(color);
        copySound.volume = 0.3;
        copySound.play();

        if (index !== -1) {
            customColors.splice(index, 1);
            localStorage.setItem('custom-colors', JSON.stringify(customColors));
            removeChildren(customColorsParent);
            displayColorBoxes(customColorsParent, customColors);
        }
    });

    // Hide buttons initially
    copyButton.style.display = 'none';
    deleteButton.style.display = 'none';

    // Add event listeners to show/hide buttons on hover
    div.addEventListener('mouseenter', function () {
        copyButton.style.display = 'inline';
        deleteButton.style.display = 'inline';
    });

    div.addEventListener('mouseleave', function () {
        copyButton.style.display = 'none';
        deleteButton.style.display = 'none';
    });

    // remove button for preset colors
    const presetColorsBoxes = document.querySelectorAll('#preset-colors .color-box');

    presetColorsBoxes.forEach(presetColorsBox => {
        const copyBtn = presetColorsBox.querySelector('.copy-button');
        const deleteBtn = presetColorsBox.querySelector('.delete-button');

        if (copyBtn) {
            presetColorsBox.removeChild(copyBtn);
        }

        if (deleteBtn) {
            presetColorsBox.removeChild(deleteBtn);
        }
    });

    div.appendChild(copyButton);
    div.appendChild(deleteButton);

    return div;
}

/**
 * this function will create and append new color boxes to it's parent
 * @param {object} parent
 * @param {Array} colors
 */
function displayColorBoxes(parent, colors) {
    colors.forEach((color, index) => {
        if (isValidHex(color.slice(1))) {
            const colorBox = generateColorBox(color);
            parent.appendChild(colorBox);
        } else {
            console.error(`Invalid color at index ${index}: ${color}`);
        }
    });
}

/**
 * remove all children from parent
 * @param {object} parent
 */
function removeChildren(parent) {
    let child = parent.lastElementChild;
    while (child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}

function changeBackgroundPreferences() {
    document.body.style.backgroundSize = document.getElementById("bg-size").value;
    document.body.style.backgroundRepeat = document.getElementById("bg-repeat").value;
    document.body.style.backgroundPosition = document.getElementById("bg-position").value;
    document.body.style.backgroundAttachment = document.getElementById("bg-attachment").value;
}

// Utils function

/**
 * generate and return an object of three color decimal values
 * @returns {object}}
 */
function generateColorDecimal() {
    const red = Math.floor(Math.random() * 255);
    const green = Math.floor(Math.random() * 255);
    const blue = Math.floor(Math.random() * 255);

    return {
        red,
        green,
        blue,
    };
}

/**
 * take a color object of three decimal values and return a hexadecimal color code
 * @param {object} color
 * @returns {string}
 */
function generateHexColor({ red, green, blue }) {
    const getTwoCode = (value) => {
        const hex = value.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    };

    return `${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`.toUpperCase();
}

/**
 * take a color object of three decimal values and return a rgb color code
 * @param {object} color
 * @returns {string}
 */
function generateRGBColor({ red, green, blue }) {
    return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * convert hex color to decimal colors object
 * @param {string} hex
 * @returns {object}
 */
function hexToDecimalColors(hex) {
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4), 16);

    return {
        red,
        green,
        blue,
    };
}

/**
 * validate hex color code
 * @param {string} color;
 * @returns {boolean}
 */
function isValidHex(color) {
    if (color.length !== 6) return false;
    return /^[0-9A-Fa-f]{6}$/i.test(color);
}
