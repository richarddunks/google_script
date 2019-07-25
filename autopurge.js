// A script based on https://ctrlq.org/code/19383-bulk-delete-gmail

// The name of the Gmail Label that is to be autopurged
var GMAIL_LABELS = ["[mailbox]-business ", "[mailbox]-cities ", "[mailbox]-data-and-tech ", "[mailbox]-events ", "[mailbox]-inspiration ", "[mailbox]-news ", "[mailbox]-sales " ];    

// Purge messages automatically after how many days?
var PURGE_AFTER = "7";

function purgeGmail() {
  
  var age = new Date();  
  age.setDate(age.getDate() - PURGE_AFTER);    
  
  var purge  = Utilities.formatDate(age, Session.getScriptTimeZone(), "yyyy-MM-dd");
    
  label_list_length = GMAIL_LABELS.length;

  for (var i = 0; i < label_list_length; i++) { 
    var search = "label:" + GMAIL_LABELS[i] + " before:" + purge;
  
    // This will create a simple Gmail search 
    // query like label:Newsletters before:10/12/2012
    
    try {
      
      // We are processing 100 messages in a batch to prevent script errors.
      // Else it may throw Exceed Maximum Execution Time exception in Apps Script

      var threads = GmailApp.search(search, 0, 100); // limiting threads
      // var threads = GmailApp.search(search); // not limiting threads (will cull beforehand)

      // For large batches, create another time-based trigger that will
      // activate the auto-purge process after 'n' minutes.

      if (threads.length == 100) {
        ScriptApp.newTrigger("purgeGmail")
                 .timeBased()
                 .at(new Date((new Date()).getTime() + 1000*60*10))
                 .create();
      } // end if

      // An email thread may have multiple messages and the timestamp of 
      // individual messages can be different.
      
      for (var i = 0; i < threads.length; i++) {
        var messages = GmailApp.getMessagesForThread( threads[i] );
        for (var j = 0; j < messages.length; j++) {
          var email = messages[j];       
          if (email.getDate() < age) {
            email.moveToTrash();
          } // end if
        } // end for
      } // end for
      
    // If the script fails for some reason or catches an exception, 
    // it will simply defer auto-purge until the next day.
    } catch (e) {}
  }
  
}
