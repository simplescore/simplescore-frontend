export function locationMaybe(location, itemName) {
    return location.state && itemName in location.state ? location.state[itemName] : null;
}
