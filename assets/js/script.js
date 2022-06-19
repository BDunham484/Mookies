var bookSearchResultsEl = document.querySelector("#book-results");
var suggestionBtnEl = document.querySelector("#get-suggestions");
var feelingLuckyBtnEl = document.querySelector("#feeling-lucky");
var searchInputEl = document.querySelector("#search-input");
var bookListEl = document.querySelector("#book-results")
var bookResultsColEl = document.querySelector("#book-results-column")

var genreArr = ["action", "romance", "thriller", "sports", "comedy", "science fiction", "horror", "drama", "fantasy", "mystery", "western", "crime", "fiction", "adventure", "experimental", "disaster", "war", "documentary", "gangster", "animation", "indie", "romantic comedy", "cartoon", "children"]





//function that gets the number of search results
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
                console.log("The number of results found with this query: " + numFound)
                getSearchResults(searchQuery, numFound)
            });
        } else {
            console.log("There was an error with the response");
        }
    }).catch(function(error) {
        console.log("Cannot compute!");
    });
};




//function that takes the search query and the number of results to randomize the selections
var getSearchResults = function(searchQuery, numFound) {
    for (var i = 0; i < 5; i++) {
         //randomize search result display offset based off the number of results in open library for that query
        var randoOffsetNum = Math.floor(Math.random() * (numFound - 6))
        console.log("random result number: " + randoOffsetNum)



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





//function that displays results from getSearchResults()
var createListItems = function(subject, title, author, coverId) {
    //create list-items for each book
    var resultsListItem = document.createElement("li");
    resultsListItem.className = "pt-5"
    //append list-item to ul #book-results
    bookSearchResultsEl.appendChild(resultsListItem);
    //begin dunamically creating bulma css card to display book search results
    var card = document.createElement("div")
    card.className = "card";
    resultsListItem.appendChild(card)

    var cardContent = document.createElement("div")
    cardContent.className = "card-content";
    card.appendChild(cardContent);

    var cardMedia = document.createElement("div");
    cardMedia.className = "media";
    cardContent.appendChild(cardMedia);

    var mediaLeft = document.createElement("div");
    mediaLeft.className = "media-left";
    cardMedia.appendChild(mediaLeft);

    var cardFigure = document.createElement("figure");
    cardFigure.classList.add("image", "is-48x58");
    //provide alternative display in case there is no book cover
    if (coverId === undefined) {
            cardFigure.classList.add("missing-cover", "has-text-centered", "pt-6")
            cardFigure.textContent = "Cover Missing"
        } else {
        //provide image link for coverListItem
        cardFigure.innerHTML = "<img src='https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg' />";
        }
    mediaLeft.appendChild(cardFigure);

    var content = document.createElement("div");
    content.className = "content";
    cardContent.appendChild(content);
    //create and append the book title
    var cardTitle = document.createElement("p");
    cardTitle.classList.add("title", "is-5");
    cardTitle.textContent = title;
    content.appendChild(cardTitle)
    //create and append the author
    var cardAuthor = document.createElement("p");
    cardAuthor.classList.add("subtitle", "is-7");
    cardAuthor.textContent = author;
    content.appendChild(cardAuthor);
}




//event listener for the 'get suggestions' button
suggestionBtnEl.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("'Get Suggestions' button clicked")
    var searchQuery = searchInputEl.value.trim();
    console.log("search input: " + searchQuery)
    //convert query for 'history' to 'world history'
    //if not there are too many results and fetch response times out
    if (searchQuery.toLowerCase() === "history") {
        searchQuery = "world history"
        console.log("search input is now: " + searchQuery)
        getNumFound(searchQuery);
    } else {
        getNumFound(searchQuery)
    } 
});





//event listener for 'feeling lucky' button
feelingLuckyBtnEl.addEventListener("click", function() {
    console.log("'Feeling Lucky' Btn Clicked");
    //creates random number for index of genreArr[]
    var genreIndex = Math.floor(Math.random() * (genreArr.length -1))
    console.log("random genre index: " + genreIndex)
    console.log("random genre selected: " + genreArr[genreIndex]);
    //assigns the randomly selected genre text to search bar
    searchInputEl.value = genreArr[genreIndex];
    //calls function to begin search for randomly selected genre
    getNumFound(genreArr[genreIndex]);
})


