import * as networkUtils from './network_utils.js';

const utils = {
    getNewDOMElement : function(type = 'div', text = '', cssClassList) {
        const elem = document.createElement(type);
        if(type === 'input') {
            elem.type = 'text';
            elem.value = text;
        } else if(type === 'button') {
            elem.textContent = text;
            elem.dataset.action = text?.toLowerCase();
        } else {
            elem.textContent = text;
        }

        if(Array.isArray(cssClassList))
            cssClassList.forEach(cssClass => elem.classList.add(cssClass));

        return elem;
    },
    addChildContainer :  function(parentElem, cssClassList) {
        const sectionElem = this.getNewDOMElement('section', '', cssClassList);
        parentElem.append(sectionElem);
        return sectionElem;
    }       
};


const CSSNAMES = {
    flexBox : 'flex-box',
    commentContainer : 'comment-container',
    existingComment: 'existing-comment',
    childContainer: 'child-container',
    newComment : 'new-comment',
    userName : 'user-name',
    userComment : 'user-comment',
    newUserName: 'new-user-name',
    newUserComment: 'new-user-comment',
    btnCancel: 'btn-cancel',
    btnPost: 'btn-post',
    btnReply: 'btn-reply',
    btnEdit: 'btn-edit',
    btnDelete: 'btn-delete',     
};


function renderHandler(CSSNAMES) {                
    const addComment = function(container, id, user) {        
        const sectionElem = utils.getNewDOMElement('section', '', [CSSNAMES.commentContainer]);
        sectionElem.dataset.commentId = id;
        const flexElem = utils.getNewDOMElement('div', '', [CSSNAMES.flexBox]);
        const figureElem = utils.getNewDOMElement('figure');
        const imgElem = utils.getNewDOMElement('img');
        imgElem.src = user.avatar;
        figureElem.append(imgElem);
        flexElem.append(figureElem);
        
        const divElem = utils.getNewDOMElement('div', '', [CSSNAMES.existingComment]);
        
        const nameElem = utils.getNewDOMElement('p', user.name, [CSSNAMES.userName]);        
        divElem.append(nameElem);

        const textElem = utils.getNewDOMElement('p', user.comment, [CSSNAMES.userComment]);                     
        divElem.append(textElem); 
      
        const actionArea = utils.getNewDOMElement();
        const replyBtn = utils.getNewDOMElement('button', 'Reply', ['btn', CSSNAMES.btnReply]);        
        actionArea.append(replyBtn);

        const editBtn = utils.getNewDOMElement('button', 'Edit', ['btn', CSSNAMES.btnEdit]);        
        actionArea.append(editBtn);

        const deleteBtn = utils.getNewDOMElement('button', 'Delete', ['btn', CSSNAMES.btnDelete]);        
        actionArea.append(deleteBtn);        

        divElem.append(actionArea);
        flexElem.append(divElem);
        sectionElem.append(flexElem);
        container.append(sectionElem);
    }
    const updateComment = function(elem, value)  {
        showExistingComment(elem);            
        const toTextElem = elem.querySelector(`.${CSSNAMES.userComment}`);
        toTextElem.textContent = value;       
    }
    const deleteComment = function(elem) {
        elem?.remove();
    }
    const editComment = function(elem) {        
        const name = elem.querySelector(`.${CSSNAMES.userName}`)?.textContent;
        const comment = elem.querySelector(`.${CSSNAMES.userComment}`)?.textContent;
        hideExistingComment(elem);
        const flexElem = elem.querySelector(`.${CSSNAMES.flexBox}`);
        addCommentForm(flexElem, {name, comment}, true);
    }    
    const cancelEditComment = function(elem) {
        removeCommentForm(elem);
        showExistingComment(elem);
    }
    const hideExistingComment = function(container) {
        const elem = container.querySelector(`.${CSSNAMES.existingComment}`);
        if(elem)
            elem.style.display = 'none';
    }
    const showExistingComment = function(container) {
        const elem = container.querySelector(`.${CSSNAMES.existingComment}`);        
        if(elem)
            elem.style.display = '';
    }
    const addCommentForm = function(container, user = {name: '', comment: ''}, isNameDisabled = false) {
        const sectionElem = utils.getNewDOMElement('div', '', [CSSNAMES.newComment]);
        const userNameElem = utils.getNewDOMElement('input','', [CSSNAMES.newUserName]);        
        userNameElem.value = user.name;
        userNameElem.disabled = isNameDisabled;
        sectionElem.append(userNameElem);

        const verbiageElem = utils.getNewDOMElement('input', '', [CSSNAMES.newUserComment]);        
        verbiageElem.value = user.comment;
        verbiageElem.rows = 3;        
        sectionElem.append(verbiageElem);
        
        const actionArea = utils.getNewDOMElement();
        const cancelBtn = utils.getNewDOMElement('button', 'Cancel', ['btn', CSSNAMES.btnCancel]);                
        actionArea.append(cancelBtn);

        const postBtn = utils.getNewDOMElement('button', 'Post', ['btn', CSSNAMES.btnPost]);                
        actionArea.append(postBtn);

        sectionElem.append(actionArea);
        container.prepend(sectionElem);
    }
    const removeCommentForm = function(container) {
        const form = container.querySelector(`.${CSSNAMES.newComment}`);
        form?.remove();        
    }    

    return {addComment, addCommentForm, removeCommentForm, updateComment, deleteComment, editComment, cancelEditComment};
}



function dataHandler() {
    const comments = {};

    const initialize = async function() {
        const json = await networkUtils.getCommentsData();
        Object.assign(comments, json);        
    }

    const addNewComment = async function(parentId, user) {      
        const response = await networkUtils.addComment(parentId, user);
        if(response.status === 200)
            Object.assign(comments, response.data);      

        return response.status === 200;
    }

    const updateComment = async function(id, user) {        
        const response = await networkUtils.updateComment(id, user);
        if(response.status === 200) 
            comments[id].user.comment = user.comment;
            
        return response.status === 200;        
    }

    const deleteComment = async function(id) {
        const response = await networkUtils.deleteComment(id);
        if(response.status === 200) 
            delete comments[id];
           
        return response.status === 200;
    }

    const getComments = () => comments;

    return {initialize, addNewComment, updateComment, deleteComment, getComments};

}


function commentsController(container, dataHandler, renderHandler, cssNames) {

    container.addEventListener('click', (event) => {
        if(!event?.target.dataset?.action) return;
        const container = event.target.closest(`.${cssNames.commentContainer}`);
        if(!container) return;
        const action = event.target.dataset.action.toLowerCase();       
        const childContainer = event.target.closest(`.${cssNames.childContainer}`);
        let isFromChild = false;
        if(childContainer && container.contains(childContainer)) isFromChild = true;

        switch(action) {
            case 'cancel': handleCancelOp(container);
            break;
            case 'post': handlePostOp(container, isFromChild);
            break;
            case 'reply': handleReplyOp(container);
            break;
            case 'edit': handleEditOp(container);
            break;
            case 'delete': handleDeleteOp(container);
            break;
            default: console.warn(`invalid action ${action} specified in event target`);
        }
    });

    const handleCancelOp = function(elem) {
        renderHandler.cancelEditComment(elem);
    }

    const handlePostOp = async function(elem, isFromChild) {
        const id = elem.dataset.commentId;
        let isSuccess = false;        
        if(!isFromChild) {
            const commentValue = elem.querySelector(`.${cssNames.newUserComment}`)?.value;
            isSuccess = await dataHandler.updateComment(id, {comment: commentValue});   
            if(isSuccess) {                                
                renderHandler.removeCommentForm(elem);
                renderHandler.updateComment(elem, commentValue);     
            }                 
        }
        else {
            const user = {
                name: elem.querySelector(`.${cssNames.newUserName}`)?.value,
                avatar: "https://i.pravatar.cc/32?u=User%"+(Math.random()*10),
                comment: elem.querySelector(`.${cssNames.newUserComment}`)?.value,
            }
            isSuccess = await dataHandler.addNewComment(id, user);
            if(isSuccess) {
                renderHandler.removeCommentForm(elem);
                const container = elem.querySelector(`.${cssNames.childContainer}`);
                renderHandler.addComment(container, id, user);
            }
        }        
               
    }

    const handleReplyOp = function(elem) {        
        let childContainer = elem.querySelector(`.${cssNames.childContainer}`);
        if(!childContainer)
            childContainer = utils.addChildContainer(elem, [cssNames.childContainer]);

        renderHandler.addCommentForm(childContainer);                
    }

    const handleEditOp = function(elem) {        
        renderHandler.editComment(elem);
    }
    
    const handleDeleteOp = async function(elem) {
        const id = elem.dataset.commentId;
        const isSuccess = await dataHandler.deleteComment(id)
        if(isSuccess)
            renderHandler.deleteComment(elem);
    }

    const initialize = async function() {
        await dataHandler.initialize();
        const comments = dataHandler.getComments();        
        const keys = Object.keys(comments);
        keys.forEach(key => {
            renderHandler.addComment(container, key, comments[key].user);
        });        
    };

    return {initialize};

}

const container = document.querySelector('main');
const dataHandlerInst = dataHandler();
const renderHandlerInst = renderHandler(CSSNAMES);
commentsController(container, dataHandlerInst, renderHandlerInst, CSSNAMES).initialize();


