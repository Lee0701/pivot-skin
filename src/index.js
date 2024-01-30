
const tags = new Set([
    'textarea',
    'input',
])

function removeLineBreaks(element) {
    element.childNodes.forEach((node) => {
        if(node.nodeType === Node.TEXT_NODE) {
            node.data = node.data.replace(/(\r\n|\n|\r)/g, '')
        } else {
            const tagname = node.tagName.toLowerCase()
            if(!tags.has(tagname)) removeLineBreaks(node)
        }
    })
}

function onload() {
    removeLineBreaks(document.body)
}

window.addEventListener('load', onload)
onload()
