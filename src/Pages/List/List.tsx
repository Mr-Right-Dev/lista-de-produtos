import React, { useEffect, useRef, useState } from 'react'
import './list.css';
import Button from '../../Components/Button';
import { Toast, Tooltip, Modal } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { useTranslation, Trans } from 'react-i18next';
import { getListIdFromQuery, nameSize } from '../../modules/ListManager';
import { db, type ItemList } from '../../modules/db';
import UnsavedChangesModal from '../../Components/UnsavedChangesModal';
import { useUnsavedChanges } from './../../modules/useUnsavedChanges';
import Loader from '../../Components/Loader';
import { openModal } from '../../modules/Utils';

export interface data {
  amount: number,
  name: string,
  price: number,
};

const List = () => {
  const { t } = useTranslation();

  const searchId = getListIdFromQuery();
  const [listName, setListName] = useState(searchId[0]);
  const [clearedLast, setClearedLast] = useState<number>(1);
  const [itemList, setItemList] = useState<[data?]>([]);
  const [editTarget, setEditTarget] = useState<number>(-1);
  const [unSavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [listId, setListId] = useState<number | undefined>(undefined);
  const [itemData, setItemData] = useState<data>({
    amount: 1,
    name: "",
    price: 0,
  });

  var dexieVersion: ItemList = {
    id: undefined,
    title: searchId[0],
    list: itemList,
    creatingDate: new Date().toISOString(),
    lastEditedDate: new Date().toISOString(),
  };

  const blocker = useUnsavedChanges(unSavedChanges);

  const usdFormatter = new Intl.NumberFormat(t("numberFormat"), {
    style: 'currency',
    currency: t("currency"),
  });

  const tooltipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!tooltipRef.current) return;
    const tooltip = new Tooltip(tooltipRef.current);
    return () => tooltip.dispose();
  }, [itemList.length]);

  useEffect(() => {
    (async () => {
      var first;
      try {
        first = await db.itemList.where('title').equals(searchId[0]).toArray();
      } catch (e) {
        const tost = document.getElementById("savedToast");
        tost.querySelector(".toast-body").innerHTML = t("toastLoadFail");
        const toastBootstrap = Toast.getOrCreateInstance(tost)
        toastBootstrap.show()
        console.error('Something went wrong:', e);
        return;
      }

      if (first.length == 0) {
        setLoadingState(false);
        return;
      }

      dexieVersion = first[0];
      setListId(dexieVersion.id as number);
      setItemList(dexieVersion.list);

      setLoadingState(false);
    })()
  }, []);

  const handleListNameSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    document.getElementById("mainForm")?.classList.add("was-validated")

    if (!e.target.checkValidity()) {
      return;
    }

    setLoadingState(true);

    dexieVersion.title = listName;
    dexieVersion.lastEditedDate = new Date().toISOString();
    dexieVersion.list = [...itemList];
    const query = new URLSearchParams(window.location.search);

    const successToast = () => {
      const tost = document.getElementById("savedToast");
      tost.querySelector(".toast-body").innerHTML = t("toastSaveSuccess");
      const toastBootstrap = Toast.getOrCreateInstance(tost)
      toastBootstrap.show()
    }

    try {
      const first = await db.itemList.where('title').equals(listName).toArray();
      if (first[0] && first[0].id != listId) {
        if (!(await openModal("overwriteModal"))) {
          setLoadingState(false);
          return;
        }

        await db.itemList.delete(first[0].id);
      }

      const newId = await db.itemList.put({
        id: listId,
        title: listName,
        list: [...itemList],
        creatingDate: dexieVersion.creatingDate || new Date().toISOString(),
        lastEditedDate: new Date().toISOString(),
      });

      setListId(newId as number);              // ← persist for next save
      setLoadingState(false);
      setUnsavedChanges(false);
      query.set("listId", listName);
      window.history.replaceState(null, '', `?${query.toString()}`);

      const tost = document.getElementById("savedToast");
      tost.querySelector(".toast-body").innerHTML = t("toastSaveSuccess");
      Toast.getOrCreateInstance(tost).show();
    } catch (e) {
      const tost = document.getElementById("savedToast");
      tost.querySelector(".toast-body").innerHTML = t("toastSaveFailed");
      Toast.getOrCreateInstance(tost).show();
      console.error('Something went wrong:', e);
      setLoadingState(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setItemData({ ...itemData, [name]: value });
    setUnsavedChanges(true);
  };

  const handleInsertItem = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    document.getElementById("headerInserter")?.classList.add("was-validated")

    if (!e.target.checkValidity()) {
      return;
    }

    const tost = document.getElementById('addedToast')

    if (editTarget == -1) {
      const newList: [data?] = [...itemList];
      newList.push({ ...itemData });

      tost.querySelector(".toast-body").innerHTML = t("toastRowInserted", { rows: 1 })
      setItemList(newList);
    } else {
      const newList: [data?] = [...itemList];
      newList[editTarget] = { ...itemData };
      setEditTarget(-1);
      tost.querySelector(".toast-body").innerHTML = t("toastRowEdited", { rows: 1 })
      setItemList(newList);
    }

    const toastBootstrap = Toast.getOrCreateInstance(tost)
    toastBootstrap.show()


    document.getElementById("itemName")?.focus();
  };

  const handleRemove = (id: number) => {
    const newList: [data?] = [...itemList];
    newList.splice(id, 1);

    if (editTarget == id) {
      setEditTarget(-1);
    }

    setItemList(newList);

    const tost = document.getElementById('removedToast')

    const toastBootstrap = Toast.getOrCreateInstance(tost)
    setClearedLast(1);
    toastBootstrap.show()
  }

  const handleOpenModal = () => {
    const modalEl = document.getElementById('confirmModal');
    Modal.getOrCreateInstance(modalEl!).show();
  };

  const handleClearAll = () => {
    const tost = document.getElementById('removedToast')
    const toastBootstrap = Toast.getOrCreateInstance(tost)
    setClearedLast(itemList.length);
    toastBootstrap.show()
    setEditTarget(-1);
    setItemList([]);
    Modal.getOrCreateInstance(document.getElementById('confirmModal')!).hide();
  };

  const handleEdit = (id: number) => {
    if (editTarget != -1) {
      const tost = document.getElementById('addedToast')

      const newList: [data?] = [...itemList];
      newList[editTarget] = { ...itemData };
      setEditTarget(-1);
      tost.querySelector(".toast-body").innerHTML = t("toastRowEdited", { rows: 1 })
      setItemList(newList);

      const toastBootstrap = Toast.getOrCreateInstance(tost)
      toastBootstrap.show()
    }

    setEditTarget(id);
    setItemData(itemList[id]);
  }

  return (
    <>
      <Loader visible={loadingState} />

      {blocker.state === 'blocked' && (
        <UnsavedChangesModal
          onLeave={() => blocker.proceed()}
          onStay={() => blocker.reset()}
        />
      )}

      <div className="modal fade" id="confirmModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{t("modalClearTitle")}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {t("modalClearBody")}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success" data-bs-dismiss="modal">{t("modalClearAbort")}</button>
              <button type="button" className="btn btn-danger" onClick={handleClearAll}>{t("modalClearConfirm")}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="overwriteModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{t("modalOverwriteTitle")}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <Trans
                  i18nKey="modalOverwriteBody"
                  components={{ br: <br /> }}
                />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success" data-bs-dismiss="modal">{t("modalOverwriteAbort")}</button>
              <button type="button" className="btn btn-danger">{t("modalOverwriteAccept")}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="addedToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <svg aria-hidden="true" className="bd-placeholder-img rounded me-2" height="20" preserveAspectRatio="xMidYMid slice" width="20" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#00ff00"></rect></svg>
            <strong className="me-auto">{t("toastTitle")}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {t("toastRowInserted", { rows: 1 })}
          </div>
        </div>
        <div id="removedToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <svg aria-hidden="true" className="bd-placeholder-img rounded me-2" height="20" preserveAspectRatio="xMidYMid slice" width="20" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ff0000"></rect></svg>
            <strong className="me-auto">{t("toastTitle")}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {t("toastRowRemoved", { rows: clearedLast })}
          </div>
        </div>
        <div id="savedToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <svg aria-hidden="true" className="bd-placeholder-img rounded me-2" height="20" preserveAspectRatio="xMidYMid slice" width="20" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ffff00"></rect></svg>
            <strong className="me-auto">{t("toastSaveLabel")}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">

          </div>
        </div>
      </div>

      <div className="d-flex justify-content-start flex-column w-100 w-auto" id="main">
        <form
          className={"d-inline-flex flex-wrap align-self-start p-2 justify-content-start flex-row w-100 h-auto needs-validation"}
          noValidate={true}
          role="menuitem"
          id="mainForm"
          style={{ borderBottom: "1px solid var(--bs-tertiary-color)", background: "var(--bs-body-bg)" }}
          onSubmit={handleListNameSubmit}
        >
          <div className="col-md-4 w-auto h-auto flex-grow-1 m-1">
            <label className="fs-4" htmlFor="itemName">{t("listNameLabel")} {unSavedChanges && (<span style={{ "fontSize": "0.6rem" }} className="badge text-bg-danger">{t("unsavedBadge")}</span>)}</label>
            <input value={listName} onChange={(e) => {
              setListName(e.target.value);
              setUnsavedChanges(true);
            }} maxLength={nameSize * 13} onFocus={(e) => e.target.select()} id="listName" name="name" className="form-control p-1 w-100" type="text" placeholder={t("listNameLabel")} aria-label={t("listNameLabel")} required={true} />
            <div className="valid-feedback">
              {t("formValid")}
            </div>
            <div className="invalid-feedback">
              {t("formNameInvalid")}
            </div>
          </div>

          <Button
            buttonType="primary"
            outlineStyle={true}
            className="h-50 align-self-end"
            HtmlType='submit'
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy-fill" viewBox="0 0 16 16">
              <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z" />
              <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z" />
            </svg>
          </Button>
        </form>
        <form
          className={"d-inline-flex flex-wrap align-self-start p-2 justify-content-start flex-row w-100 h-auto needs-validation " + (editTarget != -1 && "edit-mode")}
          role="menuitem"
          onSubmit={handleInsertItem}
          noValidate={true}
          id="headerInserter"
          style={{ borderBottom: "1px solid var(--bs-tertiary-color)", background: "var(--bs-body-bg)" }}
        >
          <div className="col-md-4 w-auto h-auto flex-grow-1 m-1">
            <label htmlFor="itemName">{t("formNameLabel")}</label>
            <input maxLength={50} onFocus={(e) => e.target.select()} id="itemName" name="name" value={itemData.name} onChange={handleInputChange} className="form-control p-1 w-100" type="text" placeholder={t("formNameLabel")} aria-label={t("formNameLabel")} required={true} />
            <div className="valid-feedback">
              {t("formValid")}
            </div>
            <div className="invalid-feedback">
              {t("formNameInvalid")}
            </div>
          </div>

          <div className="col-md-4 w-auto h-auto flex-shrink-1 m-1">
            <label htmlFor="itemAmount">{t("formAmountLabel")}</label>
            <input min={"1"} maxLength={10} id="itemAmount" name="amount" onChange={handleInputChange} className="form-control p-1 w-100" type="number" placeholder={t("formAmountLabel")} aria-label={t("formAmountLabel")} value={itemData.amount} required={true} />
            <div className="valid-feedback">
              {t("formValid")}
            </div>
            <div className="invalid-feedback">
              {t("formAmountInvalid")}
            </div>
          </div>

          <div className="col-md-4 w-auto h-auto flex-shrink-1 m-1">
            <label htmlFor="itemPrice">{t("formPriceLabel")}</label>
            <input maxLength={10} step={"0.01"} id="itemPrice" name="price" onChange={handleInputChange} value={itemData.price} className="form-control p-1 w-100" type="number" placeholder={t("formPriceLabel")} aria-label={t("formPriceLabel")} required={false} />
          </div>

          <Button className="w-auto flex-shrink-1 m-1 d-flex justify-content-center flex-row align-items-center h-auto" buttonType='primary' HtmlType="submit" outlineStyle={true}>
            {
              editTarget == -1 ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                  </svg>
                  {t("formInsertLabel")}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                  </svg>
                  {t("formEditLabel")}
                </>
              )
            }
          </Button>
        </form>

        <div style={{ "overflow": "auto" }}>{itemList.length > 0 &&
          (<table id="main-table" className="table table-striped">
            <thead>
              <tr>
                <td>#</td>
                <td style={{ "maxWidth": "100px" }}>{t("formNameLabel")}</td>
                <td style={{ "maxWidth": "100px" }}>{t("formAmountLabel")}</td>
                <td style={{ "maxWidth": "100px" }}>{t("formPriceLabel")}</td>
                <td style={{ width: "10%" }}>
                  <button
                    className="btn"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    data-bs-custom-class="custom-tooltip"
                    data-bs-title={t("clearItemsTooltip")}
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
                  <tr key={i} className={(editTarget == i ? ("edit-mode") : "")}>
                    <td key={"id"}>{i + 1}</td>
                    <td style={{ "maxWidth": "100px" }} key={"name"}>{row.name}</td>
                    <td style={{ "maxWidth": "100px" }} key={"amount"}>x{Number(row.amount)}</td>
                    <td style={{ "maxWidth": "100px" }} key={"price"}>{row.price == 0 ? "-" : usdFormatter.format(Number(row.price))}</td>
                    <td style={{ "padding": "3px" }}>
                      <Button
                        buttonType='primary'
                        outlineStyle={true}
                        className="m-1"
                        onClickEvent={() => {
                          handleEdit(i);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>
                      </Button>
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
          )}</div>
      </div>
    </>
  );
}

export default List;