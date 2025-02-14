<template>
  <div
    class="tile-background-container"
    :style="{ backgroundImage: props.bgAppImage }"
  >
    <canvas ref="canvas" id="bg-tile-cvs"></canvas>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps } from "vue";
const props = defineProps({
  bgAppImage: {
    type: String,
    default: "url('http://assets.kanapka.eu/images/AmsterdamBackground.png')",
  },
});

const tileSize = 24;
const tileGap = 8;
const tileGrid = [];

let lastChange = 0;
let progress = 0;
const duration = 3;

const randomHex = () => {
  const s = "0123456789abc";
  const index = Math.floor(Math.random() * s.length);
  return s[index];
};

const red = `90`;
const green = `90`;
const createTile = (x, y) => {
  return {
    x,
    y,
    currentColor: `#${red}${green}ff${randomHex()}0`,
    nextColor: `#${red}${green}ff${randomHex()}0`,
    interactionColor: `#${red}${green}ffa0`,
  };
};

const lerp = (s, e, p) => {
  return s + (e - s) * p;
};

const progressToHex = (firstHex, secondHex, progress) => {
  const s = "0123456789abcdef";
  const c1 = s.indexOf(firstHex[7]) * 16 + s.indexOf(firstHex[8]);
  const c2 = s.indexOf(secondHex[7]) * 16 + s.indexOf(secondHex[8]);

  const result = Math.floor(lerp(c1, c2, progress)).toString(16);

  return `#0000ff${result}`;
};

const drawTile = (tile, progress = 0) => {
  ctx.fillStyle = progressToHex(tile.currentColor, tile.nextColor, progress);
  ctx.filter = "blur(1px)";
  ctx.fillRect(tile.x, tile.y, tileSize, tileSize);
};

const draw = () => {
  if (Date.now() - lastChange > duration * 1000) {
    for (let x = 0; x < tileGrid.length; x++) {
      for (let y = 0; y < tileGrid[0].length; y++) {
        tileGrid[x][y].currentColor = tileGrid[x][y].nextColor;
        tileGrid[x][y].nextColor = `#0000ff${randomHex()}0`;
      }
    }

    lastChange = Date.now();
    progress = 0;
  } else {
    progress = (Date.now() - lastChange) / duration / 1000;
  }

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  for (let x = 0; x < tileGrid.length; x++) {
    for (let y = 0; y < tileGrid[0].length; y++) {
      drawTile(tileGrid[x][y], progress);
    }
  }

  requestAnimationFrame(draw);
};

let ctx = null;
const canvas = ref("canvas");
onMounted(() => {
  ctx = canvas.value.getContext("2d");

  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;

  let column = 0;
  for (let x = 0; x < canvas.value.width; x += tileSize + tileGap) {
    tileGrid.push([]);
    for (let y = 0; y < canvas.value.height; y += tileSize + tileGap) {
      tileGrid[column].push(createTile(x, y));
    }
    column++;
  }

  lastChange = Date.now();
  requestAnimationFrame(draw);
});
</script>

<style scoped>
.tile-background-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: #000;
}
#bg-tile-cvs {
  width: 100%;
  height: 100%;
  backdrop-filter: blur(1px);
}
</style>
