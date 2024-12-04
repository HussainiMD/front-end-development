function getNewUniqId() {
    let units = new Uint32Array(1);
    self.crypto.getRandomValues(units);        
    return `uc${units[0]}`;
}

function delayExectionBy(secs, fn, args) {
    setTimeout((arg) => fn(arg), secs*1000, args);
}

export async function getCommentsData() {
    const response = await fetch('./comments.json');
    if(response.ok && response.status !== '404') {
        const json = await response.json();
        return json;
    } else throw new Error(`unable to fetch comments data from backend. Error details: response code = ${response.status} and response object ${response}`);
}

async function simulatedApiCall() {
    const executorFn = function (res, rej) {
        delayExectionBy(1, res);
    }
    const promise = new Promise(executorFn);
    return promise;
}

export async function addComment(parentId, user) {
    const response = await simulatedApiCall();
    const id = getNewUniqId();
    return { status: 200,
             data: {
                [id]: { parentId, user }
             }             
    }     
}

export async function updateComment(id, user) {
    const response = await simulatedApiCall();
    return {status: 200};
}

export async function deleteComment(id) {
    const response = await simulatedApiCall();
    return {status: 200};
}
