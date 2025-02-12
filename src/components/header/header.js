import React, {useState} from 'react';
import { Navbar, Offcanvas } from 'react-bootstrap';
import MenuHeader from './menu-header';
import './header.css';

const Header = () => {

  const [show, setShow] = useState(false);
  const handleToggle = () => setShow(!show);

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
                    <MenuHeader handleToggle={handleToggle}/>
                </Offcanvas.Body>
            </Offcanvas>
        </div>
          
      </div>
    </div>
  )
};

export default Header;