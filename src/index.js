document.addEventListener("DOMContentLoaded", function() {

    originalFetch()
  
  });

//************* Grab Elements off the DOM ***********/

const quotes = document.querySelector('#quote-list')
const quoteForm = document.querySelector('#new-quote-form')
const deleteButton = document.querySelector(".btn-danger")

//************* Event Listeners ********************/

quotes.addEventListener('submit', grabFormInputs)


quotes.addEventListener('click', function(e) {
    if (e.target.matches('.btn-danger')) {
        const quoteToRemove = e.target.closest('.quote-card')
        makeDeleteRequest(quoteToRemove)
        quoteToRemove.remove()
    } 
    // else if (e.target.matches('.btn-success')) {
    //     let numLikes = parseInt(e.target.innerText.split(' ')[1])
    //     let nextNum = numLikes + 1
    //     e.target.innerText = `Likes: ${nextNum}`
    //     let parsedQuoteId = parseInt(e.target.closest('li').dataset.id)
    //     let quoteObj = {
    //         quoteId: parsedQuoteId
    //     }
    //     makePostLikeRequest(quoteObj)
    // }
})



//*********** Network Request (Fetch) **************/

function originalFetch() {
    fetch("http://localhost:3000/quotes?_embed=likes")
        .then(res => res.json())
        .then((quotesArr) => createQuoteCard(quotesArr))
        //.then(createQuoteCard)
}


function createQuoteInDatabase(quoteObj) {
    fetch("http://localhost:3000/quotes?_embed=likes", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quoteObj),
    })
      .then(res => res.json())
      .then(slapQuoteOnDom)
  }
  

function makeDeleteRequest(quoteToRemove){
    fetch(`http://localhost:3000/quotes?_embed=likes/${quoteToRemove.id}`, {
        method: "DELETE", 
    })
    .then(res => res.json())
    .then((emptyObj) => {
        quoteToRemove.remove()
    })
}


//****** Manipulating the Dom and Logic ***********/

function createQuoteCard(quotesArr) {
    quotesArr.forEach(quote => {
        quotes.innerHTML += `
        <li class='quote-card' data-id=${quote.id}>
            <blockquote class="blockquote">
                <p class="mb-0">"${quote.quote}"</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                <button class='btn-danger'>Delete</button>
            </blockquote>
        </li>
        `
    })
}


function slapQuoteOnDom(quote) {
    quoteForm.innerHTML += `
    <div class="form-group">
        <label for="new-quote">${quote.quote}</label>
        <input name="quote" type="text" class="form-control" id="new-quote" placeholder="Learn. Love. Code.">
    </div>
    <div class="form-group">
        <label for="Author">${quote.author}</label>
        <input name="author" type="text" class="form-control" id="author" placeholder="Flatiron School">
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
    `
}


function grabFormInputs(event) {
    event.preventDefault()
    //debugger
    const actualQuote = event.target.quote.value
    const author = event.target.author.value

    quoteObj = {
        quote: actualQuote,
        author: author
    }

    createQuoteInDatabase(quoteObj)

}



//****** Eric Combo Way ***********/

// quoteForm.addEventListener("submit", (evt) => {
//     evt.preventDefault()
    
//     let actualQuote = evt.target.quote.value
//     let author = evt.target.author.value

//     fetch("http://localhost:3000/quotes?_embed=likes", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             quote: actualQuote,
//             author: author,
//         })
//     })
//             .then(res => res.json())
//             .then((createdQuoteObj) => {
//                 slapQuoteOnDom(createdQuoteObj)
//                 evt.target.reset()
//             })
        
// })


