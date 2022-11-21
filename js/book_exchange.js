$(document).ready(function () {
    var id = sessionStorage.getItem('exchange_book_id');
    var jwt = sessionStorage.getItem('token');

    var get_book_url = "http://localhost:8080/api/book/"+id;
    var exchange_book_info;
    var user_books_list;

    $.ajax({
        method: "GET",
        url: get_book_url,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt
        },
        crossDomain: true,
        success: function (response) {
            exchange_book_info = response.data;

            console.log(exchange_book_info);

            var user_book_collection;
            var book_collection_url = "http://localhost:8080/api/book/collection";
            $.ajax({
                method: "GET",
                url: book_collection_url,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwt
                },
                crossDomain: true,
                success: function (response) {
                    user_book_collection = response.data
                    for(var book_num in user_book_collection){
                        var option = `<option value='${user_book_collection[book_num].id}'> ${user_book_collection[book_num].name} </option>`;
                        $('#user_books_list').append(option);
                    }

                    $('#exchange_book').find('.other_party_book_name').html(exchange_book_info.name); 
                    $('#exchange_book').find('.other_party_book_isbn').html(exchange_book_info.isbn);
                    $('#exchange_book').find('.other_party_user').html(exchange_book_info.owner);  
                }
            });
        }
    });


    $('#request_exchange').click(function (e) { 
        e.preventDefault();
        var selected_book = $('#user_books_list').val();
        var exchange_data = {};
        exchange_data.firstPartyId = sessionStorage.getItem('email');
        exchange_data.otherPartyId = exchange_book_info.owner;
        exchange_data.firstPartyBookId = id;
        exchange_data.otherPartyBookId = selected_book;
        exchange_data.initiatorId = sessionStorage.getItem('email');

        var book_exchange_url = "http://localhost:8080/api/book/exchange";

        $.ajax({
            method: "POST",
            url: book_exchange_url,
            data: JSON.stringify(exchange_data),
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwt
            },
            crossDomain: true,
            success: function (response) {
                alert('Book exchange request initiated !');
                window.location = "../book_listings.html"
            }, error: function(err){
                alert('Exchange could not be initiated, please try again.');
            }
        });

    });

    $("#cancel_exchange").click(function(){
        window.location = "../book_listings.html";
    })

});