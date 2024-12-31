import {useRouteError} from 'react-router-dom';

export default AppError = _ => {
    const errObj = useRouteError();
    console.dir(errObj);
    return(
        <div  className='banner'>
            <h1>OOPS!! Something went wrong</h1>
            <h4>Please check the console log of the page</h4>
            <h6>{errObj?.stack ? JSON.stringify(errObj.stack) : JSON.stringify(errObj?.error.stack)}</h6>
        </div>
    )
};
