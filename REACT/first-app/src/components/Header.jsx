import {LOGO_URL} from '../utils/constants';
import { Link } from 'react-router-dom';

export default Header = _ => (
    <header className='container__header flex'>
        <figure className='logo'>
            <img src={LOGO_URL} alt='logo image'></img>
        </figure>
        <ul className='nav flex'>
            <li className='nav__itm'><Link to="/">Home</Link></li>
            <li className='nav__itm'><Link to="about">About Us</Link></li>
            <li className='nav__itm'><a href="#">Contact Us</a></li>
            <li className='nav__itm'><a href="#">CART</a></li>
        </ul>
    </header>
);


