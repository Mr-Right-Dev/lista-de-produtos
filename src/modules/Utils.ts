import { Modal } from 'bootstrap';

export function openModal(modalId: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) {
      reject("Modal not found.");
      return;
    }

    const modal = Modal.getOrCreateInstance(modalEl!)

    document.querySelector(`#${modalId} .btn-danger`)?.addEventListener('click', () => {
      modal.hide();
      resolve(true);
    });

    document.querySelector(`#${modalId} .btn-success`)?.addEventListener('click', () => {
      modal.hide();
      resolve(false);
    });

    modal.show();
  });
}