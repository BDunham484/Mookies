var bookSearchResultsEl = document.querySelector("#book-results")




//function that gets the number of books listed in openlibrary under the searched genre
var getWorkCount = function(subject) {
    var apiUrl = "https://openlibrary.org/subjects/" + subject + ".json?limit=5"

    fetch(apiUrl).then(function(response) {
        //request was succesful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data)
                var workCount = data.work_count
                console.log(workCount)
                getBooks(subject, workCount)
            })
        }
    })
}






var getBooks = function(subject, workCount) {
    //randomize search result display offset based off the number of works in open library for that genre
    var randoOffsetNum = Math.floor(Math.random() * (workCount - 6))
    console.log(randoOffsetNum)
    //capture api url with user input subject and randomized offset number
    var apiUrl = "https://openlibrary.org/subjects/" + subject + ".json?limit=5&offset=" + randoOffsetNum
    //fetch request 
    fetch(apiUrl).then(function(response) {
        //request was succesful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data)
                for (var i = 0; i < data.works.length; i++) {
                    var title = data.works[i].title
                    var author = data.works[i].authors[0].name
                    var coverId = data.works[i].cover_id
                    console.log("title: " + title)
                    console.log("author: " + author)
                    console.log("cover_id: " + coverId)
                    createListItems(subject, title, author, coverId)
                };
                
            });
        };
    });
};





//function that display results from getBooks()
var createListItems = function(subject, title, author, coverId) {
    //create list-items for each book
    var resultsListItem = document.createElement("li");
    //append list-item to ul #book-results
    bookSearchResultsEl.appendChild(resultsListItem);

    //create new ul to be nested as list-item in resultsListItem
    var bookList = document.createElement("ul");
    //append new ul to resultsListItem
    resultsListItem.appendChild(bookList);

    //create title list-items for bookList ul
    var titleListItem = document.createElement("li");
    //provide the title as text input
    titleListItem.textContent = title
    //append title li to bookList ul
    bookList.appendChild(titleListItem);

    //create author list-item for booklist ul
    var authorListItem = document.createElement("li");
    //provide the author as textContent
    authorListItem.textContent = author;
    //append to list
    bookList.appendChild(authorListItem);

    //create cover list-item for bookList ul
    var coverListItem = document.createElement("li");
    //add class
    coverListItem.className = "cover-image"
    //provide image link for coverListItem
    coverListItem.innerHTML = "<img src='https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg' />";
    //append append cover li to bookList ul
    bookList.appendChild(coverListItem)

}


getWorkCount("mystery")
