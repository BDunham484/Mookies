var bookSearchResultsEl = document.querySelector("#book-results");
var suggestionButtonEl = document.querySelector("#get-suggestions");
var searchInputEl = document.querySelector("#search-input");
var bookListEl = document.querySelector("#book-results")





//function that gets lthe number of search results
var getNumFound = function(searchQuery)  {
    while (bookListEl.firstChild) {
        bookListEl.removeChild(bookListEl.firstChild);
    }

    var apiUrl = "http://openlibrary.org/search.json?q=" + searchQuery

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data)
                var numFound = data.numFound
                console.log(numFound)
                getSearchResults(searchQuery, numFound)
            });
        };
    });
};




//function that takes the search query and the number of results to randomize the selections
var getSearchResults = function(searchQuery, numFound) {
    for (var i = 0; i < 5; i++) {
         //randomize search result display offset based off the number of results in open library for that query
        var randoOffsetNum = Math.floor(Math.random() * (numFound - 6))
        console.log(randoOffsetNum)



        var apiUrl = "http://openlibrary.org/search.json?q=" + searchQuery + "&limit=1&offset=" + randoOffsetNum
        //fetches data from open library and saves the necessary data to variables
        fetch(apiUrl).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                console.log(data)
                var title = data.docs[0].title
                console.log("the title: " + title)
                if (!data.docs[0].author_name) {
                    var author = "Author Unknown"
                } else {
                    var author = data.docs[0].author_name[0]
                }
                console.log("the author: " + author)
                var coverId = data.docs[0].cover_i
                console.log("cover id: " + coverId)
                createListItems(searchQuery, title, author, coverId)
                });
            };
        });
    };
};





//function that display results from getSearchResults()
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
    if (coverId === undefined) {
        coverListItem.className = "missing-cover"
        coverListItem.textContent = "Cover Missing"
    } else {
        //provide image link for coverListItem
    coverListItem.innerHTML = "<img src='https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg' />";
    }
    
    //append append cover li to bookList ul
    bookList.appendChild(coverListItem)

}




// getNumFound("star wars")

suggestionButtonEl.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("button clicked")
    var searchQuery = searchInputEl.value.trim();
    console.log(searchQuery)

    getNumFound(searchQuery)
})
