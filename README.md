**Under Development**

# Tabled
An HTML table plugin designed to enhance the usability and responsiveness of tables on web pages on an accesible way.

Tabled is an HTML table plugin crafted to make your tables more user-friendly and adaptable on different viewport widths. It's designed to seamlessly integrate into your projects, transforming static tables into responsive ones that work beautifully across different devices. Tabled doesn't aim to be flashy; it just wants to help you present your data in the best possible way without fuss.

## Features

TBD

## Installation
Just add the Tabled JavaScript and CSS files to your project and initialize the plugin – it's that simple!

## Usage

- Add your table's HTML markup.
- Include Tabled's JavaScript and CSS files.
- Initialize the plugin with your preferred options.

## Contributing and Feedback
We welcome contributions from the community to make Tabled even better. Whether it's reporting a bug, suggesting a feature, or contributing code, your help is appreciated.
Questions or feedback about Tabled? Feel free to reach out to us via the issue tracker.

## License
Tabled is licensed under the GPL (GNU General Public License), which means it's open-source and free to use, modify, and distribute for both personal and commercial projects.

## Examples

**Calling tabled from a Drupal JS file**

This will render every table using Tabled, exept by those specifically defined as "stacked" and also excluding layout builder tables.

```
((Drupal, once) => {
  /**
   * Initialize the behavior.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attach context and settings for the plugin.
   */
  Drupal.behaviors.tabled = {
    tableCount: 0,
    attach: function (context) {
      let index = Drupal.behaviors.tabled.tableCount;
      const tables = once('tabled',
      'table:not(.tabled--stacked):not([data-drupal-selector="edit-settings-selection-table"])'
      , context);
      const options = { failClass: 'table--stacked' };
      tables.forEach((table) => {
      	new Tabled(table, index++, options);
      });
      Drupal.behaviors.tabled.tableCount = index;
    },
  };
})(Drupal, once);
```
