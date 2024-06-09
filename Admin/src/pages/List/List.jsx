import React, { useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      // Set editable state to false initially for each item
      const newList = response.data.data.map((item) => ({
        ...item,
        editable: false,
      }));
      setList(newList);
    } else {
      toast.error("Error fetching food list");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    if (response.data.success) {
      await fetchList();
      toast.success(response.data.message);
    } else {
      toast.error("Error removing food");
    }
  };

  const handleDoubleClick = (index) => {
    // Toggle editable state for the clicked item
    const newList = [...list];
    newList[index].editable = !newList[index].editable;
    setList(newList);
  };

  const handlePriceChange = (event, index) => {
    // Update price in the list state
    const newList = [...list];
    newList[index].price = event.target.value;
    setList(newList);
  };

  const savePrice = async (foodId, newPrice) => {
    const response = await axios.put(`${url}/api/food/updatePrice`, { id: foodId, price: newPrice });
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error('Error updating price');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Remove</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/image/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              {item.editable ? (
                <input
                  type="text"
                  value={item.price}
                  onChange={(event) => handlePriceChange(event, index)}
                  onBlur={() => {
                    savePrice(item._id, item.price);
                    handleDoubleClick(index); 
                  }}
                />
              ) : (
                <p onDoubleClick={() => handleDoubleClick(index)}>
                  ${item.price}
                </p>
              )}
              <p onClick={() => removeFood(item._id)} className="cursor">
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
