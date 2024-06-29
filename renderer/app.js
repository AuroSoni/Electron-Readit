let showModal = document.getElementById('show-modal');
let closeModal = document.getElementById('close-modal');
let modal = document.getElementById('modal');
let addItem = document.getElementById('add-item');
let itemUrl = document.getElementById('url');

showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

closeModal.addEventListener('click', e => {
    modal.style.display = 'none';
});

addItem.addEventListener('click', e => {
    if (itemUrl.value) {
        // Send the new item URL to the main process
        require('electron').ipcRenderer.send('new-item', itemUrl.value);
    }
});

itemUrl.addEventListener('keyup', e => {
    if(e.key === 'Enter') addItem.click();
});

itemUrl.addEventListener('keyup', e => {
    if(e.key === 'Esc') closeModal.click();
});