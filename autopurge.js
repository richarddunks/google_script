// The name of the Gmail Label that is to be autopurged?
var GMAIL_LABELS = ["[mailbox]-business ", "[mailbox]-cities ", "[mailbox]-data-and-tech ", "[mailbox]-events ", "[mailbox]-inspiration ", "[mailbox]-news ", "[mailbox]-sales " ];    

// Purge messages automatically after how many days?
var PURGE_AFTER = "7";

function purgeGmail() {
  var age = new Date();  
  age.setDate(age.getDate() - PURGE_AFTER);    

  var purge  = Utilities.formatDate(age, Session.getScriptTimeZone(), "yyyy-MM-dd");

  // join the search terms together in OR clause
  var search = "label:" + GMAIL_LABELS.join(" OR label:") + " before:" + purge;
  // This will create a Gmail search 
  // query like label:Newsletters before:10/12/2012
    
  try {
    
    // We are processing 100 messages in a batch to prevent script errors.
    // Else it may throw Exceed Maximum Execution Time exception in Apps Script

    var threads = GmailApp.search(search, 0, 100); // limiting threads

    // For large batches, create another time-based trigger that will
    // activate the auto-purge process after 'n' minutes.

    var n = 10;
    if (threads.length == 100) {
      ScriptApp.newTrigger("purgeGmail")
               .timeBased()
               .at(new Date((new Date()).getTime() + 1000 * 60 * n))
               .create();
      console.log("Setting trigger for " + n + " minutes");
    } // end if

    // An email thread may have multiple messages and the timestamp of 
    // individual messages can be different.
    var trash_counter = 0;
    for (var i = 0; i < threads.length; i++) {
      var messages = GmailApp.getMessagesForThread( threads[i] );
      for (var j = 0; j < messages.length; j++) {
        var email = messages[j];       
        if (email.getDate() < age) {

          email.moveToTrash();
          trash_counter++; // iterate the trash counter
          
        } // end if
      } // end j for
    } // end i for
    console.log("Successfully deleted " + trash_counter + " messages");
  }   
  
  // If the script fails for some reason or catches an exception, 
  // it will simply defer auto-purge until the next day.

  catch (e) {
    console.error("Script failed with " + e);
  }
  
} // end function