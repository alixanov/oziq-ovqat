import React from 'react';
import Barcode from 'react-barcode'; // Импортируйте react-barcode
import "./bar-code.css";

const BarcodeModal = ({ onClose, product }) => {
     return (
          <div className='modal'>
               <div className="modal-content">
                    <span className='close' onClick={onClose}>
                         &times;
                    </span>
                    <h2>Штрих-код продукта</h2>
                    <div className="barcode-container">
                         <Barcode value={product.barcode} /> {/* Отображение QR кода */}
                         {/* <p>{product.barcode}</p> */}
                    </div>
               </div>
          </div>
     );
}

export default BarcodeModal;
