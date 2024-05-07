import { Raycaster, Vector3 } from "three";

const LineCheck = (origin, direction, ships) => {
    const raycaster = new Raycaster(origin, new Vector3(direction).normalize(), 1);
    const intersections = raycaster.intersectObjects(ships, false);
    for (intersection of intersections) {
        const obj = intersections.object;
        alert(obj);
    }
}
