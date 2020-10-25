function click_event(){
	
	var i, tabcontent, tablinks;
	tabcontent = $(".tabcontent");

	for (i = 0; i < tabcontent.length; i++)
	tabcontent[i].style.display = "none";
  
	tablinks = $(".tablinks");

	for (i = 0; i < tablinks.length; i++)
	tablinks[i].className = tablinks[i].className.replace("active", "");

	let id_name = "#";
	id_name += $(this).attr("id");
	id_name += "_out";
  
	$(id_name).show();
	this.className += " active";

}

	class Booked_flight_one_way{
	
		constructor(to, from, time){
		
			this.to = to;
			this.from = from;
			this.time = time;

		}
		get_to(){
		
			return this.to;

		}
		get_from() {
		
			return this.from

		}
		get_time(){
		
			return this.time;

		}
		set_user(username){
		
			this.user = username;

		}
		get_user(){
		
			return this.user;

		}

	}


	var all_booked_flights  = [];
	if (JSON.parse(localStorage.getItem("all_booked_flights")) != null)
		all_booked_flights = JSON.parse(localStorage.getItem("all_booked_flights"));

	function pad(n) {

		n = n + '';

		return n.length >= 2 ? n : new Array(2 - n.length + 1).join(0) + n;

	}
	
	$("#home").on('click', click_event);
	$("#about_us").on('click', click_event);
	$("#contact_us").on('click', click_event);
	$("#covid_info").on('click', click_event);
	$("#flight_selection").on('click', click_event);
	$("#seat_selection").on('click', click_event);
	$("#food_drink_selection").on('click', click_event);
	$("#finalize_order").on('click', click_event);
	$("#book_new_flights").on('click', click_event);
	$("#manage_existing_flights").on('click', click_event);

	let show_my_flights = "<table class='table_loads'><tr><th>From</th><th>To</th><th>Departure time</th></tr>";

	all_booked_flights.forEach((x) => {
	
		if (x.user == sessionStorage.getItem("active_user"))
			show_my_flights += "<tr><th>" + x.from + "</th><th>" + x.to + "</th><th>" + x.time + "</th></tr>";
	
	});

	show_my_flights += "</table>";

	$("#manage_existing_flights_out").append("<p>" + show_my_flights + "</p>");

	var flights = [];

	if (JSON.parse(localStorage.getItem("flights")) != null)
		flights = JSON.parse(localStorage.getItem("flights"));
	else {

		var locations = ["Canberra", "Sydney", "Hobart", "Adelaide", "Perth", "Darwin", "Brisbane", "Melbourne"];

		var location_counter = 0;

		let today = new Date();

		for (var i = 0; i < 500; i++){

			let start_index = Math.floor(Math.random() * (7 - 0 + 1) + 0);
			let end_index = Math.floor(Math.random() * (7 - 0 + 1) + 0);

			if (start_index == end_index)
				++end_index;

			if (end_index == 8)
				end_index = 0;

			today.setHours(0, 0, 0, 0);
			today.setMilliseconds(Math.floor(Math.random() * (86399999 - 0 + 1) + 0));
			let hours = pad(today.getHours());
			let mins = pad(today.getMinutes());
			let this_time = hours + ":" + mins;

			flights.push({
	
				start: locations[start_index],
				end: locations[end_index],
				time: pad(this_time)

			});

		}

		localStorage.setItem("flights", JSON.stringify(flights));

	}

	

	class Booked_flight_round{
	
		constructor(to, from){
		
			this.to_start = to;
			this.from_start = from;

			this.to_end = from;
			this.from_end = to;

		}

	}

	var bookable_flights = [];
	var booking_flights = [];

	function add_flight(){
	
		let flight_arr_index = parseInt($(this).attr("id"));

		let current_flight = bookable_flights[flight_arr_index];

		current_flight.set_user(sessionStorage.getItem("active_user"));

		booking_flights.push(current_flight);

	}

	$("#submit_search").on('click', function(){
	
			let from = $("#from_val option:selected").text();
			let to = $("#to_val option:selected").text();

			$("#search_results_table").remove();

			bookable_flights.forEach(function(flight) {
				flights.pop();
			});

			let counter = 0;

			if (from != to){

				let dep_date = $("#dep_date").val();
				let ret_date = $("#ret_date").val();

				let trip_type = $("input:radio[name=trip]:checked").val();

				let search_results = "";

				if (trip_type == "one-way"){

					search_results += "<table id = 'search_results_table' class='table_loads'><tr><th>From</th><th>To</th><th>Departure time</th><th></th></tr>"

					flights.forEach((flight) => {
				
						if (flight.start == from && to == flight.end){
					
							search_results += "<tr><th>" + flight.start + "</th><th>" + flight.end + "</th><th>" + flight.time + "</th><th><button id='" + counter + "'>Book</button></th></tr>";

							let this_flight = new Booked_flight_one_way(flight.end, flight.start, flight.time);
							bookable_flights[counter++] = this_flight;

						}
				
					});
				
					search_results += "</table>"

					$("#flight_selection_out").append(search_results);

					$("#search_results_table :button").on('click', add_flight);

					localStorage.setItem("bookedFlights", JSON.stringify(booking_flights));

				} else if (trip_type == "round"){
				
					search_results += "<table id = 'search_results_table' class='table_loads'><tr><th>From</th><th>To</th><th>Departure time</th><th>To</th><th>From</th><th>Departure time</th><th></th></tr>"

					flights.forEach((flight) => {
					
						if (flight.start == from && flight.end == to){
						
							flights.forEach((x) => {
							
								if (x.start == flight.end && x.end == flight.start){
								
									search_results += "<tr><th>" + flight.start + "</th><th>" + flight.end + "</th><th>" + flight.time + "</th><th>" + x.start + "</th><th>" + x.end + "</th><th>" + x.time + "</th><th><button>Book</th></tr>"

								}
							
							});

						}
					
					});

					search_results += "</table>"

					$("#flight_selection_out").append(search_results);

				}

			}
	
	});


	$("#finalize_now").on('click', () => {
	
		booking_flights.forEach((x) => {
		
			all_booked_flights.push(x);
			localStorage.setItem("all_booked_flights", JSON.stringify(all_booked_flights));
			location.replace("indexb.html");
		
		});
	
	});