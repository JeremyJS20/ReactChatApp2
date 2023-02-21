import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { PrivateRoutes } from '../../ComponentTSCode/Routes';
import AuthContext from '../../Context/AuthContext';


interface IAuthPublicRouteVerifierProps {
}

const AuthPublicRouteVerifier: React.FunctionComponent<IAuthPublicRouteVerifierProps> = (props) => {
  const { authUser } = React.useContext(AuthContext);
  return (authUser == undefined? <Outlet />: <Navigate replace to={PrivateRoutes.CHATUI} />);
};

export default AuthPublicRouteVerifier;
