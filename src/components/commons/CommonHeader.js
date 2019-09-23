import React from 'react';
import { NavLink } from 'react-router-dom';
import './CommonHeader.css';
import { Header, Menu } from 'semantic-ui-react';

const CommonHeader = () => {
  return (
    <div>
      <div>
        <Header as='h3' textAlign='center' color="blue" block>
          Granble Fantasy SupportApp!
        </Header>
      </div>
      <div>
        <Menu pointing secondary>
          {/* <Menu.Item name="Quest" as={NavLink} to='/Quest'>
          </Menu.Item> */}
          <Menu.Item name="Statistics" as={NavLink} to='/Stat'>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default CommonHeader;