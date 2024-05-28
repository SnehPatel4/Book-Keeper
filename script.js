const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];

// Show Modal, Focus On Input
function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event Listners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate form
function validate(nameValue, urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g; // this is the exp for validate a url the entered url is valid or not. exp form stackoverflow.
    const regex = new RegExp(expression); // RegExp stands regular expression which is a method.
    if(!nameValue || !urlValue){
        alert('Please submit values for both fields');
        return false;
    }
    if(!urlValue.match(regex)){
        alert('Please provide a valid web address');
        return false;
    }
    // Valid
    return true;
}

// Build Bookmarks DOM
function buildBookmarks(){
    // Remove all bookmark element
    bookmarksContainer.textContent = '';
    // Build items
    bookmarks.forEach((bookmark) => {
        const { name, url} = bookmark;
        // item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon / Link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmark container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Fetch Bookmarks
function fetchBookmarks(){
    // get bookmarks from localstorage if available
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // create a bookmark array in localstorage
        bookmarks = [
            {
                name: 'google',
                url: 'https://google.com',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(url){
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url){
            bookmarks.splice(i, 1); // we use splice() for remove or replace element in array.
        }
    });
    // Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// handle data from form
function storeBookmark(e){
    e.preventDefault(); // this will prevent a form to submit data to the webserver.
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`; 
    }
    if(!validate(nameValue, urlValue)){
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event Listners
bookmarkForm.addEventListener('submit', storeBookmark);

// on Load, fetch Bookmarks
fetchBookmarks();