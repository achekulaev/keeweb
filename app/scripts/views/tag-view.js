'use strict';

var Backbone = require('backbone'),
    Locale = require('../util/locale'),
    Alerts = require('../comp/alerts');

var TagView = Backbone.View.extend({
    template: require('templates/tag.hbs'),

    events: {
        'click .tag__buttons-trash': 'moveToTrash',
        'click .tag__back-button': 'returnToApp',
        'click .tag__btn-rename': 'renameTag'
    },

    initialize: function() {
        this.appModel = this.model;
    },

    render: function() {
        if (this.model) {
            this.renderTemplate({
                title: this.model.get('title')
            }, { plain: true });
        }
        return this;
    },

    showTag: function(tag) {
        this.model = tag;
        this.render();
    },

    renameTag: function() {
        var title = $.trim(this.$el.find('#tag__field-title').val());
        if (!title || title === this.model.get('title')) {
            return;
        }
        if (/[;,:]/.test(title)) {
            Alerts.error({ header: Locale.tagBadName, body: Locale.tagBadNameBody });
            return;
        }
        if (this.appModel.tags.some(function(t) { return t.toLowerCase() === title.toLowerCase(); })) {
            Alerts.error({ header: Locale.tagExists, body: Locale.tagExistsBody });
            return;
        }
        this.appModel.renameTag(this.model.get('title'), title);
        Backbone.trigger('select-all');
    },

    moveToTrash: function() {
        this.title = null;
        var that = this;
        Alerts.yesno({
            header: Locale.tagTrashQuestion,
            body: Locale.tagTrashQuestionBody,
            success: function() {
                that.appModel.renameTag(that.model.get('title'), undefined);
                Backbone.trigger('select-all');
            }
        });
    },

    returnToApp: function() {
        Backbone.trigger('edit-tag');
    }
});

module.exports = TagView;
