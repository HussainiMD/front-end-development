import { EMAIL_ID } from "../utils/constants";

export default Footer = _ => (
    <footer className='container__footer flex'>
        <section className='container__footer__copy'>
            <span>@Copyright 2024</span>                    
        </section>
        <section className='container__footer__links'>
            <ul className='nav flex'>
                <li>one</li>
                <li>two</li>
                <li>three</li>
                <li>four</li>
            </ul>
        </section>
        <section className='container__footer__address'>
            <address>
                Please contact us @ <a href={'mailto:'+EMAIL_ID}>HERE</a>
            </address>
        </section>
    </footer>
);
