import { MeshLambertMaterial, NearestFilter, SRGBColorSpace, TextureLoader } from "three";

const textureLoader = new TextureLoader();

function loadTexture(path: string) {
	const texture = textureLoader.load(path);
	texture.colorSpace = SRGBColorSpace;
	texture.minFilter = NearestFilter;
	texture.magFilter = NearestFilter;
	return texture;
}

const textures = {
	dirt: loadTexture("/textures/dirt.png"),
	grass: loadTexture("/textures/grass_top.png"),
	grassSide: loadTexture("/textures/grass_side.png"),
	stone: loadTexture("/textures/stone.png"),
	coalOre: loadTexture("/textures/coal_ore.png"),
	ironOre: loadTexture("/textures/iron_ore.png"),
};

export const blocks = {
	empty: {
		id: 0,
		name: "empty",
		color: null,
		material: new MeshLambertMaterial(),
	},
	grass: {
		id: 1,
		name: "grass",
		color: "#CCFFCC",
		material: [
			new MeshLambertMaterial({ map: textures.grassSide }),
			new MeshLambertMaterial({ map: textures.grassSide }),
			new MeshLambertMaterial({ map: textures.grass }),
			new MeshLambertMaterial({ map: textures.grass }),
			new MeshLambertMaterial({ map: textures.grassSide }),
			new MeshLambertMaterial({ map: textures.grassSide }),
		],
	},
	dirt: {
		id: 2,
		name: "dirt",
		color: "#816C5F",
		material: new MeshLambertMaterial({ map: textures.dirt }),
	},

	stone: {
		id: 3,
		name: "stone",
		color: "#e3cba5",
		scale: { x: 30, y: 30, z: 30 },
		scarcity: 0.5,
		material: new MeshLambertMaterial({ map: textures.stone }),
	},

	coalOre: {
		id: 4,
		name: "coalOre",
		color: "#161616",
		scale: { x: 20, y: 20, z: 20 },
		scarcity: 0.5,
		material: new MeshLambertMaterial({ map: textures.coalOre }),
	},

	ironOre: {
		id: 5,
		name: "ironOre",
		color: "#676767",
		scale: { x: 60, y: 60, z: 60 },
		scarcity: 0.5,
		material: new MeshLambertMaterial({ map: textures.ironOre }),
	},
};

export const resourceBlocks = [blocks.stone, blocks.coalOre, blocks.ironOre];
