async function testbg() {
    setTimeout(function () {
        const blob = new Blob([JSON.stringify([1, 2, 3], null, '\t')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        await browser.downloads.download({
            url: url,
            filename: 'data.json',
        });
    }, 3000);
}
