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

async function extractData(template) {
    const tab = await currentTab();

    return await browser.tabs.sendMessage(tab.id, {
        action: 'extract',
        template: template
    });
}

async function nextPage() {
    const tab = await currentTab();

    return await browser.tabs.sendMessage(tab.id, { action: 'next' });
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
        filename: 'data.json'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('parse').addEventListener('click', () => {
        loadTemplate()
        .then(template => extractData(template))
        .then(data => donwloadData(data))
        .catch(error => {
            console.error(error);
        });
    });

    document.getElementById('next').addEventListener('click', () => {
        nextPage().catch(error => console.error(error));
    });

    document.getElementById('load').addEventListener('click', () => {
        loadTemplate();
    });
});
