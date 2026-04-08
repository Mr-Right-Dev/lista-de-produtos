import randomWords from 'random-words';

const nameSize: number = 5;

export function generateName(): string {
    let output = "" 
    const items = randomWords(nameSize);

    items.forEach((word, i) => i == nameSize-1 ? output = output + word : output = output + word + "-");

    return output;
}

export function getListIdFromQuery(): [string, boolean] {
    const urlQuerry = new URLSearchParams(window.location.search);
    if (urlQuerry.has("listId") && urlQuerry.get("listId").trim() != "") {
        return [urlQuerry.get("listId"), false];
    }

    const newName = generateName();
    urlQuerry.set("listId", newName);
    window.location.search = `?${urlQuerry.toString()}`

    return [newName, true];
}

export function save() {

}

export { nameSize };