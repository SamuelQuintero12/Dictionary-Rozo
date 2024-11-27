// Importar el diccionario
import { dictionary } from './dictionary.js';

// Selección de elementos del DOM
const wordInput = document.getElementById("wordInput");
const translateButton = document.getElementById("translateButton");
const translationResult = document.getElementById("translationResult");
const wordList = document.getElementById("wordList");
const sortAZButton = document.getElementById("sortAZButton");
const sortZAButton = document.getElementById("sortZAButton");
const categoryRadios = document.getElementsByName("category");
const addWordForm = document.getElementById("addWordForm");
const newWordEn = document.getElementById("newWordEn");
const newWordEs = document.getElementById("newWordEs");
const exampleInput = document.getElementById("example");
const categorySelect = document.getElementById("categorySelect");
const toggleDictionaryButton = document.getElementById("toggleDictionaryButton");
const dictionarySection = document.getElementById("dictionary");

let currentWords = []; // Mantiene las palabras filtradas actualmente

// Función para mostrar u ocultar el diccionario
function toggleDictionary() {
    dictionarySection.style.display = dictionarySection.style.display === "none" ? "block" : "none";
}

// Función para mostrar palabras en la lista
function displayWords(words) {
    wordList.innerHTML = "";
    words.forEach(word => {
        const li = document.createElement("li");
        li.textContent = `${word.english} → ${word.spanish} (Ejemplo: ${word.example})`;
        wordList.appendChild(li);
    });
}

// Función para obtener palabras filtradas por categoría
function getFilteredWords() {
    const selectedCategory = Array.from(categoryRadios).find(radio => radio.checked).value;
    if (selectedCategory === "all") {
        return Object.values(dictionary.category).flat();
    } else {
        return dictionary.category[selectedCategory] || [];
    }
}

// Nueva función para manejar el cambio de categoría
function handleCategoryChange() {
    currentWords = getFilteredWords(); // Actualiza las palabras actuales según la categoría seleccionada
    displayWords(currentWords); // Mostrar las palabras filtradas inmediatamente
}

// Función para ordenar palabras de A-Z
function sortWordsAZ() {
    currentWords.sort((a, b) => a.english.localeCompare(b.english));
    displayWords(currentWords);
}

// Función para ordenar palabras de Z-A
function sortWordsZA() {
    currentWords.sort((a, b) => b.english.localeCompare(a.english));
    displayWords(currentWords);
}

// Función para añadir nuevas palabras al diccionario
function addNewWord(event) {
    event.preventDefault();

    const newWord = {
        id: Date.now(),
        english: newWordEn.value.trim(),
        spanish: newWordEs.value.trim(),
        example: exampleInput.value.trim(),
    };

    const selectedCategory = categorySelect.value;

    if (!dictionary.category[selectedCategory]) {
        dictionary.category[selectedCategory] = [];
    }

    dictionary.category[selectedCategory].push(newWord);

    // Limpiar formulario
    newWordEn.value = "";
    newWordEs.value = "";
    exampleInput.value = "";
    categorySelect.value = "fruits";

    // Actualizar lista de palabras
    handleCategoryChange(); // Refresca la lista con las nuevas palabras
}

// Nueva lógica para manejar la traducción
translateButton.addEventListener('click', () => { 
    const input = wordInput.value.trim().toLowerCase();
    const direction = document.querySelector('input[name="language"]:checked').value;

    const translation = currentWords.find(word =>
        direction === 'es'
            ? word.english.toLowerCase() === input
            : word.spanish.toLowerCase() === input
    );

    if (translation) {
        translationResult.textContent = direction === 'es'
            ? `${translation.english} → ${translation.spanish} (Ejemplo: ${translation.example})`
            : `${translation.spanish} → ${translation.english} (Ejemplo: ${translation.example})`;
    } else {
        translationResult.textContent = 'Palabra no encontrada en el diccionario.';
    }
});

// Eventos
sortAZButton.addEventListener("click", sortWordsAZ); // Ordenar A-Z
sortZAButton.addEventListener("click", sortWordsZA); // Ordenar Z-A
addWordForm.addEventListener("submit", addNewWord); // Añadir nueva palabra
toggleDictionaryButton.addEventListener("click", toggleDictionary); // Mostrar/Ocultar diccionario
categoryRadios.forEach(radio => {
    radio.addEventListener("change", handleCategoryChange); // Filtrar por categoría
});

// Inicializar la lista de palabras al cargar la página
window.onload = () => {
    dictionarySection.style.display = "none"; // Ocultar el diccionario inicialmente
    handleCategoryChange(); // Mostrar palabras iniciales
};
