document.addEventListener('DOMContentLoaded', function () {
    let selectedElements = [];
    let currentElement = null;

    function reset() {
        selectedElements = [];
        currentElement = null;
        document.querySelectorAll('.htmlSelectorSelected').forEach( el => el.classList.remove(htmlSelectorSelected))
        document.querySelectorAll('.htmlSelectorCurrent').forEach( el => el.classList.remove(htmlSelectorCurrent))
    }

    function selectElement(element) {
        element.classList.add('htmlSelectorSelected');
        selectedElements.push(element);
    }

    function deselectElement(element) {
        element.classList.remove('htmlSelectorSelected');
        selectedElements = selectedElements.filter(el => el !== element);
        if (currentElement === element) {
            currentElement.classList.remove('htmlSelectorCurrent')
            currentElement = null;
        }
    }

    document.body.addEventListener('click', function (e) {
        const target = e.target;
        if (selectedElements.includes(target)) {
            setCurrentElement(target);
        } else {
            selectElement(target);
            setCurrentElement(target);
        }
    });

    function setCurrentElement(element) {
        if (currentElement)
            currentElement.classList.remove('htmlSelectorCurrent');
        currentElement = element;
        element.classList.add('htmlSelectorCurrent');
    }

    document.addEventListener('keydown', function (e) {
        if (!currentElement) return;
        e.preventDefault();

        switch (e.key) {
            case 'Tab':
                navigateToNextElement();
                break;
            case 'Backspace':
                deselectElement(currentElement);
                break;
            case 'ArrowLeft':
                moveCurrent(currentElement.previousElementSibling);
                break;
            case 'ArrowRight':
                moveCurrent(currentElement.nextElementSibling);
                break;
            case 'ArrowUp':
                if (currentElement !== document.documentElement)
                    moveCurrent(currentElement.parentNode);
                break;
            case 'ArrowDown':
                if (currentElement.children.length > 0) {
                    moveCurrent(currentElement.children[0]);
                }
                break;
            case 'Enter':
                sendSelectedData();
                break;
        }
    });

    function navigateToNextElement() {
        const currentIndex = selectedElements.indexOf(currentElement);
        const nextIndex = (currentIndex + 1) % selectedElements.length;
        setCurrentElement(selectedElements[nextIndex]);
    }

    function moveCurrent(newElement) {
        if (currentElement && newElement) {
            deselectElement(currentElement)
            if (selectedElements.indexOf(newElement) === -1) selectElement(newElement)
            setCurrentElement(newElement);
        }
    }

    function sendSelectedData() {
        const data = selectedElements.map(el => ({
            domPath: getDomPath(el),
            html: el.outerHTML
        }));
        window.parent.postMessage({
            eventType: 'htmlSelector',
            list: data
        }, '*')
    }

    function getDomPath(el) {
        var stack = [];
        while (el.parentNode != null) {
            var sibCount = 0;
            var sibIndex = 0;
            for (var i = 0; i < el.parentNode.childNodes.length; i++) {
                var sib = el.parentNode.childNodes[i];
                if (sib.nodeName == el.nodeName) {
                    if (sib === el) {
                        sibIndex = sibCount;
                    }
                    sibCount++;
                }
            }
            if (el.hasAttribute('id') && el.id != '') {
                stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
            } else if (sibCount > 1) {
                stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
            } else {
                stack.unshift(el.nodeName.toLowerCase());
            }
            el = el.parentNode;
        }
        return stack.slice(1).join(' > ');
    }

    const links = document.querySelectorAll('a');
    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
        });
    });

    window.addEventListener('message', function(event) {
        if (event.data && event.data.eventType === 'select') {
            const doms = event.data.list
            reset()
            doms.map( dom => document.querySelectorAll(dom).forEach( el => selectElement(el) ) )
        }
    })
});
