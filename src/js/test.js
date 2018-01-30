async function reloadTabs() {
    try {
        // let {urls} = await browser.storage.get("urls");
        let urls = ['https://github.com/'];

        let tabs = await browser.tabs.query({url: urls});
        console.log(tabs);

        await Promise.all(
            Array.from(tabs, tab => browser.tabs.reload(tab.id))
        );

        await browser.notifications.create({
            type: "basic",
            iconUrl: "img/icon48.png",
            title: "Tabs reloaded",
            message: "Your tabs have been reloaded",
        });
    } catch (error) {
        console.error(`An error occurred while reloading tabs: ${error.message}`);
    }
}

async function getBookTitle() {
    const options = {
        active: true,
        currentWindow: true
    };

    let [tab] = await browser.tabs.query(options);
    console.log(tab);
}

document.addEventListener('DOMContentLoaded', () => {
    getBookTitle();
  //   chrome.tabs.query({
  //       active: true,
  //       currentWindow: true
  //   }, (tabs) => {
  //     // chrome.tabs.query invokes the callback with a list of tabs that match the
  //     // query. When the popup is opened, there is certainly a window and at least
  //     // one tab, so we can safely assume that |tabs| is a non-empty array.
  //     // A window can only have one active tab at a time, so the array consists of
  //     // exactly one tab.
  //     var tab = tabs[0];
  //
  //     // A tab is a plain object that provides information about the tab.
  //     // See https://developer.chrome.com/extensions/tabs#type-Tab
  //     var url = tab.url;
  //
  //     console.log(tab);
  // });
});
