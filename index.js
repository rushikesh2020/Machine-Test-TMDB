const showModal = document.getElementById("show-modal");
const movieModal = document.getElementById("movie-modal");
const backdrop = document.querySelector(".back-drop");
const movieForm = document.getElementById("movie-form");
const titleControl = document.getElementById("title-control");
const posterUrlControl = document.getElementById("posterUrl-control");
const overviewControl = document.getElementById("overview-control");
const ratingsControl = document.getElementById("ratings-control");
const cancelBtn = document.getElementById("cancel-btn");
const submitBtn = document.getElementById("submit-btn");
const updateBtn = document.getElementById("update-btn");
const movieContainer = document.getElementById("movie-container");

let movieArr = [];

const Uuid = () => {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
		/[xy]/g,
		character => {
			const random = (Math.random() * 16) | 0;
			const value = character === "x" ? random : (random & 0x3) | 0x8;

			return value.toString(16);
		}
	);
};

function modalToggler() {
	movieModal.classList.toggle("d-none");
	backdrop.classList.toggle("d-none");
}

function movieTemplating(arr) {
	let result = "";
	arr.forEach(ele => {
		result += `
            <div class="col-md-4">
					<div class="card">
						<figure id="${ele.movieId}" class="movie-card mb-0">
							<img
								src="${ele.url}"
								alt="Movie Poster"
							/>

							<figcaption>
								<div class="rating-section">
									<div class="row">
										<div class="col-md-10">
											<div class="movie-name">
												<h3>${ele.title}</h3>
											</div>
										</div>
										<div class="col-md-2">
											<div class="movie-rating">
												${
													ele.rating > 4
														? `<h3 class="bg-success">${ele.rating}</h3>`
														: ele.rating > 2
														? `<h3 class="bg-warning">${ele.rating}</h3>`
														: `<h3 class="bg-danger">${ele.rating}</h3>`
												}
											</div>
										</div>
									</div>
								</div>
								<div class="overview-section">
									<h3>${ele.title}</h3>
									<em>Overview</em>
									<p>
										${ele.overview}
									</p>
                                    <div class='action'>
                                        <button class='btn btn-warning' onclick='onEdit(this)'>Edit</button>
                                        <button class='btn btn-danger' onclick='onDelete(this)'>Delete</button>
                                    </div>
								</div>
							</figcaption>
						</figure>
					</div>
				</div>
        `;
	});

	movieContainer.innerHTML = result;
}

if (localStorage.getItem("movieArr")) {
	movieArr = JSON.parse(localStorage.getItem("movieArr"));
	movieTemplating(movieArr);
}

function onEdit(ele) {
	let editId = ele.closest(".movie-card").id;
	console.log(editId);
	localStorage.setItem("editId", editId);
	let editObj = movieArr.find(movie => movie.movieId === editId);
	modalToggler();
	titleControl.value = editObj.title;
	posterUrlControl.value = editObj.url;
	overviewControl.value = editObj.overview;
	ratingsControl.value = editObj.rating;

	updateBtn.classList.remove("d-none");
	submitBtn.classList.add("d-none");
}

function onMovieUpdate() {
	let updateId = localStorage.getItem("editId");
	console.log(updateId);
	let updateObj = {
		movieId: updateId,
		title: titleControl.value,
		url: posterUrlControl.value,
		overview: overviewControl.value,
		rating: ratingsControl.value,
	};

	let getIndex = movieArr.findIndex(movie => movie.movieId === updateId);

	movieArr[getIndex] = updateObj;
	localStorage.setItem("movieArr", JSON.stringify(movieArr));
	let getCard = document.getElementById(updateId);
	console.log(getCard);
	getCard.innerHTML = `<div class="card">
						<figure id="${updateObj.movieId}" class="movie-card mb-0">
							<img
								src="${updateObj.url}"
								alt="Movie Poster"
							/>

							<figcaption>
								<div class="rating-section">
									<div class="row">
										<div class="col-md-10">
											<div class="movie-name">
												<h3>${updateObj.title}</h3>
											</div>
										</div>
										<div class="col-md-2">
											<div class="movie-rating">
												${
													updateObj.rating > 4
														? `<h3 class="bg-success">${updateObj.rating}</h3>`
														: updateObj.rating > 2
														? `<h3 class="bg-warning">${updateObj.rating}</h3>`
														: `<h3 class="bg-danger">${updateObj.rating}</h3>`
												}
											</div>  
										</div>
									</div>
								</div>
								<div class="overview-section">
									<h3>${updateObj.title}</h3>
									<em>Overview</em>
									<p>
										${updateObj.overview}
									</p>
                                    <div class='action'>
                                        <button class='btn btn-warning' onclick='onEdit(this)'>Edit</button>
                                        <button class='btn btn-danger' onclick='onDelete(this)'>Delete</button>
                                    </div>
								</div>
							</figcaption>
						</figure>
					</div>`;

	updateBtn.classList.add("d-none");
	submitBtn.classList.remove("d-none");
	movieForm.reset();
	modalToggler();
	Swal.fire({
		title: `${updateObj.title} movie info updated succesfully`,
		icon: "success",
		timer: 2000,
	});
}

function onDelete(ele) {
	let deleteId = ele.closest(".movie-card").id;
	let getIndex = movieArr.findIndex(movie => movie.movieId === deleteId);
	let deleteObj = movieArr[getIndex];
	swal.fire({
		title: `Are you sure, you want to delete ${deleteObj.title}`,
		text: "You won't be able revert this!",
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Yes, delete it!",
	}).then(result => {
		if (result.isConfirmed) {
			movieArr.splice(getIndex, 1);
			localStorage.setItem("movieArr", JSON.stringify(movieArr));
			ele.closest(".col-md-4").remove();
			swal.fire({
				title: `${deleteObj.title} movie deleted successfully!!!`,
				text: "Your file has been deleted",
				icon: "success",
			});
		}
	});
}

function addMovie(movie) {
	let card = document.createElement("div");
	card.id = movie.movieId;
	card.className = "col-md-4";
	card.innerHTML = `<div class="card">
						<figure id="${movie.movieId}" class="movie-card mb-0">
							<img
								src="${movie.url}"
								alt="Movie Poster"
							/>

							<figcaption>
								<div class="rating-section">
									<div class="row">
										<div class="col-md-10">
											<div class="movie-name">
												<h3>${movie.title}</h3>
											</div>
										</div>
										<div class="col-md-2">
											<div class="movie-rating">
												${
													movie.rating > 4
														? `<h3 class="bg-success">${movie.rating}</h3>`
														: movie.rating > 2
														? `<h3 class="bg-warning">${movie.rating}</h3>`
														: `<h3 class="bg-danger">${movie.rating}</h3>`
												}
											</div>  
										</div>
									</div>
								</div>
								<div class="overview-section">
									<h3>${movie.title}</h3>
									<em>Overview</em>
									<p>
										${movie.overview}
									</p>
                                    <div class='action'>
                                        <button class='btn btn-warning' onclick='onEdit(this)'>Edit</button>
                                        <button class='btn btn-danger' onclick='onDelete(this)'>Delete</button>
                                    </div>
								</div>
							</figcaption>
						</figure>
					</div>
    `;

	movieContainer.prepend(card);
}

function onFormSubmit(event) {
	event.preventDefault();

	let movie = {
		movieId: Uuid(),
		title: titleControl.value,
		url: posterUrlControl.value,
		overview: overviewControl.value,
		rating: ratingsControl.value,
	};

	movieArr.unshift(movie);
	localStorage.setItem("movieArr", JSON.stringify(movieArr));
	addMovie(movie);
	event.target.reset();
	Swal.fire({
		title: `New Movie ${movie.title} added succesfully`,
		icon: "success",
		timer: 2000,
	});
}
showModal.addEventListener("click", modalToggler);
movieForm.addEventListener("submit", onFormSubmit);
cancelBtn.addEventListener("click", modalToggler);
updateBtn.addEventListener("click", onMovieUpdate);
