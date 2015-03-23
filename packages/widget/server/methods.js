Meteor.methods({
  updateWidgetPositions: function(widgetPositions) {
    _.each(widgetPositions, function(widget) {
      var modifier = {
        $set: {
          position: { x: widget.row, y: widget.col },
          width: widget.size_x,
          height: widget.size_y,
        }
      };
      Widgets.update(widget.id, modifier);
    });
  },
  addWidgetToDashboard: function(widget) {
    if (_.isUndefined(widget.dashboardId)) {
      throw new Error('Widget object must have dashboard id.');
    }
    Widgets.insert(widget);
  },
  removeWidgetFromDashboard: function(widgetId) {
    Widgets.remove(widgetId);
  },
});
