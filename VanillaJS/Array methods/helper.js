import {utils} from './utils.js';

const atomicUIUtils = {};
atomicUIUtils.getElem = (name, classList) => {
    if(typeof name !== 'string' || name.length === 0) return;

    const elem = document.createElement(name);
    if(Array.isArray(classList)) 
        classList.forEach(entry => elem.classList.add(entry));
    
    return elem
}

atomicUIUtils.getInputElem = (classList, placeholderTxt, elemType = 'text') => {
    const elem = atomicUIUtils.getElem('input', classList);
    if(!elem) return;

    if(placeholderTxt && name.toLowerCase() === 'input') {
        elem.type = elemType;
        elem.placeholder = placeholderTxt;
       }    
   return elem;
}

atomicUIUtils.getOptionElem = (classList, value = '', text = '') => {
    const elem = atomicUIUtils.getElem('option', classList);
    if(!elem) return;    
    elem.value = value;
    elem.textContent = text;

    return elem;
}

atomicUIUtils.getButtonElem = (classList, action, text = 'click me') => {
    const elem = atomicUIUtils.getElem('button', classList);
    if(!elem) return;
    elem.textContent = text;
    if(typeof action === 'string' && action.length > 0)
      elem.dataset.action = action;
    
    return elem;
}

const componentUIUtils = {}

componentUIUtils.getHeaderSection = function(inputSelector) {
    const sectionElem = atomicUIUtils.getElem('section');
    const inputElem = atomicUIUtils.getInputElem(['center', inputSelector], 'Please enter some value');
    sectionElem.append(inputElem);
    return sectionElem;
} 

componentUIUtils.getMapperSection = function(sectionSelector,selectSelector, selectOptions, querySelector) {
    if(!Array.isArray(selectOptions)) return;
    const sectionElem = atomicUIUtils.getElem('section', [sectionSelector]);
    const divElem = atomicUIUtils.getElem('div', ['flex', 'center']);
    const selectElem = atomicUIUtils.getElem('select', ['map__method', selectSelector]);
    selectOptions.forEach(option => {
        if(utils.isValidString(option)) {
            const txt = utils.toCameCase(option);
            const optionElem = atomicUIUtils.getOptionElem([], option, txt);
            selectElem.append(optionElem);
        }
    })    
    divElem.append(selectElem);
    const inputElem = atomicUIUtils.getInputElem([querySelector], 'enter criteria to be matched');
    divElem.append(inputElem);
    sectionElem.append(divElem);
    sectionElem.insertAdjacentHTML('beforeend', '<output class="center"></output>');
    return sectionElem;
}

componentUIUtils.getFooterSection = function() {
    const sectionElem = atomicUIUtils.getElem('section');
    const divElem = atomicUIUtils.getElem('div', ['flex', 'center']);
    let btnElem = atomicUIUtils.getButtonElem(['btn'], 'add', 'Add');
    divElem.append(btnElem);
    btnElem = atomicUIUtils.getButtonElem(['btn'], 'eval', 'Evaluate');
    divElem.append(btnElem);
    sectionElem.append(divElem);
    return sectionElem;
}

export {componentUIUtils, utils};
