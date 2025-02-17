import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavItem = ({ path, icon, label, onClick, isActive }) => (
    <Link to={path} className={`mobile-header-li text-light `} onClick={onClick}>
        <li className={`px-3 py-2 nav-item ${isActive ? 'bg-custom-primary' : ''}`}>
            <i className={`fa ${icon} me-3 text-light icon-fixed-width`}></i>
            {label}
        </li>
    </Link>
);

const MenuHeader = ({ handleToggle }) => {
    const { user } = useSelector((state) => state.user);
    const location = useLocation();

    const NAV_ITEMS = [
        { path: '/current-workout', icon: 'fa-dumbbell', label: 'Текущая тренировка' },
        { path: '/mesocycles', icon: 'fa-book', label: 'Тренировочные планы' },
        { path: '/templates', icon: 'fa-drafting-compass', label: 'Шаблоны' },
        { path: '/custom-exercises', icon: 'fa-user-edit', label: 'Пользовательские упражнения' },
        { path: '/plan-mesocycle', icon: 'fa-plus-circle', label: 'Новый тренировочный план' },
    ];

    return (
        <ul className='list-unstyled'>
            {NAV_ITEMS.map(item => (
                <NavItem key={item.path} {...item} onClick={handleToggle} isActive={location.pathname.startsWith(item.path)} />
            ))}
            {user && (
                <NavItem path='/logout' icon='fa-solid fa-right-from-bracket' label='Выйти' onClick={handleToggle} isActive={location.pathname === '/logout'} />
            )}
        </ul>
    );
};

export default MenuHeader;
