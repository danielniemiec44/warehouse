import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            if(location.pathname === '/') {
                navigate('/main', { replace: true });
            } else {
                navigate(location.pathname, { replace: true });
            }
        }
        setLoading(false);
    }, [dispatch, navigate, location.pathname]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return children;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
