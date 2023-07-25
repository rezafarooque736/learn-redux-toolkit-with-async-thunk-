import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Cart.module.css";
import { deleteAsync, updateAsync } from "./cartSlice";

export function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const handleChange = (e, id) => {
    dispatch(updateAsync({ id, change: { quantity: +e.target.value } }));
  };

  return (
    <div>
      <div>
        {items.map((item) => (
          <div className={styles.cartItem} key={item.id}>
            <img src={item.thumbnail} alt="" className={styles.imgFluid} />
            <div className={styles.description}>
              <p>{item.title}</p>
              <span>{item.brand}</span>
              <strong>${item.price}</strong>
            </div>
            <div className={styles.quantity}>
              Quantity
              <select
                value={item.quantity}
                onChange={(e) => handleChange(e, item.id)}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
            <div className={styles.close}>
              <button onClick={() => dispatch(deleteAsync(item.id))}>X</button>
            </div>
          </div>
        ))}
      </div>
      <h1>
        Total:{" "}
        {items.reduce((acc, item) => acc + item.price * item.quantity, 0)}
      </h1>
    </div>
  );
}
