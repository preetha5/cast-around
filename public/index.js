//MOCK-DATA for Home Details page
const MOCK_HOME_DETAILS = {
    'details':[
        {
            "hid": 1234,
            "nickName": "blue front door",
            "address": "123, abc street",
            "zipcode":92111,
            "notes" : "erbvuynyguy u7dkufy uifii78ogvkjvuv"
        },
        {
            "hid": 4567,
            "nickName": "big front yard",
            "address": "123, def street",
            "zipcode":92011,
            "notes" : "erbvuynyguy u7dkufy uifii78ogvkjvuv"
        }
    ]
};

function renderHomeDetails(data){
    for (index in data.details){
        $('#home_details').append(
            '<p>'+data.details[index].nickName+'</p>');
    }
}

function getHomeDetails(cbFn){
    setTimeout(function(){ cbFn(MOCK_HOME_DETAILS)}, 100);
}

function showHomeDetails(cbFn){
    getHomeDetails(renderHomeDetails);
}

$(function(){
    showHomeDetails();
})