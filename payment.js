$(function () {

    function pad(n) {

        n = n + '';

        return n.length >= 2 ? n : new Array(2 - n.length + 1).join(0) + n;

    }

    let or = indexedDB.open('flydreamairDB');

    or.onsuccess = () => {

        let db = or.result;
        let trans = db.transaction("Customers", "readwrite");

        let customers = trans.objectStore("Customers");
        let ady = customers.openCursor();

        ady.onsuccess = () => {
            let cursor = ady.result;

            if (cursor) {

                if (cursor.key == localStorage.getItem("currentUser")) {

                    let html_out = "";

                    let currentFlight = cursor.value.flights[cursor.value.flights.length - 1];
                    console.log(currentFlight);

                    html_out += '<div id="' + currentFlight.fID + '" style="cursor:pointer;" class="search-flight-box" " ><div class="flight-left-container"><div class="flight-left"><div class="flight-departure">';
                    html_out += '<p class="flight-depart-city">' + currentFlight.From + '</p><p class="flight-depart-date">' + currentFlight.departDate + ' </p >' + '<p class="flight-depart-time">' + currentFlight.Departure_Time + '</p>';
                    html_out += '</div><div class="flight-arrow"></div><div class="flight-arrival<p class="flight-arrive-city">' + currentFlight.To + '</p><p class="flight-arrive-date">' + currentFlight.arriveDate +  '</p></div>';
                    html_out += '<div class="flight-time"><b>Flight time:</b> ' + Math.floor(currentFlight.Duration / 60) + ' hours ' + (currentFlight.Duration % 60) + ' minutes</div></div></div><div class="flight-right-container">';
                    html_out += '<div class="flight-right"><div class="flight-number">Flight number: ' + currentFlight.fID + '</div > <div class="flight-price"><a class="book-now">$' + currentFlight.ECTicket + '</a></div></div ></div ></div > ';

                    $("#firstOut").append(html_out);

                    html_out = "";

                    html_out += "<tr><td>" + currentFlight.food + "</td><td>" + "$7.95" + "</td></tr>";
                    html_out += "<tr><td>" + currentFlight.drink + "</td><td>" + "$7.95" + "</td></tr>";
                    html_out += "<tr><td>" + currentFlight.entertainment + "</td><td>" + "$7.95" + "</td></tr>";
                    html_out += '< tr ><td colspan="2"><a href="in-flight.html">edit</a></td></tr >';

                    $("#secondOut").append(html_out);

                    //let total = currentFlight.ECTicket + 7.95 * 3;

                    $("#flights-total-price").text("$" + total);

                    html_out = "";

                    html_out += "<p>" + cursor.value.title + " " + cursor.value.givenNames + " " + cursor.value.lastName + "</p>";

                    html_out += "<p>" + cursor.value.address.street + ", " + cursor.value.address.city  + " " + cursor.value.address.state + " " + cursor.value.address.postCode + "</p>";
                    html_out += "<p>" + cursor.key + "</p>";

                    html_out += "<a href = 'account.html'>Edit</a>";

                    $("#thirdOut").append(html_out);

                } else
                    cursor.continue()

            }

        }

    }

    

});