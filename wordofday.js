import DomParser from "dom-parser";

document.addEventListener('DOMContentLoaded', () => {
    const wordEl = document.getElementById('word');
    const definitionEl = document.getElementById('definition');
    const errorEl = document.getElementById('error');
  
    // Fetch the Merriam-Webster Word of the Day page
    fetch("https://www.merriam-webster.com/word-of-the-day")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok (status ${response.status})`);
        }
        return response.text();
      })
      .then(html => {
        // Use the imported dom-parser library to parse the HTML.
        // (Ensure that dom-parser.min.js is correctly loaded and exposes "DomParser" globally.)
        const parser = new DomParser();
        const doc = parser.parseFromString(html, "text/html");
  
        // Extract the word of the day and its definition.
        // Note: These selectors may need updating based on the actual page structure.
        const word = doc.querySelector('.word-and-pronunciation h1')?.textContent.trim();
        const definition = doc.querySelector('.wod-definition-container p')?.textContent.trim();
  
        if (word && definition) {
          wordEl.textContent = word;
          definitionEl.textContent = definition;
        } else {
          wordEl.textContent = "Error loading Word of the Day";
          errorEl.textContent = "Could not locate the word or definition. Please verify the page structure.";
        }
      })
      .catch(error => {
        console.error("Error fetching or parsing the page:", error);
        wordEl.textContent = "Error loading Word of the Day";
        errorEl.textContent = error.toString();
      });
  });
  