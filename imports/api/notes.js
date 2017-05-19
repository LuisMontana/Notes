import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Notes = new Mongo.Collection('notes');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('notes', function notesPublication() {
    return Notes.find({ owner: this.userId });
  });
}
 
Meteor.methods({
  'notes.insert'(text, priority) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a note
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Notes.insert({
      text,
      priority,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'notes.update'(noteID, replaceText){
    check(replaceText, String);
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Notes.update(
      {_id : noteID},
      {$set: {text:replaceText}},
    );
  },
  'notes.remove'(noteID) {
    check(noteID, String);
 
    Notes.remove(noteID);
  },
  'notes.setChecked'(noteID, setChecked) {
    check(noteID, String);
    check(setChecked, Boolean);
 
    Notes.update(noteID, { $set: { checked: setChecked } });
  },
});
