function parseElement2($element, template) {
    function extract(child) {
        const entity = { title: template.title };
        switch(typeof template.content) {
            case 'object':
                if(!Array.isArray(template.content)) return null;
                entity.content = template.content.map(subElement => parseElement($(child), subElement));
                break;
            case 'string':
                entity.content = template.trim ? $(child).text().trim() : $(child).text();
                break;
            case 'number':
                entity.content = Number($(child).text());
                break;
        }
        return entity;
    }

    const children = $element.find(template.path);
    if(template.unique) {
        const data = {};
        data[template.title] = extract(children.get(0));
        return data;
    } else {
        return children.map((index, child) => extract(child)).toArray();
    }
}

function parseElement($element, template) {
    function extract(child) {
        const entity = { title: template.title };
        switch(typeof template.content) {
            case 'object':
                if(!Array.isArray(template.content)) return null;
                entity.content = template.content.map(subElement => parseElement($(child), subElement));
                break;
            case 'string':
                entity.content = template.trim ? $(child).text().trim() : $(child).text();
                break;
            case 'number':
                entity.content = Number($(child).text());
                break;
        }
        return entity;
    }

    const children = $element.find(template.path);
    if(template.unique) {
        return extract(children.get(0));
    } else {
        return children.map((index, child) => extract(child)).toArray();
    }
}

function nextPage(next) {
    $(next.path).click();
}

function extractDisplayedData(template) {
    console.log(parseElement($('html'), template));
}

// function extractData(template) {
    // $(document).ajaxComplete((event, xhr, settings) => {
    //     if(settings.url === template.next.request) {
    //         extractDisplayedData(template.tree);
    //         nextPage(template.next);
    //     }
    // });
// }

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(!request.action) return;

    switch(request.action) {
        case 'extract':
            sendResponse(parseElement($('html'), request.tree));
            break;
        case 'next':
            const $nextButton = $(request.next.path).eq(0);
            if($nextButton.length) {
                $nextButton.get(0).click();
                sendResponse(true);
            } else {
                sendResponse(false);
            }
            break;
    }
});
