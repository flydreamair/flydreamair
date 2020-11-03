$(function () {

	function add_minutes(dt, minutes) {

		return new Date(dt.getTime() + minutes * 60000);

	}

	function pad(n) {

		n = n + '';

		return n.length >= 2 ? n : new Array(2 - n.length + 1).join(0) + n;

	}

	$("#bottom-display-bar").hide()

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
						console.log(cursor.key + " " + cursor.value.From + " " + cursor.value.To + " " + cursor.value.Departure_Time + " " + cursor.value.Duration + " " + cursor.value.ECTicket + " " + cursor.value.BCTicket);

						let depart_time_from = cursor.value.Departure_Time.split(":");

						let arrive_date = new Date(departDate);

						arrive_date.setHours(depart_time_from[0]);
						arrive_date.setMinutes(depart_time_from[1]);


						let outDate = add_minutes(arrive_date, parseInt(cursor.value.Duration));

						html_out += '<div id="' + cursor.key + '" style="cursor:pointer;" class="search-flight-box" onclick="bookMe(' + cursor.key + ')" ><div class="flight-left-container"><div class="flight-left"><div class="flight-departure">';
						html_out += '<p class="flight-depart-city">' + cursor.value.From + '</p><p class="flight-depart-date">' + days[day] + ', ' + date + ' ' + months[month] + ' ' + year + ' </p >' + '<p class="flight-depart-time">' + cursor.value.Departure_Time + '</p>';
						html_out += '</div><div class="flight-arrow"></div><div class="flight-arrival<p class="flight-arrive-city">' + cursor.value.To + '</p><p class="flight-arrive-date">' + days[outDate.getDay()] + ', ' + outDate.getDate() + ' ' + months[outDate.getMonth()] + ' ' + outDate.getFullYear() +  '</p><p class="flight-arrive-time">' + pad(outDate.getHours()) + ':' + pad(outDate.getMinutes()) + '</p></div>';
						html_out += '<div class="flight-time"><b>Flight time:</b> '+ Math.floor(cursor.value.Duration/60) +' hours ' + (cursor.value.Duration % 60) + ' minutes</div></div></div><div class="flight-right-container">';
						html_out += '<div class="flight-right"><div class="flight-number">Flight number: ' + cursor.key + '</div > <div class="flight-price"><a class="book-now">$' + cursor.value.ECTicket + '</a></div></div ></div ></div > ';

					}

					cursor.continue();

					if (atLeastOne) {

						$("#display-results").html(html_out);

					} else {

						console.log("There are no available flights!");

					}

				}
				
				db.close()

			}

		}
		

	} catch (err) {

		console.error(err);

	}

});

function bookMe(flightID) {

	//Create a transaction and create a new flight object - add it to the current user if there is one
	//If there isn't, create an object store in which the flight is temporarily held until the customer is registered
	//Then, once registered, add the flight into the new customer object

	let openRequest = indexedDB.open('flydreamairDB');
	openRequest.onsuccess = function (e) {

		db = openRequest.result;
		let trans = db.transaction(["Flights", "Customers"], "readwrite");

		let flights = trans.objectStore('Flights');

		let request = flights.openCursor();

		request.onsuccess = () => {

			let cursor = request.result;

			if (cursor) {

				if (cursor.key == flightID) {

					if (localStorage.getItem("currentUser") != "") {
						let customers = trans.objectStore('Customers');
						let request2 = customers.openCursor();

						request2.onsuccess = () => {

							let cursor2 = request2.result;

							if (cursor2) {

								if (cursor2.key == localStorage.getItem("currentUser")) {
									
									let isU = true;
									cursor2.value.flights.forEach((flightx) => {

										if (flightx == cursor.key)
											isU = false;

									});
									if (isU) {

										let newFlights = [];
										let newFlight = {

											fID: cursor.key,
											seat: "AA",
											food: "AA",
											drink: "AA",
											entertainment: "AA",
											person: {

												title: "Mr",
												givenNames: "Given Name",
												lastName: "lN"

											},
											extra23kg: false,
											bookingContact: {

												chooseBookingContact: "Adult 1",


											}

										};

										cursor2.value.flights.forEach((x) => {

											if (typeof x != 'undefined')
												newFlights.push(x);

										});
										newFlights.push(cursor.key);
										let finalR = customers.put({

											fullName: cursor2.value.fullName,
											uID: cursor2.value.uID,
											address: {

												streetAddress: cursor2.value.address.streetAddress,
												state: cursor2.value.address.state,
												city: cursor2.value.address.city,
												postcode: cursor2.value.address.postcode

											},
											email: cursor2.key,
											password: cursor2.value.password,
											flights: newFlights
										});
									}
									
								} else
									cursor2.continue();
							}

						}
					} else {




					}

				} else
					cursor.continue();

			}


		}

	}


}