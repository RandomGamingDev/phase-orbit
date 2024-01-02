function touching(rad, circ1, circ2) {
  let distance = Math.sqrt(
    Math.abs(Math.cos(circ1.rot) - Math.cos(circ2.rot)) ** 2 +
    Math.abs(Math.sin(circ1.rot) - Math.sin(circ2.rot)) ** 2
  )
  return distance <= (circ1.siz + circ2.siz) / 2;
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const toDeltaTime = () => (deltaTime == 0 ? 10 : deltaTime) / (1000 / 60);