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

async function loadTemplate(url) {
    // const { url } = await currentTab();

    const matches = url.match(/^((?:\w+:\/\/)?(?:w{3}\.)?([^\/:?#]+))(?:[\/:?#]|$)/i);
    const path = matches && matches[1];
    const domain = matches && matches[2];

    if(!domain) throw new Error('Invliad domain name.');

    const template = JSON.parse(await fetchTemplate(domain));
    template.url = path;
    template.domain = domain;

    return template;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('parse').addEventListener('click', () => {
        let tab;
        currentTab()
        .then(currentTab => {
            tab = currentTab;
            return loadTemplate(tab.url);
        })
        .then(template => chrome.extension.getBackgroundPage().allPages(template, tab.id))
        .catch(error => console.error(error));
    });

    document.getElementById('single').addEventListener('click', () => {
        let tab;
        currentTab()
        .then(currentTab => {
            tab = currentTab;
            return loadTemplate(tab.url);
        })
        .then(template => chrome.extension.getBackgroundPage().singlePage(template, tab.id))
        .catch(error => console.error(error));
    });

    // document.getElementById('load').addEventListener('click', () => {});
});
