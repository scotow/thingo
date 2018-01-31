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

async function extractData() {
    const options = {
        active: true,
        currentWindow: true
    };

    let [tab] = await browser.tabs.query(options);

    return await browser.tabs.sendMessage(tab.id, { extract: true });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('parse').addEventListener('click', () => {
        extractData()
        .then(data => {
            const blob = new Blob([JSON.stringify(data, null, '\t')], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            return browser.downloads.download({
                url: url,
                filename: 'data.json'
            })
        })
        .catch(error => console.error(error));
    });

    document.getElementById('list').addEventListener('click', () => {
        // chrome.runtime.getPackageDirectoryEntry(entries => {
        //     console.log(entries);
        // })
        // console.log(chrome.extension.getURL('/assets/templates/bm-lille.fr.json'));
        chrome.runtime.getPackageDirectoryEntry(function(root) {
          root.getFile(chrome.extension.getURL('/assets/templates/bm-lille.fr.json'), {}, function(fileEntry) {
            fileEntry.file(function(file) {
              var reader = new FileReader();
              reader.onloadend = function(e) {
                console.log(this.result);
              };
              reader.readAsText(file);
          }, null);
        }, null);
        });
    });
});
