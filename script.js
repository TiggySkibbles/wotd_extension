document.addEventListener("DOMContentLoaded", () => {
    // Get references to page elements.
    const progressBar = document.getElementById("progress-bar");
    const loadingContainer = document.getElementById("loading-container");
    const contentDiv = document.getElementById("content");
    const wordElem = document.getElementById("word");
    const defElem = document.getElementById("definition");
  
    // Determine the target URL from the query parameter, or use the default.
    const urlParams = new URLSearchParams(window.location.search);
    let targetURL =
      urlParams.get("target") || "https://www.merriam-webster.com/word-of-the-day";
  
    // Simulate a loading bar progress.
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + 5, 95); // increment progress up to 95%
      progressBar.style.width = progress + "%";
    }, 50);
  
    // Fetch the target page.
    fetch(targetURL)
      .then((response) => response.text())
      .then((htmlString) => {
        // Parse the fetched HTML string into a document.
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
  
        // XPaths for the desired elements.
        const wordXpath =
          "/html/body/div/div/div[2]/main/article/div[1]/div[3]/div[1]/div/h2";
        const defXpath =
          "/html/body/div/div/div[2]/main/article/div[2]/div[1]/div/div[1]/p[1]";
        const prevXpath =
          "/html/body/div/div/div[2]/main/article/div[1]/div[3]/div[3]/a[1]";
        const nextXpath =
          "/html/body/div/div/div[2]/main/article/div[1]/div[3]/div[3]/a[2]";
  
        // Scrape the word and definition.
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
  
        const wordText = wordNode ? wordNode.textContent.trim() : "Word not found";
        const defText = defNode
          ? defNode.textContent.trim()
          : "Definition not found";
  
        // Update the page content.
        wordElem.textContent = wordText;
        defElem.textContent = defText;
  
        // Scrape the 'Previous' and 'Next' links.
        const prevNode = doc.evaluate(
          prevXpath,
          doc,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        const nextNode = doc.evaluate(
          nextXpath,
          doc,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
  
        // Get the href attributes from the anchor nodes.
        let prevLink = prevNode ? prevNode.getAttribute("href") : null;
        let nextLink = nextNode ? nextNode.getAttribute("href") : null;
  
        // If the URLs are relative, prepend the base URL.
        if (prevLink && prevLink.startsWith("/")) {
          prevLink = "https://www.merriam-webster.com" + prevLink;
        }
        if (nextLink && nextLink.startsWith("/")) {
          nextLink = "https://www.merriam-webster.com" + nextLink;
        }
  
        // Create a navigation container and buttons.
        const navContainer = document.createElement("div");
        navContainer.style.textAlign = "center";
        navContainer.style.marginTop = "20px";
  
        if (prevLink) {
          const prevButton = document.createElement("button");
          prevButton.textContent = "Previous";
          prevButton.style.marginRight = "10px";
          prevButton.addEventListener("click", () => {
            // Reload the extension page with the previous page as the target.
            window.location.href =
              chrome.runtime.getURL("index.html") +
              "?target=" +
              encodeURIComponent(prevLink);
          });
          navContainer.appendChild(prevButton);
        }
  
        if (nextLink) {
          const nextButton = document.createElement("button");
          nextButton.textContent = "Next";
          nextButton.addEventListener("click", () => {
            // Reload the extension page with the next page as the target.
            window.location.href =
              chrome.runtime.getURL("index.html") +
              "?target=" +
              encodeURIComponent(nextLink);
          });
          navContainer.appendChild(nextButton);
        }
  
        // Append the navigation container to the content.
        contentDiv.appendChild(navContainer);
      })
      .catch((error) => {
        console.error("Error fetching or parsing the page:", error);
        wordElem.textContent = "Error";
        defElem.textContent = "Could not fetch data.";
      })
      .finally(() => {
        // Complete the loading bar.
        clearInterval(interval);
        progressBar.style.width = "100%";
  
        // After a slight delay, hide the loading bar and display the content.
        setTimeout(() => {
          loadingContainer.style.display = "none";
          contentDiv.style.display = "block";
  
          // Format the content container: center it and limit its width to 50%.
          contentDiv.style.width = "50%";
          contentDiv.style.margin = "0 auto";
  
          // Center the text for the word and definition.
          wordElem.style.textAlign = "center";
          defElem.style.textAlign = "center";
        }, 300);
      });
  });
  