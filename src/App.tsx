import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import './app.css';
import Button from './Components/Button';
import { Toast, Tooltip, Modal } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

interface data {
  amount: number,
  name: string,
  price: number,
};

const App = () => {
  const [itemData, setItemData] = useState<data>({
    amount: 1,
    name: "",
    price: 0,
  });

  const [itemList, setItemList] = useState<[data?]>([]);

  const tooltipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!tooltipRef.current) return;
    const tooltip = new Tooltip(tooltipRef.current);
    return () => tooltip.dispose();
  }, [itemList.length])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setItemData({ ...itemData, [name]: value });
  };

  const handleInsertItem = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    document.getElementById("headerInserter")?.classList.add("was-validated")

    if (!e.target.checkValidity()) {
      return;
    }

    const tost = document.getElementById('addedToast')
    const toastBootstrap = Toast.getOrCreateInstance(tost)
    toastBootstrap.show()

    const newList: [data?] = [...itemList];
    newList.push({ ...itemData });

    setItemList(newList);
  };

  const handleRemove = (id: number) => {
    const newList: [data?] = [...itemList];
    newList.splice(id, 1);

    setItemList(newList);

    const tost = document.getElementById('removedToast')
    const toastBootstrap = Toast.getOrCreateInstance(tost)
    toastBootstrap.show()
  }

  const handleOpenModal = () => {
    const modalEl = document.getElementById('confirmModal');
    Modal.getOrCreateInstance(modalEl!).show();
  };

  const handleClearAll = () => {
    setItemList([]);
    Modal.getOrCreateInstance(document.getElementById('confirmModal')!).hide();
  };

  return (
    <>
      <div className="modal fade" id="confirmModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Clear list</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to clear the list, this action cannot be undone.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success" data-bs-dismiss="modal">Abort</button>
              <button type="button" className="btn btn-danger" onClick={handleClearAll}>Clear list</button>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-start flex-column w-100 w-auto" id="main">
        <form
          className={"d-inline-flex flex-wrap align-self-start p-2 justify-content-start flex-row w-100 h-auto needs-validation"}
          role="menuitem"
          onSubmit={handleInsertItem}
          noValidate={true}
          id="headerInserter"
          style={{ borderBottom: "1px solid var(--bs-tertiary-color)", background: "var(--bs-body-bg)" }}
        >
          <div className="col-md-4 w-auto h-auto flex-grow-1 m-1">
            <label htmlFor="itemName">Item Name:</label>
            <input maxLength={30} id="itemName" name="name" value={itemData.name} onChange={handleInputChange} className="form-control p-1 w-100" type="text" placeholder="Item Name" aria-label="Item Name" required={true} />
            <div className="valid-feedback">
              Looks good!
            </div>
            <div className="invalid-feedback">
              You must set the item name.
            </div>
          </div>

          <div className="col-md-4 w-auto h-auto flex-shrink-1 m-1">
            <label htmlFor="itemAmount">Amount:</label>
            <input min={"1"} maxLength={10} id="itemAmount" name="amount" onChange={handleInputChange} className="form-control p-1 w-100" type="number" placeholder="Amount" aria-label="Amount" value={itemData.amount} required={true} />
            <div className="valid-feedback">
              Looks good!
            </div>
            <div className="invalid-feedback">
              It's needed a amount.
            </div>
          </div>

          <div className="col-md-4 w-auto h-auto flex-shrink-1 m-1">
            <label htmlFor="itemPrice">Price:</label>
            <input maxLength={10} step={"0.01"} id="itemPrice" name="price" onChange={handleInputChange} value={itemData.price} className="form-control p-1 w-100" type="number" placeholder="Price" aria-label="Price" required={false} />
          </div>

          <Button className="w-auto flex-shrink-1 m-1 d-flex justify-content-center flex-row align-items-center h-auto" buttonType='primary' HtmlType="submit" outlineStyle={true}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
            Insert
          </Button>
        </form>

        {itemList.length > 0 &&
          (<table id="main-table" className="table table-striped">
            <thead>
              <tr>
                <td>#</td>
                <td>Name</td>
                <td>Amount</td>
                <td>Price</td>
                <td style={{ width: "6%" }}>
                  <button
                    className="btn"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-custom-class="custom-tooltip"
                    data-bs-title="Clear all items."
                    ref={tooltipRef}
                    onClick={handleOpenModal}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                  </button>
                </td>
              </tr>
            </thead>
            <tbody>
              {
                itemList.map((row: any, i) =>
                (
                  <tr key={i}>
                    <td key={"id"}>{i + 1}</td>
                    <td key={"name"}>{row.name}</td>
                    <td key={"amount"}>x{Number(row.amount)}</td>
                    <td key={"price"}>{row.price == 0 ? "-" : "$" + Number(row.price).toFixed(2)}</td>
                    <td style={{ "padding": "3px" }}>
                      <Button
                        buttonType='danger'
                        outlineStyle={true}
                        onClickEvent={() => {
                          handleRemove(i);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                          <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                        </svg>
                      </Button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
          )}
      </div>
    </>
  );
}

export default App;