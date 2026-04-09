import { useTranslation, Trans } from "react-i18next";

interface Props {
  onLeave: () => void,
  onStay: () => void,
}

const UnsavedChangesModal = ({ onLeave, onStay }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="modal fade" id="confirmModal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="unsavedModal">{t("unsavedTitle")}</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <Trans
              i18nKey="unsavedBody"
              components={{ br: <br /> }}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={onLeave} data-bs-dismiss="modal">{t("unsavedDiscard")}</button>
            <button type="button" className="btn btn-success" onClick={onStay}>{t("unsavedStay")}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnsavedChangesModal;