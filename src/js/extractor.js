const template = {
    "title": "Books",
    "path": "body #resultats > .notice",
    "content": [
        {
            "title": "Book",
            "path": ".search-item .notice_container .notice_corps .media-body",
            "content": [
                {
                    "title": "Title",
                    "path": ".title",
                    "content": "string",
                    "unique": true,
                    "trim": true
                },
                {
                    "title": "Description",
                    "path": ".template-resume",
                    "content": "string",
                    "unique": true,
                    "trim": true
                }
            ]
        }
    ],
    "unique": true
};

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
            sendResponse(parseElement($('html'), template));
            break;
        case 'next':
            $('button.suivant').eq(0).click();
            break;
    }
});
