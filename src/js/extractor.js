function parseElement($element, template) {
    function extract(child) {
        const entity = { title: template.title };
        switch (typeof template.content) {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(!request.action) return;

    switch(request.action) {
        case 'extract':
            console.log(request.template);
            sendResponse(parseElement($('html'), request.template));
            break;
        case 'next':
            $('button.suivant').eq(0).click();
            break;
    }
});
