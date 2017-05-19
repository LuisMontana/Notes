import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Notes } from '../api/notes.js';

import './note.js';
import './body.html';
 
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('notes');

  this.state.set("sortByDate", true);
  this.state.set("sortDateAscending", true);
  this.state.set("sortPriorityAscending", true);
});

Template.body.helpers({
  notes() {
  	const instance = Template.instance();    
    if(instance.state.equals('sortByDate', true)){
      if(instance.state.equals('sortDateAscending', true)){
        return Notes.find({}, { sort: { createdAt: -1 } });
      }
      else{
        return Notes.find({}, { sort: { createdAt: 1 } });
      }
    }
    else{
      if(instance.state.equals('sortPriorityAscending', true)){
        return Notes.find({}, { sort: { priority: -1 } });
      }
      else{
        return Notes.find({}, { sort: { priority: 1 } });
      }
    }
    

    
  },
  incompleteCount() {
    return Notes.find({ checked: { $ne: true } }).count();
  },
  isDateAscending() {
  	const instance = Template.instance();
  	return instance.state.equals('sortDateAscending', true);
  },
  isPriorityAscending() {
    const instance = Template.instance();
    return instance.state.equals('sortPriorityAscending', true);
  },
});

Template.body.events({
  'click .sort-notes-date'(event, instance){
    instance.state.set("sortByDate", true);
  	if(instance.state.equals('sortDateAscending', true)){
  		instance.state.set("sortDateAscending", false);
  	}
  	else{
  		instance.state.set("sortDateAscending", true);
  	}
  },
  'click .sort-notes-priority'(event, instance){
    instance.state.set("sortByDate", false);
    if(instance.state.equals('sortPriorityAscending', true)){
      instance.state.set("sortPriorityAscending", false);
    }
    else{
      instance.state.set("sortPriorityAscending", true);
    }
  },
  'submit .new-note'(event) {
    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const target = event.target;
    const text = target.text.value;
    const priority = target.dropdown.selectedIndex;    
 
    // Insert a note into the collection
    Meteor.call('notes.insert', text, priority);
 
    // Clear form
    target.dropdown.selectedIndex = 0;
    target.text.value = '';
  },  
});