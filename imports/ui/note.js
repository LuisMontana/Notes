import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Notes } from '../api/notes.js';
 
import './note.html';
 
Template.note.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('notes.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
    Meteor.call('notes.remove', this._id);
  },
});