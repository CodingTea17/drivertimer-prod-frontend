import React from "react";
import { NavLink } from 'react-router-dom';

function Store(props){
  return (
    <div>
      <NavLink
        to={`/stores/${props.store.store_number}`}
        activeClassName='is-active'
      >
        { `${props.store.store_number}: ${props.store.address}` }
      </NavLink>
    </div>
  );
}

export default Store;
