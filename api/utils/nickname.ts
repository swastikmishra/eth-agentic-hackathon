import { adjectives, nouns } from "./nicknameConstants";
import prisma from "../prisma/prisma";

function getRandomElement(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
}

function capitalizeWords(str: string): string {
    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Generates a random nickname with 2 or 3 words.
export function generateRandomNickname() {
    let nickname = "";

    const adjective = getRandomElement(adjectives);
    const noun = getRandomElement(nouns);
    nickname = `${adjective} ${noun}`;

    // Capitalize the first letter of each word
    return capitalizeWords(nickname);
}
