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
  'notes.insert'(text) {
    check(text, String);
 
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
 
    Notes.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
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
