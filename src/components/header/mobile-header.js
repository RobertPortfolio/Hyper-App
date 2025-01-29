import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Offcanvas } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import './header.css';

const MobileHeader = () => {

    const [show, setShow] = useState(false);

    const handleToggle = () => setShow(!show);

    const { user } = useSelector((state) => state.user);

    return (
        <div className='sticky-header mobile-header bg-header px-3'>
        <div className='d-flex justify-content-between align-items-center h-55'>
            <div>HYPER-APP</div>
            <div className=''>
                <Navbar className="">
                    <button 
                        onClick={handleToggle}
                        className=''
                        style={{ zIndex: 1051 }}
                        >
                        <i className={`fa-solid ${show ? 'fa-xmark' : 'fa-bars'}`} />
                    </button>
                </Navbar>
                <Offcanvas show={show} onHide={handleToggle} placement="start" className="offcanvas-below-header bg-component">
                    <Offcanvas.Body>
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
                    </Offcanvas.Body>
                </Offcanvas>
            </div>
            
        </div>
        </div>
    )
}

export default MobileHeader;