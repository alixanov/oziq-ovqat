import React from 'react';
import { useForm } from 'react-hook-form';
import axios from "axios";
import { Notyf } from 'notyf';
import "./modal.css";

const Modal = ({ onClose, product, onUpdate }) => {
     const { register, handleSubmit, setValue } = useForm();

     const notyf = new Notyf({
          position: {
               x: 'top',
               y: 'top',
          },
     });

     React.useEffect(() => {
          if (product) {
               // Заполнение формы данными продукта при редактировании
               setValue("nomi", product.nomi);
               setValue("kelgannarxi", product.kelgannarxi);
               setValue("sotishnarxi", product.sotishnarxi);
               setValue("soni", product.soni);
               setValue("barcode", product.barcode);
          }
     }, [product, setValue]);

     const addOrUpdateData = (data) => {
          const request = product
               ? axios.put(`https://oziq-ovqat-backend-eight.vercel.app/api/update/${product._id}`, data) // Обновить, если продукт существует
               : axios.post("https://oziq-ovqat-backend-eight.vercel.app/api/add", data); // Добавить новый продукт, если нет

          request.then(response => {
               onClose(); // Закрыть модальное окно после успешного выполнения
               onUpdate(); // Обновить данные
               notyf.success(product ? 'Продукт успешно обновлен!' : 'Продукт успешно добавлен!'); // Показать уведомление
          })
               .catch(error => {
                    console.error(error);
                    notyf.error('Произошла ошибка!'); // Показать уведомление об ошибке
               });
     };

     return (
          <div className='modal'>
               <div className="modal-content">
                    <span className='close' onClick={onClose}>
                         &times;
                    </span>
                    <form onSubmit={handleSubmit(addOrUpdateData)} className='modal__form'>
                         <input type="text" placeholder='Название' {...register("nomi", { required: true })} />
                         <input type="text" placeholder='Цена прибытия' {...register("kelgannarxi", { required: true })} />
                         <input type="text" placeholder='Цена продажи' {...register("sotishnarxi", { required: true })} />
                         <input type="text" placeholder='Количество' {...register("soni", { required: true })} />
                         <input type="number" placeholder='Штрих код' {...register("barcode", { required: true })} />
                         <button type="submit">{product ? 'Обновить данные' : 'Отправить данные'}</button>
                    </form>
               </div>
          </div>
     );
}

export default Modal;
