//book api variables
var bookSearchResultsEl = document.querySelector("#book-results");
var suggestionBtnEl = document.querySelector("#get-suggestions");
var feelingLuckyBtnEl = document.querySelector("#feeling-lucky");
var searchInputEl = document.querySelector("#search-input");
var bookListEl = document.querySelector("#book-results");
var bookResultsColEl = document.querySelector("#book-results-column");
//modal variables
var closeModalEl = document.querySelector("#modal-trigger");
var modalSectionEl = document.querySelector(".modal-section");
var mainSectionEl = document.querySelector("main");
var modalBackgroundEl = document.querySelector(".modal-background");
//movie api variable
var movieResultsEl = document.querySelector("#movie-results");
var movieResultsColEl = document.querySelector("#movie-results-column");
// rando variables
var deleteButtonEl = document.querySelector(".icon");


var genreArr = ["action", "romance", "thriller", "sports", "comedy", "science fiction", "horror", "drama", "fantasy", "mystery", "western", "crime", "fiction", "adventure", "disaster", "war", "gangster", "animation", "romantic comedy", "cartoon", "children"]
var bookResultsArr = [];
var movieResultsArr = [];





//function that gets the number of search results for books based off of search input
var getNumFound = function (searchQuery) {
  while (bookListEl.firstChild) {
    bookListEl.removeChild(bookListEl.firstChild);
  }

  var apiUrl = "https://openlibrary.org/search.json?q=" + searchQuery

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data)
        var numFound = data.numFound
        if (numFound === 0 || numFound === -1) {
          closeModalEl.click();
          searchInputEl.value = "";
        } else {
          console.log("The number of results found with this query: " + numFound)
          getSearchResults(searchQuery, numFound)
        }

      });
    } else {
      console.log("There was an error with the response");
    }
  }).catch(function (error) {
    console.log("Cannot compute!");
  });
};





//function that gets number of movie results based off of search input
var getMovies = function (searchQuery) {
  while (movieResultsEl.firstChild) {
    movieResultsEl.removeChild(movieResultsEl.firstChild);
  };
  var apiUrl = "https://imdb-api.com/en/API/AdvancedSearch/k_zulp8liu/?title_type=feature&genres=" + searchQuery + "&title=" + searchQuery

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data)
        var movieResultsNum = data.results.length
        console.log("number of movie results: " + movieResultsNum)
        getMovieResults(searchQuery, movieResultsNum)
      })
    } else {
      console.log("There was an error with the response");
    }
  }).catch(function (error) {
    console.log("Cannot compute!");
  });
};






//function that takes the search query and the number of results to randomize the book selections
var getSearchResults = function (searchQuery, num) {
  for (var i = 0; i < 5; i++) {
    //randomize search result display offset based off the number of results in open library for that query
    var randoOffsetNum = Math.floor(Math.random() * (num - 1))
    if (randoOffsetNum === 0) {
      var randoOffsetNum = 1;
    }
    console.log("(Books) random result number: " + randoOffsetNum)


    var apiUrl = "https://openlibrary.org/search.json?q=" + searchQuery + "&limit=1&offset=" + randoOffsetNum
    //fetches data from open library and saves the necessary data to variable
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data)
          var title = data.docs[0].title
          console.log("the book title: " + title)
          if (!data.docs[0].author_name) {
            var author = "Author Unknown"
          } else {
            var author = data.docs[0].author_name[0]
          };
          console.log("the author: " + author)
          var coverId = data.docs[0].cover_i
          console.log("cover id: " + coverId)
          var randoOffsetNum = data.offset;
          console.log("offset #: " + randoOffsetNum)
          var book = {
            query: searchQuery,
            cover: coverId,
            title: title,
            author: author,
            offsetNum: randoOffsetNum
          }
          console.log("book object: " + JSON.stringify(book))
          //push object to array
          bookResultsArr.push(book)
          //save array to localStorage
          localStorage.setItem("Books:", JSON.stringify(bookResultsArr))
          //call createListItems()
          createListItems(searchQuery, title, author, coverId, randoOffsetNum)
        });
      };
    });
  };
};





//function that takes the search query and the number of results to randomize the movie selections
var getMovieResults = function (searchQuery, num) {
  for (var i = 0; i < 5; i++) {
    //randomize search result display offset based off the number of results in open library for that query
    var randoOffsetNum = Math.floor(Math.random() * (num - 1))
    if (randoOffsetNum === 0) {
      var randoOffsetNum = 1;
    }
    console.log("(Movies) random result number: " + randoOffsetNum)


    var apiUrl = "https://imdb-api.com/en/API/AdvancedSearch/k_zulp8liu/?title_type=feature&genres=" + searchQuery + "&title=" + searchQuery + "&count=" + randoOffsetNum
    //fetches data from open library and saves the necessary data to variable
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data)
          var index = data.results.length - 1
          var title = data.results[index].title
          console.log("the movie title: " + title)
          var starsArr = [];
          var starList = data.results[index].starList
          if (starList === null) {
            var stars = "";
          } else if (starList.length === 0) {
            var stars = "";
          } else if (starList.length === 1){
            starsArr.push(starList[0].name)
          } else if (starList.length === 2)
            for (var i = 0; i < 2; i++) {
              starsArr.push(data.results[index].starList[i].name)
            } else {
              for (var i = 0; i < 3; i++) {
                starsArr.push(data.results[index].starList[i].name)
            }
          };
          console.log("starring: " + starsArr)
          var movieImg = data.results[index].image
          console.log("movie poster: " + movieImg)
          console.log("movie index: " + index)
          var movie = {
            query: searchQuery,
            poster: movieImg,
            title: title,
            starring: starsArr,
            index: index
          }
          console.log("movie object: " + JSON.stringify(movie))
          //push object to array
          movieResultsArr.push(movie)
          //save array to localStorage
          localStorage.setItem("Movies:", JSON.stringify(movieResultsArr))
          //call createListItems()
          createMovieListItems(searchQuery, title, starsArr, movieImg, index)
        });
      };
    });
  };
};





//function that loads previous search results from localStorage
var pageLoad = function () {
  bookResultsArr = [];
  bookResultsArr = JSON.parse(localStorage.getItem("Books:"));
  movieResultsArr = [];
  movieResultsArr = JSON.parse(localStorage.getItem("Movies:"));
  if (localStorage.getItem("Books:") === null) {
    console.log("localStorage is empty");
  } else {
    //loop to assign info from localStorage to variables to be passed as arguments in createListItems
    for (var i = 0; i < bookResultsArr.length; i++) {
      var searchQuery = bookResultsArr[i].query
      //assign search input value
      searchInputEl.value = searchQuery;
      var coverId = bookResultsArr[i].cover
      var title = bookResultsArr[i].title
      var author = bookResultsArr[i].author
      var randoOffsetNum = bookResultsArr[i].offsetNum
      //call createListItems
      createListItems(searchQuery, title, author, coverId, randoOffsetNum)
    };
  };

  if (localStorage.getItem("Movies:") === null) {
    console.log("localStorage is empty");
  } else {
    //loop to assign info from localStorage to variables to be passed as arguments in createListItems
    for (var i = 0; i < movieResultsArr.length; i++) {
      var searchQuery = movieResultsArr[i].query
      //assign search input value
      // searchInputEl.value = searchQuery;
      var movieImg = movieResultsArr[i].poster
      var title = movieResultsArr[i].title
      var starsArr = movieResultsArr[i].starring
      var index = movieResultsArr[i].index
      //call createListItems
      createMovieListItems(searchQuery, title, starsArr, movieImg, index)
    };
  };
};



//function that displays results from getSearchResults()
var createListItems = function (subject, title, author, coverId, randoOffsetNum) {
  //create list-items for each book
  var resultsListItem = document.createElement("li");
  resultsListItem.className = "pt-5"
  //append list-item to ul #book-results
  bookSearchResultsEl.appendChild(resultsListItem);
  //begin dunamically creating bulma css card to display book search results
  var card = document.createElement("div")
  card.classList.add("card", "js-modal-trigger");
  card.setAttribute("data-target", "modal-" + randoOffsetNum)
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
    cardFigure.setAttribute("data-target", "modal-" + randoOffsetNum)
  } else {
    //provide image link for coverListItem
    cardFigure.innerHTML = "<img src='https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg' data-target='modal-" + randoOffsetNum + "'/>";

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

  createModals(title, author, coverId, randoOffsetNum)
}





//function that displays results from getMovieResults()
var createMovieListItems = function (searchQuery, title, starsArr, movieImg, index) {
  //create list-items for each book
  var movieListItem = document.createElement("li");
  movieListItem.className = "pt-5"
  //append list-item to ul #book-results
  movieResultsEl.appendChild(movieListItem);
  //begin dunamically creating bulma css card to display book search results
  var card = document.createElement("div")
  card.classList.add("card", "js-modal-trigger");
  card.setAttribute("data-target", "modal-" + index)
  movieListItem.appendChild(card)

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
  // provide alternative display in case there is no book cover
  if (movieImg === undefined) {
    cardFigure.classList.add("missing-cover", "has-text-centered", "pt-6")
    cardFigure.textContent = "Cover Missing"
    cardFigure.setAttribute("data-target", "modal-" + index)
  } else {
    //provide image link for coverListItem
    cardFigure.innerHTML = "<img src='" + movieImg + "' data-target='modal-" + index + "' />";

  }
  mediaLeft.appendChild(cardFigure);

  var content = document.createElement("div");
  content.className = "content";
  cardContent.appendChild(content);
  //   //create and append the book title
  var cardTitle = document.createElement("p");
  cardTitle.classList.add("title", "is-5");
  cardTitle.textContent = title;
  content.appendChild(cardTitle)
  //create and append the stars
  var cardStars = document.createElement("p");
  cardStars.classList.add("subtitle", "is-7");
  cardStars.textContent = starsArr;
  content.appendChild(cardStars);

  createMovieModals(title, starsArr, movieImg, index)
}




//function that dynamically creates modals for each search result
var createModals = function (title, author, coverId, randoOffsetNum) {
  var modal = document.createElement("div");
  modal.setAttribute("id", "modal-" + randoOffsetNum);
  modal.className = "modal";
  modalSectionEl.appendChild(modal);

  var modalBackground = document.createElement("div");
  modalBackground.className = "modal-background";
  modal.appendChild(modalBackground);

  var modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modal.appendChild(modalContent);

  var modalCard = document.createElement("div");
  modalCard.classList.add("card");
  modalContent.appendChild(modalCard);

  var modalCardContent = document.createElement("div");
  modalCardContent.className = "card-content";
  modalCardContent.setAttribute("id", "modal-card-content")
  modalCard.appendChild(modalCardContent);

  var modalMedia = document.createElement("div");
  modalMedia.className = "media";
  modalCardContent.appendChild(modalMedia);

  var modalMediaLeft = document.createElement("div");
  modalMediaLeft.className = "media-left";
  modalMedia.appendChild(modalMediaLeft);

  var modalFigure = document.createElement("figure");
  modalFigure.classList.add("image", "is-48x58");
  //provide alternative display in case there is no book cover
  if (coverId === undefined) {
    modalFigure.classList.add("missing-cover", "has-text-centered", "pt-6")
    modalFigure.textContent = "Cover Missing"
    modalFigure.setAttribute("data-target", "modal-" + randoOffsetNum)
  } else {
    //provide image link for coverListItem
    modalFigure.innerHTML = "<img src='https://covers.openlibrary.org/b/id/" + coverId + "-M.jpg' data-target='modal-" + randoOffsetNum + "'/>"
  }
  modalMediaLeft.appendChild(modalFigure);

  var modalLowerContent = document.createElement("div");
  modalLowerContent.className = "content";
  modalCardContent.appendChild(modalLowerContent);

  var modalTitleP = document.createElement("p");
  modalTitleP.classList.add("title", "is-5");
  modalTitleP.textContent = title;
  modalLowerContent.appendChild(modalTitleP);

  var modalAuthorP = document.createElement("p");
  modalAuthorP.classList.add("subtitle", "is-7");
  modalAuthorP.textContent = author;
  modalLowerContent.appendChild(modalAuthorP);

  var modalOpenLibraryLink = document.createElement("a");
  modalOpenLibraryLink.classList.add("subtitle", "is-5");
  modalOpenLibraryLink.setAttribute("href", "https://www.openlibrary.org/search?q=" + title + " " + author + "&mode=everything");
  modalOpenLibraryLink.setAttribute("target", "_blank");
  modalOpenLibraryLink.textContent = "Find on Open Library"
  modalLowerContent.appendChild(modalOpenLibraryLink);

  var modalLineBreak = document.createElement("br");
  modalLowerContent.appendChild(modalLineBreak);

  var modalAmazonLink = document.createElement("a");
  modalAmazonLink.classList.add("subtitle", "is-5");
  modalAmazonLink.setAttribute("href", "https://www.amazon.com/s?k=" + title + " " + author + "&i=stripbooks");
  modalAmazonLink.setAttribute("target", "_blank");
  modalAmazonLink.textContent = "Find on Amazon"
  modalLowerContent.appendChild(modalAmazonLink);

  var modalLineBreak = document.createElement("br");
  modalLowerContent.appendChild(modalLineBreak);

  var modalAudibleLink = document.createElement("a");
  modalAudibleLink.classList.add("subtitle", "is-5");
  modalAudibleLink.setAttribute("href", "https://www.audible.com/search?keywords=" + title + " " + author);
  modalAudibleLink.setAttribute("target", "_blank");
  modalAudibleLink.textContent = "Find on Audible";
  modalLowerContent.appendChild(modalAudibleLink);

  var modalButton = document.createElement("button");
  modalButton.classList.add("modal-close", "is-large");
  modalButton.setAttribute("aria-label", "close")
  modal.appendChild(modalButton);

}






//function that dynamically creates modals for each search result
var createMovieModals = function (title, starsArr, movieImg, index) {
  var modal = document.createElement("div");
  modal.setAttribute("id", "modal-" + index);
  modal.className = "modal";
  modalSectionEl.appendChild(modal);

  var modalBackground = document.createElement("div");
  modalBackground.className = "modal-background";
  modal.appendChild(modalBackground);

  var modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  modal.appendChild(modalContent);

  var modalCard = document.createElement("div");
  modalCard.classList.add("card");
  modalContent.appendChild(modalCard);

  var modalCardContent = document.createElement("div");
  modalCardContent.className = "card-content";
  modalCardContent.setAttribute("id", "modal-card-content")
  modalCard.appendChild(modalCardContent);

  var modalMedia = document.createElement("div");
  modalMedia.className = "media";
  modalCardContent.appendChild(modalMedia);

  var modalMediaLeft = document.createElement("div");
  modalMediaLeft.className = "media-left";
  modalMedia.appendChild(modalMediaLeft);

  var modalFigure = document.createElement("figure");
  modalFigure.classList.add("image", "is-48x58");
  //provide alternative display in case there is no book cover
  if (movieImg === undefined) {
    modalFigure.classList.add("missing-cover", "has-text-centered", "pt-6")
    modalFigure.textContent = "Cover Missing"
    modalFigure.setAttribute("data-target", "modal-" + index)
  } else {
    //provide image link for coverListItem
    modalFigure.innerHTML = "<img src='" + movieImg + "' data-target='modal-" + index + "' />"
  }
  modalMediaLeft.appendChild(modalFigure);

  var modalLowerContent = document.createElement("div");
  modalLowerContent.className = "content";
  modalCardContent.appendChild(modalLowerContent);

  var modalTitleP = document.createElement("p");
  modalTitleP.classList.add("title", "is-5");
  modalTitleP.textContent = title;
  modalLowerContent.appendChild(modalTitleP);

  var modalAuthorP = document.createElement("p");
  modalAuthorP.classList.add("subtitle", "is-7");
  modalAuthorP.textContent = starsArr;
  modalLowerContent.appendChild(modalAuthorP);

  var modalOpenLibraryLink = document.createElement("a");
  modalOpenLibraryLink.classList.add("subtitle", "is-5");
  modalOpenLibraryLink.setAttribute("href", "https://www.google.com/search?q=stream+" + title);
  modalOpenLibraryLink.setAttribute("target", "_blank");
  modalOpenLibraryLink.textContent = "Where to Watch"
  modalLowerContent.appendChild(modalOpenLibraryLink);

  var modalLineBreak = document.createElement("br");
  modalLowerContent.appendChild(modalLineBreak);

  var modalAmazonLink = document.createElement("a");
  modalAmazonLink.classList.add("subtitle", "is-5");
  modalAmazonLink.setAttribute("href", "https://www.amazon.com/s?k=" + title + "&i=instant-video");
  modalAmazonLink.setAttribute("target", "_blank");
  modalAmazonLink.textContent = "Find on Amazon"
  modalLowerContent.appendChild(modalAmazonLink);

  var modalLineBreak = document.createElement("br");
  modalLowerContent.appendChild(modalLineBreak);

  var modalAudibleLink = document.createElement("a");
  modalAudibleLink.classList.add("subtitle", "is-5");
  modalAudibleLink.setAttribute("href", "https://www.youtube.com/results?search_query=" + title);
  modalAudibleLink.setAttribute("target", "_blank");
  modalAudibleLink.textContent = "Find on YouTube";
  modalLowerContent.appendChild(modalAudibleLink);

  var modalButton = document.createElement("button");
  modalButton.classList.add("modal-close", "is-large");
  modalButton.setAttribute("aria-label", "close")
  modal.appendChild(modalButton);

}




//calls pageLoad function that pulls info from localStorage and distributes to the appropriate functions
pageLoad();




//event listener for the 'get suggestions' button
suggestionBtnEl.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("'Get Suggestions' button clicked")
  //clear bookResultsArr 
  bookResultsArr = [];
  console.log("bookResultsArr has been cleared")
  //clear movieResultArr
  movieResultsArr = [];
  console.log("movieResultsArr has been cleared")
  var searchQuery = searchInputEl.value.trim();
  console.log("search input: " + searchQuery)
  //convert query for 'history' to 'world history'
  //if not there are too many results and fetch response times out
  if (searchQuery.toLowerCase() === "history") {
    searchQuery = "world history"
    console.log("search input is now: " + searchQuery)
    getNumFound(searchQuery);
    getMovies(searchQuery)
  } else {
    getNumFound(searchQuery)
    getMovies(searchQuery)
  }
  while (modalSectionEl.firstChild) {
    modalSectionEl.removeChild(modalSectionEl.firstChild);
  }
});





//event listener for 'feeling lucky' button
feelingLuckyBtnEl.addEventListener("click", function () {
  console.log("'Feeling Lucky' Btn Clicked");
  //clear bookResults Arr
  bookResultsArr = [];
  console.log("bookResultsArr has been cleared")
  //clear movieResultsArr
  movieResultsArr = [];
  console.log("movieResultsArr has been cleared")    //creates random number for index of genreArr[]
  var genreIndex = Math.floor(Math.random() * (genreArr.length - 1))
  console.log("random genre index: " + genreIndex)
  console.log("random genre selected: " + genreArr[genreIndex]);
  //assigns the randomly selected genre text to search bar
  searchInputEl.value = genreArr[genreIndex];
  //calls function to begin search for randomly selected genre
  getNumFound(genreArr[genreIndex]);
  getMovies(genreArr[genreIndex]);

  while (modalSectionEl.firstChild) {
    modalSectionEl.removeChild(modalSectionEl.firstChild);
  }
})





//delete button event listener
deleteButtonEl.addEventListener("click", function() {
  console.log("delete button has been clicked")

  searchInputEl.value = "";

  while (bookListEl.firstChild) {
    bookListEl.removeChild(bookListEl.firstChild);
  }

  while (movieResultsEl.firstChild) {
    movieResultsEl.removeChild(movieResultsEl.firstChild);
  };

  //clear bookResults Arr
  bookResultsArr = [];
  console.log("bookResultsArr has been cleared")
  //clear movieResultsArr
  movieResultsArr = [];
  console.log("movieResultsArr has been cleared")  

  localStorage.setItem("Books:", JSON.stringify(bookResultsArr))
  localStorage.setItem("Movies:", JSON.stringify(movieResultsArr))

  while (modalSectionEl.firstChild) {
    modalSectionEl.removeChild(modalSectionEl.firstChild);
  }

})






//eventlistener for clicks on dynamic list items
bookResultsColEl.addEventListener("click", function (event) {
  var target = event.target;
  //assign unigue id to variable
  var targetId = "#" + target.getAttribute("data-target");
  console.log("list-item with a target Id of " + targetId + " has been clicked.")
  var targetIdEl = document.querySelector(targetId);
  //add 'is-active' class to acitivate modal
  targetIdEl.classList.add("is-active");
})





//eventlistener for clicks on dynamic list items
movieResultsColEl.addEventListener("click", function (event) {
  var target = event.target;
  //assign unigue id to variable
  var targetId = "#" + target.getAttribute("data-target");
  console.log("list-item with a target Id of " + targetId + " has been clicked.")
  var targetIdEl = document.querySelector(targetId);
  //add 'is-active' class to acitivate modal
  targetIdEl.classList.add("is-active");
})




//event listener to remove is-active class from dynamic modals
modalSectionEl.addEventListener("click", function (event) {
  var target = event.target;
  target.parentElement.classList.remove("is-active");
})





//bulma event listener for modals
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});
