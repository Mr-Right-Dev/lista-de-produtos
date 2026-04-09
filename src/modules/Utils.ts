import { Modal } from 'bootstrap';

export function openModal(modalId: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) {
        reject("Modal not found.");
        return;
    }

    const modal = Modal.getOrCreateInstance(modalEl!)

    document.querySelector(`#${modalId} .btn-danger`).onclick = () => {
      modal.hide();
      resolve(true);
    };

    document.querySelector(`#${modalId} .btn-success`).onclick = () => {
      modal.hide();
      resolve(false);
    };

    modal.show();
  });
}