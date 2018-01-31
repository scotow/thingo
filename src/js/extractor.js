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
                    "unique": true
                },
                {
                    "title": "Description",
                    "path": ".template-resume",
                    "content": "string",
                    "unique": true
                }
            ]
        }
    ]
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
                entity.content = $(child).text();
                break;
            case: 'number':
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

$(function() {
    console.log(parseElement($('html'), template));
});
