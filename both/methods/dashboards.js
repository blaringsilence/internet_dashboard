Meteor.methods({
  newDashboard: function() {
    var userId = Meteor.userId();
    var dashboard = {};

    if (userId) {
      _.extend(dashboard, {
        ownerId: userId,
        editorIds: [userId],
        publiclyEditable: false
      });
    }

    var newDash = new Dashboard(dashboard);
    console.log('Dashboard: Creating dashboard');
    return Dashboards.insert(newDash);
  },
  copyDashboard: function(oldId) {
    var oldDashboard = Dashboards.findOne(oldId);
    var newId = Meteor.call('newDashboard');
    var newDashboard = Dashboards.findOne(newId);
    var copyFields = _.omit(
        Dashboards.simpleSchema().clean(_.clone(oldDashboard)),
        ['_id', 'ownerId', 'editorIds', 'publiclyEditable']
    );
    Meteor.call('updateDashboard', newId, copyFields);
    oldDashboard.widgets().forEach(function(widget) {
      newDashboard.addWidget(widget.copy());
    });
    return newId;
  },
  updateDashboard: function(id, attrs) {
    var dashboard = Dashboards.findOne(id);
    dashboard.authorize();
    var requiresOwnership = ['ownerId', 'editorIds', 'publiclyEditable'];
    if (!dashboard.isOwned()) {
      attrs = _.omit(attrs, requiresOwnership);
    }
    if (!_.isEmpty(attrs)) {
      console.log('Dashboard: Updating dashboard ' + id);
      Dashboards.update(dashboard._id, { $set: attrs });
    }
  },
  deleteDashboard: function(id) {
    var dashboard = Dashboards.findOne(id);
    dashboard.authorize();
    console.log('Dashboard: Deleting dashboard ' + id);
    var widgets = dashboard.widgets();
    widgets.forEach(function(widget) {
      Widgets.remove(widget._id);
    });
    Dashboards.remove(dashboard._id);
  }
});
