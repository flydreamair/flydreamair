

$(function () {

	function add_minutes(dt, minutes) {

		return new Date(dt.getTime() + minutes * 60000);

	}

	function pad(n) {

		n = n + '';

		return n.length >= 2 ? n : new Array(2 - n.length + 1).join(0) + n;

	}

	$("#clicked_flight").hide()

	try {

		var url_string = (window.location.href);
		var url = new URL(url_string);
		var depart = url.searchParams.get("depart");
		var arrive = url.searchParams.get("arrive");
		var departDate = new Date(url.searchParams.get("departDate"));

		let day = departDate.getDay();
		let date = departDate.getDate();
		let month = departDate.getMonth();
		let year = departDate.getFullYear();

		const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

		$("#from-to").text(depart + " to " + arrive);
		$("#search-results-departure-date").text(days[day] + ", " + date + " " + months[month] + " " + year);

		let openRequest = indexedDB.open("flydreamairDB", 1);
		openRequest.onsuccess = () => {
			let db = openRequest.result;
			let trans = db.transaction("Flights", "readonly");
			let flights = trans.objectStore("Flights");
			let request = flights.openCursor();
			let html_out = '<div class="select-dropdown"><label for= "sort-by"> Sort by</label > <br /><select name="sorting" id="sort-by"><option value="departure">Departure</option><option value="price">Price</option><option value="flight-time">Flight time</option></select></div ></div >';


			let atLeastOne = false;

			request.onsuccess = () => {

				let cursor = request.result;

				if (cursor) {

					if (cursor.value.From == depart && cursor.value.To == arrive) {
						atLeastOne = true;
						//console.log(cursor.key + " " + cursor.value.From + " " + cursor.value.To + " " + cursor.value.Departure_Time + " " + cursor.value.Duration + " " + cursor.value.ECTicket + " " + cursor.value.BCTicket);

						html_out += '<div class="search-flight-box"><div><div class="flight-departure">';
						html_out += cursor.value.From + '<br />' + days[day] + ', ' + date + ' ' + months[month] + ' ' + year + '<br />' + cursor.value.Departure_Time;
						html_out += '</div><br /><div class="flight-arrival">';

						let depart_time_from = cursor.value.Departure_Time.split(":");

						let arrive_date = new Date(departDate);

						arrive_date.setHours(depart_time_from[0]);
						arrive_date.setMinutes(depart_time_from[1]);


						let outDate = add_minutes(arrive_date, parseInt(cursor.value.Duration));

						html_out += cursor.value.To + '<br />' + days[outDate.getDay()] + ', ' + outDate.getDate() + ' ' + months[outDate.getMonth()] + ' ' + outDate.getFullYear() + '<br />';
						html_out += pad(outDate.getHours()) + ':' + pad(outDate.getMinutes());
						html_out += '<br /><br /><button id="' + cursor.key + '"class="flight-is-being-booked">Book now</button></div></div></div><br /><br />';
						

					}

					cursor.continue();

				}


				if (atLeastOne) {

					//print there are no flights from this place to the arrival destination

				}

				$("#flight-search-out-div").html(html_out);
				db.close()

			}

		}
		

	} catch (err) {

		console.error(err);

	}

	$("body").on("click", ".flight-is-being-booked", function () {

		let key = $(this).attr("id");

		let newRequest = indexedDB.open('flydreamairDB');

		newRequest.onsuccess = () => {

			let db = openRequest.result;
			let trans = db.transaction("Flights", "readonly");
			let flights = trans.objectStore("Flights");

		}


	});

});