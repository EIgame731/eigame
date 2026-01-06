canvas.style.touchAction = "none";

function getPos(e) {
  var rect = canvas.getBoundingClientRect();
  var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  var y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  return { x:x, y:y };
}

function startDraw(e){
  e.preventDefault();
  drawing = true;
  ctx.beginPath();
  var p = getPos(e);
  ctx.moveTo(p.x, p.y);
}

function draw(e){
  if (!drawing) return;
  e.preventDefault();

  ctx.strokeStyle = tool === "eraser" ? "#fff" : document.getElementById("color").value;
  ctx.lineWidth = tool === "eraser" ? 30 : 5;

  var p = getPos(e);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

function stopDraw(){ drawing = false; }

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

canvas.addEventListener("touchstart", startDraw, {passive:false});
canvas.addEventListener("touchmove", draw, {passive:false});
canvas.addEventListener("touchend", stopDraw);

function postImage() {
  var name = document.getElementById("artistName").value.trim();
  if (!name) {
    alert("Please enter your name");
    return;
  }

  var imgData = canvas.toDataURL("image/png");

  firebase.database().ref("fanarts").push({
    img: imgData,
    credit: "By " + name,
    time: Date.now()
  }, function(err){
    if(err){
      alert("Post failed");
    } else {
      window.location.href = "fanarts.html";
    }
  });
}

