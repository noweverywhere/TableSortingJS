var createTableElement = function (src) {
  var table = document.createElement('table');
  if (typeof src !== "undefined") {
    table.dataset.src = src;
  }
  return table;
},
  expectedResponse = '[{"name":"Bob the builder","job":"Builder","age":27},{"name":"Steve Buscemi","job":"Eyes","age":56},{"name":"Tony Stark","job":"Ironman","age":34}]';


describe("ConsumerTable ", function () {
  var tableElement = createTableElement()
  var consumerTable = new ConsumerTable(tableElement);
  it('it should be defined', function () {
    expect(consumerTable).toBeDefined();
  });

  it('should remember the table it was given', function (){
    expect(consumerTable.table).toEqual(tableElement);
  })
});

describe("The table data loader", function() {

  it("should call its prototype's loadSrc method", function() {
    var tableElement = createTableElement()
    spyOn(ConsumerTable.prototype, 'loadSrc');  //.andCallThrough();
    var table = new ConsumerTable(tableElement);
    expect(ConsumerTable.prototype.loadSrc).toHaveBeenCalled();

  });

  it("should not continue if there is no data source", function() {
    var tableElement = createTableElement()
    spyOn(ConsumerTable.prototype, 'loadSrc');  //.andCallThrough();
    var table = new ConsumerTable(tableElement);
    expect(table.request).toBeUndefined();
  });

  it('should prepare an ajax call if the data source is defined', function () {
    var table, tableElement;
    spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
    spyOn(XMLHttpRequest.prototype, 'send');
    spyOn(ConsumerTable.prototype, 'requestHandler');
    tableElement = createTableElement('/');
    table = new ConsumerTable(tableElement);
    expect(table.request).toBeDefined();
    expect(XMLHttpRequest.prototype.open).toHaveBeenCalled();
    expect(XMLHttpRequest.prototype.send).toHaveBeenCalled();
    expect(ConsumerTable.prototype.requestHandler).toHaveBeenCalled();
  });

  /*it('should handle ajax responses', function () {
    spyOn(ConsumerTable.prototype, 'parseData');
    tableElement = createTableElement('/');
    table = new ConsumerTable(tableElement);

    expect(ConsumerTable.prototype.parseData).toHaveBeenCalled();
  });*/

});

describe('data parsing and DOM building ability', function() {
  var table, tableElement, data;
  beforeEach(function () {

    tableElement = createTableElement('/');
    table = new ConsumerTable(tableElement);
    data = table.data = JSON.parse(expectedResponse);

  });

  afterEach(function () {
    tableElement = 'undefined';
    table = 'undefined';
    data = 'undefined';
  })

  it('create the correct number of nodes', function () {

    table.parseData();
    expect(table.rows.length).toEqual(data.length);
  });

  it('should append the nodes to the table', function () {
    longestDataObject = (function (){
      // immediate function to get the number
      // of properties on the longest object
      // in the array
      var maxNumberOfProperties = 0,
        currentNumberOfProperties = 0;
      for (var i = 0; i < data.length; i+=1) {
        for(property in data[i]) {
          if(data[i].hasOwnProperty(property)) {
            currentNumberOfProperties += 1;
            if (currentNumberOfProperties > maxNumberOfProperties) {
              maxNumberOfProperties = currentNumberOfProperties;
            }
          }
        }
        currentNumberOfProperties = 0;
      }
      return maxNumberOfProperties;
    } )()

    expect(table.table.getElementsByTagName('th').length).toEqual(0);
    expect(table.table.getElementsByTagName('tr').length).toEqual(0);
    table.parseData();
    expect(table.table.getElementsByTagName('th').length).toEqual(longestDataObject);
    expect(table.table.getElementsByTagName('tr').length).toEqual(data.length + 1);
  });

  it('should be able to handle weird properties on the objects', function () {
    table.data =  [
      {
        "class":"Bob the builder",
        "prototype":"Builder",
        "%%.%%":27
      },{
        "class":"Steve Buscemi"
        ,"prototype":"Eyes",
        "%%.%%":56
      }
    ];
    table.parseData();
    expect(table.table.getElementsByTagName('tr').length).toEqual(table.data.length + 1);
  });
});

describe('ConsumerTable sorting ', function() {
  var table, tableElement, data;
  beforeEach(function () {
    tableElement = createTableElement('/');
    table = new ConsumerTable(tableElement);
    data = table.data = [{a: 3}, {a: 1}, {a: 2}];
    table.parseData();
    spyOn(ConsumerTable.prototype, 'sortByProperty').andCallThrough();
  });

  afterEach(function () {
    tableElement = 'undefined';
    table = 'undefined';
    data = 'undefined';
  })

  it ('Should be able to sort when given a property to sort by', function () {
    expect(parseInt(table.table.getElementsByTagName('td')[0].innerHTML, 10)).toEqual(data[0].a);
    table.sortByProperty("a");
    expect(parseInt(table.table.getElementsByTagName('td')[0].innerHTML, 10)).toEqual(data[1].a);

  });

  it ('Should be able to sort when clicked', function () {

    expect(parseInt(table.table.getElementsByTagName('td')[0].innerHTML, 10)).toEqual(data[0].a);
    table.table.getElementsByTagName('th')[0].click();
    expect(parseInt(table.table.getElementsByTagName('td')[0].innerHTML, 10)).toEqual(data[1].a);
    expect(ConsumerTable.prototype.sortByProperty).toHaveBeenCalled();
  });

  it ('Should be able to sort by reverse when clicked twice', function () {

    expect(parseInt(table.table.getElementsByTagName('td')[0].innerHTML, 10)).toEqual(data[0].a);
    table.table.getElementsByTagName('th')[0].click();
    expect(parseInt(table.table.getElementsByTagName('td')[0].innerHTML, 10)).toEqual(data[1].a);
    expect(parseInt(table.table.getElementsByTagName('td')[1].innerHTML, 10)).toEqual(data[2].a);
    //click a second time for reverse
    table.table.getElementsByTagName('th')[0].click();
    expect(parseInt(table.table.getElementsByTagName('td')[0].innerHTML, 10)).toEqual(data[0].a);
    expect(parseInt(table.table.getElementsByTagName('td')[2].innerHTML, 10)).toEqual(data[1].a);
    // make sure reverse method was called
    expect(ConsumerTable.prototype.sortByProperty).toHaveBeenCalledWith('a', true);
  });

});
