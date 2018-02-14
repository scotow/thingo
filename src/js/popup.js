/**
 * Get the current active tab open in the browser.
 * @return {Promise} A promise wrapping a tab object or an error.
 */
async function currentTab() {
    const options = {
        active: true,
        currentWindow: true
    };

    // Get current active tab.
    const tabs = await browser.tabs.query(options);

    // Reject promise if there is no or more than one tab.
    if(tabs.length !== 1) throw new Error('Number of active tab incorrect.');

    return tabs[0];
}

async function extractData(tree) {
    const tab = await currentTab();

    return await browser.tabs.sendMessage(tab.id, {
        action: 'extract',
        tree: tree
    });
}

async function nextPage(data) {
    const tab = await currentTab();

    return await browser.tabs.sendMessage(tab.id, {
        action: 'next',
        next: data
    });
}

function fetchTemplate(domain) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = data => {
            if(xhr.readyState !== XMLHttpRequest.DONE) return;
            if(xhr.status !== 200) {
                reject(new Error('Template file not found.'));
                return;
            }

            resolve(xhr.responseText);
        };
        xhr.open('GET', `/assets/templates/${domain}.json`, true);
        xhr.send();
    });
}

async function loadTemplate() {
    const { url } = await currentTab();

    const matches = url.match(/^(?:\w+:\/\/)?(?:w{3}\.)?([^\/:?#]+)(?:[\/:?#]|$)/i);
    const domain = matches && matches[1];

    if(!domain) throw new Error('Invliad domain name.');

    return JSON.parse(await fetchTemplate(domain));
}

async function donwloadData(data) {
    const blob = new Blob([JSON.stringify(data, null, '\t')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    await browser.downloads.download({
        url: url,
        filename: 'data.json',
        saveAs: false
    });
}

function wait(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('parse').addEventListener('click', () => {
        let data = [];

        loadTemplate()
        .then(template => {
            return new Promise((resolve, reject) => {
                function extractPage() {
                    wait(1000)
                    .then(() => extractData(template.tree))
                    .then(chunk => data.push(chunk))
                    .then(() => nextPage(template.next))
                    .then(success => {
                        if(!success) resolve(data);
                    })
                    .catch(error => reject(error));
                }

                chrome.webRequest.onCompleted.addListener(extractPage, { urls: ["http://www.bm-lille.fr/Default/Portal/Recherche/Search.svc/Search*"] });
                extractPage();
            });
        })
        .then(data => donwloadData(data))
        .catch(error => {
            console.error(error);
        });
    });

    document.getElementById('single').addEventListener('click', () => {
        loadTemplate()
        .then(template => extractData(template.tree))
        .then(data => donwloadData(data))
        .catch(error => console.error(error));
    });

    // document.getElementById('load').addEventListener('click', () => {
    //     loadTemplate();
    // });
});
