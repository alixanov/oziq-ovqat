import React, { useState } from 'react'
import "./navbar.css"
import { Modal } from '../'

const Navbar = () => {
     const [isAddOpen, setIsAddOpen] = useState()

     const handleAddClick = () => {
          setIsAddOpen(true)
     }
     const handleCloseAdd = () => {
     setIsAddOpen(false)
}


     return (
<nav className='navbar'>
               <button onClick={() => (handleAddClick())}> Добавить продукт</button>
          {isAddOpen && <Modal onClose={handleCloseAdd}/>}
</nav>
  )
}

export default Navbar
