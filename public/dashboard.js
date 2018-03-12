let DASHBOARD_URL = '/user/dashboard';

var MOCK_LIST_HOMES = {
    "listHomes": [
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
            'nickName': "House with red door"
        },
        {
            'address': {
               'city': "SAN DIEGO",
               "state": "CA",
               "zipcode":"92127",
               "street":"8419 Run Of The Knls"
            },
            'bathrooms':"3",
            'bedrooms':"3",
            'finishedSqFt': "2900",
            'yearBuilt': "2004",
            'zpid': "16825748",
            'nickName': "House near golf course"
        }
    ]
}

function displayList(data){

    for (index in data.homes) {
        $('#savedHomes').append(
         `<li>
         <h2>${data.homes[index].nick_name} <h2>
          </li>`);
     }
}

//Call Zillow API to return property details
function getListOfHomesFromDB(){
    console.log('Retrieving homes...')
    //Make an ajax get request to 'usrl/dashboard
    //on success callback Work on response to create template.
    //setTimeout(function(){ displayList(MOCK_LIST_HOMES)}, 100);

    $.getJSON(DASHBOARD_URL, function(data) {
        displayList(data);
    });
}

//Get and display zillow home info
function getAndDisplayHomes(){
    getListOfHomesFromDB()
}

$(function(){
    getAndDisplayHomes();
})