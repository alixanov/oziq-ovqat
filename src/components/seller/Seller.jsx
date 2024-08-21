import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BarcodeModal, Modal } from "../"
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css'; // for React, Vue and Svelte



const Seller = () => {
     const [items, setItems] = useState([]);
     const [selectedCounts, setSelectedCounts] = useState({});
     const [soldItems, setSoldItems] = useState([]);
     const [selectedItem, setSelectedItem] = useState(null); // State for the selected product
     const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false); // State for barcode modal visibility

     const notyf = new Notyf({
          position: {
               x: 'end',
               y: 'top',
          },
     });


     useEffect(() => {
          axios.get("http://localhost:3005/api/getall")
               .then(response => {
                    setItems(response.data);
                    console.log("Данные успешно получены");
               })
               .catch(error => {
                    console.log("Ошибка при получении данных", error);
               });
     }, []);

     const updateItemQuantityOnServer = (id, newQuantity) => {
          axios.put(`http://localhost:3005/api/update/${id}`, { soni: newQuantity })
               .then(response => {
                    console.log("Количество успешно обновлено", response.data);
               })
               .catch(error => {
                    console.log("Ошибка при обновлении количества", error);
               });
     };

     const onPlus = (id) => {
          setItems(prevItems =>
               prevItems.map(item => {
                    if (item._id === id && item.soni > 0) {
                         const updatedCount = (selectedCounts[id] || 0) + 1;
                         if (updatedCount <= item.soni) {
                              setSelectedCounts(prevCounts => ({ ...prevCounts, [id]: updatedCount }));
                              const updatedQuantity = item.soni - 1;
                              updateItemQuantityOnServer(id, updatedQuantity);
                              return { ...item, soni: updatedQuantity };
                         }
                    }
                    return item;
               })
          );
     };

     const onMinus = (id) => {
          setItems(prevItems =>
               prevItems.map(item => {
                    if (item._id === id && selectedCounts[id] > 0) {
                         const updatedCount = (selectedCounts[id] || 0) - 1;
                         setSelectedCounts(prevCounts => ({ ...prevCounts, [id]: updatedCount }));
                         const updatedQuantity = item.soni + 1;
                         updateItemQuantityOnServer(id, updatedQuantity);
                         return { ...item, soni: updatedQuantity };
                    }
                    return item;
               })
          );
     };

     const onSeller = (item) => {
          const quantity = selectedCounts[item._id] || 0;
          if (quantity > 0) {
               const soldItem = {
                    nomi: item.nomi,
                    kelgannarxi: item.kelgannarxi,
                    sotishnarxi: item.sotishnarxi,
                    soni: quantity,
                    barcode: item.barcode,
                    saleDate: new Date().toISOString(),
               };

           

               // Отправка данных о продаже на сервер
               axios.post("http://localhost:3005/api/sell", soldItem)
                    .then(response => {
                         console.log("Проданный товар успешно сохранен в базе данных", response.data);
                         notyf.success("Продукт успешно проданно")
                    })
                    .catch(error => {
                         console.log("Ошибка при сохранении проданного товара", error);
                    });

               setSoldItems(prevSoldItems => [...prevSoldItems, soldItem]);

               const updatedQuantity = item.soni - quantity;
               updateItemQuantityOnServer(item._id, updatedQuantity);

               setSelectedCounts(prevCounts => ({ ...prevCounts, [item._id]: 0 }));
          }

     };

     const handleOpenBarcodeModal = (item) => {
          setSelectedItem(item); // Set the selected item for barcode display
          setIsBarcodeModalOpen(true); // Open the barcode modal
     };
     const handleCloseBarcodeModal = () => {
          setIsBarcodeModalOpen(false); // Close the barcode modal
          setSelectedItem(null); // Reset selected item
     };


     return (
          <div className='seller'>
               <div className="table-container">
                    <table className="product-table">
                         <thead>
                              <tr>
                                   <th>#</th>
                                   <th>Название продукта</th>
                                   <th>Цена прибытия</th>
                                   <th>Цена продажи</th>
                                   <th>Количество</th>
                                   <th>Штрих код</th>
                                   <th>Действия</th>
                              </tr>
                         </thead>
                         <tbody>
                              {items.map((item, index) => (
                                   <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.nomi}</td>
                                        <td>{item.kelgannarxi}</td>
                                        <td>{item.sotishnarxi}</td>
                                        <td>{item.soni}</td>
                                        <td>
                                             <button
                                                  className='qrcode-btn'
                                                  onClick={() => handleOpenBarcodeModal(item)}
                                             >
                                                  ⬜
                                             </button>
                                        </td>
                                        <td>
                                             <button className="minus-btn" onClick={() => onMinus(item._id)}>➖</button>
                                             <button className='count-btn'>{selectedCounts[item._id] || 0}</button>
                                             <button className="plus-btn" onClick={() => onPlus(item._id)}>➕</button>
                                             <button className="seller-btn" onClick={() => onSeller(item)}>✅</button>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </div>
            
               {isBarcodeModalOpen && (
                    <BarcodeModal
                         onClose={handleCloseBarcodeModal}
                         product={selectedItem} // Pass the selected product to the barcode modal
                    />
               )}
          </div>
     );
}

export default Seller;
