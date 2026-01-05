var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var drawing = false;
var tool = "pen";
var mode = "draw";

ctx.fillStyle = "#fff";
ctx.fillRect(0,0,canvas.width,canvas.height);

function setMode(m) {
  mode = m;
  document.getElementById("draw-area").style.display =
    m === "draw" ? "block" : "none";
  document.getElementById("import-area").style.display =
    m === "import" ? "block" : "none";
}

canvas.onmousedown = function(e){
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
};

canvas.onmousemove = function (e) {
  if (!drawing) return;

  ctx.globalCompositeOperation = "source-over";

  if (tool === "eraser") {
    ctx.strokeStyle = "#ffffff"; // สีพื้นหลัง
    ctx.lineWidth = 30;
  } else {
    ctx.strokeStyle = document.getElementById("color").value;
    ctx.lineWidth = 5;
  }

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

canvas.onmouseup = function(){ drawing = false; };
canvas.onmouseleave = function(){ drawing = false; };

function setTool(t){ tool = t; }

document.getElementById("artistName").onkeyup = function(){
  document.getElementById("postBtn").disabled =
    this.value.trim() === "";
};

document.getElementById("fileInput").onchange = function(e){
  var file = e.target.files[0];
  if (!file) return;

  var img = new Image();
  img.onload = function(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var s = Math.min(canvas.width/img.width, canvas.height/img.height);
    ctx.drawImage(
      img,
      (canvas.width-img.width*s)/2,
      (canvas.height-img.height*s)/2,
      img.width*s,
      img.height*s
    );
  };
  img.src = URL.createObjectURL(file);
};

function postImage(){
  var name = document.getElementById("artistName").value.trim();
  if (!name) return;

  var data = canvas.toDataURL("image/png");
  var fanarts = JSON.parse(localStorage.getItem("fanarts") || "[]");
  fanarts.push({ img:data, credit:"By "+name });
  localStorage.setItem("fanarts", JSON.stringify(fanarts));

  window.location.href = "fanarts.html";
}