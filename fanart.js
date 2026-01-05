// ===== DATA =====
var fanarts = JSON.parse(localStorage.getItem("fanarts")) || [
  { img: "img/fan1.png", credit: "By Name1" },
  { img: "img/fan2.png", credit: "By Name2" },
  { img: "img/fan3.png", credit: "By Name3" },
  { img: "img/fan4.png", credit: "By Name4" }
];

var page = 1;
var perPage = 9;

// ===== RENDER =====
function render() {
  var grid = document.getElementById("fanart-grid");
  grid.innerHTML = "";

  var reversed = fanarts.slice().reverse(); // รูปล่าสุดก่อน
  var totalPage = Math.ceil(reversed.length / perPage);

  var start = (page - 1) * perPage;
  var items = reversed.slice(start, start + perPage);

  for (var i = 0; i < items.length; i++) {
    var img = document.createElement("img");
    img.src = items[i].img;

    img.onclick = (function (src, credit) {
      return function () {
        openModal(src, credit);
      };
    })(items[i].img, items[i].credit);

    grid.appendChild(img);
  }

  document.getElementById("page-info").innerHTML =
    "Page " + page + " to " + totalPage;
}

// ===== PAGINATION =====
function nextPage() {
  var max = Math.ceil(fanarts.length / perPage);
  if (page < max) {
    page++;
    render();
  }
}

function prevPage() {
  if (page > 1) {
    page--;
    render();
  }
}

// ===== MODAL =====
function openModal(src, credit) {
  document.getElementById("modal").style.display = "block";
  document.getElementById("modal-img").src = src;
  document.getElementById("modal-credit").innerHTML = credit;
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// ===== POST BUTTON =====
document.getElementById("postBtn").onclick = function () {
  window.location.href = "post.html";
};

// ===== INIT =====
render();
