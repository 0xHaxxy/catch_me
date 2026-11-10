// ---------- Canvas ----------
const c = document.getElementById("c");
const ctx = c.getContext("2d");

// ---------- Settings ----------
const ghost_spawn_delay = 120;       // Unit in s
const loading_ghost = 60;       
const player_size = 32;         // Unit ox
const player_radius = player_size / 2;      // (collision)
const ghost_radius = 20;      

// ---------- load Images ----------
const player_img = new Image();
player_img.src = "Images/player.png";
const background_img = new Image();
background_img.src = "Images/background.jpeg";


// ----------Variables ----------
let mouvement_memory = []; 
let frame = 0;
let alive = false; 
let best = 0;
let lastScore = null;
const mouse = { x: 0, y: 0 };

// ----------Input functions ----------
function resize() 
{
  c.width = c.clientWidth;
  c.height = c.clientHeight;
}
addEventListener("resize", resize);
resize();

function setMouse(e)
{
  const r = c.getBoundingClientRect();
  mouse.x = e.clientX - r.left;
  mouse.y = e.clientY - r.top;
}
c.addEventListener("pointermove", setMouse);
c.addEventListener("pointerdown", e =>
{
  setMouse(e);
  if (!alive) { mouvement_memory = []; frame = 0; alive = true; }
});


// ----------Drawing function ----------
function circle(x, y, color, alpha, radius = player_radius) 
{
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

// Just in case the main img doesn't load proprely
function sprite(x, y, alpha)
{
  if (!player_img.complete || player_img.naturalWidth === 0) {
    circle(x, y, "#888", alpha);  
    return;
  }
  ctx.globalAlpha = alpha;
  ctx.drawImage(player_img, x - player_size / 2, y - player_size / 2, player_size, player_size);
  ctx.globalAlpha = 1;
}

function text(msg, y, size) 
{
  ctx.font = size + "px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(msg, c.width / 2, y);
}

function drawBackground(bg)
{
  if (background_img.complete && background_img.naturalWidth > 0) {
    ctx.drawImage(background_img, 0, 0, c.width, c.height);
  } else {
    ctx.fillStyle = bg;            // just in case the original IMG doesn't load correctly
    ctx.fillRect(0, 0, c.width, c.height);
  }
}


// ---------- Boucle principale ----------function gameLoop() {
  const css = getComputedStyle(document.documentElement);
  const bg = css.getPropertyValue("--bg");
  const fg = css.getPropertyValue("--fg");
  const ghostColor = css.getPropertyValue("--ghost");

  drawBackground(bg);

  if (alive) {
    mouvement_memory.push({ x: mouse.x, y: mouse.y });
    frame++;

    // le fantôme k rejoue ta position d'il y a (k+1)*DELAY frames
    for (let k = 0; (k + 1) * ghost_spawn_delay < frame; k++) {
      const age = frame - 1 - (k + 1) * ghost_spawn_delay;   // frames depuis son apparition
      const g = mouvement_memory[age];
      const deadly = age >= loading_ghost;

      circle(g.x, g.y, ghostColor, deadly ? 1 : 0.35, ghost_radius);

      if (deadly && Math.hypot(g.x - mouse.x, g.y - mouse.y) < player_radius + ghost_radius) {
        alive = false;
        lastScore = Math.floor(frame / 60);
        best = Math.max(best, lastScore);
      }
    }

    sprite(mouse.x, mouse.y, 1);

    ctx.fillStyle = fg;
    ctx.textAlign = "left";
    ctx.font = "50px system-ui, sans-serif";
    ctx.fillText(Math.floor(frame / 60) + " s", 16, 52);
  } else {
    ctx.fillStyle = fg;
    if (lastScore === null) {
      text("ÉCHO", c.height / 2 - 20, 56);
      text("Évite les fantômes de ton propre passé. Clique pour jouer.", c.height / 2 + 20, 24);
    } else {
      text("Touché par ton écho : " + lastScore + " s", c.height / 2 - 20, 48);
      text("Record : " + best + " s. Clique pour rejouer.", c.height / 2 + 20, 24);
    }
  }

  requestAnimationFrame(gameLoop);
}
gameLoop();