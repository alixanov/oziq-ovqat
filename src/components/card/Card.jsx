import React, { useEffect, useState } from 'react';
import { Navbar, Sidebar, BarcodeModal, Modal } from '../'; // Убедитесь, что путь к BarcodeModal правильный
import "./card.css";
import axios from 'axios';
import { Notyf } from 'notyf';

const Card = () => {
  const [items, setItems] = useState([]); // State for storing data
  const [deleteState, setDeleteState] = useState(false); // Состояние для контроля обновления данных после удаления
  const [isLoading, setIsLoading] = useState(false); // Состояние для отображения загрузчика
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false); // State for barcode modal visibility
  const [selectedItem, setSelectedItem] = useState(null); // State for the selected product

  const notyf = new Notyf({
    position: {
      x: 'end',
      y: 'top',
    },
  });

  useEffect(() => {
    axios.get("https://oziq-ovqat-backend-eight.vercel.app/api/getall")
      .then(response => {
        setItems(response.data); // Save the retrieved data in state
        console.log("успешно");
        
      })
      .catch(error => {
        console.log("Ошибка", error);
      });
  }, [deleteState]); // Update when deleteState changes

  const handleDelete = (id) => {
    setIsLoading(true);
    axios.delete(`https://oziq-ovqat-backend-eight.vercel.app/api/delete/${id}`)
      .then(res => {
        setIsLoading(false);
        setDeleteState(prev => !prev);
      })
      .catch(error => {
        console.error("Ошибка при удалении продукта:", error);
        setIsLoading(false);
      });
  };

  const handleEdit = (item) => {
    setSelectedItem(item); // Set the selected item for editing
    setIsModalOpen(true); // Open the edit modal
  };

  const handleOpenBarcodeModal = (item) => {
    setSelectedItem(item); // Set the selected item for barcode display
    setIsBarcodeModalOpen(true); // Open the barcode modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the edit modal
    setSelectedItem(null); // Reset selected item
  };

  const handleCloseBarcodeModal = () => {
    setIsBarcodeModalOpen(false); // Close the barcode modal
    setSelectedItem(null); // Reset selected item
  };

  return (
    <div className='card'>
      <Navbar />
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
            {
              items.map((item, index) => (
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
                    <button className="edit-btn" onClick={() => handleEdit(item)}>✏️</button>
                    <button className="delete-btn" onClick={() => handleDelete(item._id)}>🗑️</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          product={selectedItem} // Pass the selected product to the modal
          onUpdate={() => setDeleteState(prev => !prev)} // Refresh data after update
        />
      )}
      {isBarcodeModalOpen && (
        <BarcodeModal
          onClose={handleCloseBarcodeModal}
          product={selectedItem} // Pass the selected product to the barcode modal
        />
      )}
    </div>
  );
}

export default Card;
