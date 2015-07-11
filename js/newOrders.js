//L.Map = L.Map.extend({
//    openPopup: function (popup, latlng, options) {
//        if (!(popup instanceof L.Popup)) {
//            var content = popup;
//
//            popup = new L.Popup(options).setContent(content);
//        }
//
//        if (latlng) {
//            popup.setLatLng(latlng);
//        }
//
//        if (this.hasLayer(popup)) {
//            return this;
//        }
//
//        // NOTE THIS LINE : COMMENTING OUT THE CLOSEPOPUP CALL
//        //this.closePopup(); 
//        this._popup = popup;
//        return this.addLayer(popup);
//    }
//});
function makeOrder(from, where, time, user_phonenumber, login, driver_id) {
    $.get("http://api.bishkektaxi.org/SetTaxiOrderState", {
        method: "lk_create",
        from: from,
        where: where,
        time: time,
        user_phonenumber: user_phonenumber,
        driver_id: driver_id,
        login: login
    }).done(function(data) {
        if (data.Code == 'OK') {
            console.log(data);
        } else {
            console.log(data);
        }
    });
}
var loginModal = $("#loginModal"),
    loginForm = $("#loginForm"),
    logoutButton = $("#logout");
var login = "",
    pass = "";
// if (!($.cookie("login") && $.cookie("pass"))) {
//     console.info($.cookie("login"));
//     loginModal.modal('show');
// } else {
//     login = $.cookie("login");
// };
//listeners
logoutButton.on('click', function(e) {
    e.preventDefault();
    $.cookie("login", null);
    $.cookie("pass", null);
    loginModal.modal('toggle');
});
loginForm.on('submit', function(event) {
    event.preventDefault();
    login = $("#inputLogin").val();
    passwordHash = md5($('#inputPassword').val());
    $.get("http://api.bishkektaxi.org/LKUserAuthentificate", {
        login: login,
        password_hash: passwordHash
    }).done(function(data) {
        if (data.Code == "OK") {
            $.cookie("login", login);
            $.cookie("pass", passwordHash);
            loginModal.modal('toggle');
            window.location.reload();
        } else $("#loginStatus").html("<p>Ошибка аутентификации. Проверьте логи/пароль и повторите попытку</p>");
    }).fail(function() {
        console.log("Authentification failed");
        $("#loginStatus").html("<p>Ошибка аутентификации. Проверьте логи/пароль и повторите попытку</p>");
    }).always(function() {});
});

function format(d) {
    // `d` is the original data object  for the row
    var driver_name = d[0];
    var driver_id = ''
    $.each(drivers, function(key, val) {
        if (driver_name == val.DriverName + ' ' + val.DriverSurname) {
            driver_id = key;
        }
    });
    return '<div>Тут будет карта</div>';
}

function getCurrentDate() {
    var today = new Date(),
        dd = today.getDate(),
        mm = today.getMonth() + 1, //January is 0!
        yyyy = today.getFullYear(),
        hh = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds();
    if (dd < 10) {
        dd = '0' + dd
    };
    if (mm < 10) {
        mm = '0' + mm
    };
    if (hh < 10) {
        hh = '0' + hh
    };
    if (min < 10) {
        min = '0' + min
    };
    if (sec < 10) {
        sec = '0' + sec
    };
    return yyyy + '/' + mm + '/' + dd + ' ' + hh + ':' + min + ':' + sec;
}

function replenish(driver_id, amount, login) { //http://api.bishkektaxi.org/TurnoverMoney?driver_id=1&amount=10.0
    if (arguments.length == 3) {
        $.get("http://api.bishkektaxi.org/TurnoverMoney", {
            driver_id: driver_id,
            amount: amount,
            login: login
        }).done(function(data) {
            if (data.Code == 'OK') {
                $('.payment_result.bg-success').fadeIn(100).delay(2000).fadeOut(500)
            } else {
                $('.payment_result.bg-danger').fadeIn(100).delay(2000).fadeOut(500);
            }
        });
    } else {
        $('.payment_result').html("<p class='bg-success'>Не указана сумма или получатель платежа!<p>").delay(2000).fadeOut(500);
    }
};

function manageDriver(phonenumber, method, login) { //http://api.bishkektaxi.org/LKManageDriver?method=delete&phonenumber=79259992176&login=totsamax@gmail.com
    if (arguments.length == 3) {
        $.get("http://api.bishkektaxi.org/LKManageDriver", {
            phonenumber: phonenumber,
            method: method,
            login: login
        }).done(function(data) {
            if (data.Code == 'OK') {
                if (method == 'add') {
                    $('.add_result.bg-success').fadeIn(100).delay(2000).fadeOut(500)
                };
                if (method == 'delete') {
                    $('.delete_result.bg-success').fadeIn(100).delay(2000).fadeOut(500)
                };
                setTimeout(function() {
                    window.location.reload();
                }, 3000);
            } else {
                if (method == 'add') {
                    $('.add_result.bg-danger').fadeIn(100).delay(2000).fadeOut(500);
                };
                if (method == 'delete') {
                    $('.delete_result.bg-danger').fadeIn(100).delay(2000).fadeOut(500);
                };
            }
        });
    } else {}
};
$('#myTabs a').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
})
var drivers = {};
var login = $.cookie("login");
var init = $.get("http://api.bishkektaxi.org/GetDriversGeoInfo", {
    login: login
}).done(function(data) {
    var length = data.length;
    console.log(data);
    $(data).each(function(index, element) {
        $.get("http://api.bishkektaxi.org/GetDriverProfileEx", {
            driver_id: element[0]
        }).done(function(data) {
            drivers[element[0]] = data;
            if (index == length - 1) {
                $(document).trigger('driversReady')
            };
        });
    });
});
$(document).on("driversReady", function() {
    var options = '';
    var option = '';
    $.each(drivers, function(key, val) {
        option = "<option value=" + key + ">" + val.DriverName + "</option>";
        options += option;
    });
    $('#payments_select').append(options);
    $('#deleteDriver_name').append(options);
    $('#newOrderAssignDriver').append(options);
    //инициализация таблицы новых заказов
    var ordersTable = $('#newOrders').DataTable({
        "ajax": {
            "url": "http://api.bishkektaxi.org/GetTaxiOrderList?filter=actual&driver_id=-1",
            "dataSrc": ""
        },
        language: {
            "processing": "Подождите...",
            "search": "Поиск:",
            "lengthMenu": "Показать _MENU_ записей",
            "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
            "infoEmpty": "Записи с 0 до 0 из 0 записей",
            "infoFiltered": "(отфильтровано из _MAX_ записей)",
            "infoPostFix": "",
            "loadingRecords": "Загрузка записей...",
            "zeroRecords": "Записи отсутствуют.",
            "emptyTable": "В таблице отсутствуют данные",
            "paginate": {
                "first": "Первая",
                "previous": "Предыдущая",
                "next": "Следующая",
                "last": "Последняя"
            },
            "aria": {
                "sortAscending": ": активировать для сортировки столбца по возрастанию",
                "sortDescending": ": активировать для сортировки столбца по убыванию"
            }
        },
        "columns": [{
            "data": "Id"
        }, {
            "data": "From"
        }, {
            "data": "Where"
        }, {
            "data": "Time"
        }, {
            "data": "Custom"
        }, {
            "data": "Custom"
        }],
        "columnDefs": [{
            "targets": -2,
            "data": null,
            "defaultContent": "<select class='driversList'>" + options + "</select>"
        }, {
            "targets": -1,
            "data": null,
            "defaultContent": "<button class='accept'>Назначить</button>"
        }]
    });
    //инициализация таблицы принятых заказов
    var acceptedOrdersTable = $('#orders').DataTable({
        "ajax": {
            "url": "http://bishkektaxi-api-prod.azurewebsites.net/LKGetCompanyOrdersList?login=" + login,
            "dataSrc": ""
        },
        language: {
            "processing": "Подождите...",
            "search": "Поиск:",
            "lengthMenu": "Показать _MENU_ записей",
            "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
            "infoEmpty": "Записи с 0 до 0 из 0 записей",
            "infoFiltered": "(отфильтровано из _MAX_ записей)",
            "infoPostFix": "",
            "loadingRecords": "Загрузка записей...",
            "zeroRecords": "Записи отсутствуют.",
            "emptyTable": "В таблице отсутствуют данные",
            "paginate": {
                "first": "Первая",
                "previous": "Предыдущая",
                "next": "Следующая",
                "last": "Последняя"
            },
            "aria": {
                "sortAscending": ": активировать для сортировки столбца по возрастанию",
                "sortDescending": ": активировать для сортировки столбца по убыванию"
            }
        },
        "columns": [{
            "title": "Показать на карте",
            "className": 'details-control',
        }, {
            "title": "ФИО"
        }, {
            "title": "Дата"
        }, {
            "title": "Откуда"
        }, {
            "title": "Куда"
        }, {
            "title": "Статус"
        }]
    });
    // установка частоты обновления таблиц
    setInterval(function() {
        ordersTable.ajax.reload(null, false);
        acceptedOrdersTable.ajax.reload(null, false);
    }, 10000);
    //обработка нажатия кнопки "Пополнить счет"
    $('#payments_form').on('submit', function(e) {
        e.preventDefault();
        console.log($("#payments_amount").val());
        console.log($("#payments_select").val());
        replenish($("#payments_select").val(), $("#payments_amount").val(), login);
    });
    //обработка добавления нового заказа
    $('#newOrderForm').on('submit', function(e) {
        e.preventDefault();
        console.log(this);
        makeOrder($("#newOrderFrom").val(), $("#newOrderWhere").val(), $("#newOrderWhen").val(), $("#newOrderPhone").val(), login, $("#newOrderAssignDriver").val()); //
    });
    //обработка нажатия кнопки "Добавить водителя"
    $('#addDriver').on("submit", function(e) {
        e.preventDefault();
        manageDriver($("#driverPhoneNumber").val(), 'add', login);
    });
    //обработка нажатия кнопки "Удалить водителя"
    $('#deleteDriver').on("submit", function(e) {
        e.preventDefault();
        var phoneNumber = drivers[$('#deleteDriver_name').val()].PhoneNumber;
        console.log(phoneNumber);
        manageDriver(phoneNumber, 'delete', login);
    });
    //оброботка открытия карты по клику на первую ячейку
    $('#orders tbody').on('click', 'td.details-control', function() {
        var tr = $(this).closest('tr');
        var row = acceptedOrdersTable.row(tr);
        var driver_name = row.data()[1];
        var current_driver_id = ''
        $.each(drivers, function(key, val) {
            if (driver_name == val.DriverName + ' ' + val.DriverSurname) {
                current_driver_id = key;
            };
        });
        $.get("http://api.bishkektaxi.org/GetDriversGeoInfo", {
            login: login
        }).done(function(data) {
            $.each(data, function(key, val) {
                if (val[0] == current_driver_id) {
                    map.setView([val[2], val[1]], 13);
                }
            });
        });
    });
    //оброботка нажатия на кнопку "Назначить"
    $('#newOrders').on('click', 'button', function() {
        var data = ordersTable.row($(this).parents('tr')).data();
        var cell = ordersTable.cell(ordersTable.cell($(this).parents('td')).index().row, ordersTable.cell($(this).parents('td')).index().column - 1).node();
        var driverId = $(cell).children().val();
        var orderId = data.Id;
        console.info(data);
        $.get("http://api.bishkektaxi.org/LKAssignTaxiOrderToDriver", {
            login: login,
            order_id: orderId,
            driver_id: driverId,
            feed_datetime: getCurrentDate()
        }).done(function() {
            ordersTable.ajax.reload(null, false);
        });
    });
});
var map = L.map('map').setView([42.87592, 74.60197], 13);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
}).addTo(map);
//function onLocationFound(e) {
//    var radius = e.accuracy / 2;
//
//    L.marker(e.latlng).addTo(map)
//        .bindPopup("Вы в пределах " + radius + " метров от этой точки");
//
//    //   L.circle(e.latlng, radius).addTo(map);
//}
//
//map.on('locationfound', onLocationFound);
//map.locate({
//    setView: true,
//    maxZoom: 16
//});
var markers = {};

function update_position() {
    $.get("http://api.bishkektaxi.org/GetDriversGeoInfo", {
        login: login
    }).done(function(data) {
        var items = [];
        $.each(data, function(key, val) {
            if (!markers[key]) {
                markers[key] = L.marker([val[2], val[1]]);
                markers[key].addTo(map);
            } else {
                markers[key].setLatLng([val[2], val[1]]).update();
            };
            var url = "http://api.bishkektaxi.org/GetDriverProfileEx";
            $.getJSON(url, {
                driver_id: val[0].toString()
            }, function(data) {
                markers[key].bindPopup("<b>" + data.DriverName + " " + data.DriverSurname + "<b/><br>" + data.PhoneNumber, {
                    autoPan: false
                });
            });
        });
        setTimeout(update_position, 10000);
    });
}
update_position();