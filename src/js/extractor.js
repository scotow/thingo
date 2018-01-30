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
                    "content": "string"
                },
                {
                    "title": "Description",
                    "path": ".template-info",
                    "content": "string"
                }
            ]
        }
    ]
};

function parseElement($element, template) {
    const data = {
        title: template.title,
    };

    switch (typeof template.content) {
        case 'object':
            if(!Array.isArray(template.content)) return;
            let ma_liste = [];
            $element.find(template.path).each((index, element) => {
                ma_liste.push(parseElement(,))
            });
            data.content = template.content.map((child) => parseElement(, child));
            break;
        case 'string':
            data.content = $element.find(template.path).text();
            break;

    }

    return data;
}

setTimeout(() => {
    console.log(parseElement($('html'), template));
}, 3000);
