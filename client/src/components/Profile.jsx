
import '../styles/Profile.css';
import { FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Profile = (props) => {
    const [expanded, setExpanded] = useState(false);
    const { name, email, picture, setUserData } = props;
    const navigate = useNavigate();
    return(
        <div className='profile' >
            
            <button onClick={() => setExpanded(expanded ? false : true)}>
            {
                picture === null ?
                <FaUserCircle size="2em" color="var(--contrast-color)" /> :
                <img src={picture} alt="" className='profile__picture' />
            }
            </button>

            {   
                expanded && name !== null ?
                <div className='profile__text-container'>
                    <p>Signed in as<br /><b>{name}</b><br />{email}</p>
                    <button className='profile__logout' onClick={() => {googleLogout(); setUserData({name: null, email: null, picture: null}); navigate('/')} }>Sign out</button>
                </div> :
                null
            }
            
            
        </div>
    );
}

export default Profile;