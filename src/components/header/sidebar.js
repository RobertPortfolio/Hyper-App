import React from 'react';
import MenuHeader from './menu-header';
import './header.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <h5 className='mb-4'>HYPER-APP</h5>
            <MenuHeader />
        </aside>
    );
};

export default Sidebar;