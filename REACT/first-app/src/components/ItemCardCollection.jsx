import ItemCard from './ItemCard';

const toggleDisplay = event => {
    const elem = event.target.closest('.btn').nextElementSibling;
    elem.classList.toggle('hide');
}

export default ItemCardCollection = ({elemList, title}) => (
<section className='card__collection'>
    <button className="btn btn-toggle" onClick={toggleDisplay}>
        <div><span>{title}</span> <span>({elemList.length})</span></div> <div>^</div>
    </button>
    <div className="card__collection__body flex ">
        {   
            elemList.map(card => {
                const filteredCard = card.card;
                return <ItemCard key={filteredCard.info.id} data={filteredCard}/>
            })
        }
        
    </div>
</section>
)
