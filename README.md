
# Tabled
A plugin designed to enhance the usability and responsiveness of HTML tables on an accessible way.

Tabled is an HTML table plugin made to make your tables more user-friendly and adaptable on different viewport widths.

This plugin was created in order to have a lightweight solution that tries to offer a good experience while browsing data tables in the most user friendly way possible, following a similar approach than spreadsheet applications that will allow you to scroll through data without loosing the relationship between a data cell and the next.

This plugin was developed in collaboration with [@sganzer](https://github.com/sganzer), who assisted in designing the visual interface.


## Live demo
https://html-preview.github.io/?url=https://github.com/Javi-er/tabled/blob/main/docs/examples.html

## Features
There are two render modes available, the default *"data table"* style which will add a scrollbar to the table and controls for navigating it. It uses button elements and native browser scrolling, it can be controlled with the keyboard and it's correctly described on a screen reader.

This mode will check that some requirements are met, specifically:
- That the table doesn't have another `table` element inside of it or it's contained inside another table.
- That the table has a `tbody` element.

This plugin it's meant to work with valid tables that are well formed, if a table has broken or invalid markup the results can be unstable, for these cases it's recommended to force the stacked mode instead.

The *Stacked rows* mode will not make any modifications at larger viewport widths, but it will stack the rows one on top of another under a predefined breakpoint (1024px). This mode is recommended for tables with invalid or overly complex markup.

Both modes are tested and meant to work with most common tables layout and it can not work for cases where the tables are overly complex or with specific needs.

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
