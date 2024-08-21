import React, { useEffect, useState } from 'react';
import './storage.css';
import axios from 'axios';

const Storage = () => {
    const [soldItems, setSoldItems] = useState([]);
    const [totalProfit, setTotalProfit] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:3005/api/sold-items")
            .then(response => {
                setSoldItems(response.data);
                const profit = response.data.reduce((sum, item) => {
                    const itemProfit = (item.sotishnarxi - item.kelgannarxi) * item.soni;
                    return sum + itemProfit;
                }, 0);
                setTotalProfit(profit);
            })
            .catch(error => {
                console.log("Ошибка при получении проданных товаров", error);
            });
    }, []);


    const addSoldItem = (newItem) => {
        const updatedSoldItems = [newItem, ...soldItems]; // Добавление нового элемента в начало массива
        setSoldItems(updatedSoldItems);
        localStorage.setItem('soldItems', JSON.stringify(updatedSoldItems));

        // Обновление общей прибыли
        const newProfit = (newItem.sotishnarxi - newItem.kelgannarxi) * newItem.soni;
        setTotalProfit(prevProfit => prevProfit + newProfit);
    };

    return (
        <div className='storage'>
            <h1>Проданные товары</h1>
            <div className="income-section">
                <h2>Общий чистый доход:<p>{totalProfit} </p>₽</h2>
            </div>
            <div className="table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Название продукта</th>
                            <th>Цена прибытия</th>
                            <th>Цена продажи</th>
                            <th>Количество</th>
                            <th>Дата продажи</th>
                        </tr>
                    </thead>
                    <tbody>
                        {soldItems.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.nomi}</td>
                                <td>{item.kelgannarxi} ₽</td>
                                <td>{item.sotishnarxi} ₽</td>
                                <td>{item.soni}</td>
                                <td>{new Date(item.saleDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Storage;
