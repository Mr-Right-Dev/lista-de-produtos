import { useEffect, useState } from 'react'
import './home.css'
import Button from '../../Components/Button'
import { useTranslation } from 'react-i18next'
import { db, type ItemList } from '../../modules/db'
import Loader from '../../Components/Loader'
import { Toast } from 'bootstrap';
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const [lists, setLists] = useState<ItemList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const queryList = async () => {
    setLoading(true);

    try {
      const data = await db.itemList.toArray();

      setLists(data);
    } catch (e) {
      console.log(e);
      const tost = document.getElementById("loadFail");
      const toastBootstrap = Toast.getOrCreateInstance(tost!)
      toastBootstrap.show()
    }

    setLoading(false);
  };

  useEffect(() => {
    queryList();
  }, []);

  const handleRemove = async (id: number) => {
    await db.itemList.delete(id as number);

    queryList();
  }

  const handleClick = (title: string) => {
    const query = new URLSearchParams();
    query.set("listId", title);

    navigate(`/list?${query.toString()}`);
  }

  return (
    <>
      <Loader visible={loading} />

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="loadFail" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <svg aria-hidden="true" className="bd-placeholder-img rounded me-2" height="20" preserveAspectRatio="xMidYMid slice" width="20" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#ff0000"></rect></svg>
            <strong className="me-auto">{t("toastTitle")}</strong>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {t("toastLoadFail")}
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-start flex-column w-100 w-auto" id="main">
        <div className="d-flex justify-content-start flex-row w-100 h-auto p-1" style={{ borderBottom: "1px solid var(--bs-tertiary-color)", background: "var(--bs-body-bg)" }}>
          <Button
            buttonType="primary"
            outlineStyle={true}
            onClickEvent={() => {
              window.location.href = "/list"
            }}
            className="d-flex justify-content-center align-items-center justify-items-center m-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
            {t("newListButton")}
          </Button>

          <Button
            buttonType="secondary"
            outlineStyle={true}
            onClickEvent={queryList}
            className="d-flex justify-content-center align-items-center justify-items-center m-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
            </svg>
          </Button>
        </div>

        {
          lists.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <td style={{ "maxWidth": "100px" }}>{t("listNameLabel")}</td>
                  <td style={{ "maxWidth": "100px" }}>{t("totalItems")}</td>
                  <td style={{ "maxWidth": "100px" }}>{t("options")}</td>
                </tr>
              </thead>
              <tbody>
                {
                  lists.map((row: ItemList, i) => (
                    <tr key={i} style={{ "cursor": "pointer" }}>
                      <td onClick={() => handleClick(row.title)}>{row.title}</td>
                      <td onClick={() => handleClick(row.title)}>{row.list.length || 0}</td>
                      <td>
                        <Button
                          buttonType='danger'
                          outlineStyle={true}
                          onClickEvent={() => {
                            handleRemove(row.id!);
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
          ) : (
            <p className="w-100">{t("noListsFound")}</p>
          )
        }
      </div>
    </>
  )
}

export default Home