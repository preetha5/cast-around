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

    for (index in data.listHomes) {
        $('#savedHomes').append(
         `<li>
         <h2>${data.listHomes[index].nickName} <h2>
          </li>`);
     }
}

//Call Zillow API to return property details
function getListOfHomesFromDB(displayList){
    setTimeout(function(){ displayList(MOCK_LIST_HOMES)}, 100);
}

//Get and display zillow home info
function getAndDisplayHomes(){
    getListOfHomesFromDB(displayList)
}

$(function(){
    getAndDisplayHomes();
})