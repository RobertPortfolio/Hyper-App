import React from 'react';
import MenuHeader from './menu-header';
import './header.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <h4 className='p-3'>HYPER-APP</h4>
            <MenuHeader />
        </aside>
    );
};

export default Sidebar;