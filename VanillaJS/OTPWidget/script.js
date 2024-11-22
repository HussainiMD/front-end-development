"use strict"
const widgetContainerEl = document.querySelector('.js-otp-widget');

const utils = {};
utils.otpWidget = {};
utils.clipboard = {};

utils.otpWidget.isCellValid = function(cell) {
    return (cell instanceof HTMLInputElement) && (cell.parentNode === widgetContainerEl);
};
utils.otpWidget.getNewCell = function(id) {
    if(typeof id !== 'string' || id.length == 0) throw new Error(`Please provide valid Id to create widget cell`);
    const inputEl = document.createElement('input');
    inputEl.type = 'number';
    inputEl.id = id;
    return inputEl;
};
utils.otpWidget.moveToNextCell = function(cell, isFwdDirection=false) {    
    if(!utils.otpWidget.isCellValid(cell)) throw new Error(`This function is specific utility for OTP widgets`);
    let nxtCell = cell.previousElementSibling;
    if(isFwdDirection) nxtCell = cell.nextElementSibling;

    nxtCell ? nxtCell.focus() : cell.blur();    
}; 
utils.clipboard.getData = function(event) {
    try {    
        if(!event || !event.clipboardData) throw new Error('Invalid event data as clipboard is only accessible from events related to cut, copy or paste');
        const pastedData = event.clipboardData.getData('text/plain');
        const numberRegEx = /^\d+$/;
        if(!pastedData || !numberRegEx.test(pastedData)) throw new Error('Data accessed from clipboard is NOT a text');
        return pastedData;
    } catch(error) {
        console.error(error);
    }
    return null;
}

class OTPWidgetComponent {
    constructor(containerEl, charsLength) {
        if(!containerEl) throw new Error(`Please specify container element where widget will be rendered`);
        if(!Number.isFinite(charsLength) || charsLength <= 0) throw new Error(`Please specify number of character OTP will have`);
        this.containerEl = containerEl;
        this.charsLength = charsLength;
        this.initialize();
        this.enableListener();
    }
    initialize() {
        this.cellIdPrefix = 'cell-id';
        this.cellIds = [];
    }
    render() {
        const containerFrag = document.createDocumentFragment();
        for(let idx = 0; idx < this.charsLength; idx++) {
            const currentIdx = `${this.cellIdPrefix}${idx}`;
            let prevIdx = null, nextIdx = null;
            if(idx >= 0 && idx < this.charsLength -1) nextIdx = `${this.cellIdPrefix}${idx+1}`;
            if(idx > 0 && idx < this.charsLength) prevIdx = `${this.cellIdPrefix}${idx-1}`;
            const cell = utils.otpWidget.getNewCell(currentIdx, prevIdx, nextIdx);
            containerFrag.append(cell);
            this.cellIds.push(currentIdx);
        }
        this.containerEl.innerHTML = '';
        this.containerEl.append(containerFrag);
    }
    enableListener() {        

        this.containerEl.addEventListener('keyup', (event) => {
            if(event.target?.tagName !== 'INPUT') return;
            const digitRegEx = /\d{1}/;
            
            const cell = event.target;
            switch(event.key) {
                case 'ArrowLeft': utils.otpWidget.moveToNextCell(cell);
                break;
                case 'ArrowRight': utils.otpWidget.moveToNextCell(cell, true);
                break;
                case 'Backspace': utils.otpWidget.moveToNextCell(cell);
                break;
                case 'Delete': utils.otpWidget.moveToNextCell(cell, true);                    
                break;
                default: 
                    if(digitRegEx.test(event.key)) cell.value = event.key;
                    if(digitRegEx.test(cell.value)) utils.otpWidget.moveToNextCell(cell, true);                       
                    
            }
        });

        this.containerEl.addEventListener('paste', (event) => {
            if(!utils.otpWidget.isCellValid(event?.target)) return;
            event.preventDefault();
            event.stopPropagation();
            const data = utils.clipboard.getData(event);
            if(data) {                
                const dataStrArray = (new String(data)).split('');
                let currentCell = event.target;
                dataStrArray.forEach(entry => {
                    if(currentCell) {
                        currentCell.value = parseInt(entry);
                        currentCell.blur();
                        currentCell = currentCell.nextElementSibling;
                        currentCell ? currentCell.focus(): '';
                    } 
                })
            }
        });
    }
}

const otpLength = 6;
const otpWidget = new OTPWidgetComponent(widgetContainerEl, otpLength);
otpWidget.render();
