/* global app:true */

(function() {
  'use strict';

  app = app || {};

  app.Contact = Backbone.Model.extend({
    url: '/withdraw/',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      name: '',
      email: '',
      message: ''
    }
  });

  app.ContactView = Backbone.View.extend({
    el: '#contact',
    template: _.template( $('#tmpl-withdraw').html() ),
    events: {
      'submit form': 'preventSubmit',
      'click .btn-contact': 'contact'
    },
    initialize: function() {
      this.model = new app.Contact();
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
      this.$el.find('[name="addr"]').focus();
    },
    preventSubmit: function(event) {
      event.preventDefault();
    },
    contact: function() {
      this.$el.find('.btn-contact').attr('disabled', true);

      this.model.save({
        addr: this.$el.find('[name="addr"]').val(),
        amount: this.$el.find('[name="amount"]').val(),
        note: this.$el.find('[name="note"]').val()
      });
    }
  });

  $(document).ready(function() {
    app.contactView = new app.ContactView();
  });
}());
