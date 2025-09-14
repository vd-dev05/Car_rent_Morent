import LogoWhite from '/public/imgs/logoWhite.png'

import IconDiscord from '../../icons/footer/IconDiscord'
import IconFacebook from '../../icons/footer/IconFacebook'
import IconInstagram from '../../icons/footer/IconInstagram'
import IconLinkedIn from '../../icons/footer/IconLinkedIn'
import IconTelegram from '../../icons/footer/IconTelegram'
import IconReddit from '../../icons/footer/IconTiktok'
import IconTwitter from '../../icons/footer/IconTwitter'
import IconYoutube from '../../icons/footer/IconYoutube'

import './style.css'

const Footer = () => {
    return (
        <div className='footer'>
            <div className='top'>
                <img src={LogoWhite} alt="" />
                <p>22 Thanh Cong, Ba Dinh, Ha Noi</p>
                <p>+84 123 456 789</p>
                <p>contact@procar.com</p>
                <div className='community'>
                    <div className='item telegram'>
                        <IconTelegram />
                    </div>
                    <div className='item discord'>
                        <IconDiscord />
                    </div>
                    <div className='item twitter'>
                        <IconTwitter />
                    </div>
                    <div className='item facebook'>
                        <IconFacebook />
                    </div>
                    <div className='item linkedIn'>
                        <IconLinkedIn />
                    </div>
                    <div className='item reddit'>
                        <IconReddit />
                    </div>
                    <div className='item instagram'>
                        <IconInstagram />
                    </div>
                    <div className='item youtube'>
                        <IconYoutube />
                    </div>
                </div>
            </div>
            <div className='bottom'>Copyright ProCar © 2018. All Rights Reserved</div>
        </div>
    )
}

export default Footer