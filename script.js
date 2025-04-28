const buttons = document.querySelector('.buttons');
const display = document.querySelector('.display');

let currentInput = '0';
let previousInput = '';
let operator = '';
let wasEqualsPressed = false;
let keyMap = {
    '/': '÷',
    '*': 'x',
    'x': null,
    '÷': null,
    ' ': null,
    'Enter': '=',
    'Backspace' : 'UNDO',
    'Escape' : 'CLEAR',
};

buttons.addEventListener('click', (e) => {
    const input = e.target.textContent;
    handleInput(input);
    updateDisplay();
    e.target.blur();
});

window.addEventListener('keydown', (e) => {
    if (keyMap[e.key] === null) return;
    const input = keyMap[e.key] || e.key;
    handleInput(input);
    updateDisplay();
});

function handleInput(input) {
    if (isClear(input)) return clear();

    if (isDigit(input) || isPoint(input)) return handleNumber(input);

    if (isOperator(input)) return handleOperator(input);

    if (isEquals(input)) return handleEquals();

    if (isUndo(input)) return undo();
}

function handleNumber(input) {
    if (wasEqualsPressed) {
        currentInput = '';
        wasEqualsPressed = false;
    }

    if (isPoint(input) && currentInput.includes('.')) return;
    if (currentInput.length === 15) return;
    currentInput += input;
}

function handleOperator(input) {
    if (!currentInput) {
        operator = input;
        if (!previousInput) previousInput = '0';
        return;
    }

    if (handleDivideByZero()) return;

    if (operator) previousInput = operate(operator, previousInput, currentInput);
    else previousInput = currentInput;

    operator = input;
    currentInput = '';
}

function handleEquals() {
    if (!operator || !currentInput) return;
    if (handleDivideByZero()) return;

    currentInput = operate(operator, previousInput, currentInput);
    previousInput = '';
    operator = '';
    wasEqualsPressed = true;
}

function updateDisplay() {
    cleanInputs();
    display.textContent = `${previousInput} ${operator} ${currentInput}`;
}

function clear() {
    currentInput = '0';
    previousInput = '';
    operator = '';
}

function undo() {
    if (wasEqualsPressed) return;
    currentInput = (currentInput.length > 1 || currentInput === '') ? currentInput.slice(0, -1) : '0';
}

function isOperator(input) {
    return '+-÷x'.includes(input);
}

function isEquals(input) {
    return input === '=';
}

function isClear(input) {
    return input === 'CLEAR';
}

function isDigit(input) {
    return !isNaN(+input);
}

function isPoint(input) {
    return input === '.';
}

function isUndo(input) {
    return input === 'UNDO';
}

function cleanInputs() {
    if (currentInput.startsWith('0') && isDigit(currentInput.at(1))) currentInput = currentInput.at(1);
    if (currentInput === '.') currentInput = '0.';
    if (previousInput) previousInput = `${+previousInput}`;
}

function handleDivideByZero() {
    if (operator === '÷' && +currentInput === 0) {
        alert('Cannot divide by 0.');
        return true;
    }
    return false;
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(operator, currentInput, previousInput) {
    let operation;

    switch (operator) {
        case '+':
            operation = add;
            break;
        case '-':
            operation = subtract;
            break;
        case 'x':
            operation = multiply;
            break;
        case '÷':
            operation = divide;
            break;
    }

    return `${round(operation(+currentInput, +previousInput))}`;
}

function round(num) {
    return Math.floor(num * 1000) / 1000;
}