/* USUALLY I DO NOT ADD COMMENTS BUT this SOLUTION TOOK ME 3 DAYS. There is lack of requirements created problem for me. On top of that I was NOT aware of terms boundary, sibling..etc 

sibling count means number of buttons that appear on left / right side of active blue color button. There will 2X the sibling count + active button.

boundary count means number of buttons that appear on L.H.S / R.H.S of dots or arrow (>>) buttons; as simple as that

*/



/*
Below solution is arrived based on following understanding...

1. To show the dots or arrows (>>) on L.H.S / R.H.S, this formula is used
    count of buttons > (sibling count + boundary count + 1)
2. Based on sibling count value, buttons on L.H.S/R.H.S of active button will be shown. As active buttion changes, they will also move along. (Easy way to do is, refresh button container every time event happens)
3. On either side of extreme Left, right, buttons are shown as per boundary count. After that till sibling buttons, all are hidden under dots or arrows
4. this hidden dots or arrows are referred as "jump buttons"
    Jump button formula is 
     (current Button index/value) + (2 * sibling count) + (1 * boundary count) + 2

To figure out the INITIAL setup, it TOOK a LOT of time for me....thankfully i was able to figure out.
5. Start with some default selected button, say 1st button on L.H.S
6. using #1 formula above, figure out dots or arrow buttons RANGE. Then check if active / selected button is in that range. if it is there then do NOT show dots or arrows. Instead show all those buttons using "jump buttion formula" in #4 above
6.1 first buttons are laid then selection happens.

*/


"use strict"
let jumpBtnClickShowBtnsCount = null;
let selectedBtn = 1;

function createButton(text, id) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.dataset.value = text;
    if(id) {
        btn.id = id;
        btn.dataset.value = id;
    }
    if(text === selectedBtn) btn.setAttribute('selected', '');
    return btn; 
}

/*create collection of buttons*/ 
function createButtonsFrom(list) {
    const fragment = document.createDocumentFragment();
    list.forEach(itm => {           
        fragment.append(createButton(itm));
    });
    return fragment;
}


/*CORE LOGIC function*/
function doCalc(btnsCount, sibsCount, boundCount) {    
       btnsCount = parseInt(btnsCount);
       sibsCount = parseInt(sibsCount);
       boundCount = parseInt(boundCount);

       const btnsList = Array.from({length: btnsCount}, (v, idx) => idx+1);    
       let outputList = [];

       const minBtnNeedForDots = sibsCount + boundCount + 1;
       jumpBtnClickShowBtnsCount = (2*sibsCount) + boundCount + 2;

       let isLeftDotsPossible = false, isRightDotsPossible = false;
       if(btnsList.length > 2* minBtnNeedForDots) {

        const leftDotsCheckRange = btnsList.slice(0, minBtnNeedForDots+1);
        
        if(leftDotsCheckRange.indexOf(selectedBtn) == -1) 
            isLeftDotsPossible = true;
        
        const rightDotsCheckRange = btnsList.slice(0 - minBtnNeedForDots - 1, btnsList.length);
        
        if(rightDotsCheckRange.indexOf(selectedBtn) == -1)
            isRightDotsPossible = true;

       }

       
       btnsContainer.innerHTML = '';
       const fragment = document.createDocumentFragment();
       if(!isLeftDotsPossible && !isRightDotsPossible)         
        fragment.append(createButtonsFrom(btnsList));        
       else if(!isLeftDotsPossible && isRightDotsPossible) {
        fragment.append(createButtonsFrom(btnsList.slice(0, jumpBtnClickShowBtnsCount)));        
        fragment.append(createButton('>>', 'expandRight'));                
        fragment.append(createButtonsFrom(btnsList.slice(0 - boundCount, btnsList.length)));        
       } else if(isLeftDotsPossible && !isRightDotsPossible) {
        fragment.append(createButtonsFrom(btnsList.slice(0, boundCount)));        
        fragment.append(createButton('<<', 'expandLeft'));                
        fragment.append(createButtonsFrom(btnsList.slice(0 - jumpBtnClickShowBtnsCount, btnsList.length)));        
       } else {
        fragment.append(createButtonsFrom(btnsList.slice(0, boundCount)));        
        fragment.append(createButton('<<<', 'expandLeft'));        
        let leftLimit = selectedBtn - sibsCount -1;
        leftLimit = leftLimit < 0 ? 0 : leftLimit;
        let rightLimit = selectedBtn + sibsCount;
        rightLimit = rightLimit >= btnsList.length ? btnsList.length - 1 : rightLimit;
        fragment.append(createButtonsFrom(btnsList.slice(leftLimit, rightLimit)));        
        fragment.append(createButton('>>>', 'expandRight'));        
        fragment.append(createButtonsFrom(btnsList.slice(-boundCount, btnsList.length)));        
       }
       const leftMoveBtn = createButton('<', 'moveLeft');
       if(selectedBtn === 1) leftMoveBtn.disabled = true;
       const rightMoveBtn = createButton('>', 'moveRight');
       if(selectedBtn == btnsCount) rightMoveBtn.disabled = true;

       fragment.prepend(leftMoveBtn);
       fragment.append(rightMoveBtn);

       btnsContainer.append(fragment);    
}

/* There is short cut buttons created in between buttons called >> or << buttons */
function jumpButtonsHandler(currentBtnValue, operation) {
    if(!jumpBtnClickShowBtnsCount) return;    
    const offset = operation === '+' ? currentBtnValue + jumpBtnClickShowBtnsCount : currentBtnValue - jumpBtnClickShowBtnsCount;
    selectedBtn = offset === 0 ? 1 : offset;    
}

/*main event listener*/
const btnsContainer = document.querySelector('.js-pagination');
btnsContainer.onclick = (event) => {
    if(event.target.tagName !== 'BUTTON') return;
    const btnValue = event.target.dataset.value;
    if(!btnValue) return;
    if(btnValue === 'expandLeft') 
        jumpButtonsHandler(selectedBtn, '-');
    else if(btnValue == 'expandRight')
        jumpButtonsHandler(selectedBtn, '+');
    else if(btnValue == 'moveLeft' && selectedBtn > 1) 
         selectedBtn--;                
    else if(btnValue == 'moveRight' && selectedBtn < pageCount.value) 
         selectedBtn++;
    else 
        selectedBtn = parseInt(btnValue);        
        
    doCalc(pageCount.value,siblingCount.value,boundaryCount.value);        
}


document.querySelector('.js-control-inputs').onchange = () => doCalc(pageCount.value,siblingCount.value,boundaryCount.value);

/*first drawing of buttons*/
doCalc(pageCount.value,siblingCount.value,boundaryCount.value);
