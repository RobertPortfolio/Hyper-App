import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MenuHeader = ({ handleToggle }) => {

    const { user } = useSelector((state) => state.user);

    return (
        <ul className='list-unstyled'>
            <li className='mb-3 d-flex align-items-center'>
                <i className="fa fa-dumbbell me-3 text-light icon-fixed-width"></i>
                <Link to="/current-workout" className='mobile-header-li text-light' onClick={handleToggle}>
                    Текущая тренировка
                </Link>
            </li>
            <li className='mb-3 d-flex align-items-center'>
                <i className="fa fa-book me-3 text-light icon-fixed-width"></i>
                <Link to="/mesocycles" className='mobile-header-li text-light' onClick={handleToggle}>
                    Мезоциклы
                </Link>
            </li>
            <li className='mb-3 d-flex align-items-center'>
                <i className="fa fa-drafting-compass me-3 text-light icon-fixed-width"></i>
                <Link to="/templates" className='mobile-header-li text-light' onClick={handleToggle}>
                    Шаблоны
                </Link>
            </li>
            <li className='mb-3 d-flex align-items-center'>
                <i className="fa fa-user-edit me-3 text-light icon-fixed-width"></i>
                <Link to="/custom-exercises" className='mobile-header-li text-light' onClick={handleToggle}>
                    Пользовательские упражнения
                </Link>
            </li>
            <li className='mb-3 d-flex align-items-center'>
                <i className="fa fa-plus-circle me-3 text-light icon-fixed-width"></i>
                <Link to="/plan-mesocycle" className='mobile-header-li text-light' onClick={handleToggle}>
                    Составить новый мезоцикл
                </Link>
            </li>
            {user && 
            <li className='mb-3 d-flex align-items-center'>
                <i className="fa-solid fa-right-from-bracket me-3 text-light icon-fixed-width"></i>
                <Link to="/logout" className='mobile-header-li text-light' onClick={handleToggle}>
                    Выйти
                </Link>
            </li>}
        </ul>
    )
}

export default MenuHeader;