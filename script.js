document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.getElementById("progress-bar");
    const loadingContainer = document.getElementById("loading-container");
    const contentDiv = document.getElementById("content");
    const wordElem = document.getElementById("word");
    const defElem = document.getElementById("definition");
  
    // Simulate the loading progress.
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + 5, 95); // increment up to 95%
      progressBar.style.width = progress + "%";
    }, 50);
  
    // Fetch the Word of the Day page from Merriam-Webster.
    fetch("https://www.merriam-webster.com/word-of-the-day")
      .then((response) => response.text())
      .then((htmlString) => {
        // Parse the fetched HTML string into a document.
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
  
        // Define the XPaths for the word and definition.
        const wordXpath = "/html/body/div/div/div[2]/main/article/div[1]/div[3]/div[1]/div/h2";
        const defXpath = "/html/body/div/div/div[2]/main/article/div[2]/div[1]/div/div[1]/p[1]";
  
        // Evaluate the XPath expressions.
        const wordNode = doc.evaluate(
          wordXpath,
          doc,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
  
        const defNode = doc.evaluate(
          defXpath,
          doc,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
  
        // Get the text content from the nodes.
        const wordText = wordNode ? wordNode.textContent.trim() : "Word not found";
        const defText = defNode ? defNode.textContent.trim() : "Definition not found";
  
        // Update the page with the scraped data.
        wordElem.textContent = wordText;
        defElem.textContent = defText;
      })
      .catch((error) => {
        console.error("Error fetching or parsing the page:", error);
        wordElem.textContent = "Error";
        defElem.textContent = "Could not fetch data.";
      })
      .finally(() => {
        // Once the fetch and parsing are done, complete the loading bar and show content.
        clearInterval(interval);
        progressBar.style.width = "100%";
  
        // Delay hiding the loading bar slightly for visual effect.
        setTimeout(() => {
          loadingContainer.style.display = "none";
          contentDiv.style.display = "block";
        }, 300);
      });
  });
  