const utils = {data:{}, network: {}, ui: {}};
utils.data.toArray = function(input) {
    if(typeof input !== 'string') throw new Error(`Invalid input ${input} provided for array conversion`);
    if(input.length == 0) return [];

    let strArray = input.split(',');
    strArray = strArray.filter(str => str.trim().length > 0);
    return strArray;
}

utils.data.filterListBy = function(suggestions, txt) {
    if(suggestions?.length == 0 || txt?.length == 0) return [];   
    txt = txt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  /* escape all special character. Suggested by chat gpt */   
    const regEx = new RegExp(`^(${txt})`, 'ig');    
    return suggestions.filter(entry => regEx.test(entry));    
}


utils.network.extractModuleFromText = async function(txt) {
    const blob = new Blob([txt], {type: 'application/javascript'});
    const url = URL.createObjectURL(blob);
    const moduleObj = await import(url); /* as import needs url, we have to create url object and that needs blob (from text) */
    URL.revokeObjectURL(url); /* to avoid memory leaks */
    return moduleObj;
}

utils.ui.createElem = function(type, classList) {
    const elem = document.createElement(type);
    if(type === 'input') elem.type = 'text';
    if(Array.isArray(classList)) {
        classList.forEach(entry => elem.classList.add(entry));
    }
    return elem;
}

utils.ui.getElemAt = (elems, idx) => {
    if(elems?.length === 0 || !Number.isFinite(idx)) return;
    return elems[idx];
}

utils.ui.addClassTo = (elems, idx, className) => {
    const elem = utils.ui.getElemAt(elems, idx);
    if(!elem || typeof className !== 'string') return;
    elem.classList.add(className);
}

utils.ui.removeClassFrom = (elems, idx, className) => {
    const elem = utils.ui.getElemAt(elems, idx);
    if(!elem || typeof className !== 'string') return;    
    elem.classList.remove(className);
}


async function dataLoader() {        
    try {
        const response = await fetch('https://api.github.com/repos/sadanandpai/frontend-mini-challenges/contents/apps/javascript/src/challenges/type-ahead/list.js', {
            'method': 'get'                   
        });
        if(!response.ok || response.status === 404) 
            throw new Error(`Something went wrong while fetching data. Status Code: ${response.status}}`);
        const json = await response.json();
        const suggestionsString = window.atob(json.content);//base64 decoding
        const {suggestionsList} = await utils.network.extractModuleFromText(suggestionsString);        
        const getSuggestionsList = () => suggestionsList;
        return {getSuggestionsList};
    } catch(err) {
        console.warn(err);        
        Object.freeze(isDataAvailable);
        err.message += '. Something went wrong while fetching data';
        throw err;
    }
    
}



function UiManager(container) {
    const fragment = document.createDocumentFragment();
    const paraElem = utils.ui.createElem('p', ['txt-center', 'padding-small']);
    paraElem.textContent = 'Use up & down arrows to navigate on suggestions';
    fragment.append(paraElem);
    const divElem = utils.ui.createElem('div', ['typeahead']);
    const typeaheadInputElem = utils.ui.createElem('input', ['typeahead__input', 'padding-small', 'js-typeahead-input']);
    divElem.append(typeaheadInputElem);
    const cancelBtnElem = utils.ui.createElem('button', ['btn', 'btn-sleek', 'btn-cancel', 'js-btn-cancel']);
    cancelBtnElem.textContent = 'X';
    divElem.append(cancelBtnElem);
    fragment.append(divElem);
    const suggestionsListElem = utils.ui.createElem('section', ['suggestions', 'js-suggestions']);
    fragment.append(suggestionsListElem);
    container.append(fragment);

    let suggestionsSize = 0;
    let currentSuggestionIdx = -1;
  

    const reset = () => {
        typeaheadInputElem.value = '';
        clearSuggestions();
        suggestionsSize = 0;
        currentSuggestionIdx = -1;
    };

    const addSuggestion = (txt) => {
        if(typeof txt !== 'string' || txt.length === 0) return;

        const suggestElem = utils.ui.createElem('div', ['suggestions__option', 'padding-small']);
        suggestElem.dataset.value = txt;
        suggestElem.textContent = txt;
        suggestionsListElem.append(suggestElem);
        suggestionsSize++;
    };

    const clearSuggestions = _ => suggestionsListElem.innerHTML = '';

    const handleDownArrowEvent = () => {
        removeSuggestionHighlight();                    
        currentSuggestionIdx++;

        if(currentSuggestionIdx >= suggestionsSize)         
            currentSuggestionIdx = 0;         
        
        addSuggestionHighlight();
        updateTypeaheadInput();        
    };

    const handleUpArrowEvent = () => {
        removeSuggestionHighlight();
        currentSuggestionIdx--;

        if(currentSuggestionIdx <= 0)
            currentSuggestionIdx = suggestionsSize - 1;
        
        addSuggestionHighlight();
        updateTypeaheadInput();
    };

    const updateTypeaheadInput = () => {
        const currentElem = utils.ui.getElemAt(suggestionsListElem.children, currentSuggestionIdx);

        if(currentElem)
            typeaheadInputElem.value = currentElem.dataset.value;
    };

    const addSuggestionHighlight = () => utils.ui.addClassTo(suggestionsListElem.children, currentSuggestionIdx, 'highlight');
    
    
    const removeSuggestionHighlight = () => utils.ui.removeClassFrom(suggestionsListElem.children, currentSuggestionIdx, 'highlight');
    

    const getTypeAheadInputElem = _ => typeaheadInputElem;
    const getCancelBtnElem = _ => cancelBtnElem;

    return {reset, addSuggestion, clearSuggestions, handleDownArrowEvent, handleUpArrowEvent, getTypeAheadInputElem, getCancelBtnElem};    
}


async function appController(container, dataHandlerFn, uiHandlerFn) {   
    try {
        const dataHandler = await dataHandlerFn();
        const uiHandler = uiHandlerFn(container);
        const suggestions = dataHandler.getSuggestionsList();        

        const typeaheadInputElem = uiHandler.getTypeAheadInputElem();
        const cancelBtnElem = uiHandler.getCancelBtnElem();
        container.addEventListener('keyup', event => {
            switch(event.key) {
                case 'ArrowUp': uiHandler.handleUpArrowEvent();
                break;
                case 'ArrowDown': uiHandler.handleDownArrowEvent();
                break;
                case 'Escape': uiHandler.reset();
            }        
        });
            
        typeaheadInputElem.onkeyup = event => {            
            const value = event.target.value;
            const filteredList = utils.data.filterListBy(suggestions, value);
            uiHandler.clearSuggestions();
            filteredList.forEach(entry => uiHandler.addSuggestion(entry));
        };

        cancelBtnElem.onclick = _ => uiHandler.reset();         
    } catch(err) {
        console.warn(err.message);
        console.warn(err.stack);
        container.innerHTML = `<h1>Encountered Error. ${err}</h1>`;
    }
}

const containerElem = document.querySelector('.container');
appController(containerElem, dataLoader, UiManager);




