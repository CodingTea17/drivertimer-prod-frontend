import React from "react";
import { NavLink } from 'react-router-dom';
import { List } from 'semantic-ui-react'

function Store(props){
  return (
    <div>
      <List.Item>
        <List.Header>
          { props.store.store_number }
        </List.Header>
        <List.Content>
          <NavLink
            to={`/stores/${props.store.store_number}`}
            activeClassName='is-active'
          >
            { props.store.address }
          </NavLink>
        </List.Content>
      </List.Item>
    </div>
  );
}

export default Store;
