import { useState } from "react";
import { GREEN_RATING_STAR, CDN_URL } from "../utils/constants";
import { useLoaderData } from 'react-router-dom';
import BtnToggle from './partials/BtnToggle';
import ItemCardCollection from "./ItemCardCollection";

export default CardDetails = _ => {     
    const data = Array.from(useLoaderData());        
    const infoData = data.filter(entry => entry?.card?.card?.info).map(entry => entry.card.card.info)[0];
    const offersDataList = data.reduce((agg, entry) => {
        if(entry?.card?.card?.gridElements?.infoWithStyle?.offers) 
            agg.push(entry.card.card.gridElements.infoWithStyle.offers);

        return agg;
    }, [])[0];
    
    const regularGroupedCards = data.reduce((acc,elem) => {
        if(elem.groupedCard?.cardGroupMap?.REGULAR?.cards)
            return elem.groupedCard.cardGroupMap.REGULAR.cards
    }, []);

        
    console.log(data, regularGroupedCards);
    const {city, name, locality, areaName, costForTwoMessage, cuisines, avgRatingString, totalRatingsString} = infoData;
        

    return (
    <section  className='details'>
        <h1>{name}</h1>
        <div className="details__card">
            <p className="details__card__head">
                <span className="icon">i</span> 
                <span>This location is outside the outlet's delivery area</span></p>
            <div className="details__card__body">
                <div className='details__card__body__rating-price'>
                        <GREEN_RATING_STAR/>                        
                        <span>{avgRatingString}</span> <span>({totalRatingsString})</span> • 
                        <span className='bold'>{costForTwoMessage}</span>
                 </div>
                 <span className='details__card__body__cusines'>{cuisines.join(', ')}</span>
                 <ul className="details__card__body__outlets">
                    <li>
                        <span>Outlet</span> 
                        <select className="details__card__body__area">
                            <option>{areaName}</option>
                        </select>
                    </li>
                    <li>
                        <span>Does not deliver</span> 
                    </li>
                 </ul>
            </div>
        </div>
        <div className="details__deals">
            <div className="details__deals__head flex">
                <h3>Deals for you</h3>
                <div className="details__deals__head__nav flex">
                    <button className="btn btn-round">&larr;</button>
                    <button className="btn btn-round">&rarr;</button>
                </div>
            </div>
            <div className="details__deals__body flex">
               {
                offersDataList.map((offerData, listIdx) =>                     
                    (<div className="card details__deals__body__card" key={offerData.info?.offerIds && offerData.info.offerIds.length > 0 ? offerData.info.offerIds[0] : listIdx}>
                        <img src={CDN_URL + "offers/deal-of-day"} alt="deal-of-day"></img>
                        <div className="details__deals__body__card__info">
                            <h2>{offerData.info.header}</h2>
                            <p>{offerData.info.description}</p>
                        </div>
                    </div>)
                )
                
               }                 
            </div>
        </div>
        <section className="details__restaurants">
             <div className="details__restaurants__header">
                <p className="menu">Menu</p>
                <section className="details__restaurants__header__search">
                    <input type="search" placeholder="Search for Dishes" />
                    <button className="btn">&#128269;</button>
                </section>
               <div className="details__restaurants__header__filters flex">
                    <BtnToggle color="green"/>
                    <BtnToggle color="red"/>
                    <button className="btn">BestSellers</button>
                    <button className="btn">GuiltFree</button>
               </div>
             </div>  
             <section className="details__restaurants__body">
                <section className="details__restaurants__body__section">
                    {
                        regularGroupedCards.map(groupedCard => {
                            const displayCard = groupedCard?.card?.card;                            
                            if(Array.isArray(displayCard?.itemCards) && displayCard.itemCards.length > 0) 
                              return  <ItemCardCollection title={displayCard.title} elemList={displayCard.itemCards} />                          
                            else if(Array.isArray(displayCard?.categories) && displayCard.categories.length > 0)  {
                                return (<>
                                    <header> {displayCard.title} </header>
                                    {displayCard.categories.map(card => {
                                        if(Array.isArray(card?.itemCards) && card.itemCards.length > 0) 
                                        return <ItemCardCollection title={card.title} elemList={card.itemCards} />
                                    })}</>
                                );
                            }
                        })
                    }                    
                </section>
             </section>
        </section>
    </section>
)};
