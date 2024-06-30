const { ipcRenderer } = require('electron')
const items = require('./items')

let showModal = document.getElementById('show-modal');
let closeModal = document.getElementById('close-modal');
let modal = document.getElementById('modal');
let addItem = document.getElementById('add-item');
let itemUrl = document.getElementById('url');
let search = document.getElementById('search');

ipcRenderer.on('menu-show-modal', () => {
    showModal.click()
})

ipcRenderer.on('menu-open-item', () => {
    items.open()
})

ipcRenderer.on('menu-delete-item', () => {
    let selectedItem = items.getSelectedItem()
    items.delete(selectedItem.index)
})

ipcRenderer.on('menu-open-item-native', () => {
    items.openNative()
})

ipcRenderer.on('menu-focus-search', () => {
    search.focus()
})

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key)
    }
})

const toggleModalButtons = () => {
    if (addItem.disabled === true) {
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerText = 'Add Item';
        itemUrl.value = ''
        closeModal.style.display = 'inline';
    } else {
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
}

showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

closeModal.addEventListener('click', e => {
    modal.style.display = 'none';
});

search.addEventListener('keyup', e => {
    console.log(search.value)
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
        let hasMatch = item.innerText.toLowerCase().includes(search.value)
        item.style.display = hasMatch ? 'flex' : 'none'
    })
})

addItem.addEventListener('click', e => {
    if (itemUrl.value) {
        // Send the new item URL to the main process
        ipcRenderer.send('new-item', itemUrl.value)
        toggleModalButtons()
    }
});

ipcRenderer.on('new-item-success', (e, newItem) => {
    console.log(newItem)
    items.addItem(newItem, true)
    toggleModalButtons()

    modal.style.display = 'none'
    itemUrl.innerText = ''
})

itemUrl.addEventListener('keyup', e => {
    if (e.key === 'Enter') addItem.click()
});

itemUrl.addEventListener('keyup', e => {
    if (e.key === 'Escape') closeModal.click()
});