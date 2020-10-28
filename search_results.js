$(function () {

   //depart=Sydney&arrive=Melbourne&departDate=2020-10-30

	try {

		$("#clicked_flight").hide()

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

						html_out += '<div class="search-flight-box" ><div><div class="flight-departure">';
						html_out += cursor.value.From + '<br />' + days[day] + ', ' + date + ' ' + months[month] + ' ' + year + ' ' + cursor.value.Departure_Time;
						html_out += '</div><div class="flight-arrival">';
						html_out += cursor.value.To;
						html_out += '</div></div></div><br /><br />';
						

					}

					cursor.continue();

				}


				if (atLeastOne) {

					//print there are no flights from this place to the arrival destination

				}

				$("#flight-search-out-div").html(html_out);

			}

		}
		

	} catch (err) {

		console.error(err);

	}

});

/*<!--
				<!-- start flight result 1 -->
				<div class="search-flight-box">
					<!-- left-side flight details -->
					<div>
						<div class="flight-departure">
							Perth
							Fri, 09 October 2020
							13:00
						</div>
						<div class="flight-arrival">
							Sydney
							Fri, 09 October 2020
							19:40
						</div>
						<div class="flight-time"><b>Flight time:</b> 5h 10m</div>
					</div>
					<!-- dotted divider -->

					<!-- right-side flight number and price -->
					<div>
						<div class="flight-number">
							DA735
						</div>
						<div class="flight-price">
							<a href="">$626</a>
						</div>
					</div>
				</div>
				<!-- end flight result 1 -->


				<!-- start flight result 2 -->
				<div class="search-flight-box">
					<!-- left-side flight details -->
					<div>
						<div class="flight-departure">
							Perth
							Fri, 09 October 2020
							13:00
						</div>
						<div class="flight-arrival">
							Sydney
							Fri, 09 October 2020
							19:40
						</div>
						<div class="flight-time"><b>Flight time:</b> 5h 10m</div>
					</div>
					<!-- dotted divider -->

					<!-- right-side flight number and price -->
					<div>
						<div class="flight-number">
							DA735
						</div>
						<div class="flight-price">
							<a href="">$626</a>
						</div>
					</div>
				</div>
				<!-- end flight result 2 -->
				-->*/