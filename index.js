var ConsumerTable = function (table) {
  // This is the class constructor
  this.table = table;
  this.loadSrc();
  this.table.addEventListener('click', this.handleClicks());
  return this;
};

ConsumerTable.prototype.loadSrc = function () {
  // this method does the ajax call to collect
  // the data that will populate the table
  if (!this.table.dataset.src) {
    console.error('Can not load table data, src is empty');
  }
  this.request = new XMLHttpRequest( );
  this.request.onreadystatechange = this.requestHandler();
  this.request.open('GET', this.table.dataset.src);
  this.request.send();
}

ConsumerTable.prototype.requestHandler = function () {
  // returns event handler with reference to
  // originating object
  var ConsumerTable = this;
  return function () {
    // if ajax request is complete
    if (this.readyState === 4) {
      // if we had success
      if (this.status === 200) {
        try {
          ConsumerTable.data = JSON.parse(this.responseText);
        } catch (err) {
          console.error('Problem parsing data for table', err);
          return;
        }
        ConsumerTable.parseData();
      } else {
        // else if we had failure show console message
        console.error('Unable to load the table resource', ConsumerTable.table.dataset.src);
      }
    }
  }
}


ConsumerTable.prototype.parseData = function () {
  // this method creates the child table elements
  // and populates them with the data returned
  // from the ajax call
  this.body =  document.createElement('tbody');
  var fragment = document.createDocumentFragment(),
    head =  document.createElement('thead'),
    head_tr = document.createElement('tr'),
    tr, th, td,
    rows = [],
    columnNames = [];

  // append the elements to each other
  head.appendChild(head_tr)
  fragment.appendChild(head);
  fragment.appendChild(this.body);

  // loop over the data stored from the ajax response
  for (var i = 0; i < this.data.length; i += 1) {
    // each record will have a table row
    tr = document.createElement('tr');
    this.body.appendChild(tr);
    rows.push(tr);

    // loop over the object properties
    for (var property in this.data[i]) {
      if (this.data[i].hasOwnProperty(property) === false) {
        continue;
      }

      // if the property is new make a new th element and append it
      // to the table head
      if (columnNames.indexOf(property) === -1) {
        columnNames.push(property)
        th = document.createElement('th');
        th.innerHTML = property;
        head_tr.appendChild(th);
      }
      td = document.createElement('td');
      tr[property] = td.innerHTML = this.data[i][property];
      tr.appendChild(td);
    }
  }
  // store the rows for easy access when we need to sort them
  this.rows = rows;
  // append all the new elements to the table element
  this.table.appendChild(fragment);
}


ConsumerTable.prototype.handleClicks = function () {
  // returns event handler for clicks, with
  // reference to original table
  var ConsumerTable = this;
  return function (event) {
    var reverse = false;
    // make sure we have a header
    if (event.target.nodeName === 'TH') {
      // check to see whether we already have an element
      // from the previous click which may the same one
      if (typeof ConsumerTable.previousSort !== 'undefined') {
        // if this is the same element as previous click we will sort
        // the list in reverse, provided it was not sorted in reverse last time
        reverse = (ConsumerTable.previousSort.innerHTML === event.target.innerHTML &&
          ConsumerTable.previousSort.classList.contains('reverse') == false);
        // if it was already sorted in reverse remove the class
        ConsumerTable.previousSort.classList.remove('reverse');
      }
      ConsumerTable.sortByProperty(event.target.innerHTML, reverse);
      if (reverse === true) {
        // empty this property so that the next sort
        // will not be reversed
        ConsumerTable.previousSort = undefined;
        event.target.classList.add('reverse');
      }
      // remember which element was clicked last
      ConsumerTable.previousSort = event.target;
    }
  }
}

ConsumerTable.prototype.sortByProperty = function (propertyName, reverse) {
  // method that sorts the elements,
  // if argument "reverse" is true, list will be reversed after sorting

  // make a copy of the table body
  var replacement = this.body.cloneNode();
  // replace the original body with the copy
  // this is done to avoid causing reflows,
  // though this should not matter for shorter lists
  this.table.replaceChild(replacement , this.body)

  // sort the rows that were stored in the
  // ConsumerTable object
  this.rows.sort(function (a,b) {
    if (a[propertyName] < b[propertyName])
      return -1;
    if (a[propertyName] > b[propertyName])
      return 1;
    return 0;
  });
  if (reverse) {
    // reverse the order if needed
    this.rows.reverse()
  }

  // loop over the rows in the array and
  // and place the elements in the correct
  // order in the table body
  for (var i = 0; i < this.rows.length; i += 1) {
    this.body.appendChild(this.rows[i]);
  }

  // put the table body back with the correctly
  // ordered elements
  this.table.replaceChild(this.body, replacement)

}
