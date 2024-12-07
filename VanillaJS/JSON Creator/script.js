const utils = {};
utils.ui = {
    getJSONTreeFragment: function(isContainer = false) {        
        let detailsElem = document.createElement('details');
        if(!isContainer) detailsElem.classList.add('child');
        const summaryElem = document.createElement('summary');
        summaryElem.classList.add('entry');
        const flexElem = document.createElement('div');
        flexElem.classList.add('inline-flex');        
        const innerElems = this.getUserInputElems(!isContainer);
        flexElem.append(innerElems);
        summaryElem.append(flexElem);        
        detailsElem.append(summaryElem);        
        return detailsElem;
    },
    getUserInputElems: function(withDeleteBtn = true) {
        const fragment = document.createDocumentFragment();
        const keyElem = this.getInputElem('key');
        const valueElem = this.getInputElem('value');
        const plusBtn = this.getBtnElem('plus', '+');
        fragment.append(keyElem);
        fragment.append(valueElem);
        fragment.append(plusBtn);
        if(withDeleteBtn) {
            const deleteBtn = this.getBtnElem('delete', 'x');
            fragment.append(deleteBtn);
        }
        return fragment;
    },
    getInputElem: function(type) {
        const inputElem = document.createElement('input');
        inputElem.classList.add(type);
        inputElem.placeholder = type;
        inputElem.dataset.type = type;
        return inputElem;
    },
    getBtnElem: function(type, symbol) {
        const btnElem = document.createElement('button');
        btnElem.classList.add('btn');
        btnElem.classList.add(`btn${type}`);
        btnElem.dataset.action = type;        
        btnElem.textContent = symbol;
        return btnElem;
    },
    getDetailsOf: function(elem) {
        const key = elem.querySelector('.key').value?.trim();            
        const value = elem.querySelector('.value').value?.trim();        
        const childList = Array.from(elem.children).filter(elem => elem.classList.contains('child'));
        return {'key': key, 'value' : value, 'childList' : childList};
    }
}

function getJSONDataFrom(elem) {
    if(!elem) return {};    
    const {key, value, childList} = utils.ui.getDetailsOf(elem);
    if(!key || key.length == 0) return {}
    const result =  { [key]: {}};
    if(childList.length == 0)         
        result[key] = value
    else {
        childList.forEach(child => {
            const subResult = getJSONDataFrom(child);
            if(Object.keys(subResult).length > 0)                 
                result[key] = {...result[key], ...subResult};            
        });
    }
    return result;
}


function viewHandler(container) {
    const rootNode = utils.ui.getJSONTreeFragment(true);
    container.append(rootNode);
    container.insertAdjacentHTML('beforeend', '<button class="btn btnJson" id="btnJson" data-action="extract">Get JSON</button><output></output>');
    const addChild = function(elem) {
        if(!container.contains(elem)) return;
        const node = utils.ui.getJSONTreeFragment();
        elem.append(node);
        elem.open = true;
    }
    const removeChild = function(elem) {
        if(!container.contains(elem)) return;
        elem.remove();
    }
    return {addChild, removeChild};
}

function appController(container, uiHandlerFn) {
    const uiHandler = uiHandlerFn(container);
    container.addEventListener('click', event => {
        if(!event.target.dataset.action) return;
        const action  = event.target.dataset.action;
        if(action === 'extract') handlerExtractOper();

        const parentElem = event.target.closest('details');
        if(!parentElem) return;

        if(action === 'plus') handlePlusOper(parentElem);
        if(action === 'delete') handleDeleteOper(parentElem);        
    });

    const handlePlusOper = function(parentElem) {        
        uiHandler.addChild(parentElem);
    }

    const handleDeleteOper = function(parentElem) {
        uiHandler.removeChild(parentElem);
    } 

    const handlerExtractOper = function() {
        const elem = container.querySelector('details');
        const outputElem = container.querySelector('output');
        outputElem.textContent = JSON.stringify(getJSONDataFrom(elem));
    }
}

const containerElem = document.querySelector('.container');
appController(containerElem, viewHandler);
