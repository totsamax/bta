var loginModal = $("#loginModal"),
    loginForm = $("#loginForm");
var login = "",
    pass = "";


//listeners
loginForm.on('submit', function (event) {
    login = $("#inputLogin").val();
    passwordHash = md5($('#inputPassword').val());
    $.get("http://api.bishkektaxi.org/LKUserAuthentificate", {
        login: login,
        password_hash: passwordHash
    }).done(function (data) {
        if (data.Code == "OK") {
            $.cookie("login", login);
            $.cookie("pass", passwordHash);
            loginModal.modal('toggle');
        }
    }).fail(function () {
        alert("error");
    }).always(function () {
        $.get("http://api.bishkektaxi.org/GetDriversGeoInfo?login=totsamax@gmail.com")
        console.log("finished");
    });
    event.preventDefault();
});
if (!($.cookie("login") && $.cookie("pass"))) {
    console.info($.cookie("login"));
    loginModal.modal('show');
} else {
    login = $.cookie("login");
};

var ordersTable = $('#orders').DataTable({
    "ajax": {
        "url": "http://bishkektaxi-api-prod.azurewebsites.net/LKGetCompanyOrdersList?login=" + login,
        "dataSrc": ""
    },
    "columns": [
        {
            "title": "ID"
            },
        {
            "title": "ФИО"
            },
        {
            "title": "Дата"
            },
        {
            "title": "Откуда"
            },
        {
            "title": "Куда"
            },
        {
            "title": "Статус"
            }
        ]
});
//    setInterval(function () {
//        ordersTable.ajax.reload(null, false); // user paging is not reset on reload
//    }, 3000);
var map = L.map('map').setView([42.87592, 74.60197], 13);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
}).addTo(map);

//    function onLocationFound(e) {
//        var radius = e.accuracy / 2;
//
//        L.marker(e.latlng).addTo(map)
//            .bindPopup("Вы в пределах " + radius + " метров от этой точки").openPopup();
//
//        //   L.circle(e.latlng, radius).addTo(map);
//    }
//
//    map.on('locationfound', onLocationFound);
//    map.locate({
//        setView: true,
//        maxZoom: 16
//    });
var drivesrCoords = $.get("http://api.bishkektaxi.org/GetDriversGeoInfo", {
        login: login
    },
    function (data) {
        var items = [];
        $.each(data, function (key, val) {
            var marker = L.marker([val[2], val[1]]).addTo(map);
            var url = "http://api.bishkektaxi.org/GetDriverProfileEx?driver_id=" + val[0].toString();
            $.getJSON(url, function (data) {
                console.log(data);
                marker.bindPopup("<b>" + data.DriverName + " " + data.DriverSurname + "<b/><br>" + data.PhoneNumber).openPopup();
            });

        })
    });