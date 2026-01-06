var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var drawing = false;
var tool = "pen";
var mode = "draw";

ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// ===== MODE =====
function setMode(m) {
  mode = m;
  document.getElementById("draw-area").style.display =
    m === "draw" ? "block" : "none";
  document.getElementById("import-area").style.display =
    m === "import" ? "block" : "none";
}

// ===== DRAW =====
canvas.onmousedown = function (e) {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
};

canvas.onmousemove = function (e) {
  if (!drawing) return;

  if (tool === "eraser") {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 30;
  } else {
    ctx.strokeStyle = document.getElementById("color").value;
    ctx.lineWidth = 5;
  }

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

canvas.onmouseup = canvas.onmouseleave = function () {
  drawing = false;
};

function setTool(t) {
  tool = t;
}

// ===== NAME =====
document.getElementById("artistName").oninput = function () {
  document.getElementById("postBtn").disabled =
    this.value.trim() === "";
};

// ===== UPLOAD =====
document.getElementById("fileInput").onchange = function (e) {
  var file = e.target.files[0];
  if (!file) return;

  var img = new Image();
  img.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var s = Math.min(
      canvas.width / img.width,
      canvas.height / img.height
    );

    ctx.drawImage(
      img,
      (canvas.width - img.width * s) / 2,
      (canvas.height - img.height * s) / 2,
      img.width * s,
      img.height * s
    );
  };
  img.src = URL.createObjectURL(file);
};

// ===== FIREBASE POST =====
var db = firebase.database();
var storage = firebase.storage();

function postImage() {
  var name = document.getElementById("artistName").value.trim();
  if (!name) return;

  canvas.toBlob(function (blob) {
    var ref = storage.ref("fanarts/fanart_" + Date.now() + ".png");
    ref.put(blob).then(function () {
      return ref.getDownloadURL();
    }).then(function (url) {
      return db.ref("fanarts").push({
        img: url,
        credit: "By " + name,
        time: Date.now()
      });
    }).then(function () {
      window.location.href = "fanarts.html";
    });
  });
}
