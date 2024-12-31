import { useNavigate } from "react-router-dom";
import { GREEN_RATING_STAR, CDN_URL } from "../utils/constants";

export default Card = ({props}) =>{
   const  {id, cloudinaryImageId, costForTwo, name, avgRatingString, sla, cuisines, locality, areaName } = props.info;   
   const navigate = useNavigate();       
   const handleNavigate = _ => navigate(`/restaurant/${id}`);
   const handleKeyDown = event => {
        if(event.keyCode === 32) handleNavigate()
   };

   return  (
    <div className='card clickable' onClick={handleNavigate} onKeyDown={handleKeyDown} tabIndex={0}>                
            <div  className='card--overlay'>                
               <img src={CDN_URL+cloudinaryImageId} alt='food' />
               <span className='card--overlay__txt'>{costForTwo}</span>
            </div>
            <div className='card__footer'>
                <p className='card__dish bold'>{name}</p>
                    <div className='card__details'>
                        <GREEN_RATING_STAR/>                        
                        <span>{avgRatingString}</span> • 
                        <span className='bold'>{sla.slaString}</span>
                    </div>
                <p className='card__cusine'>{cuisines.join(', ')}</p>
                <p className='location'>{locality} - {areaName}</p>
            </div>
        </div>
)};
/*
export default Card = ({props}) => (
    <div className='card'>                            
            <div  className='card--overlay'>                
               <img src={props.info.o2FeaturedImage.url || props.info.image.url} alt='food' />
               <span className='card--overlay__txt'>{props.info?.cft.text ?? props.info?.cfo.text}</span>
            </div>
            <div className='card__footer'>
                <p className='card__dish bold'>{props.info.name}</p>
                    <div className='card__details'>
                        <GREEN_RATING_STAR/>                        
                        <span>{props.info.rating.text}</span> • 
                        <span className='bold'>{props.info.timing.text}</span>
                    </div>
                <p className='card__cusine'>{props.info.cuisine.map(entry => entry.name).join(', ')}</p>
                <p className='location'>{props.info.locality.name}</p>
            </div>
        </div>
);*/
