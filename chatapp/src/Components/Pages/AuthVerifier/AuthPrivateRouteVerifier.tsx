import * as React from 'react';
import { Navigate, Outlet, Route } from 'react-router-dom';
import { PublicRoutes } from '../../ComponentTSCode/Routes';
import AuthContext from '../../Context/AuthContext';


interface IAuthPrivateRouteVerifierProps {
}

const AuthPrivateRouteVerifier: React.FunctionComponent<IAuthPrivateRouteVerifierProps> = (props) => {
  const { authUser } = React.useContext(AuthContext);
  return (authUser != undefined? <Outlet />: <Navigate replace to={PublicRoutes.SIGNIN} />);
};

export default AuthPrivateRouteVerifier;
