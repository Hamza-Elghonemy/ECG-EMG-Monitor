import React from 'react'
import 
 {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs'

function Header({OpenSidebar}) {
  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left'>
            <BsSearch  className='icon' style={{fontSize:'25px', paddingRight:'2320px'}}/>
        </div>
        <div className='header-right'>
            <BsFillBellFill  className='icon' style={{fontSize:'25px'}}/>
            <BsFillEnvelopeFill className='icon' style={{fontSize:'25px'}}/>
            <BsPersonCircle className='icon' style={{fontSize:'25px'}}/>
        </div>
    </header>
  )
}

export default Header