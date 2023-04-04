const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let spots = []; // пятна
let hue = 0; //оттенок

const mouse = {
  x: undefined,
  y: undefined,
}

canvas.addEventListener('mousemove', function(event) {
  mouse.x = event.x;
  mouse.y = event.y;

  for(let i = 0; i < 3; i++) {
    spots.push(new Particle());
  }
});

// Частица
class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 2 + 0.1;
    this.speedX = Math.random() * 2 - 1; 
    this.speedY = Math.random() * 2 - 1;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }

  update() {
    this.x += this.speedX;                  
    this.y += this.speedY;
    if (this.size > 0.1) this.size -= 0.03; // size если больше 0.1, то убавить 0.03
  }

  draw() { // рисовать
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // кружки в рандомных позициях и размере
    ctx.fill(); // залить текущим цветом
  }
};

// линия частицы
function handleParticle () { // handle - рука
  for (let i = 0; i < spots.length; i++) {
    spots[i].update();
    spots[i].draw();
    for(let j = i; j < spots.length; j++) { // j на одну больше, чем i
      const dx = spots[i].x - spots[j].x;
      const dy = spots[i].y- spots[j].y;
      // Math.sqrt() возвращает квадратный корень числа, то есть. Если число отрицательное, то вернётся NaN.
      const distance = Math.sqrt(dx * dx + dy * dy); // пример: Math.sqrt(9); // 3

      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = spots[i].color;
        ctx.lineWidth = spots[i].size / 10;
        ctx.moveTo(spots[i].x, spots[i].y);
        ctx.lineTo(spots[j].x, spots[j].y);
        ctx.stroke();
      }
    }

    if(spots[i].size <= 0.3) {
      spots.splice(i, 1); // вырезать из массива с индекса i до индекса 1
      i--;
    }
  }
};

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticle();
  hue++;

  //! метод цикла браузерной анимации
  requestAnimationFrame(animate);
};

// resize - это собыите на измененеия окна
// если окно изменить, то присвоить новые размеры в canvas
window.addEventListener('resize', function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

window.addEventListener('mouseout', function() {
  mouse.x = undefined;
  mouse.y = undefined;
});

//animate(); // либо в <body onload="animate();">
