import { Fragment, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import CartIcon from '../../components/cart-icon/cart-icon.components';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.component';

import { UserContext } from '../../contexts/user.context';
import { CartContext } from '../../contexts/cart.context';

import { signOutUser } from '../../utils/firebase/firebase.utils';

import { ReactComponent as WreathLogo } from '../../assets/olive-wreath-small.svg';
import {
  NavigationContainer,
  LogoContainer,
  NavLinks,
  NavLink,
} from './navigation.styles';

const Navigation = () => {

  /** 当currentUser改变后，Navigation component将被重新渲染。原因见最底下详解 */
  const { currentUser/* setCurrentUser */ } = useContext(UserContext);

  // const signOutHandler = async () => {
  // await signOutUser();
  // setCurrentUser(null); // no need anymore b/c the moment a user signs out, the auth state change listener is going to catch it.
  // };

  const { isCartOpen } = useContext(CartContext);

  return (
    <Fragment> {/* 惯例写法，也可以使用<div></div>代替，但fragment不会渲染，而div会渲染一个框 */}
      <NavigationContainer>
        <LogoContainer to='/'>
          <WreathLogo />
        </LogoContainer>
        <NavLinks>
          <NavLink to='/shop'>SHOP</NavLink>

          {currentUser ? (
            <NavLink as='span' onClick={signOutUser}>
              SIGN OUT
            </NavLink>
          ) : (
            <NavLink to='/auth'>SIGN IN</NavLink>
          )}
          <CartIcon />
        </NavLinks>
        {isCartOpen && <CartDropdown />}
      </NavigationContainer>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;

/** The reason why is because useContext as a hook tells this component(Navigation):
 * whenever a value inside of this context (useContext) updates, re-render me. 
 * So what's happening here is that because we're leveraging this current user value,
 * we are saying, Oh, I want you to run my functional component again and re render
 * me because this value inside of the userContext has updated. And the reason why
 * this triggers is because of  useState being called with the setter function.
 * A component re-renders whenever it's state updates or whenever it's props changes.
 */