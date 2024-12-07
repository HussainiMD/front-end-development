import { componentUIUtils as uiUtils, utils} from "./helper.js";

function dataManager(initialArrayString) {
    if(!utils.isValidString(initialArrayString)) return;
    Object.freeze(initialArrayString);

    let currentDataArray = utils.toNumsArray(initialArrayString);
    const getDataArray = () => currentDataArray;
    const setDataArray = (array) => currentDataArray = array;

    return {getDataArray, setDataArray};
}

function uiManager(container, state, selectOptions) {
    if(!container || Object.keys(state).length == 0) return;
    if(state?.header) {
        const elem = uiUtils.getHeaderSection(selectors.headerInput);
        elem.querySelector(`.${selectors.headerInput}`).value = state.header;
        container.append(elem);
    }
    
    if(Array.isArray(state.sections)) {       
        state.sections.forEach(entry => {
            const elem = uiUtils.getMapperSection(selectors.section, selectors.mapMethodSelect, selectOptions, selectors.mapQueryInput);
            const selectElem = elem.querySelector(`.${selectors.mapMethodSelect}`);
            selectElem.value = Object.keys(entry)[0];
            elem.querySelector(`.${selectors.mapQueryInput}`).value = Object.values(entry)[0];

            container.append(elem);
        });
    }
    
    if(state?.footer)
        container.append(uiUtils.getFooterSection());

    const addNewMapperSection = function() {
        const elem = uiUtils.getMapperSection(selectors.section, selectors.mapMethodSelect, selectOptions, selectors.mapQueryInput);
        const lastSectionElem  = Array.from(container.querySelectorAll(`.${selectors.section}`)).at(-1);
        lastSectionElem.after(elem);
    }

    const getCountOfMapperSections = _ => (container.querySelectorAll(`.${selectors.section}`)).length;

    const getMapperSectionInputs = position => {
        if(!Number.isFinite(position)) return;
        const elem = Array.from(container.querySelectorAll(`.${selectors.section}`)).at(position);
        if(!elem) return;
        return {
            'select': elem.querySelector(`.${selectors.mapMethodSelect}`).value,
            'query': elem.querySelector(`.${selectors.mapQueryInput}`).value
        };
    }

    const updateMapperSectionOutput = (position, txt) => {
        if(!Number.isFinite(position)) return;        
        const elem = Array.from(container.querySelectorAll(`.${selectors.section} output`)).at(position);
        if(!elem) return;
        elem.textContent = txt;
    }
    
    return {addNewMapperSection, getCountOfMapperSections, getMapperSectionInputs, updateMapperSectionOutput};

}

function doEvaluation(dataArray, method, query) {
    if(!utils.isValidString(method) || !utils.isValidString(query) || !Array.isArray(dataArray) || dataArray.length == 0) return null;
    const safeQuery = /^[a-zA-Z0-9_+\-*/%><=!\s]+$/; /* add it always to ensure base level security */
    const operatorRegEx = /\w+\s+([*+-/%><]|(==)|(===)){1}\s+\w+/ig;
    if (!safeQuery.test(query) || !operatorRegEx.test(query)) {
        console.error("Invalid query syntax");
        return null;
    }
      
    const evalFunc = new Function('value', 'index', `return ${query}`);
    switch(method) {
        case 'map': return dataArray.map(evalFunc);
        case 'filter': return dataArray.filter(evalFunc);
    }

}


function appController(container, dataManager, uiManager) {
    const initialValue = '10, 20, 30, 40, 50, 60, 70, 80';
    const mapOptions = ['map', 'filter'];
    const initialState = {
        header: initialValue, 
        sections: [
            {[mapOptions[1]] : 'index > 3'},
            {[mapOptions[0]] : 'value / 5'}
        ], 
        footer: true
    };
    const dataManagerHandle = dataManager(initialValue);
    const uiManagerHandle = uiManager(container, initialState, mapOptions);
    container.addEventListener('click', event => {
        if(!event.target.dataset?.action) return;
        const action = event.target.dataset.action;
        if(action === 'add') handleAddNewSection();   
        if(action == 'eval') doAllSectionsQueryEvaluation();     
    })

    const handleAddNewSection =  _ => uiManagerHandle.addNewMapperSection();
    const doAllSectionsQueryEvaluation = _ => {
        const sectionCount = uiManagerHandle.getCountOfMapperSections();
        let dataArray = dataManagerHandle.getDataArray();
        for(let idx = 0; idx < sectionCount; idx++) {
            const inputObj = uiManagerHandle.getMapperSectionInputs(idx);
            const result = doEvaluation(dataArray, inputObj.select, inputObj.query);            
            if(result) {
                dataArray = result;
                uiManagerHandle.updateMapperSectionOutput(idx, dataArray);
            }
        }
    }
}


const selectors = {
    section: 'map',
    headerInput: 'js-base-data-input',
    mapMethodSelect: 'js-map-method',
    mapQueryInput: 'js-map-method-query'
}

const containerElem = document.querySelector('.container');
appController(containerElem, dataManager, uiManager);

