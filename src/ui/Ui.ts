import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { World } from "../WorldGen/World";
import { blocks, resourceBlocks } from "../WorldGen/Blocks";

export function createUi(world: World) {
	const gui = new GUI();

	gui.add(world.size, "width", 8, 128, 1).name("width");
	gui.add(world.size, "height", 8, 128, 1).name("height");

	const terrainFolder = gui.addFolder("Terrain");
	terrainFolder.add(world.params.terrain, "scale", 10, 100).name("Scale");
	terrainFolder.add(world.params.terrain, "magnitude", 0, 3, 0.1).name("Magnitude");
	terrainFolder.add(world.params.terrain, "offset", 0, 1).name("Offset");

	const resourceFolder = gui.addFolder("Resources");
	resourceBlocks.forEach((resourceBlock) => {
		const folder = resourceFolder.addFolder(resourceBlock.name);
		folder.add(resourceBlock.scale, "x", 10, 100).name("X Scale");
		folder.add(resourceBlock.scale, "y", 10, 100).name("Y Scale");
		folder.add(resourceBlock.scale, "z", 10, 100).name("Z Scale");
		folder.add(resourceBlock, "scarcity", 0, 1).name("Scarcity");
	});

	gui.add(world, "generate");
	gui.onChange(() => {
		world.generate();
	});
}
