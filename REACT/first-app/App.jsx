/*
Header
 - logo
 - nav items
Body
 - search
 - Restaurant Container
    - Restaurant Card
Footer
 - copy right
 - links
 - address
 - contact

*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, useLoaderData } from "react-router-dom"; 

import Header from './components/Header';
import Main from './components/Main'
import CardDetails from './components/CardDetails';
import Footer from './components/Footer';
import AppError from './components/AppError';
import {getRestaturantList, getRestaturantDetails} from './utils/dataFetcher';

const AppContainer = _ => (       
        <>
            <Header />
            <Outlet />          
            <Footer />
        </> 
    );


const appRouter = createBrowserRouter([        
    {
        path: '/', 
        element: <AppContainer />, // default page        
        errorElement: <><Header /><AppError /><Footer /></>,         
        children: [
            {
                path: 'restaurant/:resId',
                element: <CardDetails />,
                loader: getRestaturantDetails
            },
            {
                path: 'about', 
                element: <h1 className='banner'>about us page</h1> 
            },
            {
                path: '/', 
                element: <Main />,               
                loader: getRestaturantList, 
                index: true //optional but written to capture example. we can define any route as default
            }            
        ]
    }
])

const containerElem = document.querySelector('.app');
const rootApp = ReactDOM.createRoot(containerElem);
rootApp.render(<RouterProvider router={appRouter} />);

