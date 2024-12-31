import { CDN_URL } from "../utils/constants";
import { GREEN_RATING_STAR } from "../utils/constants";

export default ItemCard = ({data}) => {     
    
    return (
    <section className="itm__card flex">
        <div className="itm__card__info">
            <h4>{data.info.name}</h4>
            <p> 
                {
                    data.info?.finalPrice ? 
                    <><span className="light-txt cutit">${data.info.price}</span> <span className="bold-txt">${data.info.finalPrice}</span></> :
                    <><span className="bold-txt">${data.info.price}</span></>
                }                                
            </p>
            { 
                data.info.ratings.aggregatedRating.rating ? 
                 (
                        <div className='rating-section'>
                            <GREEN_RATING_STAR/>                        
                            <span className="bold-txt">{data.info.ratings.aggregatedRating.rating}</span> <span>({data.info.ratings.aggregatedRating.ratingCountV2})</span>
                        </div>
                 ) : <></>  
            }
            
            <p className="summary">
                {data.info.description}
            </p>    
        </div>
        <div className="itm__card__action flex">
            <img src={CDN_URL + data.info.imageId} alt="food image" />
            <button className="btn btn-action">ADD</button>
            <span>Customisable</span>
        </div>
    </section>
)};
