"use strict";
class Tabled {
    constructor(options) {
        this.stackedClass = 'tabled--stacked';
        if (!options.index) {
            options.index = Math.floor(Math.random() * 10000);
        }
        if (this.checkConditions(options.table)) {
            options.table.classList.add('tabled');
            this.wrap(options.table);
            const wrapper = this.getWrapper(options.table);
            wrapper.setAttribute('id', 'tabled-n' + options.index);
            this.adjustColumnsWidth(options.table);
            this.addTableControls(options.table);
            this.applyFade(options.table);
            wrapper.addEventListener('scroll', () => {
                this.applyFade(options.table);
            });
            new ResizeObserver(() => {
                this.applyFade(options.table);
            }).observe(wrapper);
        }
        else if (options.table.classList.contains(this.stackedClass)) {
            const headers = Array.from(options.table.querySelectorAll('thead th'));
            const rows = Array.from(options.table.querySelectorAll('tbody tr'));
            rows.forEach((row) => {
                const cells = Array.from(row.querySelectorAll('td, th'));
                cells.forEach((cell, index) => {
                    const header = headers[index];
                    if (header) {
                        cell.setAttribute('data-label', header.innerText + ': ');
                    }
                });
            });
        }
        else if (options.fail_class) {
            options.table.classList.add(options.fail_class);
        }
    }
    getWrapper(table) {
        return table.parentNode;
    }
    getContainer(table) {
        return table.parentNode ? table.parentNode.parentNode : null;
    }
    adjustColumnsWidth(table, characterThresholdLarge = 50, characterThresholdSmall = 8, columnLarge = "tabled__column--large", columnSmall = "tabled__column--small") {
        for (let row of table.rows) {
            Array.from(row.cells).forEach((cell) => {
                if (cell.innerText.length > characterThresholdLarge) {
                    cell.classList.add(columnLarge);
                }
                else if (cell.innerText.length <= characterThresholdSmall) {
                    cell.classList.add(columnSmall);
                }
            });
        }
    }
    wrap(table) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('tabled--wrapper');
        wrapper.setAttribute('tabindex', '0');
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
        const container = document.createElement('div');
        container.classList.add('tabled--container');
        wrapper.parentNode.insertBefore(container, wrapper);
        container.appendChild(wrapper);
    }
    applyFade(table) {
        const wrapper = this.getWrapper(table), container = wrapper.parentNode;
        if (wrapper.scrollLeft > 1) {
            container.classList.add('tabled--fade-left');
            container.querySelector('.tabled--previous').removeAttribute('disabled');
        }
        else {
            container.classList.remove('tabled--fade-left');
            container.querySelector('.tabled--previous').setAttribute('disabled', 'disabled');
        }
        const width = wrapper.offsetWidth, scrollWidth = wrapper.scrollWidth;
        if (scrollWidth - wrapper.scrollLeft - width < 1) {
            container.classList.remove('tabled--fade-right');
            container.querySelector('.tabled--next').setAttribute('disabled', 'disabled');
        }
        else {
            container.classList.add('tabled--fade-right');
            container.querySelector('.tabled--next').removeAttribute('disabled');
        }
    }
    move(table, direction = 'previous') {
        var _a, _b;
        const wrapper = this.getWrapper(table);
        const containerLeft = (_b = (_a = wrapper.parentNode) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect().left) !== null && _b !== void 0 ? _b : 0;
        const columns = table.rows[0].cells.length > 1 ? table.rows[0].cells : table.rows[1].cells;
        let currentLeft = 0;
        let scrollToPosition = 0;
        if (direction == "next") {
            for (let i = 0; i < columns.length; i++) {
                let columnLeft = columns[i].getClientRects()[0].left;
                currentLeft = columnLeft - containerLeft;
                if (currentLeft > 1) {
                    scrollToPosition = columns[i].offsetLeft;
                    break;
                }
            }
        }
        else if (direction == "previous") {
            for (let i = columns.length - 1; i > 0; i--) {
                let columnLeft = columns[i].getClientRects()[0].left;
                currentLeft = columnLeft - containerLeft;
                if (currentLeft < 0) {
                    scrollToPosition = columns[i].offsetLeft;
                    break;
                }
            }
        }
        wrapper.scrollTo({
            left: scrollToPosition,
            top: 0,
            behavior: 'smooth'
        });
    }
    addTableControls(table) {
        ['next', 'previous'].forEach((direction) => {
            let button = document.createElement('button');
            button.classList.add('tabled--' + direction);
            button.setAttribute("aria-label", direction + " table column");
            button.setAttribute("aria-controls", this.getWrapper(table).getAttribute('id'));
            button.setAttribute("disabled", "disabled");
            button.setAttribute("type", "button");
            button.addEventListener('click', () => {
                this.move(table, direction);
            });
            const container = this.getContainer(table);
            if (container) {
                container.prepend(button);
            }
        });
        const caption = table.querySelector('caption');
        if (caption) {
            caption.classList.add('visually-hidden');
            const captionDiv = document.createElement('div');
            captionDiv.classList.add('table-caption');
            captionDiv.innerHTML = caption.innerText;
            captionDiv.setAttribute('aria-hidden', 'true');
            const container = this.getContainer(table);
            if (container) {
                container.appendChild(captionDiv);
            }
        }
    }
    checkConditions(table) {
        if (table.classList.contains(this.stackedClass)) {
            return false;
        }
        ;
        if (table.querySelector('table')) {
            return false;
        }
        ;
        if (!table.querySelector('table > tbody')) {
            return false;
        }
        ;
        const result = document.evaluate("ancestor::table", table, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (result) {
            return false;
        }
        ;
        return true;
    }
}
//# sourceMappingURL=tabled.js.map