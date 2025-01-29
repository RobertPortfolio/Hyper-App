import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/slices/user-slice';

const LogoutPage = () => {
    const dispatch = useDispatch();
    const { loading, error, user } = useSelector((state) => state.user);

    const handleLogout = async () => {
        await dispatch(logoutUser());
    };

    return(
        <div>
            {user && <div>{user.username}</div> }
            <button onClick={handleLogout} className="btn btn-primary" disabled={loading}>
                {loading ? 'Logouting...' : 'Logout'}
            </button>
        </div>
        
    );
};

export { LogoutPage };
