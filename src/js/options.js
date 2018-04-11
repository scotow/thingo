const TEMPLATES_LIST_KEY = '66f0be45a753b7280ab88805c7967879';

var templatesName = null;
var currentTemplateName = null;

function initOptions() {
    loadTemplates().catch(() => alert('Cannot load templates.'));

    $('#save').click(() => {
        if (!currentTemplateName) {
            return;
        }

        saveTemplate();
    });

    $('#create').click(() => {
        const templateName = $('#template-name').val();

        if (!templateName) {
            return;
        }

        currentTemplateName = templateName;
        const $template = $('<option></option>').attr('selected', true).text(templateName);
        $('#templates-name').append($template);
        $('#template-data').val('').prop('disabled', false).focus();

        saveTemplate().catch(() => alert('Cannot create template.'));

        templatesName.push(templateName);
        updateTemplatesList().catch(window.alert.bind(null, 'Cannot update templates list.'));
    });

    $('#templates-name').change(() => {
        const $template = $('#templates-name').find(":selected");
        currentTemplateName = $template.val();

        if (!currentTemplateName) {
            currentTemplateName = null;
            $('#template-data').val('').prop('disabled', true);
            return;
        }
        loadTemplate().catch(window.alert.bind(null, 'Cannot load template data.'));
    });

    $('#delete').click(() => {
        if (!currentTemplateName) {
            return;
        }

        deleteTemplate().catch(window.alert.bind(null, 'Cannot delete template.'));
    });
}

async function loadTemplates() {
    templatesName = (await browser.storage.sync.get(TEMPLATES_LIST_KEY))[TEMPLATES_LIST_KEY] || [];

    const $templatesName = $('#templates-name');
    for (let templateName of templatesName) {
        $templatesName.append($('<option></option>').text(templateName));
    }
}

async function loadTemplate() {
    $('#template-data')
    .prop('disabled', false)
    .val((await browser.storage.sync.get(currentTemplateName))[currentTemplateName])
    .focus();
}

async function saveTemplate() {
    const template = {};
    template[currentTemplateName] = $('#template-data').val();
    await browser.storage.sync.set(template);
}

async function deleteTemplate() {
    await browser.storage.sync.remove(currentTemplateName);

    templatesName.splice(templatesName.indexOf(currentTemplateName));
    await updateTemplatesList();

    $('#templates-name').find(":selected").remove();
    $('#templates-name').first().attr('selected', true);
    $('#template-data').val('').prop('disabled', true);

    currentTemplateName = null;
}

async function updateTemplatesList() {
    const list = {};
    list[TEMPLATES_LIST_KEY] = templatesName
    await browser.storage.sync.set(list);
}

document.addEventListener('DOMContentLoaded', initOptions);