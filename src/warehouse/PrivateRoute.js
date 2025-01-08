import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if(user) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            navigate(location.pathname, {replace: true});
        }
    }, []);

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;