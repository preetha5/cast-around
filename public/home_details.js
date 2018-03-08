var MOCK_HOME_INFO = {
    "homeInfo": [
        {
            'address': {
               'city': "SAN DIEGO",
               "state": "CA",
               "zipcode":"92111",
               "street":"11111 Knots Berry Farm"
            },
            'bathrooms':"2.5",
            'bedrooms':"3",
            'finishedSqFt': "1969",
            'yearBuilt': "1990",
            'zpid': "16825747",
            'offerPrice': "333333",
            'pros': "Explore the history of the classic Lorem Ipsum passage \
                 and generate your own text using any number of characters, words, sentences or paragraphs",
            'cons':"Lorem Ipsum is not simply random text. \
                It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. ",
            'nickName': "House with red door"
        }
    ]
}

function displayHomeInfo(data){
    //Show Address from the database
    $("#city").val(data.homeInfo[0].address.city);
    $("#state").val(data.homeInfo[0].address.state);
    $("#zip").val(data.homeInfo[0].address.zipcode);
    $("#streetAdd").val(data.homeInfo[0].address.street);

    //Show home details returned from database
    $("#beds").val(data.homeInfo[0].bedrooms);
    $("#baths").val(data.homeInfo[0].bathrooms);
    $("#built").val(data.homeInfo[0].yearBuilt);

    //Show user saved Info returned from the database
    $("#pros").val(data.homeInfo[0].pros);
    $("#cons").val(data.homeInfo[0].cons);
    $("#nickName").val(data.homeInfo[0].nickName);
    $("#offer").val(data.homeInfo[0].offerPrice);
}

//Call Zillow API to return property details
function getHomeDetailsFromDB(displayHomeInfo){
    setTimeout(function(){ displayHomeInfo(MOCK_HOME_INFO)}, 100);
}

//Get and display zillow home info
function getAndDisplayHomeInfo(){
    getHomeDetailsFromDB(displayHomeInfo)
}

$(function(){
    $("#homeDetailsForm :input").prop('readonly', true);
    getAndDisplayHomeInfo();
})