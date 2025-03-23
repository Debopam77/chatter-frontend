import React, { JSX, useContext } from 'react';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../../contexts/AuthContext';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({children}) => {
    const {isAuthenticated} = useContext(AuthContext);
    return isAuthenticated ? children: <Navigate to="/login" />;
}

export default PrivateRoute;