// Function to open the custom UI page for the Word of the Day.
function openWordOfTheDayPage() {
    chrome.tabs.create({ url: chrome.runtime.getURL("wordofday.html") });
  }
  
  // When the extension icon is clicked, open the Word of the Day page.
  chrome.action.onClicked.addListener(() => {
    openWordOfTheDayPage();
  });
  
  // On Chrome startup, check if the Word of the Day page has been opened today.
  chrome.runtime.onStartup.addListener(() => {
    // Get today’s date as a string (e.g., "Mon Feb 03 2025")
    const today = new Date().toDateString();
  
    // Retrieve the last opened date from storage.
    chrome.storage.local.get("lastOpenedDate", (data) => {
      if (data.lastOpenedDate !== today) {
        // If not yet opened today, update the storage and open the page.
        chrome.storage.local.set({ lastOpenedDate: today }, () => {
          openWordOfTheDayPage();
        });
      }
    });
  });
  