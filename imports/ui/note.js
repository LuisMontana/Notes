import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
 
import { Notes } from '../api/notes.js';
 
import './note.html';
 
Template.note.events({
  'submit .note-text'(event){
    event.preventDefault();
    const target = event.target;
    const text = target.text.value;
  	Meteor.call('notes.update', this._id, text);
  },  
  'click .delete'() {
    Meteor.call('notes.remove', this._id);
  },
});