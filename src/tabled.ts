"use strict";

class Tabled {

  /**
   * Augment the table if it meets the necessary requirements.
   *
   * @param {Element} table
   */
  constructor(table, index, options) {
    if (this.checkConditions(table)) {
      // Set up attributes
      table.classList.add('tabled');

      // Add the wrapper
      this.wrap(table);
      const wrapper = this.getWrapper(table);
      wrapper.setAttribute('id', 'tabled-n' + index);

      // Identify and adjust columns that could need a large width
      this.adjustColumnsWidth(table);

      // Add navigation controls.
      this.addTableControls(table);

      // Identify and set the initial state for the tables
      this.applyFade(table);

      // On table scrolling, add or remove the left / right fading
      wrapper.addEventListener('scroll', (e) => {
        this.applyFade(table);
      });

      // Initialize a resize observer for changing the table status
      new ResizeObserver(() => {
        this.applyFade(table);
      }).observe(wrapper);

    } else if (options.failClass) {
      table.classList.add(options.failClass);
    }
  }

  /**
   *  Returns the wrapper of the table.
   *
   * @param {HTMLTableElement} table
   * @returns HTMLDivElement
   */
  getWrapper(table) {
    return table.parentNode;
  }

  /**
   *  Returns the container of the table.
   *
   * @param {HTMLTableElement} table
   * @returns HTMLDivElement
   */
  getContainer(table) {
    return table.parentNode.parentNode;
  }

  /**
   * Adjust column widths for cells that can have plenty of content by looking
   * at the cell height.
   *
   * @param {HTMLTableElement} table
   * @param {Integer} characterThreshold
   * @param {String} columnWidthLarge
   */
  adjustColumnsWidth(
    table,
    characterThresholdLarge = 50,
    characterThresholdSmall = 8,
    columnLarge = "tabled__column--large",
    columnSmall = "tabled__column--small"
  ) {
    for (let row of table.rows) {
      Array.from(row.cells).forEach((cell, index) => {
        // Check if there are cells that are taller than the threshold
        if (cell.innerText.length > characterThresholdLarge) {
          cell.classList.add(columnLarge);
        } else if (cell.innerText.length <= characterThresholdSmall) {
          cell.classList.add(columnSmall);
        }
      });
    }
  }

  /**
   * Wraps an element with another.
   *
   * @param {HTMLTableElement} table
   */
  wrap(table) {
    // Wrap the table in the scrollable div
    const wrapper = document.createElement('div');
    wrapper.classList.add('tabled--wrapper');
    wrapper.setAttribute('tabindex', '0');
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);

    // Wrap in another div for containing navigation and fading.
    const container = document.createElement('div');
    container.classList.add('tabled--container');
    wrapper.parentNode.insertBefore(container, wrapper);
    container.appendChild(wrapper);
  }

  /**
  * Applies a fading effect on the edges according to the scrollbar position.
  *
  * @param {HTMLTableElement} table
  */
  applyFade(table) {
    const wrapper = this.getWrapper(table),
      container = wrapper.parentNode;

    // Left fading
    if (wrapper.scrollLeft > 1) {
      container.classList.add('tabled--fade-left');
      container.querySelector('.tabled--previous').removeAttribute('disabled');
    } else {
      container.classList.remove('tabled--fade-left');
      container.querySelector('.tabled--previous').setAttribute('disabled', 'disabled');
    }

    // Right fading
    const width = wrapper.offsetWidth,
      scrollWidth = wrapper.scrollWidth;
    // If there is less than a pixel of difference between the table
    if (scrollWidth - wrapper.scrollLeft - width < 1) {
      container.classList.remove('tabled--fade-right');
      container.querySelector('.tabled--next').setAttribute('disabled', 'disabled');
    } else {
      container.classList.add('tabled--fade-right');
      container.querySelector('.tabled--next').removeAttribute('disabled');
    }
  }

  /**
   * Scroll the table in the specified direction.
   *
   * @param {HTMLTableElement} table
   * @param {string} direction ["previous", "next"]
   */
  move(table, direction = "previous") {
    const wrapper = this.getWrapper(table);

    // Get the container's left position
    const containerLeft = wrapper.parentNode.getBoundingClientRect().left;
    // The first row defines the columns, but in the case that the first row
    // has only one column, use the second row instead.
    const columns = table.rows[0].cells > 1 ? table.rows[0].cells : table.rows[1].cells;
    let currentLeft = 0;
    let scrollToPosition = 0;

    // Loop through all the columns in the table and find the next or prev
    // column based on the position of each columns in the container.
    if (direction == "next") {
      for (let i = 0; i < columns.length; i++) {
        let columnLeft = columns[i].getBoundingClientRect().left;
        currentLeft = columnLeft - containerLeft;
        if (currentLeft > 1) {
          scrollToPosition = columns[i].offsetLeft;
          break;
        }
      }
    } else if (direction == "previous") {
      for (let i = columns.length - 1; i > 0; i--) {
        // Get the left position of each column
        let columnLeft = columns[i].getBoundingClientRect().left;
        currentLeft = columnLeft - containerLeft;

        if (currentLeft <= 0) {
          scrollToPosition = columns[i].offsetLeft;
          break;
        }
      }
    }

    // Scroll to the identified position
    wrapper.scrollTo({
      left: scrollToPosition,
      top: 0,
      behavior: 'smooth'
    });

  }

  /**
   * Creates and attaches the table navigation.
   *
   * @param {HTMLTableElement} table
   */
  addTableControls(table) {
    // Set up the navigation.
    ['next', 'previous'].forEach((direction) => {
      let button = document.createElement('button');
      button.classList.add('tabled--' + direction);
      button.setAttribute("aria-label", direction + " table column");
      button.setAttribute("aria-controls", this.getWrapper(table).getAttribute('id'));
      button.setAttribute("disabled", "disabled");
      button.setAttribute("type", "button");
      button.addEventListener('click', (e) => {
        this.move(table, direction);
      });
      this.getContainer(table).prepend(button);
    });

    // Tweak the caption.
    const caption = table.querySelector('caption');
    if (caption) {
      caption.classList.add('visually-hidden');

      const captionDiv = document.createElement('div');
      captionDiv.classList.add('table-caption');
      captionDiv.innerHTML = caption.innerText;
      captionDiv.setAttribute('aria-hidden', true);
      this.getContainer(table).appendChild(captionDiv);
    }
  }

  /**
   * Validates if a table meets the necessary conditions for this plugin.
   *
   * @param {HTMLTableElement} table
   * @returns boolean
   */
  checkConditions(table) {
    let pass = true;

    // Don't initialize under the following conditions.
    // If a table has another table inside.
    if (table.querySelector('table')) { pass = false };

    // If a table is contained in another table.
    const result = document.evaluate("ancestor::table", table, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (result) { pass = false };

    // If the table doesn't have a tbody element as a direct descendant.
    if (!table.querySelector('table > tbody')) { pass = false };

    return pass;
  }
}
