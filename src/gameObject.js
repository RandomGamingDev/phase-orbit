class GameObject {
  constructor(rot, siz, speed, col, elem = (o, r) => circle(0, 0, r * o.siz)) {
    this.rot = rot;
    this.siz = siz;
    this.speed = speed;
    this.col = col;
    this.elem = elem;
  }
  
  draw(rad) {
    push();
    {
      noStroke();
      fill(this.col);

      const toAdd = this.speed * toDeltaTime();
      rotate(this.rot + toAdd);
      this.rot += toAdd;
      this.rot %= PI * 2;

      translate(rad, 0);

      this.elem(this, rad);
    }
    pop();
  }
}