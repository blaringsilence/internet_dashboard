Settings = {
  indicatorNames: [
    'Broadband subscription charge as a percentage of GDP per capita PPP (0-1 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>1-4 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>4-10 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>10-25 Mbps)',
    'Broadband subscription charge as a percentage of GDP per capita PPP (>25 Mbps)',
  ],
  speedRegex: /(\d+-)?\d+ Mbps/,
  maxSpeed: '25 Mbps',
  lowerCellClassBounds: { 66: 'success', 33: 'warning', 0: 'danger' },
};

BroadbandCostWidget = function(doc) {
  Widget.call(this, doc);

  if (this.data.isEmpty() && Meteor.isClient) {
    var self = this;
    Meteor.subscribe('imon_countries', function() {
      self.data.set({
        country: IMonCountries.findOne({ code: 'usa' }),
      });
    });
  }
};

BroadbandCostWidget.prototype = Object.create(Widget.prototype);
BroadbandCostWidget.prototype.constructor = BroadbandCostWidget;

_.extend(BroadbandCostWidget.prototype, {
  setCountry: function(countryCode) {
    var widget = this;
    CountryInfo.byCode(countryCode, function(country) {
      var code = country.alpha3.toLowerCase();
      var country = IMonCountries.findOne({ code: code });
      if (country) {
        widget.data.set({ country: country });
      }
    });
  },
  getCountry: function() {
    return IMonCountries.findOne({ code: this.data.country.code });
  },
  getIndicatorByName: function(name) {
    return _.findWhere(this.getCountry().indicators, { name: name });
  }
});

BroadbandCost = {
  widget: {
    name: 'Broadband Cost',
    description: 'Shows the cost of broadband access, as a proportion of per capita income, across five tiers based on download speed',
    url: 'https://thenetmonitor.org/sources#bbprice',
    dimensions: { width: 3, height: 1 },
    resize: { mode: 'reflow',
              constraints: { height: { min: 1, max: 1 }, width: { min: 2 } } },
    constructor: BroadbandCostWidget
  },
  org: {
    name: 'Google Policy by the Numbers and Communications Chambers',
    shortName: 'Google',
    url: 'http://policybythenumbers.blogspot.com/'
  }
};
